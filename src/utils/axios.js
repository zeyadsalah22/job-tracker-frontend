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

// NOTE: Refresh token functionality is disabled as the backend only supports access tokens
// const useRefreshToken = () => {
//   const refresh = async () => {
//     const response = await axios.post(BASE_URL + "/token/refresh/", {
//       refresh: localStorage.getItem("refresh"),
//     });
//
//     localStorage.setItem("access", response.data.access);
//     localStorage.setItem("refresh", response.data.refresh);
//     return response.data.access;
//   };
//   return refresh;
// };

const useAxiosPrivate = () => {
  // const refresh = useRefreshToken();

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
        // Handle 401 errors by redirecting to login instead of trying to refresh
        if (error?.response?.status === 401) {
          localStorage.removeItem("access");
          window.location.href = "/";
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axiosPrivate.interceptors.request.eject(requestIntercept);
      axiosPrivate.interceptors.response.eject(responseIntercept);
    };
  }, []);

  return axiosPrivate;
};

export { useAxiosPrivate };
