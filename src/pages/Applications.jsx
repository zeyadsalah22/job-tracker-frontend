import { Plus } from "lucide-react";
import Layout from "../components/Layout";
import Table from "../components/Table";
import React from "react";
import EditModal from "../components/applications/EditModal";
import DeleteModal from "../components/applications/DeleteModal";
import { useQuery } from "react-query";
import Pagination from "../components/Pagination";
import AddModal from "../components/applications/AddModal";
import { useAxiosPrivate } from "../utils/axios";

export default function Applications() {
  const [openEdit, setOpenEdit] = React.useState(false);
  const [openDelete, setOpenDelete] = React.useState(false);
  const [id, setId] = React.useState(null);
  const [page, setPage] = React.useState(1);
  const [search, setSearch] = React.useState("");
  const [openAdd, setOpenAdd] = React.useState(false);
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

  const fetchApplications = async () => {
    return {
      results: [
        {
          id: 1,
          company: { name: "Google" },
          job_title: "Software Engineer",
          submission_date: "2024-03-15",
          status: "PENDING",
          notes: "Applied through company website"
        },
        {
          id: 2,
          company: { name: "Microsoft" },
          job_title: "Frontend Developer",
          submission_date: "2024-03-20",
          status: "INTERVIEW",
          notes: "Technical interview scheduled"
        },
        {
          id: 3,
          company: { name: "Amazon" },
          job_title: "Full Stack Developer",
          submission_date: "2024-03-25",
          status: "ACCEPTED",
          notes: "Received offer letter"
        }
      ],
      next: null,
      previous: null,
      total_pages: 1
    };
  };

  const {
    data: applications,
    isLoading,
    refetch,
    error,
  } = useQuery(["applications", { search, page, order }], fetchApplications);

  const statusEnum = [
    { name: "Pending", value: "PENDING" },
    { name: "Assessment", value: "ASSESSMENT" },
    { name: "Interview", value: "INTERVIEW" },
    { name: "Rejected", value: "REJECTED" },
    { name: "Accepted", value: "ACCEPTED" },
  ];

  const table_head = [
    {
      name: "Company Name",
      key: "name",
    },
    {
      name: "Job Title",
      key: "job_title",
    },
    {
      name: "Submission Date",
      key: "submission_date",
    },
    {
      name: "Status",
      key: "status",
    },
  ];

  const table_rows = applications?.results?.map(
    ({ id, company: { name }, job_title, submission_date, status }) => ({
      id,
      name,
      job_title,
      submission_date,
      status: statusEnum
        .filter((item) => item.value === status)
        .map((item) => item.name),
    })
  );

  if (error) {
    return <div>Something went wrong</div>;
  }

  return (
    <Layout>
      <div className="bg-white rounded-lg h-full flex flex-col p-4 justify-between">
        <div className="flex flex-col">
          <div className="flex items-center justify-between pb-4 border-b-2">
            <h1 className="text-2xl font-bold">Applications</h1>
            <button
              onClick={() => setOpenAdd(true)}
              className="bg-primary hover:bg-primary/85 transition-all text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2"
            >
              <Plus size={18} />
              Add Application
            </button>
          </div>
          <div className="mt-2">
            <Table
              viewSearch
              actions
              setOrder={setOrder}
              isLoading={isLoading}
              search={search}
              setSearch={setSearch}
              table_head={table_head}
              table_rows={table_rows}
              handleOpenDelete={handleOpenDelete}
              handleOpenEdit={handleOpenEdit}
              handleOpenView={"applications"}
              selectedOrders={["submission_date"]}
            />
          </div>
        </div>

        {applications?.results?.length !== 0 && (
          <div className="self-center">
            <Pagination
              page={page}
              setPage={setPage}
              totalPages={applications?.total_pages}
              nextPage={applications?.next}
              prevPage={applications?.previous}
            />
          </div>
        )}

        <AddModal openAdd={openAdd} setOpenAdd={setOpenAdd} refetch={refetch} />

        <EditModal
          id={id}
          openEdit={openEdit}
          setOpenEdit={setOpenEdit}
          refetch={refetch}
        />

        <DeleteModal
          refetch={refetch}
          id={id}
          openDelete={openDelete}
          setOpenDelete={setOpenDelete}
        />
      </div>
    </Layout>
  );
}
