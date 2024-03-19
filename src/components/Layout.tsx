import React from "react";
import { useAuth } from "../contexts/AuthContext";
import HomePage from "../pages/HomePage";

const Layout: React.FC = () => {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };
  return (
    <div>
      <h1>Layout</h1>
      <div>
        <button onClick={handleLogout}>Sign Out</button>
        <HomePage />
      </div>
    </div>
  );
};

export default Layout;
