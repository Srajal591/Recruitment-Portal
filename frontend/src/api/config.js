// All API calls go to /api/... — Vite's dev proxy (vite.config.js) routes each
// prefix to the correct microservice, so no CORS issues and no gateway path-stripping.
export const API_BASE_URL = "/api";

export const STORAGE_KEYS = {
  accessToken: "rp_access_token",
  refreshToken: "rp_refresh_token",
  user: "rp_user",
};
