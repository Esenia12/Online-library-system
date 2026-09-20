-- liquibase formatted sql

-- changeset viledan:5
-- Change foreign key on articles.category_id to ON DELETE SET NULL
-- So deleting a category does NOT delete articles, but sets category_id = NULL

ALTER TABLE articles 
DROP CONSTRAINT IF EXISTS articles_category_id_fkey;

ALTER TABLE articles 
ADD CONSTRAINT articles_category_id_fkey 
FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL;