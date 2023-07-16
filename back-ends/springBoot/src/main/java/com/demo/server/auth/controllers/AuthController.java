package com.demo.server.auth.controllers;

import com.demo.server.auth.dtos.LoginRequest;
import com.demo.server.auth.dtos.RegisterRequest;
import com.demo.server.auth.model.User;
import com.demo.server.auth.services.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {
    @Autowired
    private final AuthService authService;

    @GetMapping("/users")
    public List<User> getUsers() {
        return authService.getUsers();
    }

    @GetMapping("/user")
    public UserDetails getUserDetails(@CookieValue(name = "session") String token) {
        return authService.getUserDetails(token);
    }

    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@RequestBody RegisterRequest req) {
        System.out.print(req);
        authService.register(req);
        return ResponseEntity.ok("User was successfully registered.");
    }

    @PostMapping("/login")
    public ResponseEntity<Object> loginUser(@RequestBody LoginRequest req) {
        ResponseCookie sessionCookie = authService.login(req);

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, String.valueOf(sessionCookie))
                .body("User is successfully authenticated.");
    }

    @PostMapping("/login/google")
    public ResponseEntity<Object> loginGoogleUser(@RequestBody LoginRequest req) {
        // Get accesses token and create a JWT for a session.
        return null;
    }

    // TODO: Use this if you can't get the JwtAuthFilter to only be applied to certain routes.
//    @GetMapping("/persistSession")
//    public String readCookie(@CookieValue(name = "session") String user) {
//        return user;
//    }

    @PostMapping("/logout")
    public ResponseEntity<Object> logoutUser(@RequestBody RegisterRequest req) {
        // Clear Cookie
        return null;
    }

    @DeleteMapping("/user")
    public ResponseEntity<String> deleteUser(@RequestBody Map<String, Object> req) {
        String email = (String) req.get("email");
        authService.deleteUser(email);
        return ResponseEntity.ok("User " + email + " was successfully deleted.");
    }
}
