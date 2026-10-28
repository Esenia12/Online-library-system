import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Form, Button, Alert, Spinner } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import UserService from "../services/UserService";
import RoleService from "../services/RoleService";

function UserEditPage() {
  const { id } = useParams();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [selectedRoleIds, setSelectedRoleIds] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    // Load roles
    RoleService.getAllRoles()
      .then((response) => response.json())
      .then((data) => setRoles(data))
      .catch((error) => console.error("Error fetching roles:", error));

    // Load user data
    UserService.getUser(id)
      .then((response) => response.json())
      .then((data) => {
        setUsername(data.username);
        setEmail(data.email);
        // Set selected roles based on user's current roles
        if (data.roles && Array.isArray(data.roles)) {
          const roleIds = data.roles.map(role => role.id);
          setSelectedRoleIds(roleIds);
        }
        setLoadingData(false);
      })
      .catch((error) => {
        console.error("Error fetching user:", error);
        setLoadingData(false);
      });
  }, [id]);

  const handleRoleChange = (roleId) => {
    setSelectedRoleIds(prev => 
      prev.includes(roleId)
        ? prev.filter(id => id !== roleId)
        : [...prev, roleId]
    );
  };

  const handleUpdate = (e) => {
    e.preventDefault();

    if (selectedRoleIds.length === 0) {
      setMessage("Please select at least one role");
      return;
    }

    setMessage("");
    setLoading(true);

    UserService.updateUser(id, { 
      username, 
      email, 
      roleIds: selectedRoleIds 
    })
      .then(() => {
        navigate(`/users`);
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

  if (loadingData) {
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
      <h1>{t("editUser")}</h1>
      <Form onSubmit={handleUpdate}>
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

        <Button variant="primary" type="submit" disabled={loading}>
          {loading && (
            <span className="spinner-border spinner-border-sm"></span>
          )}
          <span>{t("update")}</span>
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

export default UserEditPage;
