package com.example.wikipedia.repository;

import com.example.wikipedia.domain.Article;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ArticleRepository extends JpaRepository<Article, Long> {
    @Query(value = "SELECT * FROM articles a WHERE " +
           "(:search IS NULL OR lower(a.title) LIKE lower(concat('%', :search, '%')) OR lower(a.content) LIKE lower(concat('%', :search, '%'))) AND " +
           "(:categoryId IS NULL OR a.category_id = :categoryId)",
           nativeQuery = true)
    Page<Article> filterArticles(@Param("search") String search, @Param("categoryId") Long categoryId, Pageable pageable);
}
