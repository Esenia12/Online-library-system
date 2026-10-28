import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Alert, Spinner } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import UserService from "../services/UserService";
import RoleService from "../services/RoleService";

function UserCreatePage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRoleIds, setSelectedRoleIds] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingRoles, setLoadingRoles] = useState(true);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Load roles on mount
  useEffect(() => {
    RoleService.getAllRoles()
      .then((response) => response.json())
      .then((data) => {
        setRoles(data);
        // Set default to AUTHOR role (usually id 2)
        const authorRole = data.find(r => r.name === "AUTHOR");
        if (authorRole) {
          setSelectedRoleIds([authorRole.id]);
        }
        setLoadingRoles(false);
      })
      .catch((error) => {
        console.error("Error fetching roles:", error);
        setLoadingRoles(false);
      });
  }, []);

  const handleRoleChange = (roleId) => {
    setSelectedRoleIds(prev => 
      prev.includes(roleId)
        ? prev.filter(id => id !== roleId)
        : [...prev, roleId]
    );
  };

  const handleCreate = (e) => {
    e.preventDefault();

    if (selectedRoleIds.length === 0) {
      setMessage("Please select at least one role");
      return;
    }

    setMessage("");
    setLoading(true);

    UserService.createUser({ 
      username, 
      email, 
      password, 
      roleIds: selectedRoleIds 
    })
      .then(() => {
        navigate("/users");
        window.location.reload();
      })
      .catch((error) => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();

        setLoading(false);
        setMessage(resMessage);
      });
  };

  if (loadingRoles) {
    return (
      <div>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">{t("loading")}</span>
        </Spinner>
      </div>
    );
  }

  return (
    <div>
      <h1>{t("createUser")}</h1>
      <Form onSubmit={handleCreate}>
        <Form.Group controlId="username">
          <Form.Label>{t("username")}</Form.Label>
          <Form.Control
            type="text"
            placeholder={t("enterUsername")}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="email">
          <Form.Label>{t("email")}</Form.Label>
          <Form.Control
            type="email"
            placeholder={t("enterEmail")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="password">
          <Form.Label>{t("password")}</Form.Label>
          <Form.Control
            type="password"
            placeholder={t("enterPassword")}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="roles">
          <Form.Label>{t("role")}</Form.Label>
          <div>
            {roles.map((role) => (
              <Form.Check
                key={role.id}
                type="checkbox"
                id={`role-${role.id}`}
                label={role.name}
                checked={selectedRoleIds.includes(role.id)}
                onChange={() => handleRoleChange(role.id)}
              />
            ))}
          </div>
        </Form.Group>

        <Button variant="primary" type="submit" disabled={loading} className="mt-3">
          {loading && (
            <span className="spinner-border spinner-border-sm"></span>
          )}
          <span>{t("create")}</span>
        </Button>

        {message && (
          <div className="mt-3">
            <Alert variant="danger">{message}</Alert>
          </div>
        )}
      </Form>
    </div>
  );
}

export default UserCreatePage;

