import Modal from "../Modal";
import { toast } from "react-toastify";
import { useState } from "react";
import ReactLoading from "react-loading";
import { useFormik } from "formik";
import FormInput from "../FormInput";
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
    <Modal open={open} setOpen={setOpen} width="600px">
      <div className="flex flex-col gap-4">
        <h1 className="font-semibold text-lg">Change Password</h1>
        <div className="flex flex-col gap-3">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <FormInput
              type="password"
              name="currentPassword"
              placeHolder="Enter your current password"
              label="Current Password"
              value={values.currentPassword}
              onChange={handleChange}
              error={errors.currentPassword || error?.response?.data?.currentPassword}
              touched={touched.currentPassword}
            />
            <FormInput
              type="password"
              name="newPassword"
              placeHolder="Enter your new password"
              label="New Password"
              value={values.newPassword}
              onChange={handleChange}
              error={errors.newPassword || error?.response?.data?.newPassword}
              touched={touched.newPassword}
            />
            <FormInput
              type="password"
              name="newPasswordConfirm"
              placeHolder="Confirm your new password"
              label="Confirm New Password"
              value={values.newPasswordConfirm}
              onChange={handleChange}
              error={errors.newPasswordConfirm || error?.response?.data?.newPasswordConfirm}
              touched={touched.newPasswordConfirm}
            />
            <div className="flex gap-2 justify-end">
              {loading ? (
                <button
                  disabled
                  className="rounded-md cursor-not-allowed flex items-center justify-center bg-primary px-2 py-1 text-white transition h-10"
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
                  className="rounded-md bg-primary px-2 py-1 text-white transition hover:bg-primary/85 h-10"
                >
                  Update
                </button>
              )}
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="bg-gray-200 text-gray-800 px-2 py-1 text-sm rounded-md hover:bg-gray-300 transition-all h-10"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
}
