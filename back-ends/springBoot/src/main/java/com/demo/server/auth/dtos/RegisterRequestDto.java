package com.demo.server.auth.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
public class RegisterRequestDto {
    private String displayName;
    private String fullName;
    private String email;
    private String password;
}
