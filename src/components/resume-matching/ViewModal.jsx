import { useQuery } from "react-query";
import { Link, useParams } from "react-router-dom";
import Layout from "../Layout";
import {
  ArrowLeft,
  FileText,
  ClipboardList,
  AlertTriangle,
} from "lucide-react";
import { useAxiosPrivate } from "../../utils/axios";

export default function ViewModal() {
  const { id } = useParams();
  const axiosPrivate = useAxiosPrivate();

  const fetchResumeTest = async () => {
    return {
      id: 1,
      resumeLink: "https://example.com/resume1.pdf",
      jobDescription: "We are looking for a skilled Frontend Developer with experience in React, TypeScript, and modern web development practices. The ideal candidate should have strong problem-solving skills and experience with state management libraries like Redux or Zustand. Knowledge of testing frameworks like Jest and React Testing Library is a plus.",
      atsScore: "85%",
      missingSkills: [
        "TypeScript",
        "Redux",
        "Jest",
        "React Testing Library"
      ],
      date: "2024-03-15"
    };
  };

  const { data: testDetails, isLoading } = useQuery(
    ["resumeTest", { id }],
    fetchResumeTest,
    {
      enabled: !!id,
    }
  );

  return (
    <Layout>
      <div className="bg-white rounded-lg h-full flex flex-col p-4 justify-between">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 pb-4 border-b-2">
            <Link
              to={`/resume-matching`}
              className="py-2 px-4 hover:bg-[#f1f1f1] transition-all w-fit rounded-lg flex items-center gap-2"
            >
              <ArrowLeft size={19} />
            </Link>
            <h1 className="text-lg font-semibold">Resume Test Details</h1>
          </div>
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Resume Section */}
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="text-primary" size={20} />
                  <h2 className="text-xl font-semibold">Resume</h2>
                </div>
                <div className="space-y-4">
                  <p className="text-gray-600">
                    View the submitted resume for this test.
                  </p>
                  <a
                    href={testDetails.resumeLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-primary hover:text-primary/80"
                  >
                    <FileText size={16} />
                    View Resume PDF
                  </a>
                </div>
              </div>

              {/* Job Description Section */}
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center gap-2 mb-4">
                  <ClipboardList className="text-primary" size={20} />
                  <h2 className="text-xl font-semibold">Job Description</h2>
                </div>
                <div className="space-y-4">
                  <p className="text-gray-600 whitespace-pre-line">
                    {testDetails.jobDescription}
                  </p>
                </div>
              </div>

              {/* ATS Score Section */}
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-semibold">{testDetails.atsScore}</span>
                  </div>
                  <h2 className="text-xl font-semibold">ATS Score</h2>
                </div>
                <div className="space-y-4">
                  <p className="text-gray-600">
                    This score represents how well your resume matches the job description according to the Applicant Tracking System (ATS).
                  </p>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-primary h-2.5 rounded-full"
                      style={{ width: testDetails.atsScore }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Missing Skills Section */}
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center gap-2 mb-4">
                  <AlertTriangle className="text-yellow-500" size={20} />
                  <h2 className="text-xl font-semibold">Missing Skills</h2>
                </div>
                <div className="space-y-4">
                  <p className="text-gray-600">
                    These are the skills mentioned in the job description that were not found in your resume:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {testDetails.missingSkills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="mt-6 text-sm text-gray-500">
            Test conducted on: {testDetails?.date}
          </div>
        </div>
      </div>
    </Layout>
  );
} 