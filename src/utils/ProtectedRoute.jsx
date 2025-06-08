import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ReactLoading from "react-loading";
import { useAxiosPrivate } from "./axios";
import useUserStore from "../store/user.store";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("access");
  const navigate = useNavigate();
  const [isValidating, setIsValidating] = useState(token ? true : false);
  const axiosPrivate = useAxiosPrivate();
  const setUser = useUserStore((state) => state.setUser);

  useEffect(() => {
    // If no token, redirect immediately
    if (!token) {
      navigate("/");
      return;
    }

    // Validate token by fetching user data
    const validateToken = async () => {
      try {
        const response = await axiosPrivate.get("/users/me");
        setUser(response.data);
        setIsValidating(false);
      } catch (error) {
        // If token is invalid, clear it and redirect
        localStorage.removeItem("access");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("userId");
        localStorage.removeItem("email");
        localStorage.removeItem("fullName");
        localStorage.removeItem("role");
        localStorage.removeItem("expiresAt");
        navigate("/");
      }
    };

    validateToken();
  }, [token, navigate, axiosPrivate, setUser]);

  if (isValidating) {
    return (
      <div className="h-screen w-full flex flex-col gap-5 justify-center items-center">
        <ReactLoading
          type="spinningBubbles"
          color="#7571F9"
          height={50}
          width={50}
        />
        <p className="text-gray-500">Validating your session...</p>
      </div>
    );
  }

  return token ? (
    children
  ) : (
    <div className="h-screen w-full flex flex-col gap-5 justify-center items-center">
      <p className="text-5xl font-bold">Please log in first</p>
      <div className="text-gray-500 flex flex-col items-center gap-5">
        You now are being redirected to the sign in page
        <ReactLoading
          type="spinningBubbles"
          color="#7571F9"
          height={25}
          width={25}
        />
      </div>
    </div>
  );
}
