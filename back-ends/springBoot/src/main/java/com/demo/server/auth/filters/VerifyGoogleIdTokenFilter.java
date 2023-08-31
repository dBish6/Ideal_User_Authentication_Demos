package com.demo.server.auth.filters;

import com.demo.server.auth.utils.GetGooglePublicKey;
import com.demo.server.auth.utils.GooglePublicKey;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.SignatureException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.jetbrains.annotations.NotNull;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class VerifyGoogleIdTokenFilter extends OncePerRequestFilter {

    private final GetGooglePublicKey getGooglePublicKey;

    @Override
    protected boolean shouldNotFilter(@NotNull HttpServletRequest req) {
        return !req.getRequestURI().contains("/google");
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest req,
            HttpServletResponse res,
            FilterChain filterChain) throws ServletException, IOException {

        String authHeader = req.getHeader(HttpHeaders.AUTHORIZATION);

        if (authHeader == null) {
            sendResponse(res, "Google user ID token is missing.");
        } else if (!authHeader.startsWith("Bearer ")) {
            sendResponse(res,
                    "Found the authorization header for the google login request, but isn't a Bearer token."
            );
        }

        String userIdToken = authHeader.split(" ")[1];
        GooglePublicKey googlePublicKey;
        try {
            googlePublicKey = getGooglePublicKey.getGoogleRSAPublicKey(userIdToken);
        } catch (Exception e) {
            throw new RuntimeException("getGooglesPublicKey method error: " + e.getMessage());
        }

        try {
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(googlePublicKey.getKey())
                    .build()
                    .parseClaimsJws(userIdToken)
                    .getBody();
            // System.out.println("googleDecodedClaims: " + claims);
            if (claims == null) {
                sendResponse(res, "Google user ID token is invalid.");
            }
            req.setAttribute("googleDecodedClaims", claims);

        } catch (ExpiredJwtException e) {
            sendResponse(res, "Google user ID token is expired.");
        } catch (MalformedJwtException | UnsupportedJwtException | SignatureException e) {
            sendResponse(res, "Google user ID token is invalid.");
        }

        filterChain.doFilter(req, res);
    }

    private void sendResponse(HttpServletResponse res, String message) throws IOException {
        res.setContentType("application/json");
        if (message.contains("missing")) {
            res.setStatus(HttpStatus.UNAUTHORIZED.value());
        } else {
            res.setStatus(HttpStatus.FORBIDDEN.value());
        }
        res.getWriter().write("{\"message\": \"" + message + "\"}");
    }
}
