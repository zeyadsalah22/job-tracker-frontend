import { Plus } from "lucide-react";
import Layout from "../components/Layout";
import Table from "../components/Table";
import React from "react";
import EditModal from "../components/companies/EditModal";
import DeleteModal from "../components/companies/DeleteModal";
import { useQuery } from "react-query";
import Pagination from "../components/Pagination";
import AddModal from "../components/companies/AddModal";
import { useAxiosPrivate } from "../utils/axios";

export default function Companies() {
  const [openEdit, setOpenEdit] = React.useState(false);
  const [openDelete, setOpenDelete] = React.useState(false);
  const [openAdd, setOpenAdd] = React.useState(false);
  const [id, setId] = React.useState(null);
  const [page, setPage] = React.useState(1);
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

  const fetchCompanies = async () => {
    const { data } = await axiosPrivate.get(
      `/companies?page_size=8&page=${page}&search=${search}&ordering=${order}`
    );
    return data;
  };
  console.log(localStorage.getItem("access"));
  const {
    data: companies,
    isLoading,
    refetch,
  } = useQuery(["companies", { search, page, order }], fetchCompanies);

  const table_head = [
    {
      name: "Name",
      key: "name",
    },
    {
      name: "Location",
      key: "location",
    },
    {
      name: "Careers Link",
      key: "careers_link",
    },
  ];

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
          <div className="mt-2">
            <Table
              actions
              viewSearch
              isLoading={isLoading}
              search={search}
              setSearch={setSearch}
              table_head={table_head}
              selectedOrders={["name"]}
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
              handleOpenView={"companies"}
              setOrder={setOrder}
            />
          </div>
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
        <EditModal
          id={id}
          refetch={refetch}
          openEdit={openEdit}
          setOpenEdit={setOpenEdit}
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
