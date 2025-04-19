import { Plus } from "lucide-react";
import Layout from "../components/Layout";
import Table from "../components/Table";
import React from "react";
import DeleteModal from "../components/interviews/DeleteModal";
import { useQuery } from "react-query";
import Pagination from "../components/Pagination";
import { useNavigate } from "react-router-dom";
import { useAxiosPrivate } from "../utils/axios";

export default function Interviews() {
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();
  const [openDelete, setOpenDelete] = React.useState(false);
  const [id, setId] = React.useState(null);
  const [page, setPage] = React.useState(1);
  const [search, setSearch] = React.useState("");
  const [order, setOrder] = React.useState("");

  const handleOpenDelete = (id) => {
    setOpenDelete(true);
    setId(id);
  };

  const fetchInterviews = async () => {
    return {
      results: [
        {
          id: 1,
          startDate: "2024-03-15 10:00",
          duration: "45 minutes",
          company: "TechCorp",
          position: "Software Engineer",
        },
        {
          id: 2,
          startDate: "2024-03-16 14:30",
          duration: "60 minutes",
          company: "DataSystems",
          position: "Data Analyst",
        },
        {
          id: 3,
          startDate: "2024-03-17 11:15",
          duration: "30 minutes",
          company: "WebSolutions",
          position: "Frontend Developer",
        },
      ],
      next: null,
      previous: null,
      total_pages: 1,
    };
  };

  const { data: interviews, isLoading, refetch } = useQuery(
    ["interviews", { search, page, order }],
    fetchInterviews
  );

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

  return (
    <Layout>
      <div className="bg-white rounded-lg h-full flex flex-col p-4 justify-between">
        <div className="flex flex-col">
          <div className="flex items-center justify-between pb-4 border-b-2">
            <h1 className="text-2xl font-bold">Interviews</h1>
            <button
              onClick={() => navigate("/interviews/start")}
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
              selectedOrders={["startDate", "company", "position"]}
              table_rows={interviews?.results.map(
                ({ id, startDate, duration, company, position }) => {
                  return {
                    id,
                    startDate,
                    duration,
                    company,
                    position,
                  };
                }
              )}
              handleOpenDelete={handleOpenDelete}
              handleOpenView={"interviews"}
              setOrder={setOrder}
              handleOpenEdit={null}
            />
          </div>
        </div>
        <div className="self-center">
          <Pagination
            currentPage={page}
            totalPages={interviews?.total_pages}
            onPageChange={setPage}
            hasNext={interviews?.next !== null}
            hasPrevious={interviews?.previous !== null}
          />
        </div>
        <DeleteModal
          id={id}
          openDelete={openDelete}
          setOpenDelete={setOpenDelete}
          refetch={refetch}
        />
        
      </div>
    </Layout>
  );
} 