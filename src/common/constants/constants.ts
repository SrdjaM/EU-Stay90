export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 6,
};

export const ERROR_MESSAGES = {
  USERNAME_REQUIRED: "Username is required",
  EMAIL_REQUIRED: "Email is required",
  INVALID_EMAIL: "Invalid email",
  PASSWORD_REQUIRED: "Password is required",
  PASSWORD_MIN_LENGTH: `Password must be at least ${VALIDATION.PASSWORD_MIN_LENGTH} characters`,
  PASSWORDS_MUST_MATCH: "Passwords must match",
  CONFIRM_PASSWORD_REQUIRED: "Confirm password is required",
  INVALID_EMAIL_OR_PASSWORD: "Invalid email or password!",
  TO_MANY_REQUESTS: "Too many requests, try again later!",
  EMAIL_IN_USE: "Email already  in use!",
};

export const ROUTES = {
  HOME: "/",
  SIGN_IN: "/signin",
  SIGN_UP: "/signup",
};

export const UI_TEXT = {
  SIGN_IN: "Sign In",
  SIGN_UP: "Sign Up",
  CONFIRM: "Confirm",
  CANCEL: "Cancel",
};

export const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export const schengenCountries = [
  { code: "AT", name: "Austria" },
  { code: "BE", name: "Belgium" },
  { code: "CZ", name: "Czech Republic" },
  { code: "DK", name: "Denmark" },
  { code: "EE", name: "Estonia" },
  { code: "FI", name: "Finland" },
  { code: "FR", name: "France" },
  { code: "DE", name: "Germany" },
  { code: "GR", name: "Greece" },
  { code: "HU", name: "Hungary" },
  { code: "IS", name: "Iceland" },
  { code: "IT", name: "Italy" },
  { code: "LV", name: "Latvia" },
  { code: "LI", name: "Liechtenstein" },
  { code: "LT", name: "Lithuania" },
  { code: "LU", name: "Luxembourg" },
  { code: "MT", name: "Malta" },
  { code: "NL", name: "Netherlands" },
  { code: "NO", name: "Norway" },
  { code: "PL", name: "Poland" },
  { code: "PT", name: "Portugal" },
  { code: "SK", name: "Slovakia" },
  { code: "SI", name: "Slovenia" },
  { code: "ES", name: "Spain" },
  { code: "SE", name: "Sweden" },
  { code: "CH", name: "Switzerland" },
];
