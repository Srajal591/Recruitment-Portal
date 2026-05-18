import axios from "axios";
import toast from "react-hot-toast";
import { API_BASE_URL, STORAGE_KEYS } from "./config";

const getStoredToken = () => localStorage.getItem(STORAGE_KEYS.accessToken);
const getStoredRefreshToken = () =>
  localStorage.getItem(STORAGE_KEYS.refreshToken);

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Send cookies with requests
});

// Attach Bearer token to every request
apiClient.interceptors.request.use((config) => {
  const token = getStoredToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;
    const isAuthEndpoint = originalRequest?.url?.startsWith("/auth/");
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      (error.code === "ECONNABORTED"
        ? "Request timed out. Please confirm backend services are running."
        : null) ||
      "Something went wrong. Please try again.";

    if (status === 401 && !originalRequest?._retry && !isAuthEndpoint) {
      originalRequest._retry = true;
      try {
        const refreshToken = getStoredRefreshToken();
        const refreshResponse = await axios.post(
          `${API_BASE_URL}/auth/refresh-token`,
          { refreshToken },
          { withCredentials: true },
        );
        const newAccessToken = refreshResponse.data?.data?.accessToken;
        const newRefreshToken = refreshResponse.data?.data?.refreshToken;

        if (newAccessToken) {
          localStorage.setItem(STORAGE_KEYS.accessToken, newAccessToken);
          if (newRefreshToken) {
            localStorage.setItem(STORAGE_KEYS.refreshToken, newRefreshToken);
          }
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return apiClient(originalRequest);
        }
      } catch {
        // Refresh failed - clear session and redirect to login
        localStorage.removeItem(STORAGE_KEYS.accessToken);
        localStorage.removeItem(STORAGE_KEYS.refreshToken);
        localStorage.removeItem(STORAGE_KEYS.user);
        if (!window.location.pathname.startsWith("/auth")) {
          window.location.href = "/auth/candidate-login";
        }
      }
    }

    if (status !== 401 && status !== 404 && status !== 409) {
      toast.error(message);
    }

    return Promise.reject({
      status,
      message,
      errors: error.response?.data?.errors || [],
      raw: error,
    });
  },
);

export const unwrapData = (response) => response?.data ?? response;
