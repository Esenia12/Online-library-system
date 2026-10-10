package com.example.wikipedia.service.impl;

import com.example.wikipedia.domain.Article;
import com.example.wikipedia.dto.ArticleCreateDto;
import com.example.wikipedia.dto.ArticleResponseDto;
import com.example.wikipedia.dto.ArticleUpdateDto;
import com.example.wikipedia.mapper.ResponseMapper;
import com.example.wikipedia.repository.ArticleRepository;
import com.example.wikipedia.repository.CategoryRepository;
import com.example.wikipedia.service.ArticleService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.wikipedia.domain.EditHistory;
import com.example.wikipedia.exception.ResourceNotFoundException;
import com.example.wikipedia.repository.EditHistoryRepository;
import com.example.wikipedia.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;

@Service
@RequiredArgsConstructor
@Transactional
public class ArticleServiceImpl implements ArticleService {
    private final ArticleRepository articleRepository;
    private final ResponseMapper responseMapper;
    private final EditHistoryRepository editHistoryRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;

    @Override
    public ArticleResponseDto createArticleResponse(ArticleCreateDto articleDto) {
        Article article = new Article();
        
      
        if (articleDto.getCategoryId() != null) {
            var category = categoryRepository.findById(articleDto.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found with id " + articleDto.getCategoryId()));
            article.setCategory(category);
        }
        
       
        article.setTitle(articleDto.getTitle());
        article.setContent(articleDto.getContent());
        
     
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()) {
            Object principal = authentication.getPrincipal();
            String username;
            if (principal instanceof UserDetails) {
                username = ((UserDetails) principal).getUsername();
            } else {
                username = principal.toString();
            }
            var author = userRepository.findByUsername(username)
                    .orElseThrow(() -> new ResourceNotFoundException("Current user not found"));
            article.setAuthor(author);
        } else {
            
            var defaultUser = userRepository.findByUsername("admin")
                    .orElseThrow(() -> new ResourceNotFoundException("Default user 'admin' not found"));
            article.setAuthor(defaultUser);
        }
        
        return responseMapper.toArticleResponseDto(articleRepository.save(article));
    }

    @Override
    public ArticleResponseDto getArticleByIdResponse(Long id) {
        return articleRepository.findById(id)
                .map(responseMapper::toArticleResponseDto)
                .orElseThrow(() -> new ResourceNotFoundException("Article not found with id " + id));
    }

    @Override
    public Page<ArticleResponseDto> getAllArticlesResponse(Pageable pageable) {
        return articleRepository.findAll(pageable)
                .map(responseMapper::toArticleResponseDto);
    }

    @Override
    public Page<ArticleResponseDto> getAllArticlesResponse(String search, Long categoryId, Pageable pageable) {
        return articleRepository.filterArticles(search, categoryId, pageable)
                .map(responseMapper::toArticleResponseDto);
    }

    @Override
    public ArticleResponseDto updateArticleResponse(Long id, ArticleUpdateDto articleDto) {
        Article existingArticle = articleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Article not found with id " + id));

        EditHistory editHistory = new EditHistory();
        editHistory.setArticle(existingArticle);

        var authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()) {
            Object principal = authentication.getPrincipal();
            String username;
            if (principal instanceof UserDetails) {
                username = ((UserDetails) principal).getUsername();
            } else {
                username = principal.toString();
            }
            userRepository.findByUsername(username).ifPresent(editHistory::setEditor);
        } else {
            // Default editor when no authentication available (no-auth profile)
            userRepository.findByUsername("admin").ifPresent(editHistory::setEditor);
        }

        editHistory.setContent(existingArticle.getContent());
        editHistoryRepository.save(editHistory);

        existingArticle.setTitle(articleDto.getTitle());
        existingArticle.setContent(articleDto.getContent());
        
        
        if (articleDto.getCategoryId() != null) {
            var category = categoryRepository.findById(articleDto.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found with id " + articleDto.getCategoryId()));
            existingArticle.setCategory(category);
        }
        
        return responseMapper.toArticleResponseDto(articleRepository.save(existingArticle));
    }

    @Override
    public void deleteArticle(Long id) {
        Article article = articleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Article not found with id " + id));
        
        
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()) {
            Object principal = authentication.getPrincipal();
            String username;
            if (principal instanceof UserDetails) {
                username = ((UserDetails) principal).getUsername();
            } else {
                username = principal.toString();
            }
            
            var currentUser = userRepository.findByUsername(username)
                    .orElseThrow(() -> new ResourceNotFoundException("Current user not found"));
            
            
            boolean isAdmin = authentication.getAuthorities().stream()
                    .anyMatch(auth -> auth.getAuthority().equals("ROLE_ADMIN"));
            boolean isAuthor = article.getAuthor() != null && article.getAuthor().getId().equals(currentUser.getId());
            
            if (!isAdmin && !isAuthor) {
                throw new RuntimeException("Access denied: you can only delete articles you authored");
            }
        }
        
        articleRepository.deleteById(id);
    }
}
