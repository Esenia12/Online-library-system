-- liquibase formatted sql

-- changeset viledan:4
-- Add ON DELETE SET NULL for articles when user (author) is deleted

ALTER TABLE articles 
DROP CONSTRAINT IF EXISTS articles_author_id_fkey;

ALTER TABLE articles 
ADD CONSTRAINT articles_author_id_fkey 
FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE SET NULL;
