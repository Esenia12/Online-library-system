-- liquibase formatted sql

-- changeset viledan:2
-- Add ON DELETE SET NULL for reviews when user (reviewer) is deleted

ALTER TABLE reviews 
DROP CONSTRAINT IF EXISTS reviews_reviewer_id_fkey;

ALTER TABLE reviews 
ADD CONSTRAINT reviews_reviewer_id_fkey 
FOREIGN KEY (reviewer_id) REFERENCES users(id) ON DELETE SET NULL;
