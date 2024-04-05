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
      <div>
        <button onClick={handleLogout}>Sign Out</button>
      </div>
      <HomePage />
    </div>
  );
};

export default Layout;
