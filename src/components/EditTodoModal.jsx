import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/Dialog";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import FormField from "./ui/FormField";
import ReactLoading from "react-loading";
import { todoSchema } from "../schemas/Schemas";
import { useAxiosPrivate } from "../utils/axios";

export default function EditTodoModal({ refetch, openEdit, setOpenEdit, todoItem }) {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const axiosPrivate = useAxiosPrivate();

  const initialValues = {
    userId: todoItem?.userId || "",
    applicationTitle: todoItem?.applicationTitle || "",
    applicationLink: todoItem?.applicationLink || "",
    deadline: todoItem?.deadline ? new Date(todoItem.deadline).toISOString().split('T')[0] : "",
    completed: todoItem?.completed || false,
  };

  const { values, errors, handleSubmit, handleChange, touched, setFieldValue, resetForm } =
    useFormik({
      initialValues,
      validationSchema: todoSchema,
      enableReinitialize: true,
      onSubmit: async (values) => {
        setLoading(true);
        console.log("Updating todo:", values);
        
        try {
          const response = await axiosPrivate.put(`/todos/${todoItem.todoId}`, values);
          console.log("Todo updated successfully:", response.data);
          setOpenEdit(false);
          setLoading(false);
          toast.success("Task updated successfully");
          refetch();
        } catch (error) {
          console.error("Error updating todo:", error);
          setLoading(false);
          setError(error);
          
          let errorMessage = "An error occurred. Please try again";
          if (error.response?.data) {
            // Try to extract error message from different possible formats
            if (typeof error.response.data === 'string') {
              errorMessage = error.response.data;
            } else if (error.response.data.message) {
              errorMessage = error.response.data.message;
            } else if (error.response.data.error) {
              errorMessage = error.response.data.error;
            } else if (error.response.data.title) {
              errorMessage = error.response.data.title;
            } else if (error.response.data.errors) {
              errorMessage = Object.values(error.response.data.errors).flat().join(", ");
            }
          }
          
          toast.error(errorMessage);
        }
      },
    });

  return (
    <Modal open={openEdit} setOpen={setOpenEdit} width="600px">
      <div className="flex flex-col gap-4">
        <h1 className="font-semibold text-lg">Edit Task</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <FormField
            name="applicationTitle"
            label="Task Title"
            type="text"
            placeHolder="Task Title"
            value={values.applicationTitle}
            onChange={handleChange}
            error={
              errors.applicationTitle ||
              error?.response?.data?.applicationTitle
            }
            touched={touched.applicationTitle}
            required
          />
          <FormField
            name="applicationLink"
            label="Link (Optional)"
            type="text"
            placeHolder="Application Link"
            value={values.applicationLink}
            onChange={handleChange}
            error={
              errors.applicationLink || error?.response?.data?.applicationLink
            }
            touched={touched.applicationLink}
          />
          <FormField
            name="deadline"
            label="Deadline"
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
          
          <div className="flex items-center gap-2 mb-2">
            <input
              type="checkbox"
              id="completed"
              name="completed"
              checked={values.completed}
              onChange={() => setFieldValue("completed", !values.completed)}
              className="cursor-pointer h-4 w-4"
            />
            <label htmlFor="completed" className="text-sm cursor-pointer">
              Mark as completed
            </label>
          </div>

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
              Update
            </button>
          )}
        </form>
      </div>
    </Modal>
  );
} 