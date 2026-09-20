-- liquibase formatted sql

-- changeset viledan:3
-- Add creator_id field to categories table

ALTER TABLE categories 
ADD COLUMN creator_id BIGINT;

ALTER TABLE categories 
ADD CONSTRAINT categories_creator_id_fkey 
FOREIGN KEY (creator_id) REFERENCES users(id) ON DELETE SET NULL;
