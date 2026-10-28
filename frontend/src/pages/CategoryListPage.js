import React, { useEffect, useState } from "react";
import { Container, ListGroup, Spinner, Alert, Button, Modal } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import CategoryService from "../services/CategoryService";
import AuthService from "../services/AuthService";

function CategoryListPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [selectedCategoryName, setSelectedCategoryName] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Загружаем текущего пользователя (с ролями)
  useEffect(() => {
    AuthService.fetchCurrentUserInfo().then((userInfo) => {
      if (userInfo) {
        setCurrentUser(userInfo);
      }
    });
  }, []);

  const hasRole = (role) => {
    if (!currentUser || !currentUser.roles) return false;
    return currentUser.roles.some((r) => r.name === role);
  };

  const canManageCategories = () => {
    return hasRole("ADMIN");
  };

  useEffect(() => {
    CategoryService.getAllCategories()
      .then((response) => {
        if (!response.ok) throw new Error("Network response was not ok");
        return response.json();
      })
      .then((data) => {
        setCategories(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
        setError(error.message);
        setLoading(false);
      });
  }, []);

  const handleDelete = (id, name) => {
    setSelectedCategoryId(id);
    setSelectedCategoryName(name);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (selectedCategoryId) {
      CategoryService.deleteCategory(selectedCategoryId)
        .then((response) => {
          if (!response.ok) {
            if (response.status === 401) {
              throw new Error(t("unauthorized") || "Only administrators can delete categories.");
            }
            throw new Error("Failed to delete category");
          }
          setCategories(categories.filter((category) => category.id !== selectedCategoryId));
          setShowDeleteModal(false);
          setSelectedCategoryId(null);
          setSelectedCategoryName("");
        })
        .catch((error) => {
          setError(error.message);
          setShowDeleteModal(false);
        });
    }
  };

  return (
    <Container className="mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="mb-4">{t("categories")}</h1>
        {canManageCategories() && (
          <Link to="/categories/create">
            <Button variant="primary">{t("createCategory")}</Button>
          </Link>
        )}
      </div>

      {loading && (
        <Spinner animation="border" role="status">
          <span className="visually-hidden">{t("loading")}</span>
        </Spinner>
      )}

      {error && <Alert variant="danger">{t("error", { message: error })}</Alert>}

      {!loading && !error && (
        <ListGroup>
          {categories.length > 0 ? (
            categories.map((category) => (
              <ListGroup.Item
                key={category.id}
                className="d-flex justify-content-between align-items-center"
              >
                {category.name}
                <div>
                  {canManageCategories() && (
                    <>
                      <Link to={`/categories/${category.id}/edit`}>
                        <Button variant="primary" className="mr-2">
                          {t("edit")}
                        </Button>
                      </Link>
                      <Button
                        variant="danger"
                        onClick={() => handleDelete(category.id, category.name)}
                      >
                        {t("delete")}
                      </Button>
                    </>
                  )}
                </div>
              </ListGroup.Item>
            ))
          ) : (
            <p>{t("noCategoriesFound")}</p>
          )}
        </ListGroup>
      )}

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{t("deleteCategory")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Alert variant="warning">
            <strong>{t("warning")}:</strong> {t("deleteWarning")}
          </Alert>
          <p>
            {t("confirmDeleteMsg")} "<strong>{selectedCategoryName}</strong>"?
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            {t("cancel")}
          </Button>
          <Button variant="danger" onClick={handleConfirmDelete}>
            {t("delete")}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default CategoryListPage;