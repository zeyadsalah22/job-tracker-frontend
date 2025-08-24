import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/Dialog";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import FormField from "./ui/FormField";
import ReactLoading from "react-loading";
import { todoSchema } from "../schemas/Schemas";
import useUserStore from "../store/user.store";
import { useAxiosPrivate } from "../utils/axios";

export default function AddTodoModal({ refetch, openAdd, setOpenAdd }) {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const user = useUserStore((state) => state.user);
  const axiosPrivate = useAxiosPrivate();

  const initialValues = {
    userId: user?.userId || "",
    applicationTitle: "",
    applicationLink: "",
    deadline: "",
    completed: false,
  };

  const { values, errors, handleSubmit, handleChange, touched, setFieldValue, resetForm } =
    useFormik({
      initialValues,
      validationSchema: todoSchema,
      onSubmit: async (values) => {
        setLoading(true);
        console.log("Submitting todo:", values);
        
        try {
          const response = await axiosPrivate.post("/todos", values);
          console.log("Todo created successfully:", response.data);
          setOpenAdd(false);
          setLoading(false);
          toast.success("Task added successfully");
          resetForm();
          refetch();
        } catch (error) {
          console.error("Error adding todo:", error);
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

  // Set user ID when user data is available
  useEffect(() => {
    if (user?.userId) {
      setFieldValue("userId", user.userId);
    }
  }, [user?.userId, setFieldValue]);

  // Reset form when modal is closed
  useEffect(() => {
    if (!openAdd) {
      resetForm();
    }
  }, [openAdd, resetForm]);

  return (
    <Dialog open={openAdd} onOpenChange={setOpenAdd}>
      <DialogContent className="max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add Task</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
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
      </DialogContent>
    </Dialog>
  );
}
