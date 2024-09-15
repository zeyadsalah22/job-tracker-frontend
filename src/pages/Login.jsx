import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useFormik } from "formik";
import FormInput from "../components/FormInput";

export default function Login() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const { values, errors, handleSubmit, handleChange, touched, setFieldValue } =
    useFormik({
      initialValues: {
        username: "",
        password: "",
      },
      onSubmit: async (values) => {
        setLoading(true);
        await axios
          .post("http://127.0.0.1:8000/token/login", values)
          .then((response) => {
            localStorage.setItem("token", response.data.auth_token);
            navigate("/dashboard");
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      },
    });

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, []);

  return (
    <div className="h-screen flex flex-col justify-center items-center">
      <p className="text-xl font-semibold">LOGO</p>
      <p className="text-4xl font-bold text-white">Welcome Back</p>
      <p className="text-sm text-white">
        Enter your credentials to access your account
      </p>
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
        <button
          type="submit"
          className="bg-primary text-white py-3 px-2 rounded-md hover:bg-primary/80 transition-all duration-300"
        >
          Login
        </button>
      </form>
    </div>
  );
}
