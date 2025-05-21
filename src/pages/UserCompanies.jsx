import { Plus } from "lucide-react";
import Layout from "../components/Layout";
import Table from "../components/Table";
import React, { useState } from "react";
import EditModal from "../components/user-companies/EditModal";
import DeleteModal from "../components/user-companies/DeleteModal";
import { useQuery } from "react-query";
import Pagination from "../components/Pagination";
import AddModal from "../components/user-companies/AddModal";
import { useAxiosPrivate } from "../utils/axios";
import useUserStore from "../store/user.store";

export default function UserCompanies() {
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [id, setId] = useState(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState("");
  const [sortDirection, setSortDirection] = useState(false); // false = ascending, true = descending
  const axiosPrivate = useAxiosPrivate();
  const user = useUserStore((state) => state.user);

  // Mapping between display keys and API field names
  const fieldMapping = {
    name: "name",
    location: "location"
  };

  const handleOpenEdit = (id) => {
    setOpenEdit(true);
    setId(id);
  };

  const handleOpenDelete = (id) => {
    setOpenDelete(true);
    setId(id);
  };

  // This function will be passed to the Table component as setOrder
  const handleSort = (field) => {
    console.log("Sorting by field:", field, "-> mapped to:", fieldMapping[field] || field);
    if (sortField === (fieldMapping[field] || field)) {
      // If clicking the same field, toggle direction
      setSortDirection(!sortDirection);
    } else {
      // If clicking a new field, set it as sort field and default to ascending
      setSortField(fieldMapping[field] || field);
      setSortDirection(false);
    }
  };

  const fetchUserCompanies = async () => {    
    try {      
      console.log("Fetching with params:", {        
        search,        
        page,        
        sortField,        
        sortDirection      
      });            
      
      // Create params object for better logging
      const params = {
        SearchTerm: search || undefined,
        UserId: user?.userId || undefined,
        PageNumber: page,
        PageSize: 10,
        SortBy: sortField || undefined,
        SortDescending: sortField ? sortDirection : undefined,
      };
      
      console.log("Actual API params being sent:", params);
      
      const response = await axiosPrivate.get('/user-companies', {
        params
      });
      
      console.log("User companies response:", response.data);
      
      // Transform the API response to match the expected format for the UI
      const items = Array.isArray(response.data) ? response.data : (response.data.items || []);
      
      return {
        results: items.map(item => ({
          id: item.companyId,
          name: item.companyName,
          location: item.companyLocation,
          careers_link: item.companyCareersLink,
          linkedin_link: item.companyLinkedinLink,
          description: item.description
        })),
        next: response.data.hasNext ? page + 1 : null,
        previous: response.data.hasPrevious ? page - 1 : null,
        total_pages: response.data.totalPages || 1
      };
    } catch (error) {
      console.error("Error fetching user companies:", error);
      return {
        results: [],
        next: null,
        previous: null,
        total_pages: 1
      };
    }
  };

  const {
    data: companies,
    isLoading,
    refetch,
  } = useQuery(
    ["user-companies", { search, page, sortField, sortDirection, userId: user?.userId }], 
    fetchUserCompanies,
    {
      enabled: !!user?.userId,
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false
    }
  );

  // Define table columns with consistent naming that matches API field names
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
            <h1 className="text-2xl font-bold">User Companies</h1>
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
              table_rows={companies?.results?.map(
                ({ id, name, careers_link, location }) => {
                  return {
                    id,
                    name,
                    location,
                    careers_link,
                  };
                }
              ) || []}
              handleOpenDelete={handleOpenDelete}
              handleOpenEdit={handleOpenEdit}
              handleOpenView={"user-companies"}
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
            totalPages={companies?.total_pages || 1}
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
