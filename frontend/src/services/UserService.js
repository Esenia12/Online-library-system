import authHeader from "./auth-header";

const API_URL = "/api/users";

const getAllUsers = () => {
  return fetch(API_URL, { headers: authHeader() });
};

const getUser = (id) => {
  return fetch(API_URL + "/" + id , { headers: authHeader() });
};

const createUser = (data) => {
  return fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeader(),
    },
    body: JSON.stringify(data),
  });
};

const updateUser = (id, data) => {
  return fetch(API_URL + "/" + id, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...authHeader(),
    },
    body: JSON.stringify(data),
  });
};

const deleteUser = (id) => {
  return fetch(API_URL + "/" + id, {
    method: "DELETE",
    headers: {
      ...authHeader(),
    },
  });
};

const UserService = {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
};

export default UserService;
