import { useQuery } from "react-query";
import { Link, useParams } from "react-router-dom";
import Layout from "../Layout";
import {
  ArrowLeft,
  Linkedin,
  Link as Career,
  MapPin,
  Building2,
  NotebookPen,
  UserRound,
  Clock8,
  CalendarCheck,
  ExternalLink,
  SquareArrowOutUpRight,
} from "lucide-react";
import Table from "../Table";
import { useAxiosPrivate } from "../../utils/axios";

export default function ViewModal() {
  const { id } = useParams();
  const axiosPrivate = useAxiosPrivate();

  const fetchApplication = async () => {
    return {
      id: 1,
      job_title: "Software Engineer",
      job_type: "Full-time",
      stage: "Technical Interview",
      status: "PENDING",
      submission_date: "2024-03-15",
      ats_score: "85",
      description: "Looking for a skilled software engineer with experience in React and Node.js",
      submitted_cv: { cv: "https://example.com/cv.pdf" },
      link: "https://careers.google.com/jobs/123",
      company: {
        name: "Google",
        location: "Mountain View, CA",
        careers_link: "https://careers.google.com",
        linkedin_link: "https://linkedin.com/company/google"
      },
      contacted_employees: [1, 2]
    };
  };

  const { data: application, isLoading } = useQuery(
    ["application", { id }],
    fetchApplication,
    {
      enabled: !!id,
    }
  );

  const fetchEmployees = async () => {
    return {
      results: [
        {
          id: 1,
          name: "John Doe",
          linkedin_link: "https://linkedin.com/in/johndoe",
          email: "john.doe@google.com",
          job_title: "Senior Software Engineer"
        },
        {
          id: 2,
          name: "Jane Smith",
          linkedin_link: "https://linkedin.com/in/janesmith",
          email: "jane.smith@google.com",
          job_title: "Technical Recruiter"
        }
      ]
    };
  };

  const { data: employees, isLoading: employeesLoading } = useQuery(
    ["employees"],
    fetchEmployees
  );

  const employeesWithGivenIds = employees?.results?.filter((employee) =>
    application?.contacted_employees?.includes(employee.id)
  );

  const table_head = [
    {
      name: "Name",
      key: "name",
    },
    {
      name: "Linkedin Link",
      key: "linkedin_link",
    },
    {
      name: "Email",
      key: "email",
    },
    {
      name: "Job Title",
      key: "job_title",
    },
  ];

  return (
    <Layout>
      <div className="bg-white rounded-lg h-full flex flex-col p-4 justify-between">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 pb-4 border-b-2">
            <Link
              to={`/applications`}
              className="py-2 px-4 hover:bg-[#f1f1f1] transition-all w-fit rounded-lg flex items-center gap-2 text-sm"
            >
              <ArrowLeft size={19} />
            </Link>
            <h1 className="text-lg font-semibold">Application Details</h1>
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
                      {application.job_title === "" ? (
                        "No provided Information."
                      ) : (
                        <div className="gap-1 flex">
                          <span className="text-gray-600">Job title:</span>
                          {application.job_title}
                        </div>
                      )}

                      {application.job_type === "" ? (
                        "No provided Information."
                      ) : (
                        <div className="gap-1 flex">
                          <span className="text-gray-600">Job type:</span>
                          {application.job_type.toLowerCase()}
                        </div>
                      )}

                      {application.stage === "" ? (
                        "No provided Information."
                      ) : (
                        <div className="gap-1 flex">
                          <span className="text-gray-600">Stage:</span>
                          {application.stage.toLowerCase()}
                        </div>
                      )}

                      {application.status === "" ? (
                        "No provided Information."
                      ) : (
                        <div className="gap-1 flex">
                          <span className="text-gray-600">Status:</span>
                          {application.status.toLowerCase()}
                        </div>
                      )}

                      {application.submission_date === "" ? (
                        "No provided Information."
                      ) : (
                        <div className="gap-1 flex">
                          <span className="text-gray-600">
                            Submission date:
                          </span>
                          {application.submission_date}
                        </div>
                      )}

                      {application.ats_score === "" ? (
                        "No provided Information."
                      ) : (
                        <div className="gap-1 flex">
                          <span className="text-gray-600">ATS score:</span>
                          {application.ats_score}
                        </div>
                      )}

                      {application.description === "" ? (
                        "No provided Information."
                      ) : (
                        <div className="gap-1 flex">
                          <span className="text-gray-600">Description:</span>
                          <div className="w-96">{application.description}</div>
                        </div>
                      )}
                      <div className="flex gap-1">
                        {application.submitted_cv === "" ? (
                          "No provided Information."
                        ) : (
                          <div className="flex gap-1">
                            <span className="text-gray-600">Submitted cv:</span>

                            <a
                              className="text-primary hover:text-blue-800 transition-all flex items-center gap-1"
                              href={application.submitted_cv.cv}
                              target="_blank"
                            >
                              {application.submitted_cv.cv.split("/").pop()}
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <p>
                    {application.link === "" ? (
                      "No provided Information."
                    ) : (
                      <a
                        className="text-primary hover:text-blue-800 transition-all flex items-center gap-1"
                        href={application.link}
                        target="_blank"
                      >
                        <SquareArrowOutUpRight size={20} />
                      </a>
                    )}
                  </p>
                </div>

                <div className="flex rounded-md p-4 gap-8 shadow w-fit h-fit">
                  <div className="flex gap-4">
                    <div className="border rounded-md w-fit p-2 self-start text-primary">
                      <Building2 size={40} />
                    </div>
                    <div className="flex flex-col gap-2">
                      {application.company.name === "" ? (
                        "No provided Information."
                      ) : (
                        <div className="gap-1 flex">
                          <span className="text-gray-600">Company:</span>
                          {application.company.name}
                        </div>
                      )}
                      {application.company.location === "" ? (
                        "No provided Information."
                      ) : (
                        <div className="gap-1 flex">
                          <span className="text-gray-600">Location:</span>
                          {application.company.location}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <p>
                      {application.company.careers_link === "" ? (
                        "No provided Information."
                      ) : (
                        <a
                          className="text-primary hover:text-blue-800 transition-all flex items-center gap-1"
                          href={application.company.careers_link}
                          target="_blank"
                        >
                          <SquareArrowOutUpRight size={20} />
                        </a>
                      )}
                    </p>
                    <p>
                      {application.company.linkedin_link === "" ? (
                        "No provided Information."
                      ) : (
                        <a
                          className="text-primary hover:text-blue-800 transition-all flex items-center gap-1"
                          href={application.company.linkedin_link}
                          target="_blank"
                        >
                          <Linkedin size={20} />
                        </a>
                      )}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col mt-4">
                <p className="font-semibold text-gray-500">
                  Contacted Employees
                </p>
                {employeesLoading ? (
                  <p>Loading...</p>
                ) : (
                  <Table
                    table_head={table_head}
                    table_rows={employeesWithGivenIds?.map((employee) => ({
                      name: employee.name,
                      linkedin_link: employee.linkedin_link
                        ? employee.linkedin_link
                        : "No provided Information.",
                      email: employee.email
                        ? employee.email
                        : "No provided Information.",
                      job_title: employee.job_title,
                    }))}
                  />
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
