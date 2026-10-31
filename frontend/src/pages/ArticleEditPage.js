import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Form, Button, Alert } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import ArticleService from "../services/ArticleService";

function ArticleEditPage() {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    ArticleService.getArticle(id)
      .then((response) => response.json())
      .then((data) => {
        setTitle(data.title);
        setContent(data.content);
      });
  }, [id]);

  const handleUpdate = (e) => {
    e.preventDefault();

    setMessage("");
    setLoading(true);

    ArticleService.updateArticle(id, { title, content })
      .then(() => {
        navigate(`/articles/${id}`);
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
      <h1>{t("editArticle")}</h1>
      <Form onSubmit={handleUpdate}>
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
          <span>{t("update")}</span>
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

export default ArticleEditPage;
