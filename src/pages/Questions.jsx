import { Plus } from "lucide-react";
import Layout from "../components/Layout";
import Table from "../components/Table";
import React from "react";
import EditModal from "../components/questions/EditModal";
import DeleteModal from "../components/questions/DeleteModal";
import { useQuery } from "react-query";
import Pagination from "../components/Pagination";
import AddModal from "../components/questions/AddModal";
import { useAxiosPrivate } from "../utils/axios";

export default function Questions() {
  const [openEdit, setOpenEdit] = React.useState(false);
  const [openDelete, setOpenDelete] = React.useState(false);
  const [id, setId] = React.useState(null);
  const [page, setPage] = React.useState(1);
  const [openAdd, setOpenAdd] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [order, setOrder] = React.useState("");
  const [sortField, setSortField] = React.useState("");
  const [sortDirection, setSortDirection] = React.useState(false); // false = ascending, true = descending
  const [applicationFilter, setApplicationFilter] = React.useState("");
  const axiosPrivate = useAxiosPrivate();

  // Mapping between display keys and API field names
  const fieldMapping = {
    question: "question",
    answer: "answer",
  };
  // Reset page when search or sorting changes
  React.useEffect(() => {
    setPage(1);
  }, [search, sortField, sortDirection, applicationFilter]);

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

  const fetchquestions = async () => {
    try {
      const params = {
        SearchTerm: search || undefined,
        ApplicationId: applicationFilter || undefined,
        PageNumber: page,
        PageSize: 10,
        SortBy: sortField || undefined,
        SortDescending: sortField ? sortDirection : undefined
      };
      
      console.log("Fetching questions with params:", params);
      const response = await axiosPrivate.get('/questions', { params });
      console.log("Questions response:", response.data);
      
      // Map the API response to match what the UI expects
      return {
        results: response.data.items?.map(question => ({
          id: question.questionId,
          question: question.question1 || question.question, // Handle both possible field names
          answer: question.answer,
          applicationId: question.applicationId,
          createdAt: question.createdAt,
          updatedAt: question.updatedAt
        })) || [],
        next: response.data.hasNext ? page + 1 : null,
        previous: response.data.hasPrevious ? page - 1 : null,
        total_pages: response.data.totalPages || 1,
        total_count: response.data.totalCount || 0
      };
    } catch (error) {
      console.error("Error fetching questions:", error);
      
      // Return empty structure on error
      return {
        results: [],
        next: null,
        previous: null,
        total_pages: 1,
        total_count: 0
      };
    }
  };

  const {
    data: questions,
    isLoading,
    refetch,
    error,
  } = useQuery(["questions", { search, page, applicationFilter, sortField, sortDirection }], 
    fetchquestions,{
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false
    });

  const table_head = [
    {
      name: "Question",
      key: "question",
    },
    {
      name: "Answer",
      key: "answer",
    },
  ];

  // Define which columns are sortable
  const selectedOrders = ["question", "answer"];

  const table_rows = questions?.results?.map(({ id, question, answer }) => {
    return {
      id,
      question,
      answer,
    };
  });

  return (
    <Layout>
      <div className="bg-white rounded-lg h-full flex flex-col p-4 justify-between">
        <div className="flex flex-col">
          <div className="flex items-center justify-between pb-4 border-b-2">
            <div>
              <h1 className="text-2xl font-bold">Questions</h1>
            </div>
            <button
              onClick={() => setOpenAdd(true)}
              className="bg-primary hover:bg-primary/85 transition-all text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2"
            >
              <Plus size={18} />
              Add Question
            </button>
          </div>
          
          <div className="mt-2">
            <Table
              actions
              viewSearch
              isLoading={isLoading}
              search={search}
              setSearch={setSearch}
              setOrder={handleSort}
              selectedOrders={selectedOrders}
              table_head={table_head}
              table_rows={table_rows}
              handleOpenDelete={handleOpenDelete}
              handleOpenEdit={handleOpenEdit}
              handleOpenView={"questions"}
            />
          </div>
        </div>
        
        <div className="self-center">
          <Pagination
            nextPage={questions?.next}
            prevPage={questions?.previous}
            page={page}
            setPage={setPage}
            totalPages={questions?.total_pages || 1}
          />
        </div>

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
