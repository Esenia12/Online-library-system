package com.example.wikipedia.service;

import com.example.wikipedia.dto.ArticleCreateDto;
import com.example.wikipedia.dto.ArticleResponseDto;
import com.example.wikipedia.dto.ArticleUpdateDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ArticleService {
    ArticleResponseDto createArticleResponse(ArticleCreateDto articleDto);

    ArticleResponseDto getArticleByIdResponse(Long id);

    Page<ArticleResponseDto> getAllArticlesResponse(Pageable pageable);

    Page<ArticleResponseDto> getAllArticlesResponse(String search, Long categoryId, Pageable pageable);

    ArticleResponseDto updateArticleResponse(Long id, ArticleUpdateDto articleDto);

    void deleteArticle(Long id);
}
