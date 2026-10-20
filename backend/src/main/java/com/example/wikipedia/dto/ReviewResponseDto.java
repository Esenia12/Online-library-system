package com.example.wikipedia.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
public class ReviewResponseDto {
    private Long id;
    private Long articleId;
    private UserResponseDto reviewer;
    private String comment;
    private LocalDateTime createdAt;
}
