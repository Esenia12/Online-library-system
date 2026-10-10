package com.example.wikipedia.controller;

import com.example.wikipedia.dto.ArticleCreateDto;
import com.example.wikipedia.dto.ArticleResponseDto;
import com.example.wikipedia.dto.ArticleUpdateDto;
import com.example.wikipedia.mapper.ResponseMapper;
import com.example.wikipedia.service.ArticleService;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.Parameters;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/articles")
@RequiredArgsConstructor
public class ArticleController {
    private final ArticleService articleService;
    private final ResponseMapper responseMapper;

    @PostMapping
    public ResponseEntity<ArticleResponseDto> createArticle(@Valid @RequestBody ArticleCreateDto articleDto) {
        return new ResponseEntity<>(articleService.createArticleResponse(articleDto), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    @Parameters({
        @Parameter(name = "id", description = "Article ID", required = true)
    })
    public ResponseEntity<ArticleResponseDto> getArticleById(@PathVariable Long id) {
        return ResponseEntity.ok(articleService.getArticleByIdResponse(id));
    }

    @GetMapping
    public ResponseEntity<Page<ArticleResponseDto>> getAllArticles(Pageable pageable) {
        return ResponseEntity.ok(articleService.getAllArticlesResponse(pageable));
    }

    @GetMapping("/filter")
    public ResponseEntity<Page<ArticleResponseDto>> getAllArticles(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Long categoryId,
            Pageable pageable) {
        return ResponseEntity.ok(articleService.getAllArticlesResponse(search, categoryId, pageable));
    }

    @PutMapping("/{id}")
    @Parameters({
        @Parameter(name = "id", description = "Article ID", required = true)
    })
    public ResponseEntity<ArticleResponseDto> updateArticle(@PathVariable Long id, @Valid @RequestBody ArticleUpdateDto articleDto) {
        return ResponseEntity.ok(articleService.updateArticleResponse(id, articleDto));
    }

    @DeleteMapping("/{id}")
    @Parameters({
        @Parameter(name = "id", description = "Article ID", required = true)
    })
    public ResponseEntity<Void> deleteArticle(@PathVariable Long id) {
        articleService.deleteArticle(id);
        return ResponseEntity.noContent().build();
    }
}
