package com.demo.server.auth.services;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.function.Function;

@Service
public class JwtService {
    private static final String SECRET_KEY = "91258728c9172c72386a1ddfad486d5a926788f4467db2957f4ca222c8bada25";

    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSignInKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    private <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    public String extractSubject(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    // Ensures the JWT wasn't changed along the way and is the same sender.
    public Key getSignInKey() {
        byte[] keyDecoded = Decoders.BASE64.decode(SECRET_KEY);
        return Keys.hmacShaKeyFor(keyDecoded);
    }

    public String isTokenValid(String token, UserDetails userDetails) {
        final String username = extractSubject(token);
        final Date expiry = extractClaim(token, Claims::getExpiration);

        if (!username.equals(userDetails.getUsername())) {
            return "missing or incorrect";
        } else if (expiry.after(new Date())) {
            return "expired";
        } else {
            return "valid";
        }
        // return (username.equals(userDetails.getUsername())) && expiry.before(new Date());
    }
}
