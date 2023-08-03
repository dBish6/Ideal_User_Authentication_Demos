package com.demo.server.auth.controllers;

import com.demo.server.auth.dtos.*;
import com.demo.server.auth.model.User;
import com.demo.server.auth.services.AuthService;
import com.demo.server.auth.services.JwtService;
import lombok.RequiredArgsConstructor;
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
    private final AuthService authService;
    private final JwtService jwtService;

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
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(errMsg);
        }

        return ResponseEntity.ok(user);
    }

    @PostMapping("/register")
    public ResponseEntity<SingleMessageDto> registerUser(@RequestBody RegisterRequest req) {
        HttpStatus status;
        String message;

        GetUserDto user = authService.getUser(req.getEmail());
        if (user != null) {
            status = HttpStatus.BAD_REQUEST;
            message = "User already exists." ;
        } else {
            authService.register(req);
            status = HttpStatus.OK;
            message = "User was successfully registered." ;
        }

        SingleMessageDto messageDto = SingleMessageDto.builder()
                .message(message)
                .build();
        return ResponseEntity.status(status)
                .body(messageDto);
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
    public ResponseEntity<?> readCookie(@CookieValue("session") String email) {
        // Checks token from cookie in JwtAuthFilter...

        String subject = jwtService.extractSubject(email);
        GetUserDto user = authService.getUser(subject);
        if (user == null) {
            SingleMessageDto errMsg = SingleMessageDto.builder()
                    .message("User doesn't exist, incorrect email within cookie.")
                    .build();
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(errMsg);
        }

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
