package com.example.wikipedia.mapper;

import com.example.wikipedia.domain.EditHistory;
import com.example.wikipedia.dto.EditHistoryDto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface EditHistoryMapper {
    EditHistoryMapper INSTANCE = Mappers.getMapper(EditHistoryMapper.class);

    @Mapping(source = "article.id", target = "articleId")
    @Mapping(source = "editor.id", target = "editorId")
    EditHistoryDto toDto(EditHistory editHistory);

    @Mapping(source = "articleId", target = "article.id")
    @Mapping(source = "editorId", target = "editor.id")
    EditHistory toEntity(EditHistoryDto editHistoryDto);
}
