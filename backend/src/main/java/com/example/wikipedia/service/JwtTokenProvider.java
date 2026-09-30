package com.example.wikipedia.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Component;

import jakarta.annotation.PostConstruct;
import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;
import java.util.stream.Collectors;

@Component
public class JwtTokenProvider {

    @Value("${app.jwtSecret:default-dev-secret-change-me}")
    private String jwtSecret;

    @Value("${app.jwtExpirationInMs:604800000}")
    private int jwtExpirationInMs;

    private Key key;

    private final Logger log = LoggerFactory.getLogger(JwtTokenProvider.class);

    @PostConstruct
    public void init() {
        if (jwtSecret == null || jwtSecret.isBlank()) {
            key = Keys.secretKeyFor(SignatureAlgorithm.HS512);
            log.warn("No JWT secret configured; generated a runtime key. Replace with a secure key in production.");
            return;
        }

        byte[] keyBytes;
        try {
            // try base64 decode (common for secrets stored as base64)
            keyBytes = Decoders.BASE64.decode(jwtSecret);
        } catch (Exception ex) {
            // treat as plain text when base64 decode fails (handles DecodingException and others)
            keyBytes = jwtSecret.getBytes(StandardCharsets.UTF_8);
        }

        // Require at least 256 bits (32 bytes) for HMAC-SHA algorithms; if shorter, generate a secure key
        if (keyBytes.length < 32) {
            key = Keys.secretKeyFor(SignatureAlgorithm.HS512);
            log.warn("Provided JWT secret is too short ({} bits). Generated a secure runtime key instead. Update 'app.jwtSecret' to a base64-encoded >=256-bit key for production.", keyBytes.length * 8);
        } else {
            key = Keys.hmacShaKeyFor(keyBytes);
        }
    }

    public String generateToken(Authentication authentication) {
        String username = authentication.getName();
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpirationInMs);
        // `key` is initialized in @PostConstruct; reuse it here

        String roles = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.joining(","));

        return Jwts.builder()
                .setSubject(username)
                .claim("roles", roles)
                .setIssuedAt(new Date())
                .setExpiration(expiryDate)
                .signWith(key, SignatureAlgorithm.HS512)
                .compact();
    }

    public String getUsernameFromJWT(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
        return claims.getSubject();
    }

    public boolean validateToken(String authToken) {
        try {
            Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(authToken);
            return true;
        } catch (io.jsonwebtoken.security.SecurityException | io.jsonwebtoken.MalformedJwtException ex) {
            log.warn("Invalid JWT signature or token: {}", ex.getMessage());
        } catch (io.jsonwebtoken.ExpiredJwtException ex) {
            log.warn("Expired JWT token: {}", ex.getMessage());
        } catch (io.jsonwebtoken.UnsupportedJwtException ex) {
            log.warn("Unsupported JWT token: {}", ex.getMessage());
        } catch (IllegalArgumentException ex) {
            log.warn("JWT claims string is empty: {}", ex.getMessage());
        } catch (Exception ex) {
            log.warn("Unexpected error while validating JWT: {}", ex.getMessage());
        }
        return false;
    }
}
