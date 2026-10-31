import authHeader from "./auth-header";

const API_URL = "/api/categories";

const getAllCategories = () => {
  return fetch(API_URL, { headers: authHeader() });
};

const getCategory = (id) => {
  return fetch(API_URL + id, { headers: authHeader() });
};

const createCategory = (data) => {
  return fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeader(),
    },
    body: JSON.stringify(data),
  });
};

const updateCategory = (id, data) => {
  return fetch(API_URL + "/" + id, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...authHeader(),
    },
    body: JSON.stringify(data),
  });
};

const deleteCategory = (id) => {
  return fetch(API_URL + "/" + id, {
    method: "DELETE",
    headers: {
      ...authHeader(),
    },
  });
};

const CategoryService = {
  getAllCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
};

export default CategoryService;
