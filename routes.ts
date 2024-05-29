/**
 * The default redirect path after logging in
 */
export const DEFAULT_LOGIN_REDIRECT = "/";
export const LOGIN_URL = "/auth/login";
export const REGISTER_URL = "/auth/register";
export const NEW_PASSWORD_URL = "/auth/new-password";
export const FORGOT_PASSWORD_URL = "/auth/forgot-password";

/**
 * An array of routes that are accessible to public.
 * These routes do not require authentication.
 * @type {string[]}
 */
export const publicRoutes = ["/", "/auth/new-verification", "/api/uploadthing"];

/**
 * An array of routes that are used for authentication.
 * These routes redirect logged in users to /settings.
 * @type {string[]}
 */
export const authRoutes = [
  LOGIN_URL,
  REGISTER_URL,
  FORGOT_PASSWORD_URL,
  NEW_PASSWORD_URL,
  "/auth/error",
];

/**
 * The prefix for API authentication routes.
 * Routes that start with this prefix are used for API authentication purpose.
 * @type {string}
 */
export const apiAuthPrefix = "/api/auth";
