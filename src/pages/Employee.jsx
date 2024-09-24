import { Plus } from "lucide-react";
import Layout from "../components/Layout";
import Table from "../components/Table";
import React from "react";
import EditModal from "../components/employees/EditModal";
import DeleteModal from "../components/employees/DeleteModal";
import ViewModal from "../components/employees/ViewModal";
import axios from "axios";
import { useQuery } from "react-query";
import Pagination from "../components/Pagination";
import AddModal from "../components/employees/AddModal";

export default function Employee() {
  const [openEdit, setOpenEdit] = React.useState(false);
  const [openDelete, setOpenDelete] = React.useState(false);
  const [openView, setOpenView] = React.useState(false);
  const [id, setId] = React.useState(null);
  const [page, setPage] = React.useState(1);
  const [openAdd, setOpenAdd] = React.useState(false);
  const [search, setSearch] = React.useState("");

  const handleOpenEdit = (id) => {
    setOpenEdit(true);
    setId(id);
  };

  const handleOpenDelete = (id) => {
    setOpenDelete(true);
    setId(id);
  };

  const handleOpenView = (id) => {
    setOpenView(true);
    setId(id);
  };

  const fetchEmployees = async () => {
    const { data } = await axios.get(
      `http://127.0.0.1:8000/api/employees?page=${page}&page_size=8&search=${search}`,
      {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      }
    );
    return data;
  };

  const {
    data: employees,
    isLoading,
    refetch,
  } = useQuery(["employees", { search, page }], fetchEmployees);

  const table_head = ["Employee Name", "Job Title", "Company Name"];

  const table_rows = employees?.results?.map(
    ({ id, name, job_title, company }) => {
      return {
        id,
        name,
        job_title,
        company_name: company?.name,
      };
    }
  );

  return (
    <Layout>
      <div className="bg-white rounded-lg h-full flex flex-col p-4 justify-between">
        <div className="flex flex-col">
          <div className="flex items-center justify-between pb-4 border-b-2">
            <h1 className="text-2xl font-bold">Employees</h1>
            <button
              onClick={() => setOpenAdd(true)}
              className="bg-primary hover:bg-primary/85 transition-all text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2"
            >
              <Plus size={18} />
              Add Employee
            </button>
          </div>
          <Table
            isLoading={isLoading}
            search={search}
            setSearch={setSearch}
            table_head={table_head}
            table_rows={table_rows}
            handleOpenDelete={handleOpenDelete}
            handleOpenEdit={handleOpenEdit}
            handleOpenView={handleOpenView}
          />
        </div>

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

        {openEdit && (
          <EditModal
            id={id}
            openEdit={openEdit}
            setOpenEdit={setOpenEdit}
            refetch={refetch}
          />
        )}

        {openView && (
          <ViewModal id={id} openView={openView} setOpenView={setOpenView} />
        )}

        {openDelete && (
          <DeleteModal
            id={id}
            openDelete={openDelete}
            setOpenDelete={setOpenDelete}
            refetch={refetch}
          />
        )}

        {openAdd && (
          <AddModal
            refetch={refetch}
            openAdd={openAdd}
            setOpenAdd={setOpenAdd}
          />
        )}
      </div>
    </Layout>
  );
}
