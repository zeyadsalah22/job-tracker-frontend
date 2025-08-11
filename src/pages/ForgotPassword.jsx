import { useEffect, useRef, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link } from "react-router-dom";
import ReactLoading from "react-loading";
import { toast } from "react-toastify";
import axios from "../utils/axios";
import FormInput from "../components/FormInput";

export default function ForgotPassword() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const successRef = useRef(null);

  const { values, errors, touched, handleChange, handleSubmit, isValid, dirty } =
    useFormik({
      initialValues: {
        email: "",
      },
      validationSchema: Yup.object({
        email: Yup.string().email("Invalid email").required("Email is required"),
      }),
      onSubmit: async (vals) => {
        setLoading(true);
        try {
          await axios.post("/auth/forgot-password", { email: vals.email });
        } catch (err) {
          // Keep messaging generic per security requirements
          toast.error("Something went wrong. If the email exists, a reset link has been sent.");
        } finally {
          setSubmitted(true);
          setLoading(false);
        }
      },
    });

  useEffect(() => {
    if (submitted && successRef.current) {
      successRef.current.focus();
    }
  }, [submitted]);

  if (submitted) {
    return (
      <div className="h-screen flex flex-col justify-center items-center gap-6 p-4">
        <img src="/logo.png" alt="logo" className="w-32 h-24" />
        <div
          ref={successRef}
          tabIndex={-1}
          className="max-w-md w-full rounded-md border p-6 text-center focus:outline-none"
          aria-live="polite"
        >
          <h2 className="text-xl font-semibold mb-2">Check your inbox</h2>
          <p className="text-gray-600">
            If the email exists, a reset link has been sent. Please check your inbox.
          </p>
          <div className="mt-6">
            <Link to="/" className="text-primary underline">
              Back to sign in
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col justify-center items-center gap-4 p-4">
      <img src="/logo.png" alt="logo" className="w-32 h-24" />
      <form onSubmit={handleSubmit} className="flex flex-col w-full max-w-md gap-5">
        <FormInput
          name="email"
          type="email"
          placeHolder="Email"
          value={values.email}
          onChange={handleChange}
          error={errors.email}
          touched={touched.email}
        />

        {loading ? (
          <button
            disabled
            className="rounded cursor-not-allowed flex items-center justify-center bg-primary px-8 py-2 text-white transition h-12"
          >
            <ReactLoading type="bubbles" color="#ffffff" height={25} width={25} />
          </button>
        ) : (
          <button
            type="submit"
            disabled={!isValid || !dirty}
            className="rounded bg-primary px-8 py-2 text-white transition hover:bg-primary/80 h-12 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send reset link
          </button>
        )}

        <div className="flex gap-1 text-sm">
          <span>Remembered your password?</span>
          <Link to="/" className="underline text-primary">
            Back to sign in
          </Link>
        </div>
      </form>
    </div>
  );
}


