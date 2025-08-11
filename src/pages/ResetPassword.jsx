import { useMemo, useState } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import ReactLoading from "react-loading";
import { toast } from "react-toastify";
import axios from "../utils/axios";
import FormInput from "../components/FormInput";

const passwordSchema = Yup.string()
  .required("Password is required")
  .min(8, "Password must be at least 8 characters")
  .matches(/[A-Z]/, "Must include at least one uppercase letter")
  .matches(/[a-z]/, "Must include at least one lowercase letter")
  .matches(/[0-9]/, "Must include at least one number");

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = useMemo(() => searchParams.get("token") || "", [searchParams]);
  const [loading, setLoading] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [invalidToken, setInvalidToken] = useState(!token);

  const { values, errors, touched, handleChange, handleSubmit, isValid, dirty } =
    useFormik({
      enableReinitialize: true,
      initialValues: {
        newPassword: "",
        confirmPassword: "",
      },
      validationSchema: Yup.object({
        newPassword: passwordSchema,
        confirmPassword: Yup.string()
          .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
          .required("Confirm password is required"),
      }),
      onSubmit: async (vals) => {
        if (!token) {
          setInvalidToken(true);
          return;
        }
        setLoading(true);
        try {
          await axios.post("/auth/reset-password", {
            token,
            newPassword: vals.newPassword,
            confirmPassword: vals.confirmPassword,
          });
          toast.success("Password reset successful. You can now sign in.");
          navigate("/");
        } catch (err) {
          if (err?.response?.status === 400) {
            setInvalidToken(true);
          } else {
            toast.error("Something went wrong. Please try again.");
          }
        } finally {
          setLoading(false);
        }
      },
    });

  if (invalidToken) {
    return (
      <div className="h-screen flex flex-col justify-center items-center gap-6 p-4">
        <img src="/logo.png" alt="logo" className="w-32 h-24" />
        <div className="max-w-md w-full rounded-md border p-6 text-center">
          <h2 className="text-xl font-semibold mb-2">Invalid reset link</h2>
          <p className="text-gray-600">
            This reset link is invalid or expired. You can request a new one.
          </p>
          <div className="mt-6">
            <Link to="/forgot-password" className="text-primary underline">
              Request new link
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
        <div className="relative">
          <FormInput
            name="newPassword"
            type={showNew ? "text" : "password"}
            placeHolder="New password"
            value={values.newPassword}
            onChange={handleChange}
            error={errors.newPassword}
            touched={touched.newPassword}
          />
          <button
            type="button"
            onClick={() => setShowNew((v) => !v)}
            className="absolute right-3 top-[52px] text-sm text-gray-600"
          >
            {showNew ? "Hide" : "Show"}
          </button>
        </div>

        <div className="relative">
          <FormInput
            name="confirmPassword"
            type={showConfirm ? "text" : "password"}
            placeHolder="Confirm new password"
            value={values.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            touched={touched.confirmPassword}
          />
          <button
            type="button"
            onClick={() => setShowConfirm((v) => !v)}
            className="absolute right-3 top-[52px] text-sm text-gray-600"
          >
            {showConfirm ? "Hide" : "Show"}
          </button>
        </div>

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
            Reset password
          </button>
        )}

        <div className="flex gap-1 text-sm">
          <span>Back to</span>
          <Link to="/" className="underline text-primary">
            sign in
          </Link>
        </div>
      </form>
    </div>
  );
}


