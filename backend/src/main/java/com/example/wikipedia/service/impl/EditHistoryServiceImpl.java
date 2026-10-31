package com.example.wikipedia.service.impl;

import com.example.wikipedia.domain.EditHistory;
import com.example.wikipedia.dto.EditHistoryDto;
import com.example.wikipedia.mapper.EditHistoryMapper;
import com.example.wikipedia.repository.ArticleRepository;
import com.example.wikipedia.repository.EditHistoryRepository;
import com.example.wikipedia.repository.UserRepository;
import com.example.wikipedia.service.EditHistoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class EditHistoryServiceImpl implements EditHistoryService {
    private final EditHistoryRepository editHistoryRepository;
    private final EditHistoryMapper editHistoryMapper;
    private final ArticleRepository articleRepository;
    private final UserRepository userRepository;

    @Override
    public EditHistoryDto createEditHistory(EditHistoryDto editHistoryDto) {
        EditHistory editHistory = editHistoryMapper.toEntity(editHistoryDto);
        editHistory.setArticle(articleRepository.getReferenceById(editHistoryDto.getArticleId()));
        editHistory.setEditor(userRepository.getReferenceById(editHistoryDto.getEditorId()));
        return editHistoryMapper.toDto(editHistoryRepository.save(editHistory));
    }

    @Override
    public List<EditHistoryDto> getEditHistoryByArticleId(Long articleId) {
        return editHistoryRepository.findAllByArticleId(articleId).stream()
                .map(editHistoryMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public Page<EditHistoryDto> getEditHistoryByArticleIdPaged(Long articleId, Pageable pageable) {
        return editHistoryRepository.findAllByArticleId(articleId, pageable)
                .map(editHistoryMapper::toDto);
    }

    @Override
    public Page<EditHistoryDto> getMyEditHistoryByArticleId(Long articleId, Pageable pageable) {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()) {
            Object principal = authentication.getPrincipal();
            String username;
            if (principal instanceof UserDetails) {
                username = ((UserDetails) principal).getUsername();
            } else {
                username = principal.toString();
            }
            var user = userRepository.findByUsername(username);
            if (user.isPresent()) {
                return editHistoryRepository.findAllByArticleIdAndEditorId(articleId, user.get().getId(), pageable)
                        .map(editHistoryMapper::toDto);
            }
        }
      
        return editHistoryRepository.findAllByArticleIdAndEditorId(articleId, -1L, pageable)
                .map(editHistoryMapper::toDto);
    }
}
