package com.demo.server.auth.services;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.function.Function;

@Service
@RequiredArgsConstructor
public class JwtService {

    private final RedisTemplate<String, Object> redisTemplate;

    @Value("${ACCESS_TOKEN_SECRET}")
    private String ACCESS_TOKEN_SECRET;
    @Value("${REFRESH_TOKEN_SECRET}")
    private String REFRESH_TOKEN_SECRET;

    private Claims extractAllClaims(String token, String jwtSecret) {
        return Jwts.parserBuilder()
                .setSigningKey(getSignInKey(jwtSecret))
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    private <T> T extractClaim(String token, @NotNull Function<Claims, T> claimsResolver, String jwtSecret) {
        final Claims claims = extractAllClaims(token, jwtSecret);
        return claimsResolver.apply(claims);
    }

    public String extractSubject(String token, String jwtSecret) {
        return extractClaim(token, Claims::getSubject, jwtSecret);
    }

    // Ensures the JWT wasn't changed along the way and is the same sender.
    public Key getSignInKey(String jwtSecret) {
        byte[] keyDecoded = Decoders.BASE64.decode(jwtSecret);
        return Keys.hmacShaKeyFor(keyDecoded);
    }

    public String isTokenValid(String token, UserDetails userDetails, boolean isRefresh) {
        String key;
        if (isRefresh) {
            boolean isTokenValid = Boolean.TRUE.equals(
                    redisTemplate.opsForSet().isMember("springRefreshTokens", token)
            );
            if (!isTokenValid) {
                return "invalid; doesn't exist in the cache.";
            }

            key = REFRESH_TOKEN_SECRET;
        } else {
            key = ACCESS_TOKEN_SECRET;
        }
        final String email = extractSubject(token, key);
        final Date expiry = extractClaim(token, Claims::getExpiration, key);

        if (!email.equals(userDetails.getUsername())) {
            return "invalid.";
        } else if (expiry.before(new Date())) {
            return "expired.";
        } else {
            return "valid.";
        }
    }
}
