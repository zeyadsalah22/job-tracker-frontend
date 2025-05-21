import { useState } from "react";
import { useQuery } from "react-query";
import Layout from "../components/Layout";
import { useAxiosPrivate } from "../utils/axios";
import ReactLoading from "react-loading";
import AddModal from "../components/companies/AddModal";
import EditModal from "../components/companies/EditModal";
import DeleteModal from "../components/companies/DeleteModal";
import { Plus, Pencil, Trash2, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import Table from "../components/Table";
import React from "react";
import Pagination from "../components/Pagination";

export default function Companies() {
  const [openAdd, setOpenAdd] = React.useState(false);
  const [openEdit, setOpenEdit] = React.useState(false);
  const [openDelete, setOpenDelete] = React.useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [page, setPage] = React.useState(1);
  const [search, setSearch] = React.useState("");
  const [sortField, setSortField] = React.useState("");
  const [sortDirection, setSortDirection] = React.useState(false); // false = ascending, true = descending
  const axiosPrivate = useAxiosPrivate();

  const handleEdit = (id) => {
    setSelectedId(id);
    setOpenEdit(true);
  };

  const handleDelete = (id) => {
    setSelectedId(id);
    setOpenDelete(true);
  };

  const handleSort = (field) => {
    if (sortField === field) {
      // If clicking the same field, toggle direction
      setSortDirection(!sortDirection);
    } else {
      // If clicking a new field, set it as sort field and default to ascending
      setSortField(field);
      setSortDirection(false);
    }
  };

  const fetchCompanies = async () => {
    const response = await axiosPrivate.get('/companies', {
      params: {
        SearchTerm: search || undefined,
        PageNumber: page,
        PageSize: 10,
        SortBy: sortField || undefined,
        SortDescending: sortField ? sortDirection : undefined,
      }
    });
    
    return {
      results: response.data.items.map(item => ({
        id: item.companyId,
        name: item.name,
        location: item.location,
        careers_link: item.careersLink,
        linkedin_link: item.linkedinLink
      })),
      next: response.data.hasNext ? page + 1 : null,
      previous: response.data.hasPrevious ? page - 1 : null,
      total_pages: response.data.totalPages
    };
  };

  const {
    data: companies,
    isLoading,
    refetch,
  } = useQuery(["companies", { search, page, sortField, sortDirection }], fetchCompanies);

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
    {
      name: "LinkedIn Link",
      key: "linkedin_link",
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
              selectedOrders={["name", "location"]}
              table_rows={companies?.results.map(
                ({ id, name, careers_link, linkedin_link, location }) => {
                  return {
                    id,
                    name,
                    location,
                    careers_link,
                    linkedin_link,
                  };
                }
              )}
              handleOpenDelete={handleDelete}
              handleOpenEdit={handleEdit}
              handleOpenView={"companies"}
              setOrder={handleSort}
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
          id={selectedId}
          refetch={refetch}
          openEdit={openEdit}
          setOpenEdit={setOpenEdit}
        />

        <DeleteModal
          id={selectedId}
          openDelete={openDelete}
          setOpenDelete={setOpenDelete}
          refetch={refetch}
        />

        <AddModal refetch={refetch} openAdd={openAdd} setOpenAdd={setOpenAdd} />
      </div>
    </Layout>
  );
} 