package com.example.wikipedia.repository;

import com.example.wikipedia.domain.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findAllByArticleId(Long articleId);
    Page<Review> findAllByArticleId(Long articleId, Pageable pageable);
}
