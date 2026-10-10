package com.example.wikipedia.mapper;

import com.example.wikipedia.domain.Article;
import com.example.wikipedia.domain.Review;
import com.example.wikipedia.dto.ArticleResponseDto;
import com.example.wikipedia.dto.ReviewResponseDto;
import com.example.wikipedia.dto.UserResponseDto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring", uses = UserMapper.class)
public interface ResponseMapper {
    ResponseMapper INSTANCE = Mappers.getMapper(ResponseMapper.class);

    @Mapping(target = "authorId", source = "author.id")
    ArticleResponseDto toArticleResponseDto(Article article);

    @Mapping(target = "reviewer", source = "reviewer")
    @Mapping(target = "articleId", source = "article.id")
    ReviewResponseDto toReviewResponseDto(Review review);

    UserResponseDto toUserResponseDto(com.example.wikipedia.domain.User user);
}
