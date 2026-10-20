package com.example.wikipedia.dto;

import jakarta.validation.constraints.NotEmpty;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
public class ReviewDto {
    private Long id;
    private Long articleId;
    private Long reviewerId;

    @NotEmpty
    private String comment;
    private LocalDateTime createdAt;
}
