package com.demo.server.auth.services;

import com.demo.server.auth.model.User;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {
    private final RedisTemplate<String, Object> redisTemplate;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = (User) redisTemplate.opsForHash().get("springUsers", username);
        if (user != null) {
            return user;
        }
        throw new UsernameNotFoundException("User not found");
    }
}
