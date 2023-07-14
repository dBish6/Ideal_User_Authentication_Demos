package com.demo.server.auth.services;

import com.demo.server.auth.dtos.LoginRequest;
import com.demo.server.auth.dtos.RegisterRequest;
import com.demo.server.auth.model.*;
import com.demo.server.auth.utils.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthService {
    @Autowired
    private final RedisTemplate<String, Object> redisTemplate;
    private static final String KEY = "users";

    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    private final JwtTokenProvider jwtTokenProvider;
    private final JwtService jwtService;

    public void register(RegisterRequest req) {
        User user = User.builder()
                .email(req.getEmail())
                .username(req.getUsername())
                .fullName(req.getFirstName() + " " + req.getLastName())
                .password(passwordEncoder.encode(req.getPassword()))
                .role(new Role(Role.ROLE_USER))
                .build();
        redisTemplate.opsForHash().put(KEY, user.getEmail(), user);
    }

    public ResponseCookie login(LoginRequest req) {
        // Checks username and password.
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        req.getEmail(),
                        req.getPassword()
                )
        );
        // Load the user details and generate the JWT.
        UserDetails userDetails = userDetailsService.loadUserByUsername(req.getEmail());
        String jsonWebToken = jwtTokenProvider.generateToken(userDetails);
        // String jsonWebToken = jwtTokenProvider.generateToken({password: userDetails.getPassword()}, userDetails);
        Date jwtExpiration = jwtService.extractExpiration(jsonWebToken);

        return ResponseCookie.from("session", jsonWebToken)
//                .path("/")
                .maxAge(jwtExpiration.getTime()) // 3 days.
                .httpOnly(true)
                .secure(true)
                .sameSite("None")
                .build();
    }

    public List<User> getUsers() {
        List<User> users = new ArrayList<>();
        Map<Object, Object> usersMap = redisTemplate.opsForHash().entries(KEY);
        for (Object user : usersMap.values()) {
            users.add((User) user);
        }
        return users;
    }

    public UserDetails getUserDetails(String token) {
        String username = jwtService.extractSubject(token);
        return userDetailsService.loadUserByUsername(username);
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
