import Modal from "../Modal";
import axios from "axios";
import { toast } from "react-toastify";
import { useState } from "react";
import ReactLoading from "react-loading";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import FormInput from "../FormInput";
import * as Yup from "yup";

export default function DeleteModal({ openDelete, setOpenDelete }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const { values, errors, handleSubmit, handleChange, touched } = useFormik({
    initialValues: {
      current_password: "",
    },
    validationSchema: Yup.object({
      current_password: Yup.string().required("Password is required"),
    }),
    onSubmit: async (values) => {
      setLoading(true);

      try {
        await axios.delete(`https://job-lander-backend.fly.dev/api/users/me/`, {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`, // Add authorization token in the header
          },
          data: values, // Pass the body data here
        });
        setOpenDelete(false);
        setLoading(false);
        toast.success("User deleted successfully");
        navigate("/");
        localStorage.removeItem("token");
      } catch (error) {
        setLoading(false);
        setError(error);
        toast.error(error.response.data.current_password[0]);
      }
    },
  });

  return (
    <Modal open={openDelete} setOpen={setOpenDelete} width="600px">
      <div className="flex flex-col gap-4">
        <h1 className="font-semibold text-lg">Delete User</h1>
        <div className="flex flex-col gap-3">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <FormInput
              name="current_password"
              type="password"
              placeHolder="Enter your current password"
              value={values.current_password}
              error={
                errors.current_password ||
                error?.response?.data?.current_password
              }
              touched={touched.current_password}
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
