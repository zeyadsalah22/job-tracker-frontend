import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import FormInput from "../components/FormInput";
import { useFormik } from "formik";
import ReactLoading from "react-loading";
import { registerSchema } from "../schemas/Schemas";
import { Link } from "react-router-dom";

export default function Register() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { values, errors, handleSubmit, handleChange, touched } = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
      re_password: "",
    },
    validationSchema: registerSchema,
    onSubmit: async (values) => {
      setLoading(true);
      await axios
        .post("http://127.0.0.1:8000/api/users/", values)
        .then(() => {
          navigate("/");
          toast.success("Registration successful. Please login to continue.");
        })
        .catch((error) => {
          setLoading(false);
          setError(error);
          toast.error(
            error.response.data.non_field_errors.map((error) => error) ||
              "An error occurred. Please try again"
          );
        });
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
    <div className="h-screen flex flex-col justify-center items-center gap-4">
      <img src="/logo.png" alt="logo" className="w-32 h-24" />
      <form onSubmit={handleSubmit} className="flex flex-col w-[500px] gap-5">
        <FormInput
          type="text"
          name="username"
          placeHolder="Username"
          label="Username"
          value={values?.username}
          onChange={handleChange}
          error={errors?.username || error?.response?.data?.username}
          touched={touched.username}
        />
        <FormInput
          type="email"
          name="email"
          placeHolder="Email"
          label="Email"
          value={values?.email}
          onChange={handleChange}
          error={errors?.email || error?.response?.data?.email}
          touched={touched.email}
        />
        <FormInput
          type="password"
          name="password"
          placeHolder="Password"
          label="Password"
          value={values?.password}
          onChange={handleChange}
          error={errors?.password || error?.response?.data?.password}
          touched={touched.password}
        />
        <FormInput
          type="password"
          name="re_password"
          placeHolder="Confirm password"
          label="Confirm Password"
          value={values?.re_password}
          onChange={handleChange}
          error={errors.re_password}
          touched={touched.re_password}
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
            Register
          </button>
        )}
        <div className="flex gap-1">
          <p className="text-sm">Already a member?</p>
          <Link className="text-sm underline text-primary" to={"/"}>
            Login
          </Link>
        </div>
      </form>
    </div>
  );
}
