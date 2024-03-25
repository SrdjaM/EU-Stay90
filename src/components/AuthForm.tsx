import React, { useEffect, useState } from "react";
import { object, string } from "yup";
import classes from "../styles/AuthForm.module.scss";
import { FieldNames } from "../common/enums/FieldNames";
import { ERROR_MESSAGES } from "../common/constants/constants";
import { useAuthentication } from "../common/hooks/AuthHooks";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "./Button";

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

  const { signIn, signUp } = useAuthentication();

  const location = useLocation();

  let navigate = useNavigate();

  const isSignIn = location.pathname === "/signin";

  useEffect(() => {
    setAuthData({
      email: "",
      password: "",
      username: "",
      confirmPassword: "",
    });
    setErrors([]);
    setErrorMessage(null);
  }, [isSignIn]);

  useEffect(() => {
    if (isSuccess) {
      setTimeout(() => {
        setIsSuccess(false);
      }, 5000);
    }
  }, [isSuccess]);

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

    try {
      if (isSignIn) {
        await signIn(authData);
        navigate("/");
      } else {
        await signUp(authData);
        setIsSuccess(true);
        navigate("/signin");
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

  return (
    <form onSubmit={handleSubmit} className={classes.form}>
      {isSuccess && (
        <div className={classes["success-message"]}>Successful sign up!</div>
      )}
      {!isSignIn && (
        <div>
          <input
            type="text"
            id="username"
            name="username"
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
          id="email"
          name="email"
          placeholder="Email"
          value={authData.email}
          onChange={handleInputChange}
          onBlur={handleBlur}
          className={classes["form-input"]}
        />
        {renderFieldErrorMessage("email")}
      </div>
      <div>
        <input
          type="password"
          id="password"
          name="password"
          placeholder="Password"
          value={authData.password}
          onChange={handleInputChange}
          onBlur={handleBlur}
          className={classes["form-input"]}
        />
        {renderFieldErrorMessage("password")}
      </div>
      <div>
        {!isSignIn && (
          <div>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={authData.confirmPassword || ""}
              onChange={handleInputChange}
              onBlur={handleBlur}
              className={classes["form-input"]}
            />
            {renderFieldErrorMessage("confirmPassword")}
          </div>
        )}
      </div>
      <div className={classes["btn-container"]}>
        <Button type="submit" variant="secondary" disabled={!isFormValid()}>
          {isSignIn ? "Sign In" : "Sign Up"}
        </Button>
      </div>
      {errorMessage && (
        <div className={classes["form-input__error"]}>{errorMessage}</div>
      )}
    </form>
  );
};

export default AuthForm;
