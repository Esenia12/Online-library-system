package com.example.wikipedia.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
public class EditHistoryDto {
    private Long id;
    private Long articleId;
    private Long editorId;
    private String content;
    private LocalDateTime editedAt;
}
