package com.demo.server.auth.model;

import org.springframework.security.core.GrantedAuthority;

public class Role implements GrantedAuthority {
    public static final String ROLE_USER = "ROLE_USER";
    public static final String ROLE_ADMIN = "ROLE_ADMIN";
    private String role;

    public Role(String name) {
        this.role = name;
    }

    @Override
    public String getAuthority() {
        return role;
    }
}
