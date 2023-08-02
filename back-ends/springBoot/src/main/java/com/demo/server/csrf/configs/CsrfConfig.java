package com.demo.server.csrf.configs;

import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.security.web.util.matcher.OrRequestMatcher;

@Configuration
public class CsrfConfig {

    public void configureCsrf(HttpSecurity http) throws Exception {
        // I assigned only methods that really only need a CSRF token, which are methods that modify data.
        AntPathRequestMatcher postMatcher = new AntPathRequestMatcher("/api/auth/**", HttpMethod.POST.toString());
        AntPathRequestMatcher deleteMatcher = new AntPathRequestMatcher("/api/auth/**", HttpMethod.DELETE.toString());
        OrRequestMatcher csrfRequestMatcher = new OrRequestMatcher(postMatcher, deleteMatcher);
        http.csrf((csrf) ->
                csrf.csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
                        .requireCsrfProtectionMatcher(csrfRequestMatcher)
        );
    }
}
