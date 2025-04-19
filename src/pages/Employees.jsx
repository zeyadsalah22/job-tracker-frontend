import { Plus } from "lucide-react";
import Layout from "../components/Layout";
import Table from "../components/Table";
import React from "react";
import EditModal from "../components/employees/EditModal";
import DeleteModal from "../components/employees/DeleteModal";
import { useQuery } from "react-query";
import Pagination from "../components/Pagination";
import AddModal from "../components/employees/AddModal";
import { useAxiosPrivate } from "../utils/axios";

export default function Employees() {
  const [openEdit, setOpenEdit] = React.useState(false);
  const [openDelete, setOpenDelete] = React.useState(false);
  const [id, setId] = React.useState(null);
  const [page, setPage] = React.useState(1);
  const [openAdd, setOpenAdd] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [order, setOrder] = React.useState("");
  const axiosPrivate = useAxiosPrivate();

  const handleOpenEdit = (id) => {
    setOpenEdit(true);
    setId(id);
  };

  const handleOpenDelete = (id) => {
    setOpenDelete(true);
    setId(id);
  };

  const fetchEmployees = async () => {
    return {
      results: [
        {
          id: 1,
          name: "John Doe",
          job_title: "Senior Software Engineer",
          company: { name: "Google" },
          email: "john.doe@google.com",
          linkedin_link: "https://linkedin.com/in/johndoe"
        },
        {
          id: 2,
          name: "Jane Smith",
          job_title: "Frontend Developer",
          company: { name: "Microsoft" },
          email: "jane.smith@microsoft.com",
          linkedin_link: "https://linkedin.com/in/janesmith"
        },
        {
          id: 3,
          name: "Mike Johnson",
          job_title: "Full Stack Developer",
          company: { name: "Amazon" },
          email: "mike.johnson@amazon.com",
          linkedin_link: "https://linkedin.com/in/mikejohnson"
        }
      ],
      next: null,
      previous: null,
      total_pages: 1
    };
  };

  const {
    data: employees,
    isLoading,
    refetch,
  } = useQuery(["employees", { search, page, order }], fetchEmployees);

  const table_head = [
    {
      name: "Name",
      key: "name",
    },
    {
      name: "Job Title",
      key: "job_title",
    },
    {
      name: "Company Name",
      key: "company_name",
    },
  ];

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
          <div className="mt-2">
            <Table
              viewSearch
              actions
              isLoading={isLoading}
              search={search}
              setSearch={setSearch}
              table_head={table_head}
              table_rows={table_rows}
              handleOpenDelete={handleOpenDelete}
              handleOpenEdit={handleOpenEdit}
              handleOpenView={"employees"}
              setOrder={setOrder}
              selectedOrders={["name"]}
            />
          </div>
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

        <EditModal
          id={id}
          openEdit={openEdit}
          setOpenEdit={setOpenEdit}
          refetch={refetch}
        />

        <DeleteModal
          id={id}
          openDelete={openDelete}
          setOpenDelete={setOpenDelete}
          refetch={refetch}
        />

        <AddModal refetch={refetch} openAdd={openAdd} setOpenAdd={setOpenAdd} />
      </div>
    </Layout>
  );
}
