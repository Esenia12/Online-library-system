import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Card,
  Spinner,
  Alert,
  ListGroup,
  Button,
  Form,
} from "react-bootstrap";
import { useTranslation } from "react-i18next";
import ArticleService from "../services/ArticleService";
import ReviewService from "../services/ReviewService";
import UserService from "../services/UserService";
import AuthService from "../services/AuthService";

function ArticlePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [editHistory, setEditHistory] = useState([]);
  const [editHistoryPage, setEditHistoryPage] = useState(0);
  const [editHistoryTotal, setEditHistoryTotal] = useState(0);
  const [showOnlyMyEdits, setShowOnlyMyEdits] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [reviewsPage, setReviewsPage] = useState(0);
  const [reviewsTotal, setReviewsTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comment, setComment] = useState("");
  const [editorNames, setEditorNames] = useState({});
  const [currentUser, setCurrentUser] = useState(null);
  const { t } = useTranslation();

  const ITEMS_PER_PAGE = 5;

  useEffect(() => {
    setCurrentUser(AuthService.getCurrentUser());

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

  const canEditArticle = () => {
    if (hasRole("ADMIN") || hasRole("AUTHOR")) return true;
   
    return article && currentUser && article.authorId === currentUser.id;
  };

  const canDeleteArticle = () => {
    return hasRole("ADMIN");
  };

  const fetchUserName = async (userId) => {
    if (editorNames[userId]) {
      return editorNames[userId];
    }
    try {
      const response = await UserService.getUser(userId);
      if (response.ok) {
        const userData = await response.json();
        setEditorNames((prev) => ({
          ...prev,
          [userId]: userData.username,
        }));
        return userData.username;
      }
    } catch (err) {
      console.error("Error fetching user:", err);
    }
    return null;
  };

  const fetchArticleData = () => {
    const editHistoryPromise = showOnlyMyEdits && currentUser
      ? ArticleService.getMyEditHistoryPaged(id, editHistoryPage, ITEMS_PER_PAGE)
      : ArticleService.getEditHistoryPaged(id, editHistoryPage, ITEMS_PER_PAGE);

    const editHistoryFetch = editHistoryPromise
      .then(async (res) => {
        if (res.ok) {
          const data = await res.json();
         
          if (data.content && data.content.length > 0) {
            for (const edit of data.content) {
              if (edit.editorId) {
                await fetchUserName(edit.editorId);
              }
            }
          }
          return { content: data.content || [], totalElements: data.totalElements || 0 };
        }
        throw new Error("Failed to fetch edit history");
      });

    const reviewsPromise = ArticleService.getReviewsPaged(id, reviewsPage, ITEMS_PER_PAGE)
      .then(async (res) => {
        if (res.ok) {
          const data = await res.json();
          return { content: data.content || [], totalElements: data.totalElements || 0 };
        }
        throw new Error("Failed to fetch reviews");
      });

    Promise.all([
      ArticleService.getArticle(id),
      editHistoryFetch,
      reviewsPromise,
    ])
      .then(([articleRes, historyData, reviewsData]) => {
        if (!articleRes.ok) {
          throw new Error("Network response was not ok");
        }
        return articleRes.json().then((articleData) => {
          setArticle(articleData);
          setEditHistory(historyData.content);
          setEditHistoryTotal(historyData.totalElements);
          setReviews(reviewsData.content);
          setReviewsTotal(reviewsData.totalElements);
          setLoading(false);
        });
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setError(error.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    setLoading(true);
    fetchArticleData();
  }, [id, editHistoryPage, reviewsPage, showOnlyMyEdits]);

  const handleDelete = () => {
    if (window.confirm(t("confirmDeleteArticle"))) {
      ArticleService.deleteArticle(id)
        .then(() => {
          navigate("/home");
          window.location.reload();
        })
        .catch((error) => {
          setError(error.message);
        });
    }
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    ReviewService.createReview(id, { comment })
      .then(() => {
        setComment("");
        fetchArticleData(); // Refresh data
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  return (
    <div>
      {loading && (
        <Spinner animation="border" role="status">
          <span className="visually-hidden">{t("loading")}</span>
        </Spinner>
      )}

      {error && <Alert variant="danger">{t("error", { message: error })}</Alert>}

      {!loading && !error && article && (
        <div>
          <Card>
            <Card.Body>
              <Card.Title>{article.title}</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">
                {t("category")}: {article.category?.name}
              </Card.Subtitle>
              <Card.Text>
                <div dangerouslySetInnerHTML={{ __html: article.content }} />
              </Card.Text>
              {canEditArticle() && (
                <Link to={`/articles/${id}/edit`}>
                  <Button variant="primary" className="mr-2">
                    {t("edit")}
                  </Button>
                </Link>
              )}
              {canDeleteArticle() && (
                <Button variant="danger" onClick={handleDelete}>
                  {t("delete")}
                </Button>
              )}
            </Card.Body>
          </Card>

          <h2 className="mt-4">{t("editHistory")}</h2>
          <Form.Check
            type="checkbox"
            label={t("showOnlyMyEdits") || "Show only my edits"}
            checked={showOnlyMyEdits}
            onChange={(e) => {
              setShowOnlyMyEdits(e.target.checked);
              setEditHistoryPage(0);
            }}
            className="mb-3"
          />
          <ListGroup>
            {editHistory.length > 0 ? (
              <>
                {editHistory.map((edit) => (
                  <ListGroup.Item key={edit.id}>
                    <p>
                      <strong>{t("user")}:</strong> {editorNames[edit.editorId] || `User #${edit.editorId}`}
                    </p>
                    <p>
                      <strong>{t("timestamp")}:</strong>{" "}
                      {new Date(edit.editedAt).toLocaleString()}
                    </p>
                    <p>
                      <strong>{t("changes")}:</strong> {edit.content}
                    </p>
                  </ListGroup.Item>
                ))}
                {editHistoryTotal > ITEMS_PER_PAGE && (
                  <div className="d-flex justify-content-between mt-3">
                    <Button
                      variant="outline-secondary"
                      disabled={editHistoryPage === 0}
                      onClick={() => setEditHistoryPage(editHistoryPage - 1)}
                    >
                      {t("previous")}
                    </Button>
                    <span>
                      {editHistoryPage + 1} / {Math.ceil(editHistoryTotal / ITEMS_PER_PAGE)}
                    </span>
                    <Button
                      variant="outline-secondary"
                      disabled={
                        editHistoryPage >= Math.ceil(editHistoryTotal / ITEMS_PER_PAGE) - 1
                      }
                      onClick={() => setEditHistoryPage(editHistoryPage + 1)}
                    >
                      {t("next")}
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <p>{t("noEditHistoryFound")}</p>
            )}
          </ListGroup>

          <h2 className="mt-4">{t("reviews")}</h2>
          <ListGroup>
            {reviews.length > 0 ? (
              <>
                {reviews.map((review) => (
                  <ListGroup.Item key={review.id}>
                    <p>
                      <strong>{t("user")}:</strong> {review.reviewer?.username}
                    </p>
                    <p>
                      <strong>{t("comment")}:</strong> {review.comment}
                    </p>
                    <p>
                      <strong>{t("timestamp")}:</strong>{" "}
                      {new Date(review.createdAt).toLocaleString()}
                    </p>
                  </ListGroup.Item>
                ))}
                {reviewsTotal > ITEMS_PER_PAGE && (
                  <div className="d-flex justify-content-between mt-3">
                    <Button
                      variant="outline-secondary"
                      disabled={reviewsPage === 0}
                      onClick={() => setReviewsPage(reviewsPage - 1)}
                    >
                      {t("previous")}
                    </Button>
                    <span>
                      {reviewsPage + 1} / {Math.ceil(reviewsTotal / ITEMS_PER_PAGE)}
                    </span>
                    <Button
                      variant="outline-secondary"
                      disabled={reviewsPage >= Math.ceil(reviewsTotal / ITEMS_PER_PAGE) - 1}
                      onClick={() => setReviewsPage(reviewsPage + 1)}
                    >
                      {t("next")}
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <p>{t("noReviewsFound")}</p>
            )}
          </ListGroup>

          {currentUser ? (
            <>
              <h2 className="mt-4">{t("leaveAReview")}</h2>
              <Form onSubmit={handleReviewSubmit}>
                <Form.Group controlId="comment">
                  <Form.Label>{t("comment")}</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    required
                  />
                </Form.Group>
                <Button variant="primary" type="submit" className="mt-2">
                  {t("submitReview")}
                </Button>
              </Form>
            </>
          ) : (
            <div className="mt-4">
          
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ArticlePage;
