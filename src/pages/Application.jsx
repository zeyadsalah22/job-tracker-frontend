import { Plus } from "lucide-react";
import Layout from "../components/Layout";
import Table from "../components/Table";
import React from "react";
import EditModal from "../components/applications/EditModal";
import DeleteModal from "../components/applications/DeleteModal";
import ViewModal from "../components/applications/ViewModal";
import axios from "axios";
import { useQuery } from "react-query";
import ReactLoading from "react-loading";
import Pagination from "../components/Pagination";

export default function Application() {
  const [openEdit, setOpenEdit] = React.useState(false);
  const [openDelete, setOpenDelete] = React.useState(false);
  const [openView, setOpenView] = React.useState(false);
  const [id, setId] = React.useState(null);
  const [page, setPage] = React.useState(1);

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

  // const applications = [
  //   {
  //     id: 0,
  //     user: {
  //       id: 0,
  //       username: "string",
  //       email: "string",
  //     },
  //     company: {
  //       id: 0,
  //       name: "string",
  //       location: "string",
  //       careers_link: "string",
  //       linkedin_link: "string",
  //     },
  //     job_title: "string",
  //     job_type: "string",
  //     description: "string",
  //     link: "string",
  //     submitted_cv: "string",
  //     ats_score: 0,
  //     stage: "string",
  //     status: "Pending",
  //     submission_date: "2024-09-18",
  //   },
  //   {
  //     id: 1,
  //     user: {
  //       id: 0,
  //       username: "string",
  //       email: "string",
  //     },
  //     company: {
  //       id: 0,
  //       name: "string",
  //       location: "string",
  //       careers_link: "string",
  //       linkedin_link: "string",
  //     },
  //     job_title: "string",
  //     job_type: "string",
  //     description: "string",
  //     link: "string",
  //     submitted_cv: "string",
  //     ats_score: 0,
  //     stage: "string",
  //     status: "Pending",
  //     submission_date: "2024-09-18",
  //   },
  //   {
  //     id: 2,
  //     user: {
  //       id: 0,
  //       username: "string",
  //       email: "string",
  //     },
  //     company: {
  //       id: 0,
  //       name: "string",
  //       location: "string",
  //       careers_link: "string",
  //       linkedin_link: "string",
  //     },
  //     job_title: "string",
  //     job_type: "string",
  //     description: "string",
  //     link: "string",
  //     submitted_cv: "string",
  //     ats_score: 0,
  //     stage: "string",
  //     status: "Pending",
  //     submission_date: "2024-09-18",
  //   },
  // ];

  const fetchApplications = async () => {
    const { data } = await axios.get("http://127.0.0.1:8000/api/applications", {
      headers: {
        Authorization: `Token  ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    });
    return data;
  };

  const {
    data: applications,
    isLoading,
  } = useQuery(["applications"], fetchApplications);

  const table_head = [
    "ID",
    "Email",
    "Company Name",
    "Job Title",
    "Submission Date",
    "Status",
  ];

  const table_rows = applications?.results?.map(
    ({
      id,
      user: { email },
      company: { name },
      job_title,
      submission_date,
      status,
    }) => ({
      id,
      email,
      name,
      job_title,
      submission_date,
      status,
    })
  );

  if (isLoading) {
    return (
      <div className="h-screen p-[40px] flex justify-center items-center gap-[40px]">
        <ReactLoading type="spinningBubbles" color="#11664F" />
      </div>
    );
  }

  console.log(table_rows);
  console.log(applications);

  return (
    <Layout>
      <div className="bg-white rounded-lg h-full flex flex-col p-4 justify-between">
        <div className="flex flex-col">
          <div className="flex items-center justify-between pb-4 border-b-2">
            <h1 className="text-2xl font-bold">Applications</h1>
            <button className="bg-primary hover:bg-primary/85 transition-all text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2">
              <Plus size={18} />
              Add Application
            </button>
          </div>
          <Table
            table_head={table_head}
            table_rows={table_rows}
            handleOpenDelete={handleOpenDelete}
            handleOpenEdit={handleOpenEdit}
            handleOpenView={handleOpenView}
          />
        </div>

        <div className="self-center">
          <Pagination
            page={page}
            setPage={setPage}
            totalPages={applications.total_pages}
            nextPage={applications.next}
            prevPage={applications.previous}
          />
        </div>
        <EditModal id={id} openEdit={openEdit} setOpenEdit={setOpenEdit} />
        <ViewModal id={id} openView={openView} setOpenView={setOpenView} />
        <DeleteModal
          id={id}
          openDelete={openDelete}
          setOpenDelete={setOpenDelete}
        />
      </div>
    </Layout>
  );
}
