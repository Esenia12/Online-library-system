package com.example.wikipedia.domain;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "edit_history")
@Data
@NoArgsConstructor
public class EditHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "article_id")
    private Article article;

    @ManyToOne
    @JoinColumn(name = "editor_id")
    private User editor;

    @Column(nullable = false)
    private String content;

    @Column(name = "edited_at", nullable = false, updatable = false)
    private LocalDateTime editedAt;

    @PrePersist
    protected void onEdit() {
        editedAt = LocalDateTime.now();
    }
}
