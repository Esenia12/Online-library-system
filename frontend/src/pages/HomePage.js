import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Spinner,
  Alert,
  Button,
  Form,
  Pagination,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ArticleService from "../services/ArticleService";
import CategoryService from "../services/CategoryService";
import AuthService from "../services/AuthService";

function HomePage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState([]);
  const [currentUser, setCurrentUser] = useState(null); // ✅
  const { t } = useTranslation();

  // ✅ Загружаем текущего пользователя
  useEffect(() => {
      setCurrentUser(AuthService.getCurrentUser());

      AuthService.fetchCurrentUserInfo().then((userInfo) => {
      if (userInfo) setCurrentUser(userInfo);
    });
  }, []);

  const hasRole = (role) => {
    if (!currentUser || !currentUser.roles) return false;
    return currentUser.roles.some((r) => r.name === role);
  };

  const canCreateArticle = () => {
    return hasRole("ADMIN") || hasRole("AUTHOR");
  };

  // Загрузка категорий (без изменений)
  useEffect(() => {
    CategoryService.getAllCategories()
      .then((response) => response.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);

  // Загрузка статей (без изменений)
  useEffect(() => {
    setLoading(true);
    ArticleService.getAllArticles(page, 10, search, categoryId)
      .then((response) => {
        if (!response.ok) throw new Error("Network response was not ok");
        return response.json();
      })
      .then((data) => {
        setArticles(data.content || []);
        setTotalPages(data.totalPages);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [page, search, categoryId]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(0);
  };

  const handleCategoryChange = (e) => {
    setCategoryId(e.target.value);
    setPage(0);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setPage(newPage);
    }
  };

  return (
    <Container className="mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>{t("wikipediaArticles")}</h1>
        {canCreateArticle() && (
          <Link to="/articles/create">
            <Button variant="primary">{t("createArticle")}</Button>
          </Link>
        )}
      </div>

      <Row className="mb-4">
        <Col md={6}>
          <Form.Group controlId="search">
            <Form.Control
              type="text"
              placeholder={t("searchByTitleOrContent")}
              value={search}
              onChange={handleSearchChange}
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group controlId="categoryFilter">
            <Form.Control
              as="select"
              value={categoryId}
              onChange={handleCategoryChange}
            >
              <option value="">{t("allCategories")}</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
        </Col>
      </Row>

      {loading && (
        <Spinner animation="border" role="status">
          <span className="visually-hidden">{t("loading")}</span>
        </Spinner>
      )}

      {error && <Alert variant="danger">{t("error", { message: error })}</Alert>}

      {!loading && !error && (
        <>
          <Row>
            {articles.length > 0 ? (
              articles.map((article) => (
                <Col key={article.id} md={4} className="mb-3">
                  <Card>
                    <Card.Body>
                      <Card.Title>{article.title}</Card.Title>
                      <Card.Subtitle className="mb-2 text-muted">
                        {t("category")}: {article.category?.name}
                      </Card.Subtitle>
                      <Card.Text>
                        {article.content
                          ? article.content.substring(0, 100) + "..."
                          : t("noContent")}
                      </Card.Text>
                      <Link to={`/articles/${article.id}`}>
                        <Button variant="primary">{t("viewArticle")}</Button>
                      </Link>
                    </Card.Body>
                  </Card>
                </Col>
              ))
            ) : (
              <p>{t("noArticlesFound")}</p>
            )}
          </Row>
          <Pagination>
            <Pagination.Prev
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 0}
            />
            {[...Array(totalPages).keys()].map((pageNumber) => (
              <Pagination.Item
                key={pageNumber}
                active={pageNumber === page}
                onClick={() => handlePageChange(pageNumber)}
              >
                {pageNumber + 1}
              </Pagination.Item>
            ))}
            <Pagination.Next
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages - 1}
            />
          </Pagination>
        </>
      )}
    </Container>
  );
}

export default HomePage;
