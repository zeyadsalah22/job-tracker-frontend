import { Plus } from "lucide-react";
import Layout from "../components/Layout";
import Table from "../components/Table";
import React from "react";
import EditModal from "../components/companies/EditModal";
import DeleteModal from "../components/companies/DeleteModal";
import ViewModal from "../components/companies/ViewModal";
import axios from "axios";
import { useQuery } from "react-query";
import Pagination from "../components/Pagination";
import AddModal from "../components/companies/AddModal";

export default function Application() {
  const [openEdit, setOpenEdit] = React.useState(false);
  const [openDelete, setOpenDelete] = React.useState(false);
  const [openView, setOpenView] = React.useState(false);
  const [openAdd, setOpenAdd] = React.useState(false);
  const [id, setId] = React.useState(null);
  const [page, setPage] = React.useState(1);
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

  const fetchCompanies = async () => {
    const { data } = await axios.get(
      `http://127.0.0.1:8000/api/companies?search=${search}`,
      {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      }
    );
    return data;
  };

  const {
    data: companies,
    isLoading,
    refetch,
  } = useQuery(["companies", search], fetchCompanies);

  const table_head = ["Name", "Location", "Careers Link"];

  return (
    <Layout>
      <div className="bg-white rounded-lg h-full flex flex-col p-4 justify-between">
        <div className="flex flex-col">
          <div className="flex items-center justify-between pb-4 border-b-2">
            <h1 className="text-2xl font-bold">Companies</h1>
            <button
              onClick={() => setOpenAdd(true)}
              className="bg-primary hover:bg-primary/85 transition-all text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2"
            >
              <Plus size={18} />
              Add Company
            </button>
          </div>
          <Table
            isLoading={isLoading}
            search={search}
            setSearch={setSearch}
            table_head={table_head}
            table_rows={companies?.results.map(
              ({ id, name, careers_link, location }) => {
                return {
                  id,
                  name,
                  location,
                  careers_link,
                };
              }
            )}
            handleOpenDelete={handleOpenDelete}
            handleOpenEdit={handleOpenEdit}
            handleOpenView={handleOpenView}
          />
        </div>
        <div className="self-center">
          <Pagination
            nextPage={companies?.next}
            prevPage={companies?.previous}
            page={page}
            setPage={setPage}
            totalPages={companies?.total_pages}
          />
        </div>
        {openEdit && (
          <EditModal
            id={id}
            refetch={refetch}
            openEdit={openEdit}
            setOpenEdit={setOpenEdit}
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
