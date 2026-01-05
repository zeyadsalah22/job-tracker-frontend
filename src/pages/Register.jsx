import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import FormField from "../components/ui/FormField";
import { useFormik } from "formik";
import ReactLoading from "react-loading";
import { registerSchema } from "../schemas/Schemas";
import { Link } from "react-router-dom";
import axios from "../utils/axios";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/Card";
import { CheckboxWithLabel } from "../components/ui/Checkbox";
import Button from "../components/ui/Button";
import { Briefcase, Loader2 } from "lucide-react";

export default function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [acceptTerms, setAcceptTerms] = useState(false);
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4">
      <Card className="w-full max-w-md shadow-xl border-0 glass">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold gradient-text">Job Lander</span>
          </div>
          <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
          <CardDescription>
            Join thousands of job seekers finding their dream jobs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                type="text"
                name="Fname"
                placeHolder="First Name"
                label="First Name"
                value={values.Fname}
                onChange={handleChange}
                //onBlur={handleBlur}
                error={errors.Fname || error?.response?.data?.Fname}
                touched={touched.Fname}
              />
              <FormField
                type="text"
                name="Lname"
                placeHolder="Last Name"
                label="Last Name"
                value={values.Lname}
                onChange={handleChange}
                //onBlur={handleBlur}
                error={errors.Lname || error?.response?.data?.Lname}
                touched={touched.Lname}
              />
            </div>
            <FormField
              type="email"
              name="Email"
              placeHolder="Enter your email"
              label="Email"
              value={values.Email}
              onChange={handleChange}
              //onBlur={handleBlur}
              error={errors.Email || error?.response?.data?.Email}
              touched={touched.Email}
            />
            <FormField
              type="password"
              name="Password"
              placeHolder="Create a password"
              label="Password"
              value={values.Password}
              onChange={handleChange}
              //onBlur={handleBlur}
              error={errors.Password || error?.response?.data?.Password}
              touched={touched.Password}
            />
            <FormField
              type="password"
              name="ConfirmPassword"
              placeHolder="Confirm your password"
              label="Confirm Password"
              value={values.ConfirmPassword}
              onChange={handleChange}
              //onBlur={handleBlur}
              error={errors.ConfirmPassword || error?.response?.data?.ConfirmPassword}
              touched={touched.ConfirmPassword}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                type="text"
                name="Address"
                placeHolder="Address (Optional)"
                label="Address"
                value={values.Address}
                onChange={handleChange}
                //onBlur={handleBlur}
                error={errors.Address || error?.response?.data?.Address}
                touched={touched.Address}
              />
              <div className="flex flex-col gap-2">
                <label htmlFor="BirthDate" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Birth Date (Optional)
                </label>
                <input
                  type="date"
                  id="BirthDate"
                  name="BirthDate"
                  value={values.BirthDate || ""}
                  onChange={handleChange}
                  className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 focus:scale-[1.02] focus:border-primary"
                />
                {(errors.BirthDate || error?.response?.data?.BirthDate) && touched.BirthDate && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.BirthDate || error?.response?.data?.BirthDate}
                  </p>
                )}
              </div>
            </div>
            <CheckboxWithLabel
              id="terms"
              checked={acceptTerms}
              onCheckedChange={setAcceptTerms}
            >
              I agree to the{" "}
              <Link to="/terms-of-service" className="text-primary hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link to="/privacy-policy" className="text-primary hover:underline">
                Privacy Policy
              </Link>
            </CheckboxWithLabel>
            <Button
              type="submit"
              className="w-full"
              disabled={loading}
              variant="hero"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/" className="text-primary hover:underline font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
