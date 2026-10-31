package com.example.wikipedia.controller;

import com.example.wikipedia.dto.EditHistoryDto;
import com.example.wikipedia.service.EditHistoryService;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.Parameters;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/articles/{articleId}/history")
@RequiredArgsConstructor
public class EditHistoryController {
    private final EditHistoryService editHistoryService;

    @GetMapping
    @Parameters({
        @Parameter(name = "articleId", description = "Article ID", required = true)
    })
    public ResponseEntity<List<EditHistoryDto>> getEditHistoryByArticleId(@PathVariable Long articleId) {
        return ResponseEntity.ok(editHistoryService.getEditHistoryByArticleId(articleId));
    }

    @GetMapping("/paged")
    @Parameters({
        @Parameter(name = "articleId", description = "Article ID", required = true)
    })
    public ResponseEntity<Page<EditHistoryDto>> getEditHistoryByArticleIdPaged(@PathVariable Long articleId, Pageable pageable) {
        return ResponseEntity.ok(editHistoryService.getEditHistoryByArticleIdPaged(articleId, pageable));
    }

    @GetMapping("/my")
    @Parameters({
        @Parameter(name = "articleId", description = "Article ID", required = true)
    })
    public ResponseEntity<Page<EditHistoryDto>> getMyEditHistoryByArticleId(@PathVariable Long articleId, Pageable pageable) {
        return ResponseEntity.ok(editHistoryService.getMyEditHistoryByArticleId(articleId, pageable));
    }
}

