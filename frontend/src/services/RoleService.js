import authHeader from "./auth-header";

const API_URL = "/api/roles";

const getAllRoles = () => {
  return fetch(API_URL, { headers: authHeader() });
};

const RoleService = {
  getAllRoles,
};

export default RoleService;
