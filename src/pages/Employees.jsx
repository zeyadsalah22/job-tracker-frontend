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
      
      console.log("Employees request params:", params);
      const response = await axiosPrivate.get('/employees', { params });
      console.log("Employees response:", response.data);
      
      return {
        results: response.data.items,
        next: response.data.hasNext ? page + 1 : null,
        previous: response.data.hasPrevious ? page - 1 : null,
        total_pages: response.data.totalPages
      };
    } catch (error) {
      console.error("Error fetching employees:", error);
      return {
        results: [],
        next: null,
        previous: null,
        total_pages: 0
      };
    }
  };

  const {
    data: employees,
    isLoading,
    refetch,
    error,
  } = useQuery(
    ["employees", page, search, order],
    fetchEmployees,
    {
      keepPreviousData: true, // Keep previous data while fetching new data
      refetchOnWindowFocus: false // Don't refetch when window regains focus
    }
  );

  const table_head = [
    {
      name: "Name",
      key: "name",
    },
    {
      name: "Job Title",
      key: "jobTitle",
    },
    {
      name: "Company",
      key: "companyName",
    },
    {
      name: "Email",
      key: "email",
    },
  ];

  const table_rows = employees?.results?.map((employee) => {
    return {
      id: employee.employeeId,
      name: employee.name,
      jobTitle: employee.jobTitle,
      companyName: employee.companyName,
      email: employee.email,
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
              selectedOrders={["name", "jobTitle", "companyName", "email"]}
            />
          </div>
        </div>

        {employees?.results?.length > 0 && (
          <div className="self-center">
            <Pagination
              page={page}
              setPage={setPage}
              totalPages={employees?.total_pages}
              nextPage={employees?.next !== null}
              prevPage={employees?.previous !== null}
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
