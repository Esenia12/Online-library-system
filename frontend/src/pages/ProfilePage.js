import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import AuthService from "../services/AuthService";

const ProfilePage = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const { t } = useTranslation();

  useEffect(() => {
    const user = AuthService.getCurrentUser();
    setCurrentUser(user);
    
    // Fetch full user info from server
    AuthService.fetchCurrentUserInfo().then((userInfo) => {
      if (userInfo) {
        setCurrentUser(userInfo);
      }
    });
  }, []);

  if (!currentUser) {
    return <div>{t("loading")}</div>;
  }

  return (
    <div className="container">
      <header className="jumbotron">
        <h3>
          <strong>{currentUser.username}</strong> {t("profile")}
        </h3>
      </header>
      <p>
        <strong>{t("id")}:</strong> {currentUser.id}
      </p>
      <p>
        <strong>{t("email")}:</strong> {currentUser.email}
      </p>
      <strong>{t("authorities")}:</strong>
      <ul>
        {currentUser.roles &&
          currentUser.roles.map((role, index) => <li key={index}>{role.name || role}</li>)}
      </ul>
    </div>
  );
};

export default ProfilePage;
