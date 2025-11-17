import { useEffect, useRef, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import ReactLoading from "react-loading";
import { toast } from "react-toastify";
import axios from "../utils/axios";
import Input from "../components/ui/Input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/Card";
import Button from "../components/ui/Button";
import { Briefcase, Loader2 } from "lucide-react";

export default function ForgotPassword() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const successRef = useRef(null);
  const navigate = useNavigate();

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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4">
        <Card className="w-full max-w-md shadow-xl border-0 glass">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold gradient-text">Job Lander</span>
            </div>
            <CardTitle className="text-2xl font-bold">Check your inbox</CardTitle>
            <CardDescription>
              If the email exists, a reset link has been sent
            </CardDescription>
          </CardHeader>
          <CardContent
            ref={successRef}
            tabIndex={-1}
            className="text-center focus:outline-none"
            aria-live="polite"
          >
            <p className="text-muted-foreground mb-6">
              Please check your inbox and follow the instructions in the email to reset your password.
            </p>
            <Button 
              variant="hero"
              onClick={() => navigate('/')}
            >
              Back to sign in
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4">
      <Card className="w-full max-w-md shadow-xl border-0 glass">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold gradient-text">Job Lander</span>
          </div>
          <CardTitle className="text-2xl font-bold">Forgot Password</CardTitle>
          <CardDescription>
            Enter your email address and we'll send you a reset link
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={values.email}
                onChange={handleChange}
                // onBlur={handleBlur}
                className={touched.email && errors.email ? "border-red-500" : ""}
              />
              {touched.email && errors.email && (
                <div className="text-red-500 text-sm">{errors.email}</div>
              )}
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={!isValid || !dirty || loading}
              variant="hero"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending reset link...
                </>
              ) : (
                "Send reset link"
              )}
            </Button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Remembered your password?{" "}
              <Link to="/" className="text-primary hover:underline font-medium">
                Back to sign in
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


