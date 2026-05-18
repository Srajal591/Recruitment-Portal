import { useState, useEffect } from "react";
import { getStoredUser } from "../services/auth.service";
import { STORAGE_KEYS } from "../api/config";

/**
 * Helper functions to check user roles
 */
export const isAdminUser = (user) => {
  return user?.role === "employee" || user?.employeeId || user?.officialEmail;
};

export const isCandidateUser = (user) => {
  return user?.role === "candidate" && !user?.employeeId;
};

/**
 * Custom hook for authentication state management
 * Simple and fast - just reads from localStorage
 */
export const useAuth = () => {
  const [user, setUser] = useState(() => getStoredUser());
  const [token, setToken] = useState(() =>
    localStorage.getItem(STORAGE_KEYS.accessToken),
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const storedUser = getStoredUser();
    const storedToken = localStorage.getItem(STORAGE_KEYS.accessToken);
    return !!(storedUser && storedToken);
  });

  // Listen to storage changes (for multi-tab sync)
  useEffect(() => {
    const handleStorageChange = () => {
      const storedUser = getStoredUser();
      const storedToken = localStorage.getItem(STORAGE_KEYS.accessToken);
      setUser(storedUser);
      setToken(storedToken);
      setIsAuthenticated(!!(storedUser && storedToken));
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const updateAuth = () => {
    const storedUser = getStoredUser();
    const storedToken = localStorage.getItem(STORAGE_KEYS.accessToken);
    setUser(storedUser);
    setToken(storedToken);
    setIsAuthenticated(!!(storedUser && storedToken));
  };

  return {
    user,
    token,
    isLoading,
    isAuthenticated,
    updateAuth,
  };
};
