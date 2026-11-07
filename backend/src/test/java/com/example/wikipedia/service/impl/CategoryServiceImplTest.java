package com.example.wikipedia.service.impl;

import com.example.wikipedia.dto.CategoryCreateDto;
import com.example.wikipedia.dto.CategoryDto;
import com.example.wikipedia.exception.ResourceNotFoundException;
import com.example.wikipedia.mapper.CategoryMapper;
import com.example.wikipedia.repository.CategoryRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CategoryServiceImplTest {

    @Mock private CategoryRepository categoryRepository;
    @Mock private CategoryMapper categoryMapper;

    @InjectMocks private CategoryServiceImpl categoryService;

    @Test
    void getCategoryById_whenNotFound_throwsResourceNotFoundException() {
        when(categoryRepository.findById(anyLong())).thenReturn(Optional.empty());

        assertThatThrownBy(() -> categoryService.getCategoryById(42L))
                .isInstanceOf(ResourceNotFoundException.class);
    }
}