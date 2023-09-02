package com.demo.server.auth.controllers;

import com.demo.server.auth.dtos.*;
import com.demo.server.auth.exceptions.UserAlreadyExistException;
import com.demo.server.auth.model.User;
import com.demo.server.auth.services.AuthService;
import io.jsonwebtoken.Claims;
import lombok.RequiredArgsConstructor;
import org.jetbrains.annotations.NotNull;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @GetMapping("/users")
    public List<User> getUsers() {
        return authService.getUsers();
    }

    @GetMapping("/user/{email}")
    public ResponseEntity<?> getUser(@PathVariable String email) {
        GetUserDto user = (GetUserDto) authService.getUser(email.toLowerCase(), false);
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
    public ResponseEntity<SingleMessageDto> registerUser(@RequestBody RegisterRequestDto req) {
        HttpStatus status;
        String message;

        GetUserDto user = (GetUserDto) authService.getUser(req.getEmail().toLowerCase(), true);
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
    public ResponseEntity<?> loginUser(@RequestBody LoginRequestDto req) {
        try {
            Map<String, Object> serviceMap = authService.login(req.getEmail().toLowerCase(), req.getPassword());

            return sendNewSession(serviceMap);

        } catch (BadCredentialsException e) {
            // TODO: Upgrade.
            SingleMessageDto errMsg = SingleMessageDto.builder()
                    .message("Email or password is incorrect.")
                    .build();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errMsg);
        }
    }

    @PostMapping("/login/google")
    public ResponseEntity<?> loginGoogleUser(@RequestAttribute("googleDecodedClaims") Claims googleDecodedClaims) {
        if (googleDecodedClaims == null) {
            SingleMessageDto errMsg = SingleMessageDto.builder()
                    .message("Google decoded claims is missing!")
                    .build();
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(errMsg);
        }

        try {
            Map<String, Object> serviceMap = authService.googleLogin(googleDecodedClaims);

            return sendNewSession(serviceMap);
        } catch (UserAlreadyExistException e) {
            SingleMessageDto errMsg = SingleMessageDto.builder()
                    .message(e.getMessage())
                    .build();
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(errMsg);
        }

    }

    @PostMapping("/login/github")
    public ResponseEntity<?> loginGithubUser(@RequestBody GitHubLoginRequestDto req) {
        try {
            Map<String, Object> serviceMap = authService.githubLogin(req.getCode());

            return sendNewSession(serviceMap);
        } catch (UserAlreadyExistException e) {
            SingleMessageDto errMsg = SingleMessageDto.builder()
                    .message(e.getMessage())
                    .build();
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(errMsg);
        }
    }


    @GetMapping("/checkSession")
    public ResponseEntity<?> checkSession(@CookieValue("session") String email) {
        // Checks access (session) token from cookie in VerifyAccessTokenFilter...

        try {
            GetUserDto user = authService.check(email);

            LoginResponseDto responseDto = LoginResponseDto.builder()
                    .message("Session status was successfully checked.")
                    .user(user)
                    .build();
            return ResponseEntity.ok(responseDto);

        } catch (UsernameNotFoundException e) {
            SingleMessageDto errMsg = SingleMessageDto.builder()
                    .message("User doesn't exist, incorrect subject within session cookie.")
                    .build();
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(errMsg);
        }
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refreshSession(@CookieValue("refresh") String cookieValue) {
        // When the refresh token is verified generate the new access token.
        try {
            Map<String, Object> serviceMap = authService.refresh(cookieValue);

            return sendNewSession(serviceMap);
        } catch (UsernameNotFoundException e) {
            SingleMessageDto errMsg = SingleMessageDto.builder()
                    .message("User doesn't exist, incorrect subject in refresh cookie.")
                    .build();
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(errMsg);
        }
    }

    private static @NotNull ResponseEntity<LoginResponseDto> sendNewSession(
            @NotNull Map<String, Object> loginServiceMap) {

        LoginResponseDto responseDto = LoginResponseDto.builder()
                .message("User is successfully authenticated.")
                .user((GetUserDto) loginServiceMap.get("user"))
                .build();
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE,
                        String.valueOf(loginServiceMap.get("accessCookie")),
                        String.valueOf(loginServiceMap.get("refreshCookie"))
                )
                .body(responseDto);
    }

    @PostMapping("/logout")
    public ResponseEntity<Object> logoutUser() {
        ResponseEntity.BodyBuilder resBuilder = ResponseEntity.ok();
        clearSession(resBuilder);
        SecurityContextHolder.clearContext();

        SingleMessageDto messageDto = SingleMessageDto.builder()
                .message("User session cookies cleared, log out successful.")
                .build();
        return resBuilder.body(messageDto);
    }

    private static void clearSession(ResponseEntity.@NotNull BodyBuilder resBuilder) {
        ResponseCookie accessCookie = ResponseCookie.from("session", "")
                .maxAge(0)
                .httpOnly(true)
                .secure(true)
                .sameSite("None")
                .path("/")
                .build();
        ResponseCookie refreshCookie = ResponseCookie.from("refresh", "")
                .maxAge(0)
                .httpOnly(true)
                .secure(true)
                .sameSite("None")
                .path("/")
                .build();

        resBuilder.header(HttpHeaders.SET_COOKIE, accessCookie.toString(), refreshCookie.toString());
    }

    @DeleteMapping("/user/{email}")
    public ResponseEntity<String> deleteUser(@PathVariable String email) {
        authService.deleteUser(email);
        return ResponseEntity.ok("User " + email + " was successfully deleted.");
    }
}
