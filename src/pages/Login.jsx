import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import FormInput from "../components/FormInput";
import { loginSchema } from "../schemas/Schemas";
import ReactLoading from "react-loading";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import useUserStore from "../store/user.store";
import axios, { useAxiosPrivate } from "../utils/axios";

export default function Login() {
  const token = localStorage.getItem("access");
  const navigate = useNavigate();
  const setUser = useUserStore((state) => state.setUser);
  const [loading, setLoading] = useState(false);
  const axiosPrivate = useAxiosPrivate();

  const { values, errors, handleSubmit, handleChange, touched } = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: loginSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        // The format expected by the backend
        const loginData = {
          Email: values.email,
          Password: values.password
        };
        
        console.log("Sending login data:", loginData);
        const response = await axios.post("/auth/login", loginData);
        console.log("Login response:", response.data);
        
        const token = response.data.token;
        localStorage.setItem("access", token);
        
        // Get user info
        try {
          const userResponse = await axiosPrivate.get("/users/me");
          setUser(userResponse.data);
        } catch (error) {
          console.error("Failed to fetch user data:", error);
        }
        
        navigate("/dashboard");
        toast.success("Login successful");
        
        // Set start date if not already set
        localStorage.setItem(
          "start_date",
          localStorage.getItem("start_date")
            ? localStorage.getItem("start_date")
            : new Date().toISOString().split("T")[0]
        );
      } catch (error) {
        console.error("Login error:", error.response?.data);
        setLoading(false);
        toast.error(error.response?.data?.message || "Login failed. Please check your credentials.");
      }
    },
  });

  // Don't automatically redirect to dashboard if on the login page
  useEffect(() => {
    if (token && window.location.pathname !== "/") {
      navigate("/dashboard");
    }
  }, [token, navigate]);

  return (
    <div className="h-screen flex flex-col justify-center items-center gap-4">
      <img src="/logo.png" alt="logo" className="w-32 h-24" />
      <form onSubmit={handleSubmit} className="flex flex-col w-[500px] gap-5">
        <FormInput
          name="email"
          type="text"
          placeHolder="Email"
          value={values.email}
          onChange={handleChange}
          error={errors.email}
          touched={touched.email}
        />
        <FormInput
          name="password"
          type="password"
          placeHolder="Password"
          value={values.password}
          onChange={handleChange}
          error={errors.password}
          touched={touched.password}
        />
        {loading ? (
          <button
            disabled
            className="rounded cursor-not-allowed flex items-center justify-center bg-primary px-8 py-2 text-white transition h-12"
          >
            <ReactLoading
              type="bubbles"
              color="#ffffff"
              height={25}
              width={25}
            />
          </button>
        ) : (
          <button
            type="submit"
            className="rounded bg-primary px-8 py-2 text-white transition hover:bg-primary/80 h-12"
          >
            Login
          </button>
        )}
        <div className="flex gap-1">
          <p className="text-sm">{"Don't have an account?"}</p>
          <Link to="/register" className="text-sm underline text-primary">
            Register here
          </Link>
        </div>
      </form>
    </div>
  );
}