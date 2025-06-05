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
    try {
      const response = await axiosPrivate.get(`/applications/${id}`);
      console.log("Application data:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching application:", error);
      throw error;
    }
  };

  const { data: application, isLoading } = useQuery(
    ["application", id],
    fetchApplication,
    {
      enabled: !!id,
    }
  );

  const fetchQuestions = async () => {
    if (!id) return { items: [] };
    
    try {
      const params = { ApplicationId: id };
      const response = await axiosPrivate.get('/questions', { params });
      console.log("Questions data:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching questions:", error);
      return { items: [] };
    }
  };

  const { data: questions, isLoading: questionsLoading } = useQuery(
    ["questions", id],
    fetchQuestions,
    {
      enabled: !!id,
    }
  );

  const fetchEmployees = async () => {
    if (!application?.companyId) return { items: [] };
    
    try {
      const params = { CompanyId: application.companyId };
      const response = await axiosPrivate.get('/employees', { params });
      console.log("Employees data:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching employees:", error);
      return { items: [] };
    }
  };

  const { data: employees, isLoading: employeesLoading } = useQuery(
    ["employees", application?.companyId],
    fetchEmployees,
    {
      enabled: !!application?.companyId,
    }
  );

  // Filter employees if contactedEmployees array exists
  const contactedEmployeesList = employees?.items?.filter(
    (employee) => application?.contactedEmployees?.some(
      (contactedEmp) => contactedEmp.employeeId === employee.employeeId
    )
  ) || [];

  const questions_table_head = [
    {
      name: "Question",
      key: "question",
    },
    {
      name: "Answer",
      key: "answer",
    },
  ];

  const table_head = [
    {
      name: "Name",
      key: "name",
    },
    {
      name: "Linkedin Link",
      key: "linkedinLink",
    },
    {
      name: "Email",
      key: "email",
    },
    {
      name: "Job Title",
      key: "jobTitle",
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
                      {!application?.jobTitle ? (
                        "No provided Information."
                      ) : (
                        <div className="gap-1 flex">
                          <span className="text-gray-600">Job title:</span>
                          {application.jobTitle}
                        </div>
                      )}

                      {!application?.jobType ? (
                        "No provided Information."
                      ) : (
                        <div className="gap-1 flex">
                          <span className="text-gray-600">Job type:</span>
                          {application.jobType}
                        </div>
                      )}

                      {!application?.stage ? (
                        "No provided Information."
                      ) : (
                        <div className="gap-1 flex">
                          <span className="text-gray-600">Stage:</span>
                          {application.stage}
                        </div>
                      )}

                      {!application?.status ? (
                        "No provided Information."
                      ) : (
                        <div className="gap-1 flex">
                          <span className="text-gray-600">Status:</span>
                          {application.status}
                        </div>
                      )}

                      {!application?.submissionDate ? (
                        "No provided Information."
                      ) : (
                        <div className="gap-1 flex">
                          <span className="text-gray-600">
                            Submission date:
                          </span>
                          {application.submissionDate}
                        </div>
                      )}

                      {application?.atsScore === undefined ? (
                        "No provided Information."
                      ) : (
                        <div className="gap-1 flex">
                          <span className="text-gray-600">ATS score:</span>
                          {application.atsScore}
                        </div>
                      )}

                      {!application?.description ? (
                        "No provided Information."
                      ) : (
                        <div className="gap-1 flex">
                          <span className="text-gray-600">Description:</span>
                          <div className="w-96">{application.description}</div>
                        </div>
                      )}
                      <div className="flex gap-1">
                        {!application?.submittedCvId ? (
                          "No provided Information."
                        ) : (
                          <div className="flex gap-1">
                            <span className="text-gray-600">Submitted CV ID:</span>
                            <span>{application.submittedCvId}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <p>
                    {!application?.link ? (
                      "No provided Information."
                    ) : (
                      <a
                        className="text-primary hover:text-blue-800 transition-all flex items-center gap-1"
                        href={application.link}
                        target="_blank"
                        rel="noopener noreferrer"
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
                      {!application?.company?.name ? (
                        "No provided Information."
                      ) : (
                        <div className="gap-1 flex">
                          <span className="text-gray-600">Company:</span>
                          {application.company.name}
                        </div>
                      )}
                      {!application?.company?.location ? (
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
                      {!application?.company?.careersLink ? (
                        "No provided Information."
                      ) : (
                        <a
                          className="text-primary hover:text-blue-800 transition-all flex items-center gap-1"
                          href={application.company.careersLink}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <SquareArrowOutUpRight size={20} />
                        </a>
                      )}
                    </p>
                    <p>
                      {!application?.company?.linkedinLink ? (
                        "No provided Information."
                      ) : (
                        <a
                          className="text-primary hover:text-blue-800 transition-all flex items-center gap-1"
                          href={application.company.linkedinLink}
                          target="_blank"
                          rel="noopener noreferrer"
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
                  Related Questions
                </p>
                {questionsLoading ? (
                  <p>Loading...</p>
                ) : questions?.items?.length === 0 ? (
                  <p>No questions found for this application</p>
                ) : (
                  <Table
                    table_head={questions_table_head}
                    table_rows={questions?.items?.map((question) => ({
                      question: question.question1 || question.question || "No provided Information.",
                      answer: question.answer || "No provided Information.",
                    })) || []}
                  />
                )}
              </div>

              <div className="flex flex-col mt-4">
                <p className="font-semibold text-gray-500">
                  Contacted Employees
                </p>
                {employeesLoading ? (
                  <p>Loading...</p>
                ) : contactedEmployeesList.length === 0 ? (
                  <p>No contacted employees found</p>
                ) : (
                  <Table
                    table_head={table_head}
                    table_rows={contactedEmployeesList.map((employee) => ({
                      name: employee.name || "No provided Information.",
                      linkedinLink: employee.linkedinLink || "No provided Information.",
                      email: employee.email || "No provided Information.",
                      jobTitle: employee.jobTitle || "No provided Information.",
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
