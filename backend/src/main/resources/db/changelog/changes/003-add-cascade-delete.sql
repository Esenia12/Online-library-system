-- liquibase formatted sql

-- changeset viledan:1
-- Add CASCADE DELETE to foreign keys for edit_history and reviews when article is deleted

-- Drop existing foreign keys
ALTER TABLE edit_history 
DROP CONSTRAINT IF EXISTS edit_history_article_id_fkey;

ALTER TABLE reviews 
DROP CONSTRAINT IF EXISTS reviews_article_id_fkey;

-- Add new foreign keys with ON DELETE CASCADE
ALTER TABLE edit_history 
ADD CONSTRAINT edit_history_article_id_fkey 
FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE;

ALTER TABLE reviews 
ADD CONSTRAINT reviews_article_id_fkey 
FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE;
