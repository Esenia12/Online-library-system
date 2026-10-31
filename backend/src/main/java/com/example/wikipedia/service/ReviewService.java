package com.example.wikipedia.service;

import com.example.wikipedia.dto.ReviewCreateDto;
import com.example.wikipedia.dto.ReviewResponseDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ReviewService {
    ReviewResponseDto createReviewResponse(Long articleId, ReviewCreateDto reviewDto);
    List<ReviewResponseDto> getReviewsByArticleIdResponse(Long articleId);
    Page<ReviewResponseDto> getReviewsByArticleIdResponsePaged(Long articleId, Pageable pageable);
}
