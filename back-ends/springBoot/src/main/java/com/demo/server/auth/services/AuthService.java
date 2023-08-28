package com.demo.server.auth.services;

import com.demo.server.auth.dtos.SingleMessageDto;
import com.demo.server.auth.model.Role;
import com.demo.server.auth.model.User;
import com.demo.server.auth.utils.AuthTokens;
import com.demo.server.auth.utils.JwtTokenProvider;
import com.demo.server.auth.dtos.GetUserDto;
import com.demo.server.auth.dtos.LoginRequestDto;
import com.demo.server.auth.dtos.RegisterRequestDto;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.Duration;
import java.util.*;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final RedisTemplate<String, Object> redisTemplate;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    private final JwtTokenProvider jwtTokenProvider;
    private final JwtService jwtService;

    private static final String KEY = "springUsers";

    @Value("${ACCESS_TOKEN_SECRET}")
    private String ACCESS_TOKEN_SECRET;
    @Value("${REFRESH_TOKEN_SECRET}")
    private String REFRESH_TOKEN_SECRET;

    public List<User> getUsers() {
        List<User> users = new ArrayList<>();
        Map<Object, Object> usersMap = redisTemplate.opsForHash().entries(KEY);
        for (Object user : usersMap.values()) {
            users.add((User) user);
        }
        return users;
    }

    public Object getUser(String email, boolean getAll) {
        User user = (User) redisTemplate.opsForHash().get(KEY, email);
        if (user != null) {
            if (getAll) {
                return user;
            }
            return GetUserDto.builder()
                    .email(user.getUsername())
                    .displayName(user.getDisplayName())
                    .fullName(user.getFullName())
                    .build();
        }

        return null;
    }

    public void register(RegisterRequestDto req) {
        User user = User.builder()
                .email(req.getEmail())
                .displayName(req.getDisplayName())
                .fullName(req.getFullName())
                .password(passwordEncoder.encode(req.getPassword()))
                .role(new Role(Role.ROLE_USER))
                .build();
        redisTemplate.opsForHash().put(KEY, user.getEmail(), user);
    }

    public Map<String, Object> login(String email, String password) {
        // Checks username and password.
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(email, password)
            );
        } catch (BadCredentialsException e) {
            throw e; // Re-throw error to handle at the controller.
        }

        GetUserDto user = (GetUserDto) getUser(email, false);

        Map<String, Object> response = createTokenCookies(email);
        response.put("user", user);

        return response;
    }

    // TODO: USE FINAL EVERYWHERE.
    public GetUserDto check(String cookieValue) {
        String subject = jwtService.extractSubject(cookieValue, ACCESS_TOKEN_SECRET);

        GetUserDto user = (GetUserDto) getUser(subject, false);
        if (user == null) {
            throw new UsernameNotFoundException("User not found");
        }

        return user;
    }

    public Map<String, Object> refresh(String cookieValue) {
        String subject = jwtService.extractSubject(cookieValue, REFRESH_TOKEN_SECRET);
        GetUserDto user = (GetUserDto) getUser(subject, false);
        if (user == null) {
            throw new UsernameNotFoundException("User not found");
        }

        Map<String, Object> response = createTokenCookies(subject);
        response.put("user", user);
        return response;
    }

    //    public void googleLogin(Object googleDecodedClaims) {
//        redisTemplate.opsForHash().hasKey(KEY, googleDecodedClaims.email)
//
//        // Checks username and password.
//        try {
//            authenticationManager.authenticate(
//                    new UsernamePasswordAuthenticationToken(
//                            req.getEmail(),
//                            req.getPassword()
//                    )
//            );
//        } catch (BadCredentialsException e) {
//            throw e; // Re-throw error to handle at the controller.
//        }
//    }

    private Map<String, Object> createTokenCookies(String email) {
        final AuthTokens jsonWebToken = jwtTokenProvider.generateToken(email);
        final String accessToken = jsonWebToken.getAccess();
        final String refreshToken = jsonWebToken.getRefresh();

        // TODO: Change to object.
        Map<String, Object> response = new HashMap<>();
        response.put("accessCookie",
                createCookie("session", accessToken, Duration.ofMinutes(15))
        );
        response.put("refreshCookie",
                createCookie("refresh", refreshToken, Duration.ofDays(9))
        );

        return response;
    }

    private static ResponseCookie createCookie(String name, String value, Duration expiry) {
        return ResponseCookie.from(name, value)
                .maxAge(expiry.getSeconds())
                .httpOnly(true)
                .secure(true)
                .sameSite("None")
                .path("/")
                .build();
    }

    public void setAuthenticated(UserDetails userDetails, HttpServletRequest req) {
        UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                userDetails,
                null,
                userDetails.getAuthorities());
        // Give auth token the details from the request and set the auth context with the created authToken.
        authToken.setDetails(
                new WebAuthenticationDetailsSource().buildDetails(req));
        SecurityContextHolder.getContext().setAuthentication(authToken);
    }

    public void deleteUser(String id) {
        redisTemplate.opsForHash().delete(KEY, id);
    }

//    public boolean validateOAuthAccessToken(String accessToken) {
//        RestTemplate restTemplate = new RestTemplate();
//
//        ResponseEntity<String> response = restTemplate.exchange(
//                "https://oauth2.googleapis.com/tokeninfo?access_token=" + accessToken,
//                HttpMethod.GET,
//                null,
//                String.class
//        );
//        // Valid, invalid or expired.
//        return response.getStatusCode().is2xxSuccessful();
//    }
}
