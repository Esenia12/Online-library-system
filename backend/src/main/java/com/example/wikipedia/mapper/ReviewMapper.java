package com.example.wikipedia.mapper;

import com.example.wikipedia.domain.Review;
import com.example.wikipedia.dto.ReviewDto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface ReviewMapper {
    ReviewMapper INSTANCE = Mappers.getMapper(ReviewMapper.class);

    @Mapping(source = "article.id", target = "articleId")
    @Mapping(source = "reviewer.id", target = "reviewerId")
    ReviewDto toDto(Review review);

    @Mapping(source = "articleId", target = "article.id")
    @Mapping(source = "reviewerId", target = "reviewer.id")
    Review toEntity(ReviewDto reviewDto);
}
