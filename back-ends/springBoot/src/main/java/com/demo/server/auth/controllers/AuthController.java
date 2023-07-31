package com.demo.server.auth.controllers;

import com.demo.server.auth.dtos.*;
import com.demo.server.auth.model.User;
import com.demo.server.auth.services.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
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

    @GetMapping("/user/{email}")
    public ResponseEntity<?> getUser(@PathVariable String email) {
        GetUserDto user = authService.getUser(email);
        if (user == null) {
            SingleMessageDto errMsg = SingleMessageDto.builder()
                    .message("User doesn't exist, incorrect email.")
                    .build();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(errMsg);
        }

        return ResponseEntity.ok(user);
    }

    @PostMapping("/register")
    public ResponseEntity<SingleMessageDto> registerUser(@RequestBody RegisterRequest req) {
        authService.register(req);

        SingleMessageDto message = SingleMessageDto.builder()
                .message("User was successfully registered.")
                .build();
        return ResponseEntity.ok(message);
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequest req) {
        try {
            Map<String, Object> serviceMap = authService.login(req);

            LoginResponseDto responseDto = LoginResponseDto.builder()
                    .message("User is successfully authenticated.")
                    .user((GetUserDto) serviceMap.get("user"))
                    .build();
            return ResponseEntity.ok()
                    .header(HttpHeaders.SET_COOKIE, String.valueOf(serviceMap.get("cookie")))
                    .body(responseDto);

        } catch (BadCredentialsException e) {
            SingleMessageDto errMsg = SingleMessageDto.builder()
                    .message("Email or password is incorrect.")
                    .build();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errMsg);
        }
    }

    @PostMapping("/login/google")
    public ResponseEntity<Object> loginGoogleUser(@RequestBody LoginRequest req) {
        // TODO: Get access token and create a JWT for a session.
        return null;
    }

    @GetMapping("/checkSession")
    public ResponseEntity<LoginResponseDto> readCookie(@CookieValue(name = "session") String email) {
        // Checks token from cookie in JwtAuthFilter.

        GetUserDto user = authService.getUser(email);
        LoginResponseDto responseDto = LoginResponseDto.builder()
                .message("User is successfully authenticated.")
                .user(user)
                .build();

        return ResponseEntity.ok(responseDto);
    }

    @PostMapping("/logout")
    public ResponseEntity<Object> logoutUser(@RequestBody RegisterRequest req) {
        // TODO: Clear Cookie
        return null;
    }

    @DeleteMapping("/user/{email}")
    public ResponseEntity<String> deleteUser(@PathVariable String email) {
        authService.deleteUser(email);
        return ResponseEntity.ok("User " + email + " was successfully deleted.");
    }
}
