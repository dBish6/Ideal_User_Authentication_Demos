package com.demo.server.auth.services;

import com.demo.server.auth.dtos.GetUserDto;
import com.demo.server.auth.dtos.LoginRequest;
import com.demo.server.auth.dtos.RegisterRequest;
import com.demo.server.auth.model.*;
import com.demo.server.auth.utils.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final RedisTemplate<String, Object> redisTemplate;
    private static final String KEY = "springUsers";

    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    private final JwtTokenProvider jwtTokenProvider;
    private final JwtService jwtService;

    public void register(RegisterRequest req) {
        User user = User.builder()
                .email(req.getEmail().toLowerCase())
                .displayName(req.getDisplayName())
                .fullName(req.getFullName())
                .password(passwordEncoder.encode(req.getPassword()))
                .role(new Role(Role.ROLE_USER))
                .build();
        redisTemplate.opsForHash().put(KEY, user.getEmail().toLowerCase(), user);
    }

    public boolean userAlreadyExist(RegisterRequest req) {
        return redisTemplate.opsForHash().hasKey(KEY, req.getEmail().toLowerCase());
    }

    public Map<String, Object> login(LoginRequest req) {
        // Checks username and password.
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            req.getEmail().toLowerCase(),
                            req.getPassword()
                    )
            );
        } catch (BadCredentialsException e) {
            throw e; // Re-throw error to handle at the controller.
        }
        // Load the user details and generate the JWT.
        UserDetails userDetails = userDetailsService.loadUserByUsername(req.getEmail().toLowerCase());
        String jsonWebToken = jwtTokenProvider.generateToken(userDetails);
        Date jwtExpiration = jwtService.extractExpiration(jsonWebToken);

        GetUserDto user = GetUserDto.builder()
                .email(userDetails.getUsername())
                .displayName(((User) userDetails).getDisplayName())
                .fullName(((User) userDetails).getFullName())
                .build();

        Map<String, Object> response = new HashMap<>();
        response.put("user", user);
        response.put("cookie",
                ResponseCookie.from("session", jsonWebToken)
                        .maxAge(jwtExpiration.getTime()) // 3 days.
                        .httpOnly(true)
                        .secure(true)
                        .sameSite("None")
                        .build()
        );

        return response;
    }

    public List<User> getUsers() {
        List<User> users = new ArrayList<>();
        Map<Object, Object> usersMap = redisTemplate.opsForHash().entries(KEY);
        for (Object user : usersMap.values()) {
            users.add((User) user);
        }
        return users;
    }

    public GetUserDto getUser(String email) {
        User user = (User) redisTemplate.opsForHash().get(KEY, email.toLowerCase());
        if (user != null) {
            return GetUserDto.builder()
                    .email(user.getUsername())
                    .displayName(user.getDisplayName())
                    .fullName(user.getFullName())
                    .build();
        }

        return null;
    }

    public void deleteUser(String id) {
        redisTemplate.opsForHash().delete(KEY, id);
    }

    // TODO: For third party logins.
    public boolean validateOAuthAccessToken(String accessToken) {
        RestTemplate restTemplate = new RestTemplate();

        ResponseEntity<String> response = restTemplate.exchange(
                "https://oauth2.googleapis.com/tokeninfo?access_token=" + accessToken,
                HttpMethod.GET,
                null,
                String.class
        );
        // Valid, invalid or expired.
        return response.getStatusCode().is2xxSuccessful();
    }
}
