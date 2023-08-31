package com.demo.server.auth.utils;

import com.auth0.jwk.Jwk;
import com.auth0.jwk.JwkProvider;
import com.auth0.jwk.JwkProviderBuilder;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;
import org.springframework.stereotype.Component;

import java.net.URL;
import java.security.interfaces.RSAPublicKey;
import java.util.Base64;
import java.util.concurrent.TimeUnit;

@Component
public class GetGooglePublicKey {


    public GooglePublicKey getGoogleRSAPublicKey(String userIdToken) throws Exception {

        String keyId;
        String algorithm;

        JwtHeader header = decodeHeader(userIdToken);
        if (header != null) {
            algorithm = header.getAlg();
            keyId = header.getKid();
        } else {
            throw new Exception("Id Token header failed to be decoded in decodeHeader method.");
        }

        JwkProvider jwkProvider = new JwkProviderBuilder(new URL("https://www.googleapis.com/oauth2/v3/certs"))
                .cached(10, 24, TimeUnit.HOURS)
                .build();

        Jwk jwk = jwkProvider.get(keyId);
        // System.out.println("jwk: " + jwk);
        RSAPublicKey rsaKey = (RSAPublicKey) jwk.getPublicKey();
        // System.out.println("rsaKey: " + rsaKey);

        return GooglePublicKey.builder()
                .key(rsaKey)
                .algorithm(algorithm)
                .build();
    }

    private static @Nullable JwtHeader decodeHeader(@NotNull String token) throws Exception {
        final String[] chunks = token.split("\\.");
        if (chunks.length == 3) {
            String encodedHeader = chunks[0];
            byte[] decodedHeaderBytes = Base64.getDecoder().decode(encodedHeader);
            String decodedHeader = new String(decodedHeaderBytes);

            ObjectMapper objectMapper = new ObjectMapper();
            return objectMapper.readValue(decodedHeader, JwtHeader.class);
        }
        return null;
    }
}
