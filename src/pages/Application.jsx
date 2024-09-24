import { Plus } from "lucide-react";
import Layout from "../components/Layout";
import Table from "../components/Table";
import React from "react";
import EditModal from "../components/applications/EditModal";
import DeleteModal from "../components/applications/DeleteModal";
import ViewModal from "../components/applications/ViewModal";
import axios from "axios";
import { useQuery } from "react-query";
import Pagination from "../components/Pagination";
import AddModal from "../components/applications/AddModal";

export default function Application() {
  const [openEdit, setOpenEdit] = React.useState(false);
  const [openDelete, setOpenDelete] = React.useState(false);
  const [openView, setOpenView] = React.useState(false);
  const [id, setId] = React.useState(null);
  const [page, setPage] = React.useState(1);
  const [search, setSearch] = React.useState("");
  const [openAdd, setOpenAdd] = React.useState(false);

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

  const fetchApplications = async () => {
    const { data } = await axios.get(
      `http://127.0.0.1:8000/api/applications?page=${page}&search=${search}`,
      {
        headers: {
          Authorization: `Token  ${localStorage.getItem("token")}`,
        },
      }
    );
    return data;
  };

  const {
    data: applications,
    isLoading,
    refetch,
  } = useQuery(["applications", { search, page }], fetchApplications);

  const table_head = ["Company Name", "Job Title", "Submission Date", "Status"];

  const table_rows = applications?.results?.map(
    ({ id, company: { name }, job_title, submission_date, status }) => ({
      id,
      name,
      job_title,
      submission_date,
      status,
    })
  );
  console.log(id);
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
        <EditModal id={id} openEdit={openEdit} setOpenEdit={setOpenEdit} />
        <ViewModal id={id} openView={openView} setOpenView={setOpenView} />
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
