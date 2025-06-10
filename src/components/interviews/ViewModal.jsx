import { useQuery } from "react-query";
import { Link, redirect, useParams } from "react-router-dom";
import Layout from "../Layout";
import {
  ArrowLeft,
  Building2,
  NotebookPen,
  CalendarCheck,
  Clock,
  FileText,
  MessageSquare,
  SquareArrowOutUpRight,
  Linkedin,
} from "lucide-react";
import Table from "../Table";
import React from "react";
import { useAxiosPrivate } from "../../utils/axios";

export default function ViewModal() {
  const { id } = useParams();
  const axiosPrivate = useAxiosPrivate();

  const fetchInterview = async () => {
    const response = await axiosPrivate.get(`/mockinterview/${id}`);
    try{
      return response.data;
    } catch (error) {
      console.error("Error fetching interview data:", error);
      alert("Failed to load interview details. Please try again later.");
      redirect("/interviews");
      return null;
    }
  };

  // Fetch application data if exists using applicationId in interview
  const fetchApplication = async (applicationId) => {
    if (!applicationId) return null; // Return null if no applicationId is provided
    const response = await axiosPrivate.get(`/applications/${applicationId}`);
    try {
      return response.data;
    } catch (error) {
      console.error("Error fetching application data:", error);
      alert("Failed to load application details. Please try again later.");
      return null;
    }
  };

  // Fetch company data if exists using companyId in interview
  const fetchCompany = async (companyId) => {
    if (!companyId) return null; // Return null if no companyId is provided
    const response = await axiosPrivate.get(`/user-companies/${companyId}`);
    try {
      return response.data;
    } catch (error) {
      console.error("Error fetching company data:", error);
      alert("Failed to load company details. Please try again later.");
      return null;
    }
  };

  const { data: interview, isLoading: isLoadingInterview } = useQuery(
    ["interview", { id }],
    fetchInterview,
    {
      enabled: !!id,
    }
  );

  // Fetch application and company data if interview exists
  const { data: application, isLoading: isLoadingApplication } = useQuery(
    ["application", { applicationId: interview?.applicationId }],
    () => fetchApplication(interview?.applicationId),
    {
      enabled: !!interview?.applicationId,
    }
  );

  const { data: company, isLoading: isLoadingCompany } = useQuery(
    ["company", { companyId: interview?.companyId }],
    () => fetchCompany(interview?.companyId),
    {
      enabled: !!interview?.companyId,
    }
  );

  // wait for company and application data to be fetched before proceeding
  if (isLoadingApplication || isLoadingCompany || isLoadingInterview) {
    return <p>Loading interview details...</p>;
  }

  const table_head = [
    {
      name: "Question",
      key: "question",
    },
    {
      name: "Answer",
      key: "answer",
    },
  ];

  return (
    <Layout>
      <div className="bg-white rounded-lg h-full flex flex-col p-4 justify-between">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 pb-4 border-b-2">
            <Link
              to={`/interviews`}
              className="py-2 px-4 hover:bg-[#f1f1f1] transition-all w-fit rounded-lg flex items-center gap-2"
            >
              <ArrowLeft size={19} />
            </Link>
            <h1 className="text-lg font-semibold">Interview Details</h1>
          </div>
          {isLoadingInterview ? (
            <p>Loading...</p>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="flex gap-4">
                <div className="flex shadow rounded-md p-4 gap-8 w-fit">
                  <div className="flex gap-4">
                    <div className="border rounded-md p-2 h-fit text-primary">
                      <NotebookPen size={40} />
                    </div>
                    <div className="flex flex-col gap-2">
                      <div className="gap-1 flex">
                        <span className="text-gray-600">Interview ID:</span>
                        {id}
                      </div>
                      <div className="gap-1 flex">
                        <span className="text-gray-600">Position:</span>
                        {interview.position ? interview.position : application.jobTitle}
                      </div>
                      <div className="gap-1 flex">
                        <span className="text-gray-600">Start Date:</span>
                        {interview.startDate}
                      </div>
                      <div className="gap-1 flex">
                        <span className="text-gray-600">Duration:</span>
                        {interview.duration}
                      </div>
                      <div className="gap-1 flex">
                        <span className="text-gray-600">Job Description:</span>
                        <div className="w-96">{interview.jobDescription ? interview.jobDescription : application.description}</div>
                      </div>
                      <div className="gap-1 flex">
                        <span className="text-gray-600">Feedback:</span>
                        <div className="w-96">{interview.feedback}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  {company && (
                    <div className="flex rounded-md p-4 gap-8 shadow w-fit h-fit">
                      <div className="flex gap-4">
                        <div className="border rounded-md w-fit p-2 self-start text-primary">
                          <Building2 size={40} />
                        </div>
                        <div className="flex flex-col gap-2">
                          {company.name && (
                            <div className="gap-1 flex">
                              <span className="text-gray-600">Company:</span>
                              {company.name}
                            </div>
                          )}
                          {company.location && (
                            <div className="gap-1 flex">
                              <span className="text-gray-600">Location:</span>
                              {company.location}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {company.careers_link && (
                          <a
                            className="text-primary hover:text-blue-800 transition-all flex items-center gap-1"
                            href={company.careers_link}
                            target="_blank"
                          >
                            <SquareArrowOutUpRight size={20} />
                          </a>
                        )}
                        {company.linkedin_link && (
                          <a
                            className="text-primary hover:text-blue-800 transition-all flex items-center gap-1"
                            href={company.linkedin_link}
                            target="_blank"
                          >
                            <Linkedin size={20} />
                          </a>
                        )}
                      </div>
                    </div>
                  )}

                  {application && (
                    <div className="flex rounded-md p-4 gap-8 shadow w-fit h-fit">
                      <div className="flex gap-4">
                        <div className="border rounded-md w-fit p-2 self-start text-primary">
                          <FileText size={40} />
                        </div>
                        <div className="flex flex-col gap-2">
                          {application.jobTitle && (
                            <div className="gap-1 flex">
                              <span className="text-gray-600">Job Title:</span>
                              {application.jobTitle}
                            </div>
                          )}
                          {application.jobType && (
                            <div className="gap-1 flex">
                              <span className="text-gray-600">Job Type:</span>
                              {application.jobType.toLowerCase()}
                            </div>
                          )}
                          {application.submissionDate && (
                            <div className="gap-1 flex">
                              <span className="text-gray-600">Submission Date:</span>
                              {application.submissionDate}
                            </div>
                          )}
                          {application.status && (
                            <div className="gap-1 flex">
                              <span className="text-gray-600">Status:</span>
                              {application.status.toLowerCase()}
                            </div>
                          )}
                          {application.stage && (
                            <div className="gap-1 flex">
                              <span className="text-gray-600">Stage:</span>
                              {application.stage.toLowerCase()}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col mt-4">
                <p className="font-semibold text-gray-500">Interview Questions</p>
                <Table
                  table_head={table_head}
                  table_rows={(interview?.interviewQuestions || []).map((q) => ({
                    question: q.question,
                    answer: q.answer,
                  }))}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
