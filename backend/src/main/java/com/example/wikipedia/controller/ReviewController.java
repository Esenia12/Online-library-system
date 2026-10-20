package com.example.wikipedia.controller;

import com.example.wikipedia.dto.ReviewCreateDto;
import com.example.wikipedia.dto.ReviewResponseDto;
import com.example.wikipedia.service.ReviewService;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.Parameters;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/articles/{articleId}/reviews")
@RequiredArgsConstructor
public class ReviewController {
    private final ReviewService reviewService;

    @PostMapping
    @Parameters({
        @Parameter(name = "articleId", description = "Article ID", required = true)
    })
    public ResponseEntity<ReviewResponseDto> createReview(@PathVariable("articleId") Long articleId, @Valid @RequestBody ReviewCreateDto reviewDto) {
        return new ResponseEntity<>(reviewService.createReviewResponse(articleId, reviewDto), HttpStatus.CREATED);
    }

    @GetMapping
    @Parameters({
        @Parameter(name = "articleId", description = "Article ID", required = true)
    })
    public ResponseEntity<List<ReviewResponseDto>> getReviewsByArticleId(@PathVariable("articleId") Long articleId) {
        return ResponseEntity.ok(reviewService.getReviewsByArticleIdResponse(articleId));
    }

    @GetMapping("/paged")
    @Parameters({
        @Parameter(name = "articleId", description = "Article ID", required = true)
    })
    public ResponseEntity<Page<ReviewResponseDto>> getReviewsByArticleIdPaged(@PathVariable("articleId") Long articleId, Pageable pageable) {
        return ResponseEntity.ok(reviewService.getReviewsByArticleIdResponsePaged(articleId, pageable));
    }
}
