import authHeader from "./auth-header";

const API_URL = "/api/auth/";

const login = (username, password) => {
  return fetch(API_URL + "login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      password,
    }),
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error("Authentication failed");
    })
    .then((data) => {
      if (data.accessToken) {
        localStorage.setItem("user", JSON.stringify(data));
      }
      return data;
    });
};

const logout = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("userInfo");
};

const getCurrentUser = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  
 
  if (userInfo) {
    return userInfo;
  }
  return user;
};

const fetchCurrentUserInfo = async () => {
  try {
    const response = await fetch(API_URL + "me", {
      headers: authHeader(),
    });
    if (response.ok) {
      const userInfo = await response.json();
      localStorage.setItem("userInfo", JSON.stringify(userInfo));
      return userInfo;
    }
  } catch (error) {
    console.error("Error fetching user info:", error);
  }
  return null;
};

const AuthService = {
  login,
  logout,
  getCurrentUser,
  fetchCurrentUserInfo,
};

export default AuthService;
