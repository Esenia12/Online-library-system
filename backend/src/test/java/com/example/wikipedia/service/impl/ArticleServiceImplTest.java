package com.example.wikipedia.service.impl;

import com.example.wikipedia.domain.Article;
import com.example.wikipedia.dto.ArticleCreateDto;
import com.example.wikipedia.exception.ResourceNotFoundException;
import com.example.wikipedia.mapper.ResponseMapper;
import com.example.wikipedia.repository.*;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;


import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ArticleServiceImplTest {

    @Mock private ArticleRepository articleRepository;
    @Mock private ResponseMapper responseMapper;
    @Mock private EditHistoryRepository editHistoryRepository;
    @Mock private UserRepository userRepository;
    @Mock private CategoryRepository categoryRepository;

    @InjectMocks private ArticleServiceImpl articleService;

    @Test
    void createArticle_whenCategoryNotFound_throwsResourceNotFoundException() {
        ArticleCreateDto dto = new ArticleCreateDto();
        dto.setTitle("Test");
        dto.setContent("Content");
        dto.setCategoryId(999L);

        when(categoryRepository.findById(999L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> articleService.createArticleResponse(dto))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Category not found");
    }

    @Test
    void getArticleById_whenNotFound_throwsResourceNotFoundException() {
        when(articleRepository.findById(anyLong())).thenReturn(Optional.empty());

        assertThatThrownBy(() -> articleService.getArticleByIdResponse(42L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Article not found");
    }

    @Test
    void deleteArticle_whenNotFound_throwsResourceNotFoundException() {
        when(articleRepository.findById(42L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> articleService.deleteArticle(42L))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    void deleteArticle_whenExists_delegatesToRepository() {
        Article article = new Article();
        article.setId(1L);
        when(articleRepository.findById(1L)).thenReturn(Optional.of(article));

        articleService.deleteArticle(1L);

        verify(articleRepository, times(1)).deleteById(1L);
    }
}