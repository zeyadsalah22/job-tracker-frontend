import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import Layout from "../Layout";
import { Link } from "react-router-dom";
import { ArrowLeft, ChevronDown, ChevronUp } from "lucide-react";
import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useAxiosPrivate } from "../../utils/axios";

export default function ViewModal() {
  const { id } = useParams();
  const axiosPrivate = useAxiosPrivate();
  const [open, setOpen] = React.useState(false);

  const fetchQuestion = async () => {
    try {
      console.log("Fetching question with id:", id);
      const response = await axiosPrivate.get(`/questions/${id}`);
      console.log("Question response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching question:", error);
      throw error;
    }
  };

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
    data: question,
    isLoading: questionLoading,
    error: questionError,
  } = useQuery(["question", id], fetchQuestion, {
    enabled: !!id,
  });

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

  const isLoading = questionLoading || applicationLoading;

  if (questionError) {
    return (
      <Layout>
        <div className="bg-white rounded-lg h-full flex flex-col p-4">
          <div className="flex items-center gap-2 pb-4 border-b-2">
            <Link
              to={`/questions`}
              className="py-2 px-4 hover:bg-[#f1f1f1] transition-all w-fit rounded-lg flex items-center gap-2"
            >
              <ArrowLeft size={19} />
            </Link>
            <h1 className="text-lg font-semibold">Question Details</h1>
          </div>
          <div className="flex items-center justify-center h-full">
            <p className="text-red-600">Error loading question details. Please try again.</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-white rounded-lg h-full flex flex-col p-4 justify-between">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 pb-4 border-b-2">
            <Link
              to={`/questions`}
              className="py-2 px-4 hover:bg-[#f1f1f1] transition-all w-fit rounded-lg flex items-center gap-2"
            >
              <ArrowLeft size={19} />
            </Link>
            <h1 className="text-lg font-semibold">Question Details</h1>
          </div>
          
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <p className="text-gray-500">Loading question details...</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {/* Application Info - Clickable */}
              {application && (
                <div className="bg-gray-50 p-4 rounded-lg border">
                  <div className="flex flex-col gap-2">
                    <p className="text-sm font-medium text-gray-600">Associated Application:</p>
                    <Link
                      to={`/applications/${question.applicationId}`}
                      className="text-primary hover:text-primary/80 font-semibold transition-colors flex items-center gap-2 group"
                    >
                      <span>{application.jobTitle} at {application.companyName}</span>
                      <ArrowLeft size={16} className="rotate-180 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    {application.submissionDate && (
                      <p className="text-sm text-gray-500">
                        Submitted: {new Date(application.submissionDate).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Question Section */}
              <div className="flex flex-col gap-2">
                <div
                  onClick={() => setOpen(!open)}
                  className="flex gap-1 py-4 border-b font-semibold cursor-pointer flex-col hover:bg-gray-50 px-4 rounded-lg transition-colors"
                >
                  <div className="flex justify-between items-center">
                    <p className="text-lg">
                      {!question?.question1 || question.question1 === ""
                        ? "No question provided."
                        : question.question1}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">
                        {open ? "Hide Answer" : "Show Answer"}
                      </span>
                      {open ? <ChevronUp size={19} /> : <ChevronDown size={19} />}
                    </div>
                  </div>
                </div>

                {/* Answer Section - Toggleable */}
                <AnimatePresence>
                  {open && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
                        <p className="text-sm font-medium text-blue-800 mb-2">Answer:</p>
                        <p className="text-gray-700 leading-relaxed">
                          {!question?.answer || question.answer === ""
                            ? "No answer provided yet."
                            : question.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
