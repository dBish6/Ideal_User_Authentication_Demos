package com.demo.server.auth.controllers;

import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class CsrfController {

    @GetMapping("/csrf")
    public CsrfToken initializeCsrfToken(CsrfToken token) {
        return token;
    }
}
