import axios from "axios";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import Layout from "../Layout";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Building2,
  MapPin,
  Link as Career,
  Linkedin,
  User,
  MailPlus,
  Mails,
  UserRound,
} from "lucide-react";

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
              className="py-2 px-4 hover:bg-[#f1f1f1] transition-all w-fit rounded-lg flex items-center gap-2"
            >
              <ArrowLeft size={19} />
            </Link>
            <h1 className="text-lg font-semibold">Employee Details</h1>
          </div>
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            <div className="flex gap-4">
              <div className="flex shadow rounded-md p-4 gap-8 w-fit">
                <div className="flex gap-4">
                  <div className="border rounded-md w-fit p-2 self-start text-primary">
                    <User size={32} />
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="gap-1 flex">
                      <span className="text-gray-600">Name:</span>
                      {employee.name}
                    </div>

                    <div className="flex items-center gap-1">
                      <div className="gap-1 flex">
                        <span className="text-gray-600">Email:</span>
                        {employee.email === ""
                          ? "No provided Information."
                          : employee.email}
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <div className="gap-1 flex">
                        <span className="text-gray-600">Linked in:</span>
                        {employee.linkedin_link === ""
                          ? "No provided Information."
                          : employee.linkedin_link}
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      {employee.job_title === "" ? (
                        "No provided Information."
                      ) : (
                        <div className="gap-1 flex">
                          <span className="text-gray-600">Job Title:</span>
                          {employee.job_title}
                        </div>
                      )}
                    </div>

                    <p className="flex items-center gap-1">
                      {employee.contacted === "" ? (
                        "No provided Information."
                      ) : (
                        <div className="gap-1 flex">
                          <span className="text-gray-600">Contacted:</span>
                          {
                            contacted.find(
                              (contact) => contact.value === employee.contacted
                            ).name
                          }
                        </div>
                      )}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex shadow rounded-md p-4 gap-8 w-fit h-fit">
                <div className="flex gap-4">
                  <div className="border rounded-md w-fit p-2 self-start text-primary">
                    <Building2 size={32} />
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="gap-1 flex">
                      <span className="text-gray-600">Company:</span>
                      {employee.company.name}
                    </div>

                    <div className="gap-1 flex">
                      <span className="text-gray-600">Location:</span>
                      {employee.company.location}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <p>
                    {employee.company.linkedin_link === "" ? (
                      "No provided Information."
                    ) : (
                      <a
                        className="text-primary hover:text-blue-800 transition-all flex items-center gap-1"
                        href={employee.company.linkedin_link}
                        target="_blank"
                      >
                        <Linkedin size={20} />
                      </a>
                    )}
                  </p>
                  <p>
                    {employee.company.careers_link === "" ? (
                      "No provided Information."
                    ) : (
                      <a
                        className="text-primary hover:text-blue-800 transition-all flex items-center gap-1"
                        href={employee.company.careers_link}
                        target="_blank"
                      >
                        <Career size={20} />
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
