package com.demo.server.auth.filters;

import com.demo.server.auth.services.AuthService;
import com.demo.server.auth.services.JwtService;
import com.demo.server.csrf.filters.VerifyCsrfTokenFilter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Objects;

// Handles JWT authentication and sets the authenticated user's details in the SecurityContextHolder.
@Component
@RequiredArgsConstructor
public class VerifyAccessTokenFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;
    private final AuthService authService;

    private static final Logger logger = LoggerFactory.getLogger(VerifyCsrfTokenFilter.class);

    @Value("${ACCESS_TOKEN_SECRET}")
    private String ACCESS_TOKEN_SECRET;

    @Override
    protected boolean shouldNotFilter(@NotNull HttpServletRequest req) {
        // Exclude filtering for specific routes where JWT is not required.
        String reqURI = req.getRequestURI();
        return reqURI.contains("/csrf") || reqURI.contains("/register") || reqURI.contains("/login")
                || reqURI.contains("/logout") || reqURI.contains("/refresh");
    }

    @Override
    protected void doFilterInternal(
            @NotNull HttpServletRequest req,
            @NotNull HttpServletResponse res,
            @NotNull FilterChain filterChain) throws ServletException, IOException {

        Cookie[] cookies = req.getCookies();
        String accessToken = null;
        String refreshToken = null;

        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if (cookie.getName().equals("session")) {
                    accessToken = cookie.getValue();
                } else if (cookie.getName().equals("refresh")) {
                    refreshToken = cookie.getValue();
                }
            }
        }
        if (accessToken == null) {
            // If no accessToken, check if a refresh cookie exists for a refresh request.
            if (refreshToken != null) {
                sendResponse(res, "Access token is expired.");
                return;
            }
            sendResponse(res, "Access token is missing.");
            return;
        }

        final String subject = jwtService.extractSubject(accessToken, ACCESS_TOKEN_SECRET);

        UserDetails userDetails;
        try {
            userDetails = userDetailsService.loadUserByUsername(subject);
        } catch (UsernameNotFoundException e) {
            sendResponse(res, "User doesn't exist, incorrect value within session cookie.");
            return;
        }

        String isValid = jwtService.isTokenValid(accessToken, userDetails, false);
        if (Objects.equals(isValid, "valid.")) {
            if (subject != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                authService.setAuthenticated(userDetails, req);
            }
        } else {
            sendResponse(res, "Access token is " + isValid);
            return;
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
