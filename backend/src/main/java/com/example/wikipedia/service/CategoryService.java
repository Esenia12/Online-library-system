package com.example.wikipedia.service;

import com.example.wikipedia.dto.CategoryCreateDto;
import com.example.wikipedia.dto.CategoryDto;

import java.util.List;

public interface CategoryService {
    CategoryDto createCategory(CategoryCreateDto categoryDto);
    CategoryDto getCategoryById(Long id);
    List<CategoryDto> getAllCategories();
    CategoryDto updateCategory(Long id, CategoryCreateDto categoryDto);
    void deleteCategory(Long id);
}
