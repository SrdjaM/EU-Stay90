import React from "react";
import AuthForm from "../components/AuthForm";
import { Link } from "react-router-dom";
import { useNavigate, useLocation } from "react-router-dom";
import {ROUTES, UI_TEXT} from "../common/constants/constants"
import Button from "../components/Button";
import classes from "../styles/LoginPage.module.scss";

const LoginPage: React.FC = () => {
  let navigate = useNavigate();

  const handleSignIn = () => {
    navigate(ROUTES.SIGN_IN);
  };

  const location = useLocation();

  const isSignIn = location.pathname === ROUTES.SIGN_IN;

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
            {UI_TEXT.SIGN_UP}
          </Link>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
