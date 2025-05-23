import { useQuery } from "react-query";
import { Link, useParams } from "react-router-dom";
import Layout from "../Layout";
import {
  ArrowLeft,
  Building2,
  MapPin,
  Link as Career,
  Linkedin,
  SquareArrowOutUpRight,
} from "lucide-react";
import Table from "../Table";
import React from "react";
import EditModal from "../employees/EditModal";
import DeleteModal from "../employees/DeleteModal";
import Pagination from "../Pagination";
import { useAxiosPrivate } from "../../utils/axios";

export default function ViewModal() {
  const { id } = useParams();
  const [openEdit, setOpenEdit] = React.useState(false);
  const [openDelete, setOpenDelete] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const [search, setSearch] = React.useState("");
  const [employeeId, setEmployeeId] = React.useState(null);
  const axiosPrivate = useAxiosPrivate();

  const handleOpenEdit = (id) => {
    setOpenEdit(true);
    setEmployeeId(id);
  };

  const handleOpenDelete = (id) => {
    setOpenDelete(true);
    setEmployeeId(id);
  };

  const fetchCompany = async () => {
    try {
      const response = await axiosPrivate.get(`/user-companies/${id}`);
      console.log("Company data:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching company:", error);
      throw error;
    }
  };

  const fetchEmployees = async () => {
    return {
      results: [
        {
          id: 1,
          name: "John Doe",
          job_title: "Senior Software Engineer"
        },
        {
          id: 2,
          name: "Jane Smith",
          job_title: "Technical Recruiter"
        }
      ],
      next: null,
      previous: null,
      total_pages: 1
    };
  };

  const { data: employees, refetch, isLoading: isEmployeesLoading } = useQuery(
    ["employees", { id, search, page }],
    fetchEmployees,
    {
      enabled: !!id,
    }
  );

  const { data: company, isLoading: isCompanyLoading } = useQuery(
    ["company", { id }],
    fetchCompany,
    {
      enabled: !!id,
    }
  );

  const isLoading = isCompanyLoading || isEmployeesLoading;

  const table_head = [
    {
      name: "Name",
      key: "name",
    },
    {
      name: "Job Title",
      key: "job_title",
    },
  ];

  return (
    <Layout>
      <div className="bg-white rounded-lg h-full flex flex-col p-4 justify-between">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 pb-4 border-b-2">
            <Link
              to={`/user-companies`}
              className="py-2 px-4 hover:bg-[#f1f1f1] transition-all w-fit rounded-lg flex items-center gap-2"
            >
              <ArrowLeft size={19} />
            </Link>
            <h1 className="text-lg font-semibold">Company Details</h1>
          </div>
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="flex shadow rounded-md p-4 gap-8 w-fit">
                <div className="flex gap-4">
                  <div className="border rounded-md w-fit p-2 text-primary">
                    <Building2 size={40} />
                  </div>
                  <div className="flex flex-col gap-2">
                    {!company.companyName ? (
                      <div className="gap-1 flex">
                        <span className="text-gray-600">Company:</span>
                        <span className="text-gray-400">Not specified</span>
                      </div>
                    ) : (
                      <div className="gap-1 flex">
                        <span className="text-gray-600">Company:</span>
                        {company.companyName}
                      </div>
                    )}
                    {!company.companyLocation ? (
                      <div className="gap-1 flex">
                        <span className="text-gray-600">Location:</span>
                        <span className="text-gray-400">Not specified</span>
                      </div>
                    ) : (
                      <div className="gap-1 flex">
                        <span className="text-gray-600">Location:</span>
                        {company.companyLocation}
                      </div>
                    )}
                    {!company.description ? (
                      <div className="gap-1 flex">
                        <span className="text-gray-600">Description:</span>
                        <span className="text-gray-400">Not specified</span>
                      </div>
                    ) : (
                      <div className="gap-1 flex">
                        <span className="text-gray-600">Description:</span>
                        {company.description}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <p>
                    {!company.companyCareersLink ? (
                      ""
                    ) : (
                      <a
                        className="text-primary hover:text-blue-800 transition-all flex items-center gap-1"
                        href={company.companyCareersLink}
                        target="_blank"
                        title="Careers Page"
                      >
                        <Career size={20} />
                        <span>Careers</span>
                      </a>
                    )}
                  </p>
                  <p>
                    {!company.companyLinkedinLink ? (
                      ""
                    ) : (
                      <a
                        className="text-primary hover:text-blue-800 transition-all flex items-center gap-1"
                        href={company.companyLinkedinLink}
                        target="_blank"
                        title="LinkedIn Profile"
                      >
                        <Linkedin size={20} />
                        <span>LinkedIn</span>
                      </a>
                    )}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <p className="font-semibold text-gray-500">Employees</p>
                <Table
                  actions
                  isLoading={isEmployeesLoading}
                  search={search}
                  viewSearch
                  setSearch={setSearch}
                  table_head={table_head}
                  table_rows={employees?.results?.map(
                    ({ id, name, job_title }) => {
                      return {
                        id,
                        name,
                        job_title,
                      };
                    }
                  )}
                  handleOpenDelete={handleOpenDelete}
                  handleOpenEdit={handleOpenEdit}
                  handleOpenView={"employees"}
                />
                {employees?.results?.length !== 0 && (
                  <div className="self-center">
                    <Pagination
                      nextPage={employees?.next}
                      prevPage={employees?.previous}
                      page={page}
                      setPage={setPage}
                      totalPages={employees?.total_pages}
                    />
                  </div>
                )}
              </div>

              {openEdit && (
                <EditModal
                  id={employeeId}
                  openEdit={openEdit}
                  setOpenEdit={setOpenEdit}
                  refetch={refetch}
                />
              )}

              {openDelete && (
                <DeleteModal
                  id={employeeId}
                  openDelete={openDelete}
                  setOpenDelete={setOpenDelete}
                  refetch={refetch}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
