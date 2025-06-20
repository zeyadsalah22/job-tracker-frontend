import { Plus } from "lucide-react";
import Layout from "../components/Layout";
import Table from "../components/Table";
import React, { useEffect } from "react";
import DeleteModal from "../components/interviews/DeleteModal";
import { useQuery } from "react-query";
import Pagination from "../components/Pagination";
import { useNavigate } from "react-router-dom";
import { useAxiosPrivate } from "../utils/axios";
import AddModal from "../components/interviews/AddModal";

export default function Interviews() {
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();
  const [openDelete, setOpenDelete] = React.useState(false);
  const [id, setId] = React.useState(null);
  const [page, setPage] = React.useState(1);
  const [search, setSearch] = React.useState("");
  const [order, setOrder] = React.useState("");
  const [sortField, setSortField] = React.useState("");
  const [sortDirection, setSortDirection] = React.useState(false); // false = ascending, true = descending
  const [openAdd, setOpenAdd] = React.useState(false);
  const [resolvedRows, setResolvedRows] = React.useState([]);

  // Mapping between display keys and API field names
  const fieldMapping = {
    startDate: "startdate",
    duration: "duration",
    company: "companyname",
    position: "position",
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

  const fetchInterviews = async () => {
    // Construct the query parameters based on state
    const params = {
      SearchTerm: search || undefined,
      PageNumber: page,
      PageSize: 10, // Adjust as needed
      SortBy: sortField || undefined,
      SortDescending: sortField ? sortDirection : undefined
    };
    console.log("Fetching interviews with params:", params);
    try {
      const response = await axiosPrivate.get("/mockinterview", { params });
      console.log("Interviews response:", response.data);
      return {
        results: response.data.items,
        next: response.data.hasNext ? page + 1 : null,
        previous: response.data.hasPrevious ? page - 1 : null,
        total_pages: response.data.totalPages
      };
    } catch (error) {
      console.error("Error fetching interviews:", error);
      alert("Failed to load interview data. Please try again later.");
      return {
        results: [],
        next: null,
        previous: null,
        total_pages: 0
      };
    }
  };

   // fetch company name using either applicationId or companyId
  const fetchCompanyNameUsingCompanyId = async (companyId) => {
    try {
      const response = await axiosPrivate.get(`/user-companies/${companyId}`);
      return response.data.companyName || "Unknown Company";
    } catch (error) {
      console.error("Error fetching company name:", error);
      return "Unknown Company";
    }
  };
  const fetchCompanyNameUsingApplicationId = async (applicationId) => {
    try {
      const response = await axiosPrivate.get(`/applications/${applicationId}`);
      return response.data.companyName || "Unknown Company";
    } catch (error) {
      console.error("Error fetching company name:", error);
      return "Unknown Company";
    }
  };

    const { data: interviews, isLoading, refetch } = useQuery(
    ["interviews", { search, page, sortField, sortDirection }],
    fetchInterviews,{
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false
    }
  );

  useEffect(() => {
    const resolveCompanyNames = async () => {
    if (!interviews?.results) return;

    const rows = await Promise.all(
      interviews.results.map(async (interview) => {
        let companyName = "Unknown Company";
        if (interview.applicationId) {
          companyName = await fetchCompanyNameUsingApplicationId(interview.applicationId);
        } else if (interview.companyId) {
          companyName = await fetchCompanyNameUsingCompanyId(interview.companyId);
        }

        return {
          id: interview.interviewId,
          startDate: new Date(interview.startDate).toUTCString(),
          duration: interview.duration,
          company: companyName,
          position: interview.position,
        };
      })
    );

    setResolvedRows(rows);
  };

  resolveCompanyNames();
  }, [interviews]);

  const table_head = [
    {
      name: "Start Date",
      key: "startDate",
    },
    {
      name: "Duration",
      key: "duration",
    },
    {
      name: "Company",
      key: "company",
    },
    {
      name: "Position",
      key: "position",
    },
  ];
  // const table_rows = interviews?.results?.map((interview) => {
  //   return {
  //     id: interview.interviewId,
  //     startDate: new Date(interview.startDate).toLocaleDateString(),
  //     duration: interview.duration,
  //     company: companyName(interview),
  //     position: interview.position
  //   };
  // });


  return (
    <Layout>
      <div className="bg-white rounded-lg h-full flex flex-col p-4 justify-between">
        <div className="flex flex-col">
          <div className="flex items-center justify-between pb-4 border-b-2">
            <h1 className="text-2xl font-bold">Interviews</h1>
            <button
              onClick={() => setOpenAdd(true)}
              className="bg-primary hover:bg-primary/85 transition-all text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2"
            >
              <Plus size={18} />
              Start New Interview
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
              selectedOrders={["startDate", "company", "position", "duration"]}
              table_rows= {resolvedRows}
              handleOpenDelete={handleOpenDelete}
              handleOpenView={"interviews"}
              setOrder={handleSort}
              // handleOpenEdit= {null}
            />
          </div>
        </div>
        {interviews?.results?.length > 0 && (
          <div className="self-center">
            <Pagination
              page={page}
              setPage={setPage}
              totalPages={interviews?.total_pages}
              nextPage={interviews?.next !== null}
              prevPage={interviews?.previous !== null}
            />
          </div>
        )}
        <DeleteModal
          id={id}
          openDelete={openDelete}
          setOpenDelete={setOpenDelete}
          refetch={refetch}
        />
        <AddModal open={openAdd} setOpen={setOpenAdd} refetch={refetch} />
      </div>
    </Layout>
  );
} 