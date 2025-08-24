import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import FormField from "../components/ui/FormField";
import { loginSchema } from "../schemas/Schemas";
import ReactLoading from "react-loading";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import useUserStore from "../store/user.store";
import axios, { useAxiosPrivate } from "../utils/axios";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/Card";
import { CheckboxWithLabel } from "../components/ui/Checkbox";
import Button from "../components/ui/Button";
import { Briefcase, Loader2 } from "lucide-react";

export default function Login() {
  const token = localStorage.getItem("access");
  const navigate = useNavigate();
  const setUser = useUserStore((state) => state.setUser);
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
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
        
        // Store all tokens and user data from login response
        localStorage.setItem("access", response.data.token);
        localStorage.setItem("refreshToken", response.data.refreshToken);
        
        // Store additional user info from login response
        if (response.data.userId) localStorage.setItem("userId", response.data.userId);
        if (response.data.email) localStorage.setItem("email", response.data.email);
        if (response.data.fullName) localStorage.setItem("fullName", response.data.fullName);
        if (response.data.role !== undefined) localStorage.setItem("role", response.data.role);
        if (response.data.expiresAt) localStorage.setItem("expiresAt", response.data.expiresAt);
        
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4">
      <Card className="w-full max-w-md shadow-xl border-0 glass">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold gradient-text">Job Lander</span>
          </div>
          <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
          <CardDescription>
            Sign in to your account to continue your job search journey
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField
              name="email"
              type="text"
              placeHolder="Enter your email"
              label="Email"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.email}
              touched={touched.email}
            />
            <FormField
              name="password"
              type="password"
              placeHolder="Enter your password"
              label="Password"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.password}
              touched={touched.password}
            />
            <div className="flex items-center justify-between">
              <CheckboxWithLabel
                id="remember"
                checked={rememberMe}
                onCheckedChange={setRememberMe}
              >
                Remember me
              </CheckboxWithLabel>
              <Link
                to="/forgot-password"
                className="text-sm text-primary hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={loading}
              variant="hero"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link to="/register" className="text-primary hover:underline font-medium">
                Sign up
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}