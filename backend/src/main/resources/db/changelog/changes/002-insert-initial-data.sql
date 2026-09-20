INSERT INTO roles (name) VALUES ('ADMIN');
INSERT INTO roles (name) VALUES ('AUTHOR');

INSERT INTO users (username, password, email) VALUES ('admin', '$2a$10$slYQmyNdGzTn7ZLBXBChFOC9f6kFjAqPhccnP6DxlWXx2lPk1C3G6', 'admin@example.com');

INSERT INTO user_roles (user_id, role_id) VALUES (1, 1);
