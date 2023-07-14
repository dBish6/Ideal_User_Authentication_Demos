package com.demo.server.auth.configs;

import com.demo.server.auth.services.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.jetbrains.annotations.NotNull;
import org.springframework.http.HttpHeaders;
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

// Runs on every auth route request.
@Component
@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(
           @NotNull HttpServletRequest req,
           @NotNull HttpServletResponse res,
           @NotNull FilterChain filterChain) throws ServletException, IOException {
         String authHeader = req.getHeader(HttpHeaders.AUTHORIZATION);
        final String jsonWebToken;
        final String userEmail;

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(req, res);
            return;
        }
        jsonWebToken = authHeader.substring(7);
        userEmail = jwtService.extractSubject(jsonWebToken);
        if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = userDetailsService.loadUserByUsername(userEmail);

            String isValid = jwtService.isTokenValid(jsonWebToken, userDetails);
            if (Objects.equals(isValid, "valid")) {
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        userDetails,
                        null,
                        userDetails.getAuthorities()
                );
                // Gives auth token the details from the request.
                authToken.setDetails(
                        new WebAuthenticationDetailsSource().buildDetails(req)
                );
                SecurityContextHolder.getContext().setAuthentication(authToken);
            } else {
                res.setStatus(HttpStatus.UNAUTHORIZED.value());
                res.getWriter().write("Token is " + isValid);
            }
        }
        filterChain.doFilter(req, res);
    }
}
