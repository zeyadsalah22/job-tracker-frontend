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
            <div className="flex flex-col gap-2">
              <div className="flex border rounded-md w-[350px] p-4 bg-[#fcfcfd] mt-4">
                <div className="flex items-center justify-center gap-5">
                  <div className="border rounded-md w-fit p-2 self-start text-primary">
                    <User size={32} />
                  </div>
                  <div className="flex flex-col gap-2">
                    <p className="flex items-center">
                      {employee.name === ""
                        ? "No provided Information."
                        : employee.name}
                    </p>
                    <p>
                      {employee.email === "" ? (
                        "No provided Information."
                      ) : (
                        <a
                          className="text-primary hover:text-blue-800 transition-all flex items-center gap-1"
                          href={employee.email}
                          target="_blank"
                        >
                          <MailPlus size={16} />
                          {employee.name}
                        </a>
                      )}
                    </p>
                    <p>
                      {employee.linkedin_link === "" ? (
                        "No provided Information."
                      ) : (
                        <a
                          className="text-primary hover:text-blue-800 transition-all flex items-center gap-1"
                          href={employee.linkedin_link}
                          target="_blank"
                        >
                          <Linkedin size={16} />
                          {"LinkedIn link"}
                        </a>
                      )}
                    </p>
                    <p className="flex items-center gap-1">
                      {employee.job_title === "" ? (
                        "No provided Information."
                      ) : (
                        <>
                          <UserRound size={16} />
                          {employee.job_title}
                        </>
                      )}
                    </p>

                    <p className="flex items-center gap-1">
                      {employee.contacted === "" ? (
                        "No provided Information."
                      ) : (
                        <>
                          <Mails size={16} />
                          {
                            contacted.find(
                              (c) => c.value === employee.contacted
                            ).name
                          }
                        </>
                      )}
                    </p>
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
                      {employee.company.name === ""
                        ? "No provided Information."
                        : employee.company.name}
                    </p>
                    <p className="flex items-center gap-2">
                      {employee.company.location === "" ? (
                        "No provided Information."
                      ) : (
                        <>
                          <MapPin size={16} />
                          {employee.company.location}
                        </>
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
                          <Career size={16} />
                          {"Career Link"}
                        </a>
                      )}
                    </p>
                    <p>
                      {employee.company.linkedin_link === "" ? (
                        "No provided Information."
                      ) : (
                        <a
                          className="text-primary hover:text-blue-800 transition-all flex items-center gap-1"
                          href={employee.company.linkedin_link}
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
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
