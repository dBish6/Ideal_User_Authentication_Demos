package com.demo.server.auth.utils;

import com.demo.server.auth.services.JwtService;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.SetOperations;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class JwtTokenProvider {
    private final JwtService jwtService;
    private final RedisTemplate<String, Object> redisTemplate;

    @Value("${ACCESS_TOKEN_SECRET}")
    private String ACCESS_TOKEN_SECRET;
    @Value("${REFRESH_TOKEN_SECRET}")
    private String REFRESH_TOKEN_SECRET;

    public AuthTokens generateToken(String email) {
        final String accessToken = generateAccessToken(new HashMap<>(), email);
        final String refreshToken = generateRefreshToken(new HashMap<>(), email);

        return AuthTokens.builder()
                .access(accessToken)
                .refresh(refreshToken)
                .build();
    }

    public String generateAccessToken(
            Map<String, Object> extraClaims,
            String email) {
        return Jwts.builder().setClaims(extraClaims)
                .setSubject(email)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + (15 * 60 * 1000))) // 15 minutes.
                .signWith(jwtService.getSignInKey(ACCESS_TOKEN_SECRET), SignatureAlgorithm.HS256) // HS256; 256 bits hex key.
                .compact();
    }

    public String generateRefreshToken(
            Map<String, Object> extraClaims,
            String email) {
        final String refreshToken = Jwts.builder().setClaims(extraClaims)
                .setSubject(email)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + (7 * 24 * 60 * 60 * 1000))) // 1 week.
                .signWith(jwtService.getSignInKey(REFRESH_TOKEN_SECRET), SignatureAlgorithm.HS256) // HS256; 256 bits hex key.
                .compact();
        SetOperations<String, Object> setOps = redisTemplate.opsForSet();
        setOps.add("springRefreshTokens", refreshToken);

        return refreshToken;
    }
}
