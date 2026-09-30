package com.example.wikipedia.dto;

import lombok.Data;

@Data
public class JwtAuthResponse {
    private String accessToken;
    private String tokenType = "Bearer";

    public JwtAuthResponse(String accessToken) {
        this.accessToken = accessToken;
    }

  
    public String getToken() {
        return this.accessToken;
    }
}
