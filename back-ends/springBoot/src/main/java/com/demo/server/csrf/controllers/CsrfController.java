package com.demo.server.csrf.controllers;

import com.demo.server.csrf.dtos.csrfInitResponseDto;
import org.springframework.boot.web.server.Cookie;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/csrf")
public class CsrfController {

    @GetMapping("/init")
    public ResponseEntity<Object> initializeCsrfToken() {
        UUID token = UUID.randomUUID();

        ResponseCookie cookie = ResponseCookie.from("XSRF-TOKEN", token.toString())
                .httpOnly(true)
                .secure(true)
                .sameSite(Cookie.SameSite.STRICT.attributeValue())
                .path("/")
                .build();

        csrfInitResponseDto responseDto = csrfInitResponseDto.builder()
                .message("CSRF token successfully created.")
                .token(BCrypt.hashpw(token.toString(), BCrypt.gensalt(12)))
                .build();
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, String.valueOf(cookie))
                .body(responseDto);
    }
}
