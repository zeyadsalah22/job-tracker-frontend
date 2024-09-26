import axios from "axios";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import Layout from "../Layout";
import { Link } from "react-router-dom";
import { MoveLeft } from "lucide-react";

export default function ViewModal() {
  const { id } = useParams();

  const fetchquestion = async () => {
    const { data } = await axios.get(
      `http://127.0.0.1:8000/api/questions/${id}`,
      {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      }
    );
    return data;
  };

  const {
    data: question,
    isLoading,
    error,
  } = useQuery(["question", { id }], fetchquestion, {
    enabled: !!id,
  });

  return (
    <Layout>
      <div className="bg-white rounded-lg h-full flex flex-col p-4 justify-between">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 pb-4 border-b-2">
            <Link
              to={`/questions`}
              className="py-2 px-4 bg-[#f7f7f7] hover:bg-[#f1f1f1] transition-all w-fit rounded-lg flex items-center gap-2"
            >
              <MoveLeft /> Back
            </Link>
            <h1 className="text-2xl font-bold">question Details</h1>
          </div>
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            <div className="flex flex-col gap-2">
              <div className="flex gap-1">
                <p className="font-semibold">question: </p>
                <p>
                  {question.question === ""
                    ? "No provided Information."
                    : question.question}
                </p>
              </div>
              <div className="flex gap-1">
                <p className="font-semibold">answer: </p>
                <p>
                  {question.answer === ""
                    ? "No provided Information."
                    : question.answer}
                </p>
              </div>
              <p className="font-semibold mb-1 text-gray-500">
                Related Application
              </p>
              <div className="flex gap-1">
                <p className="font-semibold">Application: </p>
                <p>
                  {question.application.job_title === ""
                    ? "No provided Information."
                    : question.application.job_title}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
