import React from "react";
import { useAuth } from "../contexts/AuthContext";

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
      </div>
    </div>
  );
};

export default Layout;
