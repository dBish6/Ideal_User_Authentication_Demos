package com.demo.server.auth.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Getter
public class GetUserDto {
    private String email;
    private String displayName;
    private String fullName;
}
