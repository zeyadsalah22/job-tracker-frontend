import axios from "axios";
import { useEffect } from "react";

const BASE_URL = "/api";

export default axios.create({
  baseURL: BASE_URL,
});

const axiosPrivate = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

const useRefreshToken = () => {
  const refresh = async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    const response = await axios.post(BASE_URL + "/auth/refresh", {
      refreshToken: refreshToken,
    });

    // Store the new tokens
    localStorage.setItem("access", response.data.token);
    localStorage.setItem("refreshToken", response.data.refreshToken);
    
    // Store additional user info if needed
    if (response.data.userId) localStorage.setItem("userId", response.data.userId);
    if (response.data.email) localStorage.setItem("email", response.data.email);
    if (response.data.fullName) localStorage.setItem("fullName", response.data.fullName);
    if (response.data.role !== undefined) localStorage.setItem("role", response.data.role);
    if (response.data.expiresAt) localStorage.setItem("expiresAt", response.data.expiresAt);

    return response.data.token;
  };
  return refresh;
};

const useAxiosPrivate = () => {
  const refresh = useRefreshToken();

  useEffect(() => {
    const requestIntercept = axiosPrivate.interceptors.request.use(
      (config) => {
        if (!config.headers["Authorization"]) {
          config.headers["Authorization"] = `Bearer ${localStorage.getItem(
            "access"
          )}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseIntercept = axiosPrivate.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequest = error?.config;
        
        // Handle 401 errors by trying to refresh the token
        if (error?.response?.status === 401 && !prevRequest?.sent) {
          prevRequest.sent = true;
          
          try {
            const newAccessToken = await refresh();
            prevRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
            return axiosPrivate(prevRequest);
          } catch (refreshError) {
            // If refresh fails, clear tokens and redirect to login
            localStorage.removeItem("access");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("userId");
            localStorage.removeItem("email");
            localStorage.removeItem("fullName");
            localStorage.removeItem("role");
            localStorage.removeItem("expiresAt");
            window.location.href = "/";
          }
        }
        
        return Promise.reject(error);
      }
    );

    return () => {
      axiosPrivate.interceptors.request.eject(requestIntercept);
      axiosPrivate.interceptors.response.eject(responseIntercept);
    };
  }, [refresh]);

  return axiosPrivate;
};

export { useAxiosPrivate, useRefreshToken };
