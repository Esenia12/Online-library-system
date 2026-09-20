package com.example.wikipedia.mapper;

import com.example.wikipedia.domain.Category;
import com.example.wikipedia.dto.CategoryCreateDto;
import com.example.wikipedia.dto.CategoryDto;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface CategoryMapper {
    CategoryMapper INSTANCE = Mappers.getMapper(CategoryMapper.class);

    CategoryDto toDto(Category category);

    Category toEntity(CategoryDto categoryDto);

    Category toEntity(CategoryCreateDto categoryDto);
}
