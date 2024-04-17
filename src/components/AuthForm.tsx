import React, { useEffect, useState } from "react";
import { object, string } from "yup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

import { FieldNames } from "../common/enums/FieldNames";
import { useAuthentication } from "../common/hooks/AuthHooks";
import { useLocation, useNavigate } from "react-router-dom";
import { ERROR_MESSAGES, ROUTES, UI_TEXT } from "../common/constants/constants";
import Button from "./Button";
import classes from "../styles/AuthForm.module.scss";

const PASSWORD_MIN_CHAR = 6;

interface AuthData {
  username?: string;
  email: string;
  password: string;
  confirmPassword?: string;
}

type FormError = {
  fieldName: keyof AuthData;
  message: string;
};

const AuthForm: React.FC = () => {
  const [authData, setAuthData] = useState<AuthData>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<FormError[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { signIn, signUp } = useAuthentication();

  const location = useLocation();
  const navigate = useNavigate();

  const isSignIn = location.pathname === ROUTES.SIGN_IN;

  const resetFormData = () => {
    setAuthData({
      email: "",
      password: "",
      username: "",
      confirmPassword: "",
    });
    setErrors([]);
    setErrorMessage(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAuthData({ ...authData, [name]: value });
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    validateField(name, value);
  };

  const validateField = (name: string, value: string) => {
    try {
      const fieldSchema = object().shape({
        username:
          !isSignIn && name === FieldNames.Username
            ? string().required(ERROR_MESSAGES.USERNAME_REQUIRED)
            : string(),
        email:
          name === FieldNames.Email
            ? string()
                .email(ERROR_MESSAGES.INVALID_EMAIL)
                .required(ERROR_MESSAGES.EMAIL_REQUIRED)
            : string(),
        password:
          name === FieldNames.Password
            ? string()
                .min(PASSWORD_MIN_CHAR, ERROR_MESSAGES.PASSWORD_MIN_LENGTH)
                .required(ERROR_MESSAGES.PASSWORD_REQUIRED)
            : string(),
        confirmPassword:
          !isSignIn && name === FieldNames.ConfirmPassword
            ? string()
                .oneOf([authData.password], ERROR_MESSAGES.PASSWORDS_MUST_MATCH)
                .required(ERROR_MESSAGES.CONFIRM_PASSWORD_REQUIRED)
            : string(),
      });

      fieldSchema.validateSyncAt(name, { [name]: value });
      setErrors((errors) => errors.filter((error) => error.fieldName !== name));
    } catch (error: any) {
      setErrors((errors) => [
        ...errors.filter((err) => err.fieldName !== name),
        { fieldName: name as keyof AuthData, message: error.message },
      ]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const onSuccess = () => {
      resetFormData();
      navigate("/");
    };

    try {
      if (isSignIn) {
        await signIn(authData, onSuccess);
        navigate(ROUTES.HOME);
      } else {
        await signUp(authData, onSuccess);
        setIsSuccess(true);
        navigate(ROUTES.SIGN_IN);
      }
    } catch (error: any) {
      if (error.message === "auth/invalid-credential") {
        setErrorMessage(ERROR_MESSAGES.INVALID_EMAIL_OR_PASSWORD);
      } else if (error.message === "auth/too-many-requests") {
        setErrorMessage(ERROR_MESSAGES.TO_MANY_REQUESTS);
      } else if (error.message === "auth/email-already-in-use") {
        setErrorMessage(ERROR_MESSAGES.EMAIL_IN_USE);
      }
    }
  };

  const isFormValid = () => {
    if (isSignIn) {
      return authData.email && authData.password && errors.length === 0;
    } else {
      return (
        authData.email &&
        authData.password &&
        authData.username &&
        authData.confirmPassword &&
        errors.length === 0
      );
    }
  };

  const renderErrorMessage = (fieldName: string, message: string) => {
    return (
      <div key={fieldName} className={classes["form-input__error"]}>
        {message}
      </div>
    );
  };

  const renderFieldErrorMessage = (fieldName: string) => {
    const error = errors.find((error) => error.fieldName === fieldName);
    if (error) {
      return renderErrorMessage(fieldName, error.message);
    }
    return null;
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  useEffect(() => {
    resetFormData();
  }, [location.pathname]); 

  return (
    <form onSubmit={handleSubmit} className={classes.form}>
      {isSuccess && (
        <div className={classes["success-message"]}>Successful sign up!</div>
      )}
      {!isSignIn && (
        <div>
          <input
            type="text"
            id={FieldNames.Username}
            name={FieldNames.Username}
            placeholder="Username"
            value={authData.username || ""}
            onChange={handleInputChange}
            onBlur={handleBlur}
            className={classes["form-input"]}
          />
          {renderFieldErrorMessage("username")}
        </div>
      )}
      <div>
        <input
          type="email"
          id={FieldNames.Email}
          name={FieldNames.Email}
          placeholder="Email"
          value={authData.email}
          onChange={handleInputChange}
          onBlur={handleBlur}
          className={classes["form-input"]}
        />
        {renderFieldErrorMessage("email")}
      </div>
      <div className={classes["input-password"]}>
        <input
          type={showPassword ? "text" : "password"}
          id={FieldNames.Password}
          name={FieldNames.Password}
          placeholder="Password"
          value={authData.password}
          onChange={handleInputChange}
          onBlur={handleBlur}
          className={classes["form-input"]}
        />
        <div className={classes["toggle-password"]}>
          <FontAwesomeIcon
            icon={showPassword ? faEyeSlash : faEye}
            onClick={togglePasswordVisibility}
          />
        </div>
      </div>
      {renderFieldErrorMessage("password")}
      <div>
        {!isSignIn && (
          <>
            <div className={classes["input-password"]}>
              <input
                type={showConfirmPassword ? "text" : "password"}
                id={FieldNames.ConfirmPassword}
                name={FieldNames.ConfirmPassword}
                placeholder="Confirm Password"
                value={authData.confirmPassword || ""}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={classes["form-input"]}
              />
              <div className={classes["toggle-password"]}>
                <FontAwesomeIcon
                  icon={showConfirmPassword ? faEyeSlash : faEye}
                  onClick={toggleConfirmPasswordVisibility}
                />
              </div>
            </div>
            {renderFieldErrorMessage("confirmPassword")}
          </>
        )}
      </div>
      <div className={classes["btn-container"]}>
        <Button type="submit" variant="secondary" disabled={!isFormValid()}>
          {isSignIn ? UI_TEXT.SIGN_IN : UI_TEXT.SIGN_UP}
        </Button>
      </div>
      {errorMessage && (
        <div className={classes["form-input__error"]}>{errorMessage}</div>
      )}
    </form>
  );
};

export default AuthForm;
