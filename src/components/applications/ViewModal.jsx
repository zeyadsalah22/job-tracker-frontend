import axios from "axios";
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
} from "lucide-react";
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
              className="py-2 px-4 hover:bg-[#f1f1f1] transition-all w-fit rounded-lg flex items-center gap-2 text-sm"
            >
              <ArrowLeft size={19} />
            </Link>
            <h1 className="text-lg font-semibold">Application Details</h1>
          </div>
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            <div>
              <div className="flex flex-col gap-9">
                <div className="flex border rounded-md w-[500px] p-4 bg-[#fcfcfd] mt-4">
                  <div className="flex items-center justify-center gap-5">
                    <div className="border rounded-md w-fit p-2 self-start text-primary">
                      <NotebookPen size={40} />
                    </div>

                    <div className="flex flex-col gap-2">
                      <p className="flex items-center gap-1">
                        {application.job_title === "" ? (
                          "No provided Information."
                        ) : (
                          <>
                            <UserRound size={16} />
                            {application.job_title}
                          </>
                        )}
                      </p>

                      <p className="flex items-center gap-1">
                        {application.job_type === "" ? (
                          "No provided Information."
                        ) : (
                          <>
                            <Clock8 size={16} />
                            {application.job_type}
                          </>
                        )}
                      </p>

                      <div className="flex items-center gap-2">
                        <p>Stage:</p>
                        <p>
                          {application.stage === ""
                            ? "No provided Information."
                            : application.stage.toLowerCase()}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <p>Status:</p>
                        <p>
                          {application.status === ""
                            ? "No provided Information."
                            : application.status.toLowerCase()}
                        </p>
                      </div>

                      <p className="flex items-center gap-1">
                        {application.submission_date === "" ? (
                          "No provided Information."
                        ) : (
                          <>
                            <CalendarCheck size={16} />
                            {application.submission_date}
                          </>
                        )}
                      </p>

                      <div className="flex items-center gap-2">
                        <p>ATS Score:</p>
                        <p>
                          {application.ats_score === ""
                            ? "No provided Information."
                            : application.ats_score}
                        </p>
                      </div>
                      <div className="flex gap-3">
                        <p>Description:</p>
                        <p className="border p-4 rounded-md bg-white ">
                          {application.description === ""
                            ? "No provided Information."
                            : application.description}
                        </p>
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
                            <Career size={16} />
                            {"Application Link"}
                          </a>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex border rounded-md w-[300px] p-4 bg-[#fcfcfd] mt-4">
                <div className="flex items-center justify-center gap-5">
                  <div className="border rounded-md w-fit p-2 self-start text-primary">
                    <Building2 size={32} />
                  </div>
                  <div className="flex flex-col gap-2">
                    <p>
                      {application.company.name === ""
                        ? "No provided Information."
                        : application.company.name}
                    </p>
                    <p className="flex items-center gap-2">
                      {application.company.location === "" ? (
                        "No provided Information."
                      ) : (
                        <>
                          <MapPin size={16} />
                          {application.company.location}
                        </>
                      )}
                    </p>
                    <p>
                      {application.company.careers_link === "" ? (
                        "No provided Information."
                      ) : (
                        <a
                          className="text-primary hover:text-blue-800 transition-all flex items-center gap-1"
                          href={application.company.careers_link}
                          target="_blank"
                        >
                          <Career size={16} />
                          {"Career Link"}
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
                          <Linkedin size={16} />
                          {"LinkedIn link"}
                        </a>
                      )}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2">
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
