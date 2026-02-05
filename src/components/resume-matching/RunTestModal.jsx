import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, X } from "lucide-react";
import { useQuery } from "react-query";
import { useAxiosPrivate } from "../../utils/axios";
import { toast } from "react-toastify";
import ReactLoading from "react-loading";
import { useFormik } from "formik";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/Dialog";

export default function RunTestModal({ openRunTest, setOpenRunTest, refetch }) {
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();
  const [loading, setLoading] = useState(false);

  const fetchCvs = async () => {
    try {
      const response = await axiosPrivate.get(`/cvs`);
      console.log("Fetched CVs for test modal:", response.data);
      return response.data || [];
    } catch (error) {
      console.error("Error fetching CVs:", error);
      return [];
    }
  };

  const { data: cvs, isLoading: cvs_loading } = useQuery(["cvs"], fetchCvs);

  const { values, errors, handleSubmit, handleChange, touched } = useFormik({
    initialValues: {
      selectedResume: "",
      jobDescription: "",
    },
    validate: (values) => {
      const errors = {};
      if (!values.selectedResume) {
        errors.selectedResume = "Please select a resume";
      }
      if (!values.jobDescription.trim()) {
        errors.jobDescription = "Please enter a job description";
      }
      return errors;
    },
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const resumeId = parseInt(values.selectedResume, 10);
        const jobDescription = values.jobDescription.trim();

        console.log("Running resume test with data:", { resumeId, jobDescription });
        
        // The ResumeTestService should now use the ML service internally
        // If it doesn't, we can update this to use /cvs/{id}/match directly
        const response = await axiosPrivate.post("/resumetest", {
          resumeId: resumeId,
          jobDescription: jobDescription
        });
        
        console.log("Resume test response:", response.data);

        // Refresh the main table data and wait for it to complete
        if (refetch) {
          await refetch();
        }

        // Close modal and reset loading state
        setLoading(false);
        setOpenRunTest(false);
        
        toast.success("Resume test completed successfully!");
      } catch (error) {
        console.error("Error running resume test:", error);
        setLoading(false);
        
        let errorMessage = "An error occurred while running the test. Please try again.";
        
        // Handle ML service specific errors (timeout, service unavailable, etc.)
        if (error.response?.status === 504) {
          errorMessage = "Request timed out. The ML service is taking too long to respond. Please try again.";
        } else if (error.response?.status === 502) {
          errorMessage = "Error communicating with ML service. Please try again later.";
        } else if (error.response?.status === 500) {
          errorMessage = "Server error occurred while processing your request. Please try again later.";
        } else if (error.response?.data) {
          // For other errors, try to extract a meaningful message
          if (typeof error.response.data === 'string') {
            errorMessage = error.response.data;
          } else if (error.response.data.message) {
            errorMessage = error.response.data.message;
          } else if (error.response.data.details) {
            errorMessage = `${error.response.data.message || errorMessage}. ${error.response.data.details}`;
          } else if (error.response.data.error) {
            errorMessage = error.response.data.error;
          } else if (error.response.data.title) {
            errorMessage = error.response.data.title;
          }
        }
        
        toast.error(errorMessage);
      }
    },
  });

  return (
    <Dialog open={openRunTest} onOpenChange={setOpenRunTest}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Run New Resume Test</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col gap-2 w-full">
            <label className="block text-sm font-medium text-gray-700">
              Select Resume<span className="text-red-500">*</span>
            </label>
            <select
              name="selectedResume"
              value={values.selectedResume}
              onChange={handleChange}
              disabled={loading}
              className={`${
                touched.selectedResume && errors.selectedResume && "border-red-500"
              } w-full rounded-md border px-4 py-2 focus:border-primary focus:outline-none focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <option value="" disabled>
                Select a resume
              </option>
              {cvs_loading ? (
                <option value="" disabled>
                  Loading...
                </option>
              ) : (
                cvs && cvs.map((cv) => (
                  <option key={cv.resumeId} value={cv.resumeId}>
                    Resume {cv.resumeId} ({new Date(cv.createdAt).toLocaleDateString()})
                  </option>
                ))
              )}
            </select>
            {errors.selectedResume && touched.selectedResume && (
              <span className="text-xs text-red-500">
                {errors.selectedResume}
              </span>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Job Description<span className="text-red-500">*</span>
            </label>
            <textarea
              name="jobDescription"
              value={values.jobDescription}
              onChange={handleChange}
              disabled={loading}
              className={`${
                touched.jobDescription && errors.jobDescription && "border-red-500"
              } w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary h-32 resize-none disabled:opacity-50 disabled:cursor-not-allowed`}
              placeholder="Paste the job description here..."
            />
            {errors.jobDescription && touched.jobDescription && (
              <span className="text-xs text-red-500 mt-1 block">
                {errors.jobDescription}
              </span>
            )}
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => setOpenRunTest(false)}
              disabled={loading}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            {loading ? (
              <button
                disabled
                className="px-4 py-2 bg-primary text-white rounded-lg cursor-not-allowed flex items-center gap-2"
              >
                <ReactLoading type="bubbles" color="#ffffff" height={20} width={20} />
                Running Test...
              </button>
            ) : (
              <button
                type="submit"
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 flex items-center gap-2"
              >
                <FileText size={18} />
                Run Test
              </button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 