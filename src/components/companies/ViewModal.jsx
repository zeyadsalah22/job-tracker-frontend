import axios from "axios";
import { useQuery } from "react-query";
import { Link, useParams } from "react-router-dom";
import Layout from "../Layout";
import { MoveLeft } from "lucide-react";
import Table from "../Table";
import React from "react";
import EditModal from "../employees/EditModal";
import DeleteModal from "../employees/DeleteModal";
import Pagination from "../Pagination";

export default function ViewModal() {
  const { id } = useParams();
  const [openEdit, setOpenEdit] = React.useState(false);
  const [openDelete, setOpenDelete] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const [search, setSearch] = React.useState("");
  const [employeeId, setEmployeeId] = React.useState(null);

  const handleOpenEdit = (id) => {
    setOpenEdit(true);
    setEmployeeId(id);
  };

  const handleOpenDelete = (id) => {
    setOpenDelete(true);
    setEmployeeId(id);
  };

  const fetchCompany = async () => {
    const { data } = await axios.get(
      `http://127.0.0.1:8000/api/companies/${id}`,
      {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      }
    );
    return data;
  };

  const {
    data: company,
    isLoading,
    error,
  } = useQuery(["company", { id }], fetchCompany, {
    enabled: !!id,
  });

  const fetchEmployees = async () => {
    const { data } = await axios.get(
      `http://127.0.0.1:8000/api/employees?company__id=${id}&page=${page}&search=${search}`,
      {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      }
    );
    return data;
  };

  const { data: employees, refetch } = useQuery(
    ["employees", { id, search, page }],
    fetchEmployees,
    {
      enabled: !!id,
    }
  );

  const table_head = ["Employee Name", "Job Title"];

  return (
    <Layout>
      <div className="bg-white rounded-lg h-full flex flex-col p-4 justify-between">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 pb-4 border-b-2">
            <Link
              to={`/companies`}
              className="py-2 px-4 bg-[#f7f7f7] hover:bg-[#f1f1f1] transition-all w-fit rounded-lg flex items-center gap-2"
            >
              <MoveLeft /> Back
            </Link>
            <h1 className="text-2xl font-bold">Company Details</h1>
          </div>
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            <div className="flex flex-col gap-2">
              <p className="font-semibold mb-1 text-gray-500">
                company Information
              </p>
              <div className="flex gap-1">
                <p className="font-semibold">Company name: </p>
                <p>
                  {company.name === ""
                    ? "No provided Information."
                    : company.name}
                </p>
              </div>

              <div className="flex gap-1">
                <p className="font-semibold">location: </p>
                <p>
                  {company.location === ""
                    ? "No provided Information."
                    : company.location}
                </p>
              </div>

              <div className="flex gap-1">
                <p className="font-semibold">Careers Link: </p>
                <p>
                  {company.careers_link === "" ? (
                    "No provided Information."
                  ) : (
                    <a
                      className="text-blue-500 underline hover:text-blue-800 transition-all"
                      href={company.careers_link}
                      target="_blank"
                    >
                      {company.careers_link}
                    </a>
                  )}
                </p>
              </div>

              <div className="flex gap-1">
                <p className="font-semibold">Company Linked in: </p>
                <p>
                  {company.linkedin_link === "" ? (
                    "No provided Information."
                  ) : (
                    <a
                      className="text-blue-500 underline hover:text-blue-800 transition-all"
                      href={company.linkedin_link}
                      target="_blank"
                    >
                      {company.linkedin_link}
                    </a>
                  )}
                </p>
              </div>

              <p className="font-semibold mt-4 mb-1 text-gray-500">
                Employees ascoiated with company
              </p>

              <Table
                actions
                isLoading={isLoading}
                search={search}
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

              {console.log(employees)}

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
