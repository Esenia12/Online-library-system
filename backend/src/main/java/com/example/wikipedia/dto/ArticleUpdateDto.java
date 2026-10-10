package com.example.wikipedia.dto;

import jakarta.validation.constraints.NotEmpty;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ArticleUpdateDto {
    @NotEmpty
    private String title;

    @NotEmpty
    private String content;

    private Long categoryId;
}
