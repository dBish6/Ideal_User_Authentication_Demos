package com.demo.server.auth.utils;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
public class JwtHeader {

    private String alg;
    private String kid;
    private String typ;
}
