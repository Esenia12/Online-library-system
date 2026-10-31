import authHeader from "./auth-header";

const API_URL = "/api/articles";

const createReview = (articleId, data) => {
  return fetch(`${API_URL}/${articleId}/reviews`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeader(),
    },
    body: JSON.stringify(data),
  });
};

const ReviewService = {
  createReview,
};

export default ReviewService;
