package com.demo.server.csrf.filters;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class VerifyCsrfTokenFilter extends OncePerRequestFilter {
    private final Logger logger = LoggerFactory.getLogger(VerifyCsrfTokenFilter.class);

    @Override
    protected boolean shouldNotFilter(@NotNull HttpServletRequest req) {
        // I assigned only methods that really only need a CSRF token, which are methods that modify data.
        String reqMethod = req.getMethod();
        return !(HttpMethod.POST.name().equals(reqMethod) || HttpMethod.DELETE.name().equals(reqMethod));
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest req,
            HttpServletResponse res,
            FilterChain filterChain) throws ServletException, IOException {
        logger.debug("Running CSRF filter for request: " + req.getRequestURI());

        Cookie[] cookies = req.getCookies();
        String storedToken = null;
        String receivedToken = req.getHeader("x-xsrf-token");

        if (cookies != null || receivedToken != null) {
            for (Cookie cookie : cookies) {
                if (cookie.getName().equals("XSRF-TOKEN")) {
                    storedToken = cookie.getValue();

                    if (storedToken != null) {
                        boolean match = BCrypt.checkpw(storedToken, receivedToken);
                        if (!match) {
                            sendResponse(res, "CSRF token does not match.");
                            return;
                        }
                    } else {
                        sendResponse(res, "CSRF token is missing.");
                        return;
                    }
                    break;
                }
            }
        } else {
            sendResponse(res, "CSRF token is missing.");
            return;
        }
//        if (storedToken != null) {
//            boolean match = BCrypt.checkpw(storedToken, receivedToken);
//            if (!match) {
//                sendResponse(res, "CSRF token does not match.");
//                return;
//            }
//        } else {
//            sendResponse(res, "CSRF token is missing.");
//            return;
//        }
        filterChain.doFilter(req, res);
    }

    private void sendResponse(@NotNull HttpServletResponse res, String message) throws IOException {
        res.setContentType("application/json");
        res.setStatus(HttpStatus.FORBIDDEN.value());
        res.getWriter().write("{\"message\": \"" + message + "\"}");
    }
}

