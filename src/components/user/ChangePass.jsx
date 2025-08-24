import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/Dialog";
import { toast } from "react-toastify";
import { useState } from "react";
import ReactLoading from "react-loading";
import { useFormik } from "formik";
import FormField from "../ui/FormField";
import * as Yup from "yup";
import { useAxiosPrivate } from "../../utils/axios";

export default function ChangePass({ open, setOpen }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const axiosPrivate = useAxiosPrivate();

  const { values, errors, handleSubmit, handleChange, touched, resetForm } = useFormik({
    initialValues: {
      currentPassword: "",
      newPassword: "",
      newPasswordConfirm: "",
    },
    validationSchema: Yup.object({
      currentPassword: Yup.string().required("Current password is required"),
      newPassword: Yup.string()
        .required("New password is required")
        .min(6, "Password must be at least 6 characters"),
      newPasswordConfirm: Yup.string()
        .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
        .required("Confirm password is required"),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      try {
        console.log("Changing password with data:", {
          currentPassword: values.currentPassword,
          newPassword: values.newPassword,
          newPasswordConfirm: values.newPasswordConfirm
        });
        
        // Use PUT method with the correct endpoint
        await axiosPrivate.put("/users/change-password", {
          currentPassword: values.currentPassword,
          newPassword: values.newPassword,
          newPasswordConfirm: values.newPasswordConfirm
        });
        
        toast.success("Password updated successfully");
        setLoading(false);
        setOpen(false);
        resetForm();
        setError(null);
      } catch (error) {
        console.error("Change password error:", error);
        setLoading(false);
        setError(error);
        
        // Better error handling
        let errorMessage = "An error occurred. Please try again";
        
        if (error.response?.data) {
          if (typeof error.response.data === 'string') {
            errorMessage = error.response.data;
          } else if (error.response.data.message) {
            errorMessage = error.response.data.message;
          } else if (typeof error.response.data === 'object') {
            errorMessage = Object.values(error.response.data).flat().join(', ');
          }
        }
        
        toast.error(errorMessage);
      }
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Change Password</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <FormField
              type="password"
              name="currentPassword"
              placeHolder="Enter your current password"
              label="Current Password"
              value={values.currentPassword}
              onChange={handleChange}
              error={errors.currentPassword || error?.response?.data?.currentPassword}
              touched={touched.currentPassword}
            />
            <FormField
              type="password"
              name="newPassword"
              placeHolder="Enter your new password"
              label="New Password"
              value={values.newPassword}
              onChange={handleChange}
              error={errors.newPassword || error?.response?.data?.newPassword}
              touched={touched.newPassword}
            />
            <FormField
              type="password"
              name="newPasswordConfirm"
              placeHolder="Confirm your new password"
              label="Confirm New Password"
              value={values.newPasswordConfirm}
              onChange={handleChange}
              error={errors.newPasswordConfirm || error?.response?.data?.newPasswordConfirm}
              touched={touched.newPasswordConfirm}
            />
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => setOpen(false)}
                disabled={loading}
                className="px-4 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              {loading ? (
                <button
                  disabled
                  className="px-4 py-2 rounded bg-primary text-white cursor-not-allowed flex items-center gap-2"
                >
                  <ReactLoading type="spin" color="#fff" height={16} width={16} />
                  Updating...
                </button>
              ) : (
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-primary text-white hover:bg-primary/80 transition-colors"
                >
                  Update Password
                </button>
              )}
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
