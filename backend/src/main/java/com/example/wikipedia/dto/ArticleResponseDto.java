package com.example.wikipedia.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
public class ArticleResponseDto {
    private Long id;
    private String title;
    private String content;
    private CategoryDto category;
    private UserResponseDto author;
    private Long authorId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
