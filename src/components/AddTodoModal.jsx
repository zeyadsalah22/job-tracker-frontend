import Modal from "./Modal";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import FormInput from "./FormInput";
import ReactLoading from "react-loading";
import { todoSchema } from "../schemas/Schemas";
import useUserStore from "../store/user.store";
import { useAxiosPrivate } from "../utils/axios";

export default function AddTodoModal({ refetch, openAdd, setOpenAdd }) {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const user = useUserStore((state) => state.user);
  const axiosPrivate = useAxiosPrivate();

  const { values, errors, handleSubmit, handleChange, touched, setFieldValue } =
    useFormik({
      initialValues: {
        user_id: "",
        application_title: "",
        application_link: "",
        deadline: "",
        completed: false,
      },

      validationSchema: todoSchema,
      onSubmit: async (values) => {
        setLoading(true);
        await axiosPrivate
          .post("/todos", values)
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
            placeHolder="Application Title"
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
            placeHolder="Application Link"
            value={values.application_link}
            onChange={handleChange}
            error={
              errors.application_link || error?.response?.data?.application_link
            }
            touched={touched.application_link}
          />
          <FormInput
            name="deadline"
            type="date"
            placeHolder="Deadline"
            value={values.deadline}
            onChange={handleChange}
            error={
              errors.deadline || error?.response?.data?.deadline
            }
            touched={touched.deadline}
            required
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
