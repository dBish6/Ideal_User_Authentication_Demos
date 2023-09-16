package com.demo.server.utils;

import com.demo.server.exceptions.RedisConnectionException;
import lombok.RequiredArgsConstructor;
import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationListener;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.data.redis.connection.RedisConnection;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class RedisConnectionLogger implements ApplicationListener<ContextRefreshedEvent> {

    private final RedisConnectionFactory redisConnectionFactory;
    private static final Logger logger = LoggerFactory.getLogger(RedisConnectionLogger.class);

    @Override
    public void onApplicationEvent(@NotNull ContextRefreshedEvent event) {
        testRedisConnection();
    }

    private void testRedisConnection() {
        int retries = 5;

        while (retries > 0) {
            logger.info("Getting Redis server connection...");
            try (RedisConnection connection = redisConnectionFactory.getConnection()) {
                connection.close();
                logger.info("Redis server is successfully running!");
                break;
            } catch (Exception e) {
                retries -= 1;
                logger.error("Redis connection failed. Retrying connection; " + retries + " retries left.");
                if (retries == 0) {
                    throw new RedisConnectionException("Failed to connect to Redis server.", e);
                }
            }
        }
    }
}
