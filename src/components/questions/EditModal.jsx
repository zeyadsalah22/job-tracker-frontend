import Modal from "../Modal";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { questionSchema } from "../../schemas/Schemas";
import FormInput from "../FormInput";
import ReactLoading from "react-loading";
import { useQuery } from "react-query";
import useUserStore from "../../store/user.store";
import { useAxiosPrivate } from "../../utils/axios";

export default function EditModal({ id, refetch, openEdit, setOpenEdit }) {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const user = useUserStore((state) => state.user);
  const axiosPrivate = useAxiosPrivate();

  const fetchQuestion = async () => {
    try {
      console.log("Fetching question with id:", id);
      const response = await axiosPrivate.get(`/questions/${id}`);
      console.log("Question details for edit:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching question details:", error);
      throw error;
    }
  };

  const { data: question, isLoading } = useQuery(
    ["question", id],
    fetchQuestion,
    {
      enabled: !!id,
    }
  );

  const fetchApplication = async () => {
    try {
      if (!question?.applicationId) return null;
      
      console.log("Fetching application with id:", question.applicationId);
      const response = await axiosPrivate.get(`/applications/${question.applicationId}`);
      console.log("Application response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching application:", error);
      return null;
    }
  };

  const {
    data: application,
    isLoading: applicationLoading,
  } = useQuery(
    ["application", question?.applicationId], 
    fetchApplication, 
    {
      enabled: !!question?.applicationId,
    }
  );

  const { values, errors, handleSubmit, handleChange, touched, setFieldValue } =
    useFormik({
      initialValues: {
        user_id: "",
        question: "",
        answer: "",
        application_id: "",
      },

      validationSchema: questionSchema,
      onSubmit: async (values) => {
        setLoading(true);
        setError(null);
        
        // Transform form values to match backend API format
        const questionData = {
          question1: values.question,
          answer: values.answer,
          applicationId: parseInt(values.application_id, 10)
        };

        console.log("Updating question with data:", questionData);
        
        try {
          const response = await axiosPrivate.patch(`/questions/${id}`, questionData);
          console.log("Update response:", response.data);
          
          setOpenEdit(false);
          setLoading(false);
          toast.success("Question updated successfully");
          refetch();
        } catch (error) {
          console.error("Error updating question:", error);
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

  useEffect(() => {
    if (!isLoading && question) {
      setFieldValue("user_id", user?.userId);
      setFieldValue("question", question.question1 || "");
      setFieldValue("answer", question.answer || "");
      setFieldValue("application_id", question.applicationId);
    }
  }, [setFieldValue, question, isLoading, user]);

  if (isLoading) {
    return (
      <Modal open={openEdit} setOpen={setOpenEdit} width="600px">
        <div className="flex items-center justify-center py-8">
          <ReactLoading type="spin" color="#4F46E5" height={30} width={30} />
        </div>
      </Modal>
    );
  }

  return (
    <Modal open={openEdit} setOpen={setOpenEdit} width="600px">
      <div className="flex flex-col gap-4">
        <h1 className="font-semibold text-lg">Edit Question</h1>
        
        {/* Read-only application display */}
        {application && (
          <div className="bg-gray-50 p-3 rounded-md border">
            <div className="text-sm text-gray-600 mb-1">Associated Application</div>
            <div className="font-medium text-gray-800">
              {application.jobTitle} at {application.companyName}
            </div>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <FormInput
            label="Question"
            name="question"
            placeHolder="Enter your question"
            textArea={true}
            value={values.question}
            onChange={handleChange}
            error={errors.question || error?.response?.data?.question}
            touched={touched.question}
            required
          />
          
          <FormInput
            label="Answer"
            name="answer"
            placeHolder="Enter the answer"
            textArea={true}
            value={values.answer}
            onChange={handleChange}
            error={errors.answer || error?.response?.data?.answer}
            touched={touched.answer}
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
              Update
            </button>
          )}
        </form>
      </div>
    </Modal>
  );
}
