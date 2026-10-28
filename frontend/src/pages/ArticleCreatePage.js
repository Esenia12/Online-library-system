import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Alert } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import ArticleService from "../services/ArticleService";
import CategoryService from "../services/CategoryService";

function ArticleCreatePage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    CategoryService.getAllCategories()
      .then((response) => response.json())
      .then((data) => {
        setCategories(data);
        if (data.length > 0) {
          setCategoryId(data[0].id);
        }
      })
      .catch((error) => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
        setMessage(resMessage);
      });
  }, []);

  const handleCreate = (e) => {
    e.preventDefault();

    setMessage("");
    setLoading(true);

    ArticleService.createArticle({ title, content, categoryId })
      .then(() => {
        navigate("/home");
        window.location.reload();
      })
      .catch((error) => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();

        setLoading(false);
        setMessage(resMessage);
      });
  };

  return (
    <div>
      <h1>{t("createArticle")}</h1>
      <Form onSubmit={handleCreate}>
        <Form.Group controlId="title">
          <Form.Label>{t("title")}</Form.Label>
          <Form.Control
            type="text"
            placeholder={t("enterTitle")}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="category">
          <Form.Label>{t("category")}</Form.Label>
          <Form.Control
            as="select"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            required
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </Form.Control>
        </Form.Group>

        <Form.Group controlId="content">
          <Form.Label>{t("content")}</Form.Label>
          <Form.Control
            as="textarea"
            rows={10}
            placeholder={t("enterContent")}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </Form.Group>

        <Button variant="primary" type="submit" disabled={loading}>
          {loading && (
            <span className="spinner-border spinner-border-sm"></span>
          )}
          <span>{t("create")}</span>
        </Button>

        {message && (
          <div className="mt-3">
            <Alert variant="danger">{message}</Alert>
          </div>
        )}
      </Form>
    </div>
  );
}

export default ArticleCreatePage;
