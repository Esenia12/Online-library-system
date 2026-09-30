package com.example.wikipedia.config;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConditionalOnProperty(prefix = "spring.security", name = "enabled", havingValue = "false")
public class NoAuthSecurityConfig {
}

