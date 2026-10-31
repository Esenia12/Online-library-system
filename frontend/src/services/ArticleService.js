import authHeader from "./auth-header";

const API_URL = "/api/articles";

const getAllArticles = (page = 0, size = 10, search = "", categoryId = "") => {
  const params = new URLSearchParams();
  params.append("page", page);
  params.append("size", size);
  if (search) {
    params.append("search", search);
  }
  if (categoryId) {
    params.append("categoryId", categoryId);
  }

  return fetch(`${API_URL}/filter?${params.toString()}`, { headers: authHeader() });
};

const getArticle = (id) => {
  return fetch(API_URL + "/" + id, { headers: authHeader() });
};

const getEditHistory = (id) => {
  return fetch(API_URL + "/" + id + "/history", { headers: authHeader() });
};

const getEditHistoryPaged = (id, page = 0, size = 5) => {
  const params = new URLSearchParams();
  params.append("page", page);
  params.append("size", size);
  return fetch(API_URL + "/" + id + "/history/paged?" + params.toString(), { headers: authHeader() });
};

const getMyEditHistoryPaged = (id, page = 0, size = 5) => {
  const params = new URLSearchParams();
  params.append("page", page);
  params.append("size", size);
  return fetch(API_URL + "/" + id + "/history/my?" + params.toString(), { headers: authHeader() });
};

const getReviews = (id) => {
  return fetch(API_URL + "/" + id + "/reviews", { headers: authHeader() });
};

const getReviewsPaged = (id, page = 0, size = 5) => {
  const params = new URLSearchParams();
  params.append("page", page);
  params.append("size", size);
  return fetch(API_URL + "/" + id + "/reviews/paged?" + params.toString(), { headers: authHeader() });
};

const createArticle = (data) => {
  return fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeader(),
    },
    body: JSON.stringify(data),
  });
};

const updateArticle = (id, data) => {
  return fetch(API_URL + "/" + id, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...authHeader(),
    },
    body: JSON.stringify(data),
  });
};

const deleteArticle = (id) => {
  return fetch(API_URL + "/" + id, {
    method: "DELETE",
    headers: {
      ...authHeader(),
    },
  });
};

const ArticleService = {
  getAllArticles,
  getArticle,
  getEditHistory,
  getEditHistoryPaged,
  getMyEditHistoryPaged,
  getReviews,
  getReviewsPaged,
  createArticle,
  updateArticle,
  deleteArticle,
};

export default ArticleService;
