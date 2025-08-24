import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/Dialog";
import { toast } from "react-toastify";
import { useState } from "react";
import ReactLoading from "react-loading";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import FormField from "../ui/FormField";
import * as Yup from "yup";
import { useAxiosPrivate } from "../../utils/axios";
import useUserStore from "../../store/user.store";

export default function DeleteModal({ openDelete, setOpenDelete }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();
  const user = useUserStore((state) => state.user);
  const userLogout = useUserStore((state) => state.logout);

  const { values, errors, handleSubmit, handleChange, touched } = useFormik({
    initialValues: {
      password: "",
    },
    validationSchema: Yup.object({
      password: Yup.string().required("Password is required"),
    }),
    onSubmit: async (values) => {
      setLoading(true);

      if (!user?.userId) {
        setLoading(false);
        toast.error("User information not available");
        return;
      }

      try {
        console.log("Attempting to delete user with ID:", user.userId);
        
        // Send the password in the request body for verification
        await axiosPrivate.delete(`/users/${user.userId}`, {
          data: { password: values.password }
        });
        
        setOpenDelete(false);
        setLoading(false);
        toast.success("User deleted successfully");
        
        // Clear user data and redirect to login
        localStorage.removeItem("access");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("userId");
        localStorage.removeItem("email");
        localStorage.removeItem("fullName");
        localStorage.removeItem("role");
        localStorage.removeItem("expiresAt");
        userLogout();
        navigate("/");
      } catch (error) {
        console.error("Error deleting user:", error);
        setLoading(false);
        setError(error);
        
        // Improved error handling
        let errorMessage = "An error occurred. Please try again";
        
        if (error.response?.data) {
          if (typeof error.response.data === 'string') {
            errorMessage = error.response.data;
          } else if (error.response.data.message) {
            errorMessage = error.response.data.message;
          } else if (typeof error.response.data === 'object') {
            // Try to extract error from various possible response formats
            if (error.response.data.password) {
              errorMessage = error.response.data.password;
            } else {
              errorMessage = Object.values(error.response.data).flat().join(', ');
            }
          }
        }
        
        toast.error(errorMessage);
      }
    },
  });

  return (
    <Dialog open={openDelete} onOpenChange={setOpenDelete}>
      <DialogContent className="max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Delete User Account</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-gray-600">
            This action cannot be undone. Please enter your password to confirm.
          </p>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <FormField
              name="password"
              type="password"
              placeHolder="Enter your password"
              value={values.password}
              error={errors.password || error?.response?.data?.password}
              touched={touched.password}
              onChange={handleChange}
            />
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => setOpenDelete(false)}
                disabled={loading}
                className="px-4 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              {loading ? (
                <button
                  disabled
                  className="px-4 py-2 rounded bg-red-500 text-white cursor-not-allowed flex items-center gap-2"
                >
                  <ReactLoading type="spin" color="#fff" height={16} width={16} />
                  Deleting...
                </button>
              ) : (
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600 transition-colors"
                >
                  Delete Account
                </button>
              )}
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
