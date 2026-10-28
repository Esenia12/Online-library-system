import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Alert } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import CategoryService from "../services/CategoryService";

function CategoryCreatePage() {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleCreate = (e) => {
    e.preventDefault();

    setMessage("");
    setLoading(true);

    CategoryService.createCategory({ name })
      .then((response) => {
        if (!response.ok) {
          if (response.status === 403) {
            throw new Error(t("cannotCreateCategory"));
          }
          throw new Error("Failed to create category");
        }
        navigate("/categories");
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
      <h1>{t("createCategory")}</h1>
      <Form onSubmit={handleCreate}>
        <Form.Group controlId="name">
          <Form.Label>{t("name")}</Form.Label>
          <Form.Control
            type="text"
            placeholder={t("enterName")}
            value={name}
            onChange={(e) => setName(e.target.value)}
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

export default CategoryCreatePage;
