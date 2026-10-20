package com.example.wikipedia.service.impl;

import com.example.wikipedia.domain.Review;
import com.example.wikipedia.dto.ReviewCreateDto;
import com.example.wikipedia.dto.ReviewResponseDto;
import com.example.wikipedia.exception.ResourceNotFoundException;
import com.example.wikipedia.mapper.ResponseMapper;
import com.example.wikipedia.repository.ArticleRepository;
import com.example.wikipedia.repository.ReviewRepository;
import com.example.wikipedia.repository.UserRepository;
import com.example.wikipedia.service.ReviewService;
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
public class ReviewServiceImpl implements ReviewService {
    private final ReviewRepository reviewRepository;
    private final ResponseMapper responseMapper;
    private final ArticleRepository articleRepository;
    private final UserRepository userRepository;

    @Override
    public ReviewResponseDto createReviewResponse(Long articleId, ReviewCreateDto reviewDto) {
      
        var article = articleRepository.findById(articleId)
                .orElseThrow(() -> new ResourceNotFoundException("Article not found with id " + articleId));
        
        
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        String username;
        
        if (authentication != null && authentication.isAuthenticated()) {
            Object principal = authentication.getPrincipal();
            if (principal instanceof UserDetails) {
                username = ((UserDetails) principal).getUsername();
            } else {
                username = principal.toString();
            }
        } else {
            
            username = "admin";
        }
        
        var reviewer = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with username " + username));
        
        
        Review review = new Review();
        review.setArticle(article);
        review.setReviewer(reviewer);
        review.setComment(reviewDto.getComment());
        
        return responseMapper.toReviewResponseDto(reviewRepository.save(review));
    }

    @Override
    public List<ReviewResponseDto> getReviewsByArticleIdResponse(Long articleId) {
        return reviewRepository.findAllByArticleId(articleId).stream()
                .map(responseMapper::toReviewResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    public Page<ReviewResponseDto> getReviewsByArticleIdResponsePaged(Long articleId, Pageable pageable) {
        return reviewRepository.findAllByArticleId(articleId, pageable)
                .map(responseMapper::toReviewResponseDto);
    }
}
