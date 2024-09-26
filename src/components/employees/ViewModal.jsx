import axios from "axios";
import Modal from "../Modal";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import Layout from "../Layout";
import { Link } from "react-router-dom";
import { MoveLeft } from "lucide-react";

export default function ViewModal() {
  const { id } = useParams();

  const fetchEmployee = async () => {
    const { data } = await axios.get(
      `http://127.0.0.1:8000/api/employees/${id}`,
      {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      }
    );
    return data;
  };

  const {
    data: employee,
    isLoading,
    error,
  } = useQuery(["employee", { id }], fetchEmployee, {
    enabled: !!id,
  });

  const contacted = [
    {
      name: "Sent",
      value: "SENT",
    },
    {
      name: "Accepted",
      value: "ACCEPTED",
    },
    {
      name: "Messaged",
      value: "MESSAGED",
    },
    {
      name: "Replied",
      value: "REPLIED",
    },
    {
      name: "Established Connection",
      value: "STRONG_CONNECTION",
    },
  ];

  return (
    <Layout>
      <div className="bg-white rounded-lg h-full flex flex-col p-4 justify-between">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 pb-4 border-b-2">
            <Link
              to={`/employees`}
              className="py-2 px-4 bg-[#f7f7f7] hover:bg-[#f1f1f1] transition-all w-fit rounded-lg flex items-center gap-2"
            >
              <MoveLeft /> Back
            </Link>
            <h1 className="text-2xl font-bold">Employee Details</h1>
          </div>
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            <div className="flex flex-col gap-2">
              <p className="font-semibold mb-1 text-gray-500">
                Personal Information
              </p>
              <div className="flex gap-1">
                <p className="font-semibold">Employee Name: </p>
                <p>
                  {employee.name === ""
                    ? "No provided Information."
                    : employee.name}
                </p>
              </div>

              <div className="flex gap-1">
                <p className="font-semibold">email: </p>
                <p>
                  {employee.email === ""
                    ? "No provided Information."
                    : employee.email}
                </p>
              </div>

              <div className="flex gap-1">
                <p className="font-semibold">Linked in: </p>
                <p>
                  {employee.linkedin_link === ""
                    ? "No provided Information."
                    : employee.linkedin_link}
                </p>
              </div>

              <div className="flex gap-1">
                <p className="font-semibold">Job title: </p>
                <p>{employee.job_title}</p>
              </div>

              <div className="flex gap-1">
                <p className="font-semibold">Contacted status: </p>
                <p>
                  {employee.contacted === ""
                    ? "No provided Information."
                    : contacted.find((c) => c.value === employee.contacted)
                        .name}
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <p className="font-semibold mt-4 mb-1 text-gray-500">
                  Company Details
                </p>

                <div className="flex gap-1">
                  <p className="font-semibold">Company name: </p>
                  <p>
                    {employee.company.name === ""
                      ? "No provided Information."
                      : employee.company.name}
                  </p>
                </div>

                <div className="flex gap-1">
                  <p className="font-semibold">location: </p>
                  <p>
                    {employee.company.location === ""
                      ? "No provided Information."
                      : employee.company.location}
                  </p>
                </div>

                <div className="flex gap-1">
                  <p className="font-semibold">Careers Link: </p>
                  <p>
                    {employee.company.careers_link === "" ? (
                      "No provided Information."
                    ) : (
                      <a
                        className="text-blue-500 underline hover:text-blue-800 transition-all"
                        href={employee.company.careers_link}
                        target="_blank"
                      >
                        {employee.company.careers_link}
                      </a>
                    )}
                  </p>
                </div>

                <div className="flex gap-1">
                  <p className="font-semibold">Company Linked in: </p>
                  <p>
                    {employee.company.linkedin_link === "" ? (
                      "No provided Information."
                    ) : (
                      <a
                        className="text-blue-500 underline hover:text-blue-800 transition-all"
                        href={employee.company.linkedin_link}
                        target="_blank"
                      >
                        {employee.company.linkedin_link}
                      </a>
                    )}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
