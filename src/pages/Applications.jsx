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
    try {
      // Build query parameters
      const params = {
        PageNumber: page,
        PageSize: 10, // Default page size
        SearchTerm: search || undefined,
      };
      
      // Add sorting if specified
      if (order) {
        // Check if order starts with '-' to determine sort direction
        const isDescending = order.startsWith('-');
        params.SortBy = isDescending ? order.substring(1) : order;
        params.SortDescending = isDescending;
      }
      
      console.log("Applications request params:", params);
      const response = await axiosPrivate.get('/applications', { params });
      console.log("Applications response:", response.data);
      
      return {
        results: response.data.items,
        next: response.data.hasNext ? page + 1 : null,
        previous: response.data.hasPrevious ? page - 1 : null,
        total_pages: response.data.totalPages
      };
    } catch (error) {
      console.error("Error fetching applications:", error);
      return {
        results: [],
        next: null,
        previous: null,
        total_pages: 0
      };
    }
  };

  const {
    data: applications,
    isLoading,
    refetch,
    error,
  } = useQuery(
    ["applications", page, search, order],
    fetchApplications,
    {
      keepPreviousData: true, // Keep previous data while fetching new data
      refetchOnWindowFocus: false // Don't refetch when window regains focus
    }
  );

  const statusEnum = [
    { name: "Pending", value: "Pending" },
    { name: "Assessment", value: "Assessment" },
    { name: "Phone Screening", value: "Phonescreen" },
    { name: "Interview", value: "Interview" },
    { name: "Rejected", value: "Rejected" },
    { name: "Accepted", value: "Accepted" },
    { name: "Offer", value: "Offer" },
  ];

  const table_head = [
    {
      name: "Company Name",
      key: "companyName",
    },
    {
      name: "Job Title",
      key: "jobTitle",
    },
    {
      name: "Submission Date",
      key: "submissionDate",
    },
    {
      name: "Status",
      key: "status",
    },
  ];

  const table_rows = applications?.results?.map((application) => {
    // Find the matching status name
    const statusName = statusEnum.find(item => item.value === application.stage)?.name || application.stage;
    
    return {
      id: application.applicationId,
      companyName: application.companyName,
      jobTitle: application.jobTitle,
      submissionDate: application.submissionDate,
      status: statusName,
    };
  });

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
              selectedOrders={["jobTitle", "companyName", "submissionDate", "status"]}
            />
          </div>
        </div>

        {applications?.results?.length > 0 && (
          <div className="self-center">
            <Pagination
              page={page}
              setPage={setPage}
              totalPages={applications?.total_pages}
              nextPage={applications?.next !== null}
              prevPage={applications?.previous !== null}
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
