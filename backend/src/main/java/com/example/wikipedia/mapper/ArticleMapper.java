package com.example.wikipedia.mapper;

import com.example.wikipedia.domain.Article;
import com.example.wikipedia.dto.ArticleCreateDto;
import com.example.wikipedia.dto.ArticleDto;
import com.example.wikipedia.dto.ArticleUpdateDto;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface ArticleMapper {
    ArticleMapper INSTANCE = Mappers.getMapper(ArticleMapper.class);

    ArticleDto toDto(Article article);

    Article toEntity(ArticleDto articleDto);

    Article toEntity(ArticleCreateDto articleDto);

    Article toEntity(ArticleUpdateDto articleDto);
}
