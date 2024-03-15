import React from "react";
import LoginPage from "./pages/LoginPage";
import Layout from "./components/Layout";
import classes from "./App.module.scss";
import { useAuth } from "./contexts/AuthContext";

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <div className={classes.app}>
      {isAuthenticated ? <Layout /> : <LoginPage />}
    </div>
  );
}

export default App;
