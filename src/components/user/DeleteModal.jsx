import Modal from "../Modal";
import { toast } from "react-toastify";
import { useState } from "react";
import ReactLoading from "react-loading";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import FormInput from "../FormInput";
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
    <Modal open={openDelete} setOpen={setOpenDelete} width="600px">
      <div className="flex flex-col gap-4">
        <h1 className="font-semibold text-lg">Delete User</h1>
        <p className="text-gray-600">
          This action cannot be undone. Please enter your password to confirm.
        </p>
        <div className="flex flex-col gap-3">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <FormInput
              name="password"
              type="password"
              placeHolder="Enter your password"
              value={values.password}
              error={errors.password || error?.response?.data?.password}
              touched={touched.password}
              onChange={handleChange}
            />
            <div className="flex gap-2 justify-end">
              {loading ? (
                <button
                  disabled
                  className="rounded-md cursor-not-allowed flex items-center justify-center bg-red-500 px-2 py-1 text-white transition h-10"
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
                  className="rounded-md bg-red-500 px-2 py-1 text-white transition hover:bg-red-600 h-10"
                >
                  Delete
                </button>
              )}
              <button
                type="button"
                onClick={() => setOpenDelete(false)}
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
