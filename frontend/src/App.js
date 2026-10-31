import React, { useState, useEffect } from "react";
import { Routes, Route, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import AuthService from "./services/AuthService";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import HomePage from "./pages/HomePage";
import ArticlePage from "./pages/ArticlePage";
import CategoryListPage from "./pages/CategoryListPage";
import UserListPage from "./pages/UserListPage";
import ArticleCreatePage from "./pages/ArticleCreatePage";
import ArticleEditPage from "./pages/ArticleEditPage";
import CategoryCreatePage from "./pages/CategoryCreatePage";
import CategoryEditPage from "./pages/CategoryEditPage";
import UserCreatePage from "./pages/UserCreatePage";
import UserEditPage from "./pages/UserEditPage";

function App() {
  const [currentUser, setCurrentUser] = useState(undefined);
  const { t } = useTranslation();

  useEffect(() => {
    const user = AuthService.getCurrentUser();

    if (user) {
      setCurrentUser(user);
      // Fetch full user info from server
      AuthService.fetchCurrentUserInfo().then((userInfo) => {
        if (userInfo) {
          setCurrentUser(userInfo);
        }
      });
    }
  }, []);

  const logOut = () => {
    AuthService.logout();
  };

  return (
    <div>
      <nav className="navbar navbar-expand navbar-dark bg-dark">
        <Link to={"/"} className="navbar-brand">
          {t("wiki")}
        </Link>
        <div className="navbar-nav mr-auto">
          <li className="nav-item">
            <Link to={"/home"} className="nav-link">
              {t("home")}
            </Link>
          </li>
          <li className="nav-item">
            <Link to={"/categories"} className="nav-link">
              {t("categories")}
            </Link>
          </li>
          <li className="nav-item">
            <Link to={"/users"} className="nav-link">
              {t("users")}
            </Link>
          </li>
        </div>

        {currentUser ? (
          <div className="navbar-nav ml-auto">
            <li className="nav-item">
              <Link to={"/profile"} className="nav-link">
                {currentUser.username}
              </Link>
            </li>
            <li className="nav-item">
              <a href="/login" className="nav-link" onClick={logOut}>
                {t("logout")}
              </a>
            </li>
          </div>
        ) : (
          <div className="navbar-nav ml-auto">
            <li className="nav-item">
              <Link to={"/login"} className="nav-link">
                {t("login")}
              </Link>
            </li>
          </div>
        )}
      </nav>

      <div className="container mt-3">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/articles/create" element={<ArticleCreatePage />} />
          <Route path="/articles/:id/edit" element={<ArticleEditPage />} />
          <Route path="/articles/:id" element={<ArticlePage />} />
          <Route path="/categories/create" element={<CategoryCreatePage />} />
          <Route path="/categories/:id/edit" element={<CategoryEditPage />} />
          <Route path="/categories" element={<CategoryListPage />} />
          <Route path="/users/create" element={<UserCreatePage />} />
          <Route path="/users/:id/edit" element={<UserEditPage />} />
          <Route path="/users" element={<UserListPage />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
