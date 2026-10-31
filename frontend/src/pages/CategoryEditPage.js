import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Form, Button, Alert } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import CategoryService from "../services/CategoryService";

function CategoryEditPage() {
  const { id } = useParams();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    CategoryService.getCategory(id)
      .then((response) => response.json())
      .then((data) => {
        setName(data.name);
      });
  }, [id]);

  const handleUpdate = (e) => {
    e.preventDefault();

    setMessage("");
    setLoading(true);

    CategoryService.updateCategory(id, { name })
      .then(() => {
        navigate(`/categories`);
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
      <h1>{t("editCategory")}</h1>
      <Form onSubmit={handleUpdate}>
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

export default CategoryEditPage;
