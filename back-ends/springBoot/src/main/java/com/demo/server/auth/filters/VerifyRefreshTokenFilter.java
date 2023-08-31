package com.demo.server.auth.filters;

import com.demo.server.auth.services.AuthService;
import com.demo.server.auth.services.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.jetbrains.annotations.NotNull;
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

@Component
@RequiredArgsConstructor
public class VerifyRefreshTokenFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;
    private final AuthService authService;

    @Value("${REFRESH_TOKEN_SECRET}")
    private String REFRESH_TOKEN_SECRET;

    @Override
    protected boolean shouldNotFilter(@NotNull HttpServletRequest req) {
        return !req.getRequestURI().contains("/refresh");
    }

    @Override
    protected void doFilterInternal(
            @NotNull HttpServletRequest req,
            @NotNull HttpServletResponse res,
            FilterChain filterChain) throws ServletException, IOException {

        Cookie[] cookies = req.getCookies();
        String refreshToken = null;

        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if (cookie.getName().equals("refresh")) {
                    refreshToken = cookie.getValue();
                    break;
                }
            }
        }
        if (refreshToken == null) {
            sendResponse(res, "Refresh token is missing.");
            return;
        }

        final String subject = jwtService.extractSubject(refreshToken, REFRESH_TOKEN_SECRET);

        UserDetails userDetails;
        try {
            userDetails = userDetailsService.loadUserByUsername(subject);
        } catch (UsernameNotFoundException e) {
            sendResponse(res, "User doesn't exist, incorrect value within refresh cookie.");
            return;
        }

        String isValid = jwtService.isTokenValid(refreshToken, userDetails, true);
        if (Objects.equals(isValid, "valid.")) {
            if (subject != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                authService.setAuthenticated(userDetails, req);
            }
        } else {
            sendResponse(res, "Refresh token is " + isValid);
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
