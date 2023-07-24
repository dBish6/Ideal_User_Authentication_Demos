package com.demo.server.configs;

import com.demo.server.auth.configs.JwtAuthFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.security.web.util.matcher.OrRequestMatcher;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsWebFilter;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@RequiredArgsConstructor
@EnableWebSecurity
public class SecurityConfig {
    private final AuthenticationProvider jwtTokenProvider;
    private final JwtAuthFilter jwtAuthFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
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

        AntPathRequestMatcher postMatcher = new AntPathRequestMatcher("/api/auth/**", HttpMethod.POST.toString());
        AntPathRequestMatcher deleteMatcher = new AntPathRequestMatcher("/api/auth/**", HttpMethod.DELETE.toString());
        OrRequestMatcher csrfRequestMatcher = new OrRequestMatcher(postMatcher, deleteMatcher);
        http.csrf((csrf) ->
            csrf.csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
                    .requireCsrfProtectionMatcher(csrfRequestMatcher)
        );
        http.authenticationProvider(jwtTokenProvider)
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
                .sessionManagement((session) -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .authorizeHttpRequests((auth) -> auth
                        .requestMatchers("/auth/register", "/auth/csrf").permitAll()
                        .requestMatchers("/auth/**").authenticated()
                        // .anyRequest().permitAll()
                );
                // .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
        // TODO: CHECK IF THE FILTER ONLY APPLIES TO AUTH ROUTES.
        return http.build();
    }
}
