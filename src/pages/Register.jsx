import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import FormInput from "../components/FormInput";
import { useFormik } from "formik";
import ReactLoading from "react-loading";
import { registerSchema } from "../schemas/Schemas";
import { Link } from "react-router-dom";
import axios from "../utils/axios";

export default function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("access");

  const { values, errors, handleSubmit, handleChange, touched, setFieldValue } = useFormik({
    initialValues: {
      Fname: "",
      Lname: "",
      Email: "",
      Password: "",
      ConfirmPassword: "",
      Address: "",
      BirthDate: null
    },
    validationSchema: registerSchema,
    onSubmit: async (values) => {
      setLoading(true);
      
      // Format the date properly if it exists
      const formattedData = {
        ...values,
        BirthDate: values.BirthDate ? new Date(values.BirthDate).toISOString().split('T')[0] : null
      };
      
      try {
        await axios.post("/auth/register", formattedData);
        navigate("/");
        toast.success("Registration successful. Please login to continue.");
      } catch (error) {
        console.log(error);
        setLoading(false);
        setError(error);
        
        // Handle different types of error responses
        if (error.response?.data) {
          // If there's a specific error message
          const errorMessage = 
            error.response.data.message || 
            Object.values(error.response.data).flat().join(', ');
          toast.error(errorMessage || "Registration failed. Please try again.");
        } else {
          toast.error("An error occurred. Please try again.");
        }
      }
    },
  });

  useEffect(() => {
    if (token) {
      navigate("/dashboard");
    }
  }, [token, navigate]);

  if (token) {
    return null;
  }

  return (
    <div className="h-screen flex flex-col justify-center items-center gap-4 overflow-y-auto py-8">
      <img src="/logo.png" alt="logo" className="w-32 h-24" />
      <form onSubmit={handleSubmit} className="flex flex-col w-[500px] gap-5">
        <FormInput
          type="text"
          name="Fname"
          placeHolder="First Name"
          label="First Name"
          value={values.Fname}
          onChange={handleChange}
          error={errors.Fname || error?.response?.data?.Fname}
          touched={touched.Fname}
        />
        <FormInput
          type="text"
          name="Lname"
          placeHolder="Last Name"
          label="Last Name"
          value={values.Lname}
          onChange={handleChange}
          error={errors.Lname || error?.response?.data?.Lname}
          touched={touched.Lname}
        />
        <FormInput
          type="email"
          name="Email"
          placeHolder="Email"
          label="Email"
          value={values.Email}
          onChange={handleChange}
          error={errors.Email || error?.response?.data?.Email}
          touched={touched.Email}
        />
        <FormInput
          type="password"
          name="Password"
          placeHolder="Password"
          label="Password"
          value={values.Password}
          onChange={handleChange}
          error={errors.Password || error?.response?.data?.Password}
          touched={touched.Password}
        />
        <FormInput
          type="password"
          name="ConfirmPassword"
          placeHolder="Confirm Password"
          label="Confirm Password"
          value={values.ConfirmPassword}
          onChange={handleChange}
          error={errors.ConfirmPassword || error?.response?.data?.ConfirmPassword}
          touched={touched.ConfirmPassword}
        />
        <FormInput
          type="text"
          name="Address"
          placeHolder="Address (Optional)"
          label="Address"
          value={values.Address}
          onChange={handleChange}
          error={errors.Address || error?.response?.data?.Address}
          touched={touched.Address}
        />
        <div className="flex flex-col gap-1">
          <label htmlFor="BirthDate" className="text-sm font-medium">
            Birth Date (Optional)
          </label>
          <input
            type="date"
            id="BirthDate"
            name="BirthDate"
            value={values.BirthDate || ""}
            onChange={handleChange}
            className="border rounded-md p-2 outline-none focus:border-primary"
          />
          {(errors.BirthDate || error?.response?.data?.BirthDate) && touched.BirthDate && (
            <p className="text-red-500 text-xs mt-1">
              {errors.BirthDate || error?.response?.data?.BirthDate}
            </p>
          )}
        </div>

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
