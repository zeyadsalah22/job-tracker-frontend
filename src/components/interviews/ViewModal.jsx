import { useQuery } from "react-query";
import { Link, useParams } from "react-router-dom";
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
    return {
      id: 1,
      startDate: "2024-03-15 10:00",
      duration: "45 minutes",
      company: {
        name: "TechCorp",
        location: "San Francisco, CA",
        careers_link: "https://careers.techcorp.com",
        linkedin_link: "https://linkedin.com/company/techcorp"
      },
      position: "Software Engineer",
      jobDescription: "Looking for a skilled software engineer with experience in React and Node.js. The candidate should have strong problem-solving skills and experience with modern web development practices.",
      feedback: "The candidate demonstrated good technical knowledge but could improve on system design questions. Communication skills were excellent.",
      application: {
        id: 1,
        job_title: "Software Engineer",
        job_type: "Full-time",
        submission_date: "2024-03-10",
        status: "PENDING",
        stage: "Technical Interview"
      },
      questions: [
        {
          id: 1,
          question: "Tell me about yourself",
          answer: "I am a software engineer with experience in React and Node.js...",
        },
        {
          id: 2,
          question: "What are your strengths?",
          answer: "I am a quick learner and have strong problem-solving skills...",
        },
      ],
    };
  };

  const { data: interview, isLoading } = useQuery(
    ["interview", { id }],
    fetchInterview,
    {
      enabled: !!id,
    }
  );

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
          {isLoading ? (
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
                        {interview.id}
                      </div>
                      <div className="gap-1 flex">
                        <span className="text-gray-600">Position:</span>
                        {interview.position}
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
                        <div className="w-96">{interview.jobDescription}</div>
                      </div>
                      <div className="gap-1 flex">
                        <span className="text-gray-600">Feedback:</span>
                        <div className="w-96">{interview.feedback}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <div className="flex rounded-md p-4 gap-8 shadow w-fit h-fit">
                    <div className="flex gap-4">
                      <div className="border rounded-md w-fit p-2 self-start text-primary">
                        <Building2 size={40} />
                      </div>
                      <div className="flex flex-col gap-2">
                        {interview.company.name === "" ? (
                          "No provided Information."
                        ) : (
                          <div className="gap-1 flex">
                            <span className="text-gray-600">Company:</span>
                            {interview.company.name}
                          </div>
                        )}
                        {interview.company.location === "" ? (
                          "No provided Information."
                        ) : (
                          <div className="gap-1 flex">
                            <span className="text-gray-600">Location:</span>
                            {interview.company.location}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <p>
                        {interview.company.careers_link === "" ? (
                          "No provided Information."
                        ) : (
                          <a
                            className="text-primary hover:text-blue-800 transition-all flex items-center gap-1"
                            href={interview.company.careers_link}
                            target="_blank"
                          >
                            <SquareArrowOutUpRight size={20} />
                          </a>
                        )}
                      </p>
                      <p>
                        {interview.company.linkedin_link === "" ? (
                          "No provided Information."
                        ) : (
                          <a
                            className="text-primary hover:text-blue-800 transition-all flex items-center gap-1"
                            href={interview.company.linkedin_link}
                            target="_blank"
                          >
                            <Linkedin size={20} />
                          </a>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex rounded-md p-4 gap-8 shadow w-fit h-fit">
                    <div className="flex gap-4">
                      <div className="border rounded-md w-fit p-2 self-start text-primary">
                        <FileText size={40} />
                      </div>
                      <div className="flex flex-col gap-2">
                        {interview.application.job_title === "" ? (
                          "No provided Information."
                        ) : (
                          <div className="gap-1 flex">
                            <span className="text-gray-600">Job Title:</span>
                            {interview.application.job_title}
                          </div>
                        )}
                        {interview.application.job_type === "" ? (
                          "No provided Information."
                        ) : (
                          <div className="gap-1 flex">
                            <span className="text-gray-600">Job Type:</span>
                            {interview.application.job_type.toLowerCase()}
                          </div>
                        )}
                        {interview.application.submission_date === "" ? (
                          "No provided Information."
                        ) : (
                          <div className="gap-1 flex">
                            <span className="text-gray-600">Submission Date:</span>
                            {interview.application.submission_date}
                          </div>
                        )}
                        {interview.application.status === "" ? (
                          "No provided Information."
                        ) : (
                          <div className="gap-1 flex">
                            <span className="text-gray-600">Status:</span>
                            {interview.application.status.toLowerCase()}
                          </div>
                        )}
                        {interview.application.stage === "" ? (
                          "No provided Information."
                        ) : (
                          <div className="gap-1 flex">
                            <span className="text-gray-600">Stage:</span>
                            {interview.application.stage.toLowerCase()}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col mt-4">
                <p className="font-semibold text-gray-500">Interview Questions</p>
                <Table
                  table_head={table_head}
                  table_rows={interview.questions.map((q) => ({
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