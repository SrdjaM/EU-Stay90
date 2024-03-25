import React from "react";
import classes from "../styles/LoginPage.module.scss";
import AuthForm from "../components/AuthForm";
import { useNavigate, useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import Button from "../components/Button";

const LoginPage: React.FC = () => {
  let navigate = useNavigate();

  const handleSignIn = () => {
    navigate("/signin");
  };

  const location = useLocation();

  const isSignIn = location.pathname === "/signin";

  return (
    <div className={classes["login-page__container"]}>
      <h2>{isSignIn ? "Login Form" : "Sign Up Form"}</h2>
      {!isSignIn ? (
        <div className={classes["btn-wrap"]}>
          <Button variant="primary" onClick={handleSignIn}>
            Login
          </Button>
        </div>
      ) : (
        <div className={classes["welcome-back--message"]}>Welcome back!</div>
      )}
      <AuthForm />
      {isSignIn && (
        <div className={classes["signup__container"]}>
          <span className={classes["signup__text"]}>Create an account</span>
          <Link to={"/signup"} className={classes["signup__link"]}>
            Sign up
          </Link>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
