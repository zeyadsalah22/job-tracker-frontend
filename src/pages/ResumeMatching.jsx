import { useState, useEffect } from "react";
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
  const [sortField, setSortField] = useState("");
  const [sortDirection, setSortDirection] = useState(false); // false = ascending, true = descending
  const axiosPrivate = useAxiosPrivate();

  const handleOpenDelete = (id) => {
    setId(id);
    setOpenDelete(true);
  };

  const handleRunNewTest = () => {
    setOpenRunTest(true);
  };

  // Mapping between display keys and API field names
  const fieldMapping = {
    testDate: "testDate",
    atsScore: "atsScore",
  };

  // Reset page when search or sorting changes
  useEffect(() => {
    setPage(1);
  }, [search, sortField, sortDirection]);

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

  // Fetch all CVs to get resume names
  const fetchCvs = async () => {
    try {
      const response = await axiosPrivate.get('/cvs');
      console.log('Fetched CVs:', response.data);
      return response.data || [];
    } catch (error) {
      console.error('Error fetching CVs:', error);
      return [];
    }
  };

  const { data: cvs } = useQuery(["cvs"], fetchCvs);

  const fetchResumeTests = async () => {
    try {
      const params = {
        PageNumber: page,
        PageSize: 10,
      };

      // Add search term if provided
      if (search.trim()) {
        params.SearchTerm = search.trim();
      }

      // Add sorting if provided
      if (sortField) {
        params.SortBy = sortField;
        params.SortDescending = sortDirection;
      }

      console.log('Fetching resume tests with params:', params);
      const response = await axiosPrivate.get('/resumetest', { params });
      console.log('Resume tests response:', response.data);

      return {
        results: response.data.items || [],
        next: response.data.hasNext ? page + 1 : null,
        previous: response.data.hasPrevious ? page - 1 : null,
        total_pages: response.data.totalPages || 1,
      };
    } catch (error) {
      console.error('Error fetching resume tests:', error);
      return {
        results: [],
        next: null,
        previous: null,
        total_pages: 1,
      };
    }
  };

  const { data: resumeTests, isLoading, refetch } = useQuery(
    ["resumeTests", { search, page, sortField, sortDirection }],
    fetchResumeTests,
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false
    }
  );

  // Create a map of resumeId to resume data for quick lookup
  const resumeMap = {};
  if (cvs) {
    cvs.forEach(cv => {
      resumeMap[cv.resumeId] = cv;
    });
  }

  const table_head = [
    { name: "Resume", key: "resume" },
    { name: "Date", key: "testDate" },
    { name: "Score", key: "atsScore" },
  ];

  const table_rows = resumeTests?.results.map((test) => {
    const score = test.atsScore;
    let scoreColor = "";
    if (score >= 86) {
      scoreColor = "text-green-600";
    } else if (score >= 60) {
      scoreColor = "text-yellow-600";
    } else {
      scoreColor = "text-red-600";
    }

    // Format date to be more readable
    const formattedDate = new Date(test.testDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });

    // Get resume data from the map
    const resumeData = resumeMap[test.resumeId];
    
    // Create resume link
    let resumeDisplay = `Resume ${test.resumeId}`;
    if (resumeData && resumeData.resumeFile) {
      try {
        // Convert base64 to blob URL for viewing
        const binaryString = atob(resumeData.resumeFile);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        const blob = new Blob([bytes], { type: 'application/pdf' });
        const resumeUrl = URL.createObjectURL(blob);
        
        resumeDisplay = (
          <a
            href={resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            Resume {test.resumeId}
          </a>
        );
      } catch (error) {
        console.error(`Error creating URL for resume ${test.resumeId}:`, error);
      }
    }

    return {
      id: test.testId,
      resume: resumeDisplay,
      testDate: formattedDate,
      atsScore: <span className={`font-semibold ${scoreColor}`}>{test.atsScore}%</span>,
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
              selectedOrders={["testDate", "atsScore"]}
              table_rows={table_rows}
              handleOpenDelete={handleOpenDelete}
              handleOpenView={"resume-matching"}
              setOrder={handleSort}
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
            refetch={refetch}
          />
        )}
      </div>
    </Layout>
  );
};

export default ResumeMatching; 