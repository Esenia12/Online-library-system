package com.example.wikipedia.repository;

import com.example.wikipedia.domain.EditHistory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EditHistoryRepository extends JpaRepository<EditHistory, Long> {
    List<EditHistory> findAllByArticleId(Long articleId);
    Page<EditHistory> findAllByArticleId(Long articleId, Pageable pageable);
    Page<EditHistory> findAllByArticleIdAndEditorId(Long articleId, Long editorId, Pageable pageable);
}
