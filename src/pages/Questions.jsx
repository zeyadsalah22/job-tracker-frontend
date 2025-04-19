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
  const axiosPrivate = useAxiosPrivate();

  const handleOpenEdit = (id) => {
    setOpenEdit(true);
    setId(id);
  };

  const handleOpenDelete = (id) => {
    setOpenDelete(true);
    setId(id);
  };

  const fetchquestions = async () => {
    return {
      results: [
        {
          id: 1,
          question: "What is the time complexity of QuickSort?",
          answer: "Average case: O(n log n), Worst case: O(n²)"
        },
        {
          id: 2,
          question: "Explain the difference between let, const, and var in JavaScript",
          answer: "var is function-scoped, let and const are block-scoped. const cannot be reassigned."
        },
        {
          id: 3,
          question: "What is React Virtual DOM?",
          answer: "A lightweight copy of the actual DOM that React uses to optimize rendering performance"
        }
      ],
      next: null,
      previous: null,
      total_pages: 1
    };
  };

  const {
    data: questions,
    isLoading,
    refetch,
  } = useQuery(["questions", { search, page }], fetchquestions);

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
            <h1 className="text-2xl font-bold">Questions</h1>
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
              isLoading={isLoading}
              search={search}
              setSearch={setSearch}
              table_head={table_head}
              table_rows={table_rows}
              handleOpenDelete={handleOpenDelete}
              handleOpenEdit={handleOpenEdit}
              handleOpenView={"questions"}
            />
          </div>
        </div>

        {questions?.results?.length !== 0 && (
          <div className="self-center">
            <Pagination
              nextPage={questions?.next}
              prevPage={questions?.previous}
              page={page}
              setPage={setPage}
              totalPages={questions?.total_pages}
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
