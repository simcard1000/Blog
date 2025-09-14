/**
 * Route definitions for the application
 */

export const DEFAULT_LOGIN_REDIRECT = "/";
export const DEFAULT_LOGOUT_REDIRECT = "/";
export const AUTH_ROUTES = {
  LOGIN: "/login",
  REGISTER: "/register",
  ERROR: "/error",
  RESET_PASSWORD: "/reset-password",
  NEW_PASSWORD: "/new-password",
  NEW_VERIFICATION: "/new-verification",
} as const;

export const PROTECTED_ROUTES = {
  DASHBOARD: "/dashboard",
  PROFILE: "/profile",
  SETTINGS: "/settings",
} as const;

export const PUBLIC_ROUTES = {
  HOME: "/",
  BLOG: "/blog",
  ABOUT: "/about",
  CONTACT: "/contact",
} as const;
