package com.demo.server.auth.services;

import com.demo.server.auth.dtos.GitHubUserResponseBodyDto;
import com.demo.server.auth.dtos.GithubAccessTokenResponseDto;
import com.demo.server.auth.exceptions.UserAlreadyExistException;
import com.demo.server.auth.model.Role;
import com.demo.server.auth.model.User;
import com.demo.server.auth.utils.AuthTokens;
import com.demo.server.auth.utils.JwtTokenProvider;
import com.demo.server.auth.dtos.GetUserDto;
import com.demo.server.auth.dtos.RegisterRequestDto;
import io.jsonwebtoken.Claims;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.*;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.time.Duration;
import java.util.*;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final RedisTemplate<String, Object> redisTemplate;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final JwtService jwtService;

    private static final String KEY = "springUsers";
    private static final Logger logger = LoggerFactory.getLogger(AuthService.class);

    @Value("${ACCESS_TOKEN_SECRET}")
    private String ACCESS_TOKEN_SECRET;
    @Value("${REFRESH_TOKEN_SECRET}")
    private String REFRESH_TOKEN_SECRET;
    @Value("${GITHUB_CLIENT_ID}")
    private String GITHUB_CLIENT_ID;
    @Value("${GITHUB_CLIENT_SECRET}")
    private String GITHUB_CLIENT_SECRET;

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
                    .login(user.getLogin())
                    .build();
        }

        return null;
    }

    public void register(@NotNull RegisterRequestDto req) {
        User user = User.builder()
                .email(req.getEmail())
                .displayName(req.getDisplayName())
                .fullName(req.getFullName())
                .password(passwordEncoder.encode(req.getPassword()))
                .login("email")
                .role(new Role(Role.ROLE_USER))
                .build();

        redisTemplate.opsForHash().put(KEY, user.getEmail(), user);
    }

    public void thirdPartyUserRegister(GetUserDto thirdPartyUser, boolean isGoogle) {
        String password;
        if (isGoogle) {
            password = "google provided";
        } else {
            password = "github provided";
        }
        User user = User.builder()
                .email(thirdPartyUser.getEmail())
                .displayName(thirdPartyUser.getDisplayName())
                .fullName(thirdPartyUser.getFullName())
                .password(password)
                .login(thirdPartyUser.getLogin())
                .role(new Role(Role.ROLE_USER))
                .build();

        redisTemplate.opsForHash().put(KEY, user.getEmail(), user);
    }

    public Map<String, Object> login(String email, String password) throws BadCredentialsException {
        // Checks username and password.
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, password)
        );

        GetUserDto user = (GetUserDto) getUser(email, false);

        Map<String, Object> response = createTokenCookies(email);
        response.put("user", user);

        return response;
    }

    public Map<String, Object> googleLogin(@NotNull Claims googleDecodedClaims) {
        GetUserDto user = (GetUserDto) getUser((String) googleDecodedClaims.get("email"), false);
        if (user != null) {
            if (!Objects.equals(user.getLogin(), "google")) {
                throw new UserAlreadyExistException("User already exists by using " + user.getLogin() + ".");
            }
            logger.info("Google user already exists within Redis, skipping registration.");
        } else {
            logger.info("Registering Google user.");
            user = GetUserDto.builder()
                    .email((String) googleDecodedClaims.get("email"))
                    .displayName((String) googleDecodedClaims.get("name"))
                    .fullName((String) googleDecodedClaims.get("name"))
                    .login("google")
                    .build();
            thirdPartyUserRegister(user, true);
        }

        Map<String, Object> response = createTokenCookies(user.getEmail());
        response.put("user", user);

        return response;
    }

    public Map<String, Object> githubLogin(String code) throws RestClientException {
        final String githubAccessToken = getGithubUserAccessToken(code);

        final RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.set(HttpHeaders.AUTHORIZATION, "Bearer " + githubAccessToken);
        HttpEntity<String> requestEntity = new HttpEntity<>(headers);

        // This throws RestClientException on a bad response if you were wondering.
        final ResponseEntity<GitHubUserResponseBodyDto> res = restTemplate.exchange(
                "https://api.github.com/user",
                HttpMethod.GET,
                requestEntity,
                GitHubUserResponseBodyDto.class
        );
        logger.info("GitHub User Response: " + res);

        String login = null;
        String name = null;
        String email = null;
        if (res.getStatusCode().is2xxSuccessful() && res.getBody() != null) {
            final GitHubUserResponseBodyDto body = res.getBody();

            if (body.getId() != null) {
                login = body.getLogin();
                name = body.getName();
                // Yes, I didn't realize that your GitHub email is private by default. This is just unfortunate,
                // so if the email is null, resemble the email that GitHub uses in their requests if your email private.
                if (body.getEmail() == null) {
                    email = body.getId() + "+" + body.getLogin() + "@users.noreply.github.com";
                } else {
                    email = res.getBody().getEmail();
                }
            } else {
                throw new RestClientException("GitHub user was not found with GitHub's access token.");
            }
        }

        GetUserDto user = (GetUserDto) getUser(email, false);
        if (user != null) {
            if (!Objects.equals(user.getLogin(), "github")) {
                throw new UserAlreadyExistException("User already exists by using " + user.getLogin() + ".");
            }
            logger.info("GitHub user already exists within Redis, skipping registration.");
        } else {
            logger.info("Registering GitHub user.");
            user = GetUserDto.builder()
                    .email(email)
                    .displayName(login)
                    .fullName(name)
                    .login("github")
                    .build();
            thirdPartyUserRegister(user, false);
        }

        Map<String, Object> response = createTokenCookies(user.getEmail());
        response.put("user", user);

        return response;
    }

    private String getGithubUserAccessToken(String code) throws RestClientException {
        final RestTemplate restTemplate = new RestTemplate();

        final String params = String.format(
                "?client_id=%s&client_secret=%s&code=%s",
                GITHUB_CLIENT_ID,
                GITHUB_CLIENT_SECRET,
                code
        );

        HttpHeaders headers = new HttpHeaders();
        headers.set(HttpHeaders.ACCEPT, "application/json");
        HttpEntity<String> requestEntity = new HttpEntity<>(headers);

        final ResponseEntity<GithubAccessTokenResponseDto> res = restTemplate.exchange(
                "https://github.com/login/oauth/access_token" + params,
                HttpMethod.POST,
                requestEntity,
                GithubAccessTokenResponseDto.class
        );
        logger.info("GitHub Code Response: " + res);

        if (!res.getStatusCode().is2xxSuccessful() || res.getBody() == null) {
            throw new RestClientException("Invalid code param or user doesn't exist.");
        }

        return res.getBody().getAccess_token();
    }

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
}
