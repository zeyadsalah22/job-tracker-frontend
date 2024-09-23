import { useNavigate } from "react-router-dom";
import Modal from "../Modal";
import axios from "axios";
import { useFormik } from "formik";
import { useState } from "react";
import { toast } from "react-toastify";

export default function AddModal({ id }) {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const [loading, setLoading] = useState(false);

  const { values, errors, handleSubmit, handleChange, touched } = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    
    validationSchema: loginSchema,
    onSubmit: async (values) => {
      setLoading(true);
      await axios
        .post("http://127.0.0.1:8000/api/token/login", values)
        .then((response) => {
          localStorage.setItem("token", response.data.auth_token);
          navigate("/dashboard");
          toast.success("Login successful");
        })
        .catch((error) => {
          setLoading(false);
          console.log(error);
          toast.error(
            error.response.data.non_field_errors.map((error) => error) ||
              "An error occurred. Please try again"
          );
        });
    },
  });

  return (
    <Modal open={openDelete} setOpen={setOpenDelete} width="600px">
      <div className="flex flex-col gap-4">
        <h1 className="font-semibold text-lg">Delete Application</h1>
        <div className="flex flex-col gap-3">
          <p>Are you sure you want to delete this application?</p>
          <div className="flex gap-2 justify-end">
            <button
              onClick={handleDelete}
              className="bg-red-500 text-white px-2 py-1 text-sm rounded-md hover:bg-red-600 transition-all"
            >
              Delete
            </button>
            <button
              onClick={() => setOpenDelete(false)}
              className="bg-gray-200 text-gray-800 px-2 py-1 text-sm rounded-md hover:bg-gray-300 transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
