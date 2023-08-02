package com.demo.server.utils;

import com.demo.server.exceptions.RedisConnectionException;
import lombok.RequiredArgsConstructor;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.data.redis.connection.RedisConnection;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class RedisConnectionLogger implements ApplicationListener<ContextRefreshedEvent> {
    private final RedisConnectionFactory redisConnectionFactory;

    @Override
    public void onApplicationEvent(@NotNull ContextRefreshedEvent event) {
        testRedisConnection();
    }

    private void testRedisConnection() {
        System.out.println("Getting Redis server connection...");
        RedisConnection connection = null;
        try {
            connection = redisConnectionFactory.getConnection();
            if (connection != null) {
                System.out.println("Redis server is successfully running!");
            } else {
                throw new RedisConnectionException("Failed to connect to Redis server.");
            }
        } catch (Exception e) {
            throw new RedisConnectionException("Failed to connect to Redis server.", e);
        } finally {
            if (connection != null) {
                connection.close();
            }
        }
    }
}
