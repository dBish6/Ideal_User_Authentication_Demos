package com.demo.server.configs;

import com.demo.server.auth.filters.VerifyAccessTokenFilter;
import com.demo.server.auth.filters.VerifyRefreshTokenFilter;
import com.demo.server.csrf.filters.VerifyCsrfTokenFilter;
import lombok.RequiredArgsConstructor;
import org.jetbrains.annotations.NotNull;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@RequiredArgsConstructor
@EnableWebSecurity
public class SecurityConfig {

    private final AuthenticationProvider jwtTokenProvider;
    private final VerifyCsrfTokenFilter verifyCsrfTokenFilter;
    private final VerifyAccessTokenFilter verifyAccessTokenFilter;
    private final VerifyRefreshTokenFilter verifyRefreshTokenFilter;

    @Bean
    public SecurityFilterChain filterChain(@NotNull HttpSecurity http) throws Exception {
        http.cors(cors -> {
            CorsConfiguration config = new CorsConfiguration();
            config.addAllowedOrigin("http://localhost:3000");
            config.setMaxAge(3600L);
            config.setAllowedMethods(Arrays.asList(
                    HttpMethod.GET.name(),
                    HttpMethod.POST.name(),
                    HttpMethod.PATCH.name(),
                    HttpMethod.DELETE.name(),
                    HttpMethod.OPTIONS.name()
            ));
            config.setAllowedHeaders(Arrays.asList(
                    HttpHeaders.ACCEPT,
                    HttpHeaders.CONTENT_TYPE,
                    HttpHeaders.AUTHORIZATION,
                    "X-XSRF-TOKEN"
            ));
            config.setAllowCredentials(true);

            UrlBasedCorsConfigurationSource source =
                    new UrlBasedCorsConfigurationSource();
            source.registerCorsConfiguration("/**", config);
            cors.configurationSource(req -> config);
        });

        http.csrf((csrf) -> csrf.disable()); // Because of the custom csrf verification.
        http.authenticationProvider(jwtTokenProvider)
                .addFilterBefore(verifyCsrfTokenFilter, UsernamePasswordAuthenticationFilter.class)
                .addFilterAfter(verifyAccessTokenFilter, VerifyCsrfTokenFilter.class)
                .addFilterAfter(verifyRefreshTokenFilter, VerifyAccessTokenFilter.class)
                .sessionManagement((session) -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .authorizeHttpRequests((auth) -> auth
                        .requestMatchers(
                                "/csrf/**",
                                "/auth/register",
                                "/auth/login",
                                "/auth/logout").permitAll()
                        .requestMatchers("/auth/**").authenticated()
                        // .anyRequest().permitAll()
                );

        return http.build();
    }
}
