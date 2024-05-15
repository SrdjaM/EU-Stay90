import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import HomePage from "../pages/HomePage";
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
      <div>
        <Button variant="primary" onClick={handleLogout}>
          Sign Out
        </Button>
      </div>
      <HomePage />
    </div>
  );
};

export default Layout;
