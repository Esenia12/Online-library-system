import React, { useEffect, useState } from "react";
import { Container, ListGroup, Spinner, Alert, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import UserService from "../services/UserService";
import AuthService from "../services/AuthService"; 

function UserListPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null); 
  const navigate = useNavigate();
  const { t } = useTranslation();

  
  useEffect(() => {
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

  const canManageUsers = () => {
    return hasRole("ADMIN");
  };

  useEffect(() => {
    UserService.getAllUsers()
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setError(error.message);
        setLoading(false);
      });
  }, []);

  const handleDelete = (id) => {
    if (window.confirm(t("confirmDeleteUser"))) {
      UserService.deleteUser(id)
        .then((response) => {
          if (!response.ok) {
            if (response.status === 401) {
              throw new Error(t("unauthorized") || "Only administrators can delete users.");
            }
            throw new Error("Failed to delete user");
          }
          setUsers(users.filter((user) => user.id !== id));
        })
        .catch((error) => {
          setError(error.message);
        });
    }
  };

  return (
    <Container className="mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="mb-4">{t("users")}</h1>
        {canManageUsers() && (
          <Link to="/users/create">
            <Button variant="primary">{t("createUser")}</Button>
          </Link>
        )}
      </div>

      {loading && (
        <Spinner animation="border" role="status">
          <span className="visually-hidden">{t("loading")}</span>
        </Spinner>
      )}

      {error && <Alert variant="danger">{t("error", { message: error })}</Alert>}

      {!loading && !error && (
        <ListGroup>
          {users.length > 0 ? (
            users.map((user) => (
              <ListGroup.Item
                key={user.id}
                className="d-flex justify-content-between align-items-center"
              >
                {user.username}
                {canManageUsers() && (
                  <div>
                    <Link to={`/users/${user.id}/edit`}>
                      <Button variant="primary" className="mr-2">
                        {t("edit")}
                      </Button>
                    </Link>
                    <Button variant="danger" onClick={() => handleDelete(user.id)}>
                      {t("delete")}
                    </Button>
                  </div>
                )}
              </ListGroup.Item>
            ))
          ) : (
            <p>{t("noUsersFound")}</p>
          )}
        </ListGroup>
      )}
    </Container>
  );
}

export default UserListPage;