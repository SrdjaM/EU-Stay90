import React from "react";
import LoginPage from "./pages/LoginPage";
import Layout from "./components/Layout";
import classes from "./App.module.scss";
import { useAuth } from "./contexts/AuthContext";
import { Navigate, Route, Routes } from "react-router-dom";
import AuthForm from "./components/AuthForm";

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <div className={classes.app}>
      <Routes>
        {isAuthenticated && <Route path="/" element={<Layout />} />}

        {!isAuthenticated && (
          <>
            <Route path="/signin" element={<LoginPage />} />
            <Route path="/signup" element={<LoginPage />} />
            <Route path="*" element={<Navigate to="/signin" replace />} />
          </>
        )}
      </Routes>
    </div>
  );
}

export default App;
