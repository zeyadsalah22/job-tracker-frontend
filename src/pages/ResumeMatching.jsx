import { useState } from "react";
import Layout from "../components/Layout";
import Table from "../components/Table";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Pagination from "../components/Pagination";
import DeleteModal from "../components/resume-matching/DeleteModal";
import RunTestModal from "../components/resume-matching/RunTestModal";
import { useQuery } from "react-query";
import { useAxiosPrivate } from "../utils/axios";

const ResumeMatching = () => {
  const navigate = useNavigate();
  const [openDelete, setOpenDelete] = useState(false);
  const [openRunTest, setOpenRunTest] = useState(false);
  const [id, setId] = useState(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [order, setOrder] = useState("");
  const axiosPrivate = useAxiosPrivate();

  const handleOpenDelete = (id) => {
    setId(id);
    setOpenDelete(true);
  };

  const handleRunNewTest = () => {
    setOpenRunTest(true);
  };

  const fetchResumeTests = async () => {
    return {
      results: [
        {
          id: 1,
          resumeLink: "https://example.com/resume1.pdf",
          date: "2024-03-15",
          score: "85%",
          jobDescription: "We are looking for a skilled Frontend Developer with experience in React, TypeScript, and modern web development practices. The ideal candidate should have strong problem-solving skills and experience with state management libraries like Redux or Zustand. Knowledge of testing frameworks like Jest and React Testing Library is a plus.",
          missingSkills: ["TypeScript", "Redux", "Jest", "React Testing Library"]
        },
        {
          id: 2,
          resumeLink: "https://example.com/resume2.pdf",
          date: "2024-03-10",
          score: "92%",
          jobDescription: "We are looking for a skilled Frontend Developer with experience in React, TypeScript, and modern web development practices. The ideal candidate should have strong problem-solving skills and experience with state management libraries like Redux or Zustand. Knowledge of testing frameworks like Jest and React Testing Library is a plus.",
          missingSkills: ["TypeScript", "Redux", "Jest", "React Testing Library"]
        },
        {
          id: 3,
          resumeLink: "https://example.com/resume3.pdf",
          date: "2024-03-05",
          score: "78%",
          jobDescription: "We are looking for a skilled Frontend Developer with experience in React, TypeScript, and modern web development practices. The ideal candidate should have strong problem-solving skills and experience with state management libraries like Redux or Zustand. Knowledge of testing frameworks like Jest and React Testing Library is a plus.",
          missingSkills: ["TypeScript", "Redux", "Jest", "React Testing Library"]
        },
      ],
      next: null,
      previous: null,
      total_pages: 1,
    };
  };

  const { data: resumeTests, isLoading, refetch } = useQuery(
    ["resumeTests", { search, page, order }],
    fetchResumeTests
  );

  const table_head = [
    { name: "Resume Link", key: "resumeLink" },
    { name: "Date", key: "date" },
    { name: "Score", key: "score" },
  ];

  const table_rows = resumeTests?.results.map((test) => {
    const score = parseInt(test.score);
    let scoreColor = "";
    if (score >= 86) {
      scoreColor = "text-green-600";
    } else if (score >= 60) {
      scoreColor = "text-yellow-600";
    } else {
      scoreColor = "text-red-600";
    }

    return {
      id: test.id,
      resumeLink: (
        <a
          href={test.resumeLink}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          View Resume
        </a>
      ),
      date: test.date,
      score: <span className={`font-semibold ${scoreColor}`}>{test.score}</span>,
    };
  });

  return (
    <Layout>
      <div className="bg-white rounded-lg h-full flex flex-col p-4 justify-between">
        <div className="flex flex-col">
          <div className="flex items-center justify-between pb-4 border-b-2">
            <h1 className="text-2xl font-bold">Resume Matching</h1>
            <button
              onClick={handleRunNewTest}
              className="bg-primary hover:bg-primary/85 transition-all text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2"
            >
              <Plus size={18} />
              Run New Test
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
              selectedOrders={["date", "score"]}
              table_rows={table_rows}
              handleOpenDelete={handleOpenDelete}
              handleOpenView={"resume-matching"}
              setOrder={setOrder}
            />
          </div>
        </div>
        <div className="self-center">
          <Pagination
            nextPage={resumeTests?.next}
            prevPage={resumeTests?.previous}
            page={page}
            setPage={setPage}
            totalPages={resumeTests?.total_pages}
          />
        </div>

        {openDelete && (
          <DeleteModal
            id={id}
            openDelete={openDelete}
            setOpenDelete={setOpenDelete}
            refetch={refetch}
          />
        )}

        {openRunTest && (
          <RunTestModal
            openRunTest={openRunTest}
            setOpenRunTest={setOpenRunTest}
          />
        )}
      </div>
    </Layout>
  );
};

export default ResumeMatching; 