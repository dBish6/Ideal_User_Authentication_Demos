package com.demo.server.auth.dtos;

import com.fasterxml.jackson.annotation.JsonAutoDetect;
import lombok.*;
import org.springframework.http.ResponseCookie;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@JsonAutoDetect(fieldVisibility = JsonAutoDetect.Visibility.ANY)
public class NewSessionResponseDto {

    private ResponseCookie accessCookie;
    private ResponseCookie refreshCookie;
    private GetUserDto User;
}
