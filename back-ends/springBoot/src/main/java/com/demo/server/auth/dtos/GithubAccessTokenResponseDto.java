package com.demo.server.auth.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
public class GithubAccessTokenResponseDto {

    private String access_token;
    private String token_type;
    private String scope;
}
