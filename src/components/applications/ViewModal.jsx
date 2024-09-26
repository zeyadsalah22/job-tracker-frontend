import axios from "axios";
import { useQuery } from "react-query";
import { Link, useParams } from "react-router-dom";
import Layout from "../Layout";
import { MoveLeft } from "lucide-react";
import Table from "../Table";

export default function ViewModal() {
  const { id } = useParams();

  const fetchApplication = async () => {
    const { data } = await axios.get(
      `http://127.0.0.1:8000/api/applications/${id}`,
      {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      }
    );
    return data;
  };

  const { data: application, isLoading } = useQuery(
    ["application", { id }],
    fetchApplication,
    {
      enabled: !!id,
    }
  );

  const fetchEmployees = async () => {
    const { data } = await axios.get(`http://127.0.0.1:8000/api/employees`, {
      headers: {
        Authorization: `Token ${localStorage.getItem("token")}`,
      },
    });
    return data;
  };

  const { data: employees, isLoading: employeesLoading } = useQuery(
    ["employees"],
    fetchEmployees
  );

  const employeesWithGivenIds = employees?.results?.filter((employee) =>
    application?.contacted_employees?.includes(employee.id)
  );

  return (
    <Layout>
      <div className="bg-white rounded-lg h-full flex flex-col p-4 justify-between">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 pb-4 border-b-2">
            <Link
              to={`/applications`}
              className="py-2 px-4 bg-[#f7f7f7] hover:bg-[#f1f1f1] transition-all w-fit rounded-lg flex items-center gap-2"
            >
              <MoveLeft /> Back
            </Link>
            <h1 className="text-2xl font-bold">Application Details</h1>
          </div>
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            <div>
              <div className="flex flex-col gap-2">
                <p className="font-semibold mb-1 text-gray-500">
                  Application Information
                </p>

                <div className="flex gap-1">
                  <p className="font-semibold">Description: </p>
                  <p>
                    {application.description === ""
                      ? "No provided Information."
                      : application.description}
                  </p>
                </div>

                <div className="flex gap-1">
                  <p className="font-semibold">Job title: </p>
                  <p>
                    {application.job_title === ""
                      ? "No provided Information."
                      : application.job_title}
                  </p>
                </div>

                <div className="flex gap-1">
                  <p className="font-semibold">Job type: </p>
                  <p>
                    {application.job_type === ""
                      ? "No provided Information."
                      : application.job_type}
                  </p>
                </div>

                <div className="flex gap-1">
                  <p className="font-semibold">Job link: </p>
                  <p>
                    {application.link === "" ? (
                      "No provided Information."
                    ) : (
                      <a
                        className="text-blue-500 underline hover:text-blue-800 transition-all"
                        href={application.link}
                        target="_blank"
                      >
                        {application.link}
                      </a>
                    )}
                  </p>
                </div>

                <div className="flex gap-1">
                  <p className="font-semibold">Curernt Stage: </p>
                  <p>
                    {application.stage === ""
                      ? "No provided Information."
                      : application.stage}
                  </p>
                </div>

                <div className="flex gap-1">
                  <p className="font-semibold">Curernt Status: </p>
                  <p>
                    {application.status === ""
                      ? "No provided Information."
                      : application.status}
                  </p>
                </div>

                <div className="flex gap-1">
                  <p className="font-semibold">Application submission date: </p>
                  <p>
                    {application.submission_date === ""
                      ? "No provided Information."
                      : application.submission_date}
                  </p>
                </div>

                <div className="flex gap-1">
                  <p className="font-semibold">ATS score: </p>
                  <p>
                    {application.ats_score === ""
                      ? "No provided Information."
                      : application.ats_score}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <p className="font-semibold mt-4 mb-1 text-gray-500">
                  Company associated with the Application
                </p>
                <div className="flex gap-1">
                  <p className="font-semibold">Company name: </p>
                  <p>
                    {application.company.name === ""
                      ? "No provided Information."
                      : application.company.name}
                  </p>
                </div>

                <div className="flex gap-1">
                  <p className="font-semibold">location: </p>
                  <p>
                    {application.company.location === ""
                      ? "No provided Information."
                      : application.company.location}
                  </p>
                </div>

                <div className="flex gap-1">
                  <p className="font-semibold">Careers Link: </p>
                  <p>
                    {application.company.careers_link === "" ? (
                      "No provided Information."
                    ) : (
                      <a
                        className="text-blue-500 underline hover:text-blue-800 transition-all"
                        href={application.company.careers_link}
                        target="_blank"
                      >
                        {application.company.careers_link}
                      </a>
                    )}
                  </p>
                </div>

                <div className="flex gap-1">
                  <p className="font-semibold">Company Linked in: </p>
                  <p>
                    {application.company.linkedin_link === "" ? (
                      "No provided Information."
                    ) : (
                      <a
                        className="text-blue-500 underline hover:text-blue-800 transition-all"
                        href={application.company.linkedin_link}
                        target="_blank"
                      >
                        {application.company.linkedin_link}
                      </a>
                    )}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <p className="font-semibold mt-4 mb-1 text-gray-500">
                  Other contacted employees
                </p>

                {employeesLoading ? (
                  <p>Loading...</p>
                ) : (
                  <Table
                    table_head={["Name", "Linkedin Link", "Email", "Job Title"]}
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
