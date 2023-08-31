package com.demo.server.auth.utils;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.security.interfaces.RSAPublicKey;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
public class GooglePublicKey {

    private RSAPublicKey key;
    private String algorithm;
}
