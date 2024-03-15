import React, { useState } from "react";
import SignIn from "../components/SignIn";
import SignUp from "../components/SignUp";
import classes from "../styles/LoginPage.module.scss";
import AuthForm from "../components/AuthForm";

const LoginPage: React.FC = () => {
  const [isSignIn, setIsSignIn] = useState(true);

  const handleSignIn = () => {
    setIsSignIn(true);
  };

  const handleSignUp = () => {
    setIsSignIn(false);
  };

  return (
    <div className={classes["login-page__container"]}>
      <h2>{isSignIn ? "Login Form" : "Sign Up Form"}</h2>
      <div className={classes["btn-wrap"]}>
        <div className={classes["button-container"]}>
          <button
            onClick={handleSignIn}
            className={`${classes["login-page__btn"]} ${
              isSignIn ? classes["inactive"] : ""
            }`}
            aria-label="Sign In"
          >
            Login
          </button>
          <button
            onClick={handleSignUp}
            className={`${classes["login-page__btn"]} ${
              !isSignIn ? classes["inactive"] : ""
            }`}
            aria-label="Sign Up"
          >
            Sign Up
          </button>
        </div>
      </div>
      <AuthForm isSignIn={isSignIn} setIsSignIn={setIsSignIn} />
    </div>
  );
};

export default LoginPage;
