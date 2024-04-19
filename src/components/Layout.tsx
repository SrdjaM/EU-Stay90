import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Button from "./Button";

const Layout: React.FC = () => {
  const { logout } = useAuth();

  let navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };
  return (
    <div>
      <h1>Layout</h1>
      <div>
        <Button variant="primary" onClick={handleLogout}>
          Sign Out
        </Button>
      </div>
    </div>
  );
};

export default Layout;
