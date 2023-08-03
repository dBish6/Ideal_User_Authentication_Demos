package com.demo.server.auth.utils;

import com.demo.server.auth.services.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.jetbrains.annotations.NotNull;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Objects;

// Handles JWT authentication and sets the authenticated user's details in the SecurityContextHolder.
@Component
@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    @Override
    protected boolean shouldNotFilter(HttpServletRequest req) {
        // Exclude filtering for specific routes where JWT is not required.
        String reqURI = req.getRequestURI();
        return reqURI.contains("/csrf") || reqURI.contains("/register") || reqURI.contains("/login");
    }

    @Override
    protected void doFilterInternal(
            @NotNull HttpServletRequest req,
            @NotNull HttpServletResponse res,
            @NotNull FilterChain filterChain) throws ServletException, IOException {
        Cookie[] cookies = req.getCookies();
        String jsonWebToken = null;

        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if (cookie.getName().equals("session")) {
                    jsonWebToken = cookie.getValue();
                    break;
                }
            }
        }
        if (jsonWebToken == null) {
            sendResponse(res, "Token is missing.");
            return;
        } else {
            final String username = jwtService.extractSubject(jsonWebToken);
            if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                UserDetails userDetails = userDetailsService.loadUserByUsername(username);

                String isValid = jwtService.isTokenValid(jsonWebToken, userDetails);
                if (Objects.equals(isValid, "valid.")) {
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null,
                            userDetails.getAuthorities());
                    // Gives auth token the details from the request.
                    authToken.setDetails(
                            new WebAuthenticationDetailsSource().buildDetails(req));
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                } else {
                    sendResponse(res, "Token is " + isValid);
                    return;
                }
            }
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
