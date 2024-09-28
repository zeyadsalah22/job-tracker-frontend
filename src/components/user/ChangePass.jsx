import Modal from "../Modal";
import axios from "axios";
import { toast } from "react-toastify";
import { useState } from "react";
import ReactLoading from "react-loading";
import { useFormik } from "formik";
import FormInput from "../FormInput";
import * as Yup from "yup";

export default function ChangePass({ open, setOpen }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { values, errors, handleSubmit, handleChange, touched } = useFormik({
    initialValues: {
      current_password: "",
      new_password: "",
      re_new_password: "",
    },
    validationSchema: Yup.object({
      current_password: Yup.string().required("Old Password is required"),
      new_password: Yup.string().required("Password is required"),
      re_new_password: Yup.string().oneOf(
        [Yup.ref("new_password"), null],
        "Passwords must match"
      ),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      await axios
        .post("http://127.0.0.1:8000/api/users/set_password/", values, {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        })
        .then(() => {
          toast.success("Password updated successfully");
          setLoading(false);
          setOpen(false);
          values.current_password = "";
          values.new_password = "";
          values.re_new_password = "";
          setError(null);
        })
        .catch((error) => {
          setLoading(false);
          setError(error);
          toast.error(
            error.response.data.non_field_errors.map((error) => error) ||
              "An error occurred. Please try again"
          );
        });
    },
  });

  return (
    <Modal open={open} setOpen={setOpen} width="600px">
      <div className="flex flex-col gap-4">
        <h1 className="font-semibold text-lg">Delete User</h1>
        <div className="flex flex-col gap-3">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <FormInput
              type="password"
              name="current_password"
              placeHolder="Enter your current password"
              label="Current Password"
              value={values?.current_password}
              onChange={handleChange}
              error={
                errors?.current_password ||
                error?.response?.data?.current_password
              }
              touched={touched.current_password}
            />
            <FormInput
              type="password"
              name="new_password"
              placeHolder="Enter your new password"
              label="New Password"
              value={values?.new_password}
              onChange={handleChange}
              error={
                errors?.new_password || error?.response?.data?.new_password
              }
              touched={touched.new_password}
            />
            <FormInput
              type="password"
              name="re_new_password"
              placeHolder="Confirm your new password"
              label="Confirm New Password"
              value={values?.re_new_password}
              onChange={handleChange}
              error={errors.re_new_password}
              touched={touched.re_new_password}
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
