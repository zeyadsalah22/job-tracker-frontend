import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useFormik } from "formik";
import FormInput from "../components/FormInput";
import { loginSchema } from "../schemas/Schemas";
import ReactLoading from "react-loading";
import { toast } from "react-toastify";
import useUserStore from "../store/user.store";
import { Link } from "react-router-dom";

export default function Login() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const setUser = useUserStore((state) => state.setUser);

  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
    toast.info("Session expired. Please log in again.");
  };

  const { values, errors, handleSubmit, handleChange, touched } = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: loginSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const response = await axios.post(
          "http://127.0.0.1:8000/api/token/login",
          values
        );
        const authToken = response.data.auth_token;
        localStorage.setItem("token", authToken);

        if (authToken) {
          const userResponse = await axios.get(
            "http://127.0.0.1:8000/api/users/me",
            {
              headers: {
                Authorization: `Token ${authToken}`,
              },
            }
          );
          setUser(userResponse.data);
        }

        navigate("/");
        toast.success("Login successful");
      } catch (error) {
        setLoading(false);
        toast.error(
          error.response?.data?.non_field_errors?.[0] ||
            "An error occurred. Please try again"
        );
      }
    },
  });

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token, navigate]);

  if (token) {
    return null;
  }

  return (
    <div className="h-screen flex flex-col justify-center items-center">
      <p className="text-xl font-semibold">LOGO</p>
      <form onSubmit={handleSubmit} className="flex flex-col w-[500px] gap-5">
        <FormInput
          name="username"
          type="text"
          placeHolder="Username"
          value={values.username}
          onChange={handleChange}
          error={errors.username}
          touched={touched.username}
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
