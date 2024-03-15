import React, { useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { app } from "../firebase";
import classes from "../styles/SignIn.module.scss";
import { object, string, ValidationError } from "yup";
import { useAuth } from "../contexts/AuthContext";

interface SignInData {
  email: string;
  password: string;
}

type FormError = {
  fieldName: keyof SignInData;
  message: string;
};

const SignIn: React.FC = () => {
  const [signInData, setSignInData] = useState<SignInData>({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<FormError[]>([]);

  const [error, setError] = useState<string>("");

  const { login } = useAuth();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSignInData({ ...signInData, [name]: value });
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    validateField(name, value);
  };

  const validateField = async (name: string, value: string) => {
    try {
      const fieldSchema = object().shape({
        email:
          name === "email" ? string().required("Email is required") : string(),
        password:
          name === "password"
            ? string().required("Password is required")
            : string(),
      });

      await fieldSchema.validateAt(name, { [name]: value });
      setErrors((errors) => errors.filter((error) => error.fieldName !== name));
    } catch (error: any) {
      setErrors((errors) => [
        ...errors.filter((err) => err.fieldName !== name),
        { fieldName: name as keyof SignInData, message: error.message },
      ]);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const schema = object().shape({
        email: string().required("Email is required"),
        password: string().required("Password is required"),
      });

      await schema.validate(signInData, { abortEarly: false });

      const auth = getAuth(app);

      await signInWithEmailAndPassword(
        auth,
        signInData.email,
        signInData.password
      );

      login();
    } catch (error: any) {
      if (error instanceof ValidationError) {
        const validationErrors: FormError[] = error.inner.map((err) => ({
          fieldName: err.path as keyof SignInData,
          message: err.message,
        }));
        setErrors(validationErrors);
      } else {
        console.log(error.code);
        if (error.code === "auth/invalid-credential") {
          setError("Invalid email address or password");
        } else {
          console.error("Error during signing:", error);
        }
      }
    }
  };

  return (
    <>
      <form onSubmit={handleSignIn} className={classes.form}>
        <div>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="email address"
            value={signInData.email}
            onChange={handleInputChange}
            onBlur={handleBlur}
            className={classes["form-input"]}
          />
          {errors.map(
            (error) =>
              error.fieldName === "email" && (
                <div
                  key={error.fieldName}
                  className={classes["form-input__error"]}
                >
                  {error.message}
                </div>
              )
          )}
        </div>
        <div>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="password"
            value={signInData.password}
            onChange={handleInputChange}
            onBlur={handleBlur}
            className={classes["form-input"]}
          />
          {errors.map(
            (error) =>
              error.fieldName === "password" && (
                <div
                  key={error.fieldName}
                  className={classes["form-input__error"]}
                >
                  {error.message}
                </div>
              )
          )}
        </div>
        <button type="submit" className={classes["form-btn__submit"]}>
          Login
        </button>
        {error && <div className={classes["form-input__error"]}>{error}</div>}
      </form>
    </>
  );
};

export default SignIn;
