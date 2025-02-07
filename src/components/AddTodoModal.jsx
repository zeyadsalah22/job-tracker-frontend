import Modal from "./Modal";
import axios from "axios";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import FormInput from "./FormInput";
import ReactLoading from "react-loading";
import { todoSchema } from "../schemas/Schemas";
import useUserStore from "../store/user.store";

export default function AddTodoModal({ refetch, openAdd, setOpenAdd }) {
  const token = localStorage.getItem("access");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const user = useUserStore((state) => state.user);

  const { values, errors, handleSubmit, handleChange, touched, setFieldValue } =
    useFormik({
      initialValues: {
        user_id: "",
        application_title: "",
        application_link: "",
        completed: false,
      },

      validationSchema: todoSchema,
      onSubmit: async (values) => {
        setLoading(true);
        await axios
          .post("http://127.0.0.1:8000/api/todos", values, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then(() => {
            setOpenAdd(false);
            setLoading(false);
            toast.success("Task added successfully");
            refetch();
          })
          .catch((error) => {
            setLoading(false);
            setError(error);
            toast.error(
              error.response.data.non_field_errors[0] && "Todo already exists"
            );
          });
      },
    });

  useEffect(() => {
    setFieldValue("user_id", user?.id);
  }, [user?.id, setFieldValue]);

  return (
    <Modal open={openAdd} setOpen={setOpenAdd} width="600px">
      <div className="flex flex-col gap-4">
        <h1 className="font-semibold text-lg">Add Task</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <FormInput
            name="application_title"
            type="text"
            placeHolder="Title"
            value={values.application_title}
            onChange={handleChange}
            error={
              errors.application_title ||
              error?.response?.data?.application_title
            }
            touched={touched.application_title}
            required
          />
          <FormInput
            name="application_link"
            type="text"
            placeHolder="Link"
            value={values.application_link}
            onChange={handleChange}
            error={
              errors.application_link || error?.response?.data?.application_link
            }
            touched={touched.application_link}
          />

          {loading ? (
            <button
              disabled
              className="rounded cursor-not-allowed flex items-center justify-center bg-primary px-8 py-2 text-white transition h-10"
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
              className="rounded bg-primary px-8 py-2 text-white transition hover:bg-primary/80 h-10"
            >
              Submit
            </button>
          )}
        </form>
      </div>
    </Modal>
  );
}
