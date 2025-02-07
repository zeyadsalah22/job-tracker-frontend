import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Table from "./components/Table";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Apllication from "./components/applications/ViewModal";
import Company from "./components/companies/ViewModal";
import Employee from "./components/employees/ViewModal";
import Applications from "./pages/Applications";
import Companies from "./pages/Companies";
import Employees from "./pages/Employees";
import Questions from "./pages/Questions";
import Question from "./components/questions/ViewModal";
import ProtectedRoute from "./utils/ProtectedRoute";
import axios from "axios";

export default function App() {
  useEffect(() => {
    // Skip if no access token exists
    if (!localStorage.getItem("access")) return;

    const refreshToken = async () => {
      try {
        const refresh = localStorage.getItem("refresh");
        if (!refresh) {
          console.error("No refresh token found");
          return;
        }

        const response = await axios.post(
          "http://127.0.0.1:8000/api/token/refresh",
          {
            refresh: refresh,
          }
        );

        if (!response.ok) {
          throw new Error("Refresh failed");
        }

        const data = await response.json();
        localStorage.setItem("access", data.access);
      } catch (error) {
        console.error("Token refresh failed:", error);
        // Clear tokens on refresh failure
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        // Optionally redirect to login page
        window.location.href = "/";
      }
    };
    
    // Initial token refresh
    refreshToken();

    // Set interval for 13 minutes (13 * 60 * 1000 milliseconds)
    const intervalId = setInterval(refreshToken, 1 * 60 * 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
      <Routes>
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/applications"
          element={
            <ProtectedRoute>
              <Applications />
            </ProtectedRoute>
          }
        />
        <Route
          path="/applications/:id"
          element={
            <ProtectedRoute>
              <Apllication />
            </ProtectedRoute>
          }
        />
        <Route
          path="/companies"
          element={
            <ProtectedRoute>
              <Companies />
            </ProtectedRoute>
          }
        />
        <Route
          path="/companies/:id"
          element={
            <ProtectedRoute>
              <Company />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employees"
          element={
            <ProtectedRoute>
              <Employees />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employees/:id"
          element={
            <ProtectedRoute>
              <Employee />
            </ProtectedRoute>
          }
        />
        <Route
          path="/questions"
          element={
            <ProtectedRoute>
              <Questions />
            </ProtectedRoute>
          }
        />
        <Route
          path="/questions/:id"
          element={
            <ProtectedRoute>
              <Question />
            </ProtectedRoute>
          }
        />
        <Route
          path="/table"
          element={
            <ProtectedRoute>
              <Table />
            </ProtectedRoute>
          }
        />
        <Route
          path="*"
          element={
            <div className="h-screen w-full flex flex-col justify-center items-center ">
              <p className="text-7xl font-bold"> 404</p>
              <div className="text-gray-500 flex items-center gap-5">
                Sorry, the page was not found! redirecting to home page...
              </div>
            </div>
          }
        />
      </Routes>
      <ToastContainer position="bottom-center" limit={1} autoClose={2000} />
    </>
  );
}
