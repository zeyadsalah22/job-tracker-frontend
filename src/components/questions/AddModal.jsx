import Modal from "../Modal";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { questionSchema } from "../../schemas/Schemas";
import FormInput from "../FormInput";
import ReactLoading from "react-loading";
import { useQuery } from "react-query";
import useUserStore from "../../store/user.store";
import Dropdown from "../Dropdown";
import { useAxiosPrivate } from "../../utils/axios";
import React from "react";

export default function AddModal({ refetch, openAdd, setOpenAdd }) {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [applicationSearch, setApplicationSearch] = useState("");
  const axiosPrivate = useAxiosPrivate();
  const user = useUserStore((state) => state.user);

  const fetchApplications = async () => {
    try {
      const params = {
        SearchTerm: applicationSearch || undefined,
        PageSize: 100 // Ensure we get a good number of results
      };
      
      console.log("Fetching applications with params:", params);
      const response = await axiosPrivate.get('/applications', { params });
      console.log("Applications response:", response.data);
      
      // Map the API response to match what the dropdown expects
      const items = response.data.items || [];
      return {
        results: items.map(application => ({
          id: application.applicationId,
          name: `${application.jobTitle} at ${application.companyName}`,
          value: application.applicationId,
          jobTitle: application.jobTitle,
          companyName: application.companyName
        }))
      };
    } catch (error) {
      console.error("Error fetching applications:", error);
      return {
        results: []
      };
    }
  };

  const {
    data: applications,
    isLoading: applications_Loading,
  } = useQuery(["applications", applicationSearch], fetchApplications);

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
        
        console.log("Form values:", values);
        console.log("Validation errors:", errors);
        
        // Validate required fields
        if (!values.application_id) {
          toast.error("Please select an application");
          setLoading(false);
          return;
        }
        
        // Transform form values to match backend API format
        const questionData = {
          question1: values.question,
          answer: values.answer,
          applicationId: parseInt(values.application_id, 10)
        };

        console.log("Submitting question data:", questionData);
        
        try {
          const response = await axiosPrivate.post("/questions", questionData);
          console.log("Question created successfully:", response.data);
          setOpenAdd(false);
          setLoading(false);
          toast.success("Question added successfully");
          refetch();
        } catch (error) {
          console.error("Error adding question:", error);
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

  const setApplicationId = (id) => {
    setFieldValue("application_id", id);
  };

  // Set user_id when component mounts
  React.useEffect(() => {
    if (user?.userId) {
      setFieldValue("user_id", user.userId);
    }
  }, [user, setFieldValue]);

  return (
    <Modal open={openAdd} setOpen={setOpenAdd} width="600px">
      <div className="flex flex-col gap-4">
        <h1 className="font-semibold text-lg">Add Question</h1>
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

          <div className="flex flex-col gap-2 w-full">
            <p className="text-sm text-gray-600">
              Choose Application<span className="text-red-500">*</span>
            </p>
            <Dropdown
              id={values.application_id}
              options={applications?.results}
              query={applicationSearch}
              setQuery={setApplicationSearch}
              setValue={setApplicationId}
              isLoading={applications_Loading}
              error={errors.application_id || error?.response?.data?.application_id}
              touched={touched.application_id}
            />
            {errors.application_id && touched.application_id && (
              <span className="mt-1 text-xs text-red-500">
                {errors.application_id}
              </span>
            )}
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
              Submit
            </button>
          )}
        </form>
      </div>
    </Modal>
  );
}
