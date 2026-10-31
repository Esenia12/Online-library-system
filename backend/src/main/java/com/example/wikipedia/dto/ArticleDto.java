package com.example.wikipedia.dto;

import jakarta.validation.constraints.NotEmpty;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
public class ArticleDto {
    private Long id;

    @NotEmpty
    private String title;

    @NotEmpty
    private String content;

    private CategoryDto category;
    private UserDto author;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
