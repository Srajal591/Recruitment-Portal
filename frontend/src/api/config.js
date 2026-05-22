// All API calls go to /api/... — Vite's dev proxy (vite.config.js) routes each
// prefix to the correct microservice, so no CORS issues and no gateway path-stripping.
export const API_BASE_URL = "/api";

// Webhook base URL — used for displaying webhook URLs in admin panel
// Defaults to current origin if not specified in environment
export const WEBHOOK_BASE_URL =
  import.meta.env.VITE_WEBHOOK_BASE_URL || `${window.location.origin}`;

const splitUrls = (value) =>
  value
    ?.split(",")
    .map((url) => url.trim())
    .filter(Boolean) || [];

export const REALTIME_SOCKET_URLS = splitUrls(
  import.meta.env.VITE_REALTIME_SOCKET_URLS,
);

export const SERVICE_SOCKET_URLS = {
  identity:
    import.meta.env.VITE_IDENTITY_SOCKET_URL ||
    import.meta.env.VITE_IDENTITY_URL ||
    "http://localhost:5001",
  recruitment:
    import.meta.env.VITE_RECRUITMENT_SOCKET_URL ||
    import.meta.env.VITE_RECRUITMENT_URL ||
    "http://localhost:5002",
  communication:
    import.meta.env.VITE_COMMUNICATION_SOCKET_URL ||
    import.meta.env.VITE_COMMUNICATION_URL ||
    "http://localhost:5003",
};

export const STORAGE_KEYS = {
  accessToken: "rp_access_token",
  refreshToken: "rp_refresh_token",
  user: "rp_user",
};
