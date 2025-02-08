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

  const fetchquestion = async () => {
    const { data } = await axiosPrivate.get(`/questions/${id}`);
    return data;
  };

  const {
    data: question,
    isLoading,
    error,
  } = useQuery(["question", { id }], fetchquestion, {
    enabled: !!id,
  });

  const [open, setOpen] = React.useState(false);

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
            <p>Loading...</p>
          ) : (
            <div className="flex flex-col gap-2">
              <div
                onClick={() => setOpen(!open)}
                className="flex gap-1 py-4 border-b font-semibold cursor-pointer flex-col"
              >
                <div className="flex gap-1 text-sm">
                  <p className="font-semibold mb-1 text-gray-500">
                    Application:
                  </p>
                  <p>{question.application.job_title}</p>
                </div>
                <div className="flex justify-between items-center">
                  <p>
                    {question.question === ""
                      ? "No provided Information."
                      : question.question}
                  </p>
                  {open ? <ChevronUp size={19} /> : <ChevronDown size={19} />}
                </div>
              </div>

              <AnimatePresence>
                {open && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="flex gap-1 text-gray-600 overflow-hidden"
                  >
                    <p>
                      {question.answer === ""
                        ? "No provided Information."
                        : question.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
