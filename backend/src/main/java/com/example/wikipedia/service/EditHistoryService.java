package com.example.wikipedia.service;

import com.example.wikipedia.dto.EditHistoryDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface EditHistoryService {
    EditHistoryDto createEditHistory(EditHistoryDto editHistoryDto);
    List<EditHistoryDto> getEditHistoryByArticleId(Long articleId);
    Page<EditHistoryDto> getEditHistoryByArticleIdPaged(Long articleId, Pageable pageable);
    Page<EditHistoryDto> getMyEditHistoryByArticleId(Long articleId, Pageable pageable);
}
