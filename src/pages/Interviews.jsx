import React, { useState, useEffect } from "react";
import { useQuery } from "react-query";
import { useAxiosPrivate } from "../utils/axios";
import { 
  Plus,
  Search,
  Calendar,
  Building2,
  Clock,
  Play,
  FileAudio,
  Eye
} from "lucide-react";
import Button from "../components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import {CheckCircle} from "lucide-react";
import Input from "../components/ui/Input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/Tabs";
import Table from "../components/Table";
import AddModal from "../components/interviews/AddModal";
import ViewModal from "../components/interviews/ViewModal";
import DeleteModal from "../components/interviews/DeleteModal";
import InterviewRecordingModal from "../components/interviews/InterviewRecordingModal";

export default function Interviews() {
  const axiosPrivate = useAxiosPrivate();
  
  // Modal states
  const [openAdd, setOpenAdd] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openRecording, setOpenRecording] = useState(false);
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [recordingInterviewId, setRecordingInterviewId] = useState(null);
  
  // Table states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  
  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, sortBy, sortOrder]);

  // Fetch company name using either applicationId or companyId
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

  // Fetch interviews
  const fetchInterviews = async () => {
    try {
      const params = {
        PageNumber: currentPage,
        PageSize: itemsPerPage,
      };

      if (searchTerm.trim()) {
        params.SearchTerm = searchTerm.trim();
      }

      if (sortBy) {
        params.SortBy = sortBy;
        params.SortDescending = sortOrder === 'desc';
      }

      const response = await axiosPrivate.get("/mockinterview", { params });
      return response.data;
    } catch (error) {
      console.error("Error fetching interviews:", error);
      return {
        items: [],
        totalCount: 0,
        totalPages: 1,
        currentPage: 1,
        hasNext: false,
        hasPrevious: false
      };
    }
  };

  const { data: interviewsData, isLoading, refetch } = useQuery(
    ["interviews", { currentPage, itemsPerPage, searchTerm, sortBy, sortOrder }],
    fetchInterviews,
    {
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false
    }
  );

  // Resolve company names for each interview
  const [resolvedInterviews, setResolvedInterviews] = useState([]);

  useEffect(() => {
    const resolveCompanyNames = async () => {
      if (!interviewsData?.items) {
        setResolvedInterviews([]);
        return;
      }

      const resolved = await Promise.all(
        interviewsData.items.map(async (interview) => {
          let companyName = "Unknown Company";
          
          if (interview.applicationId) {
            companyName = await fetchCompanyNameUsingApplicationId(interview.applicationId);
          } else if (interview.companyId) {
            companyName = await fetchCompanyNameUsingCompanyId(interview.companyId);
          }

          return {
            ...interview,
            resolvedCompanyName: companyName
          };
        })
      );

      setResolvedInterviews(resolved);
    };

    resolveCompanyNames();
  }, [interviewsData?.items]);

  // Helper functions
  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };


  // Table configuration
  const tableHead = [
    { name: "Date & Time", key: "startDate" },
    { name: "Company & Position", key: "company" },
    { name: "Duration", key: "duration" },
    { name: "Questions Completed", key: "questionsCompleted" }
  ];

  const tableData = resolvedInterviews.map((interview) => {
    
    return {
      id: interview.interviewId,
      startDate: formatDateTime(interview.startDate),
      company: (
        <div className="flex items-center gap-2">
          <Building2 className="h-4 w-4 text-muted-foreground" />
          <div>
            <p className="font-medium">{interview.resolvedCompanyName}</p>
            <p className="text-sm text-muted-foreground">{interview.position}</p>
          </div>
        </div>
      ),
      duration: (
        <div className="flex items-center gap-1">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span>{interview.duration} min</span>
        </div>
      ),
      questionsCompleted: (
        <div className="flex items-center gap-1">
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
          <span>
            {interview.interviewQuestions 
              ? `${interview.interviewQuestions.filter(q => q.answer && q.answer.trim()).length}/${interview.interviewQuestions.length}`
              : '0/0'
            }
          </span>
        </div>
      ),
      _originalData: interview
    };
  });

  // Event handlers
  const handleView = (row) => {
    const interview = row._originalData || row;
    setSelectedInterview(interview);
    setOpenView(true);
  };

  const handleDelete = (row) => {
    const interview = row._originalData || row;
    setSelectedInterview(interview);
    setOpenDelete(true);
  };

  const handleStartRecording = (interviewId) => {
    setRecordingInterviewId(interviewId);
    setOpenRecording(true);
  };

  const handleSort = (field) => {
    // Map display field to API field
    const fieldMapping = {
      startDate: "startdate",
      duration: "duration",
      company: "companyname",
      position: "position",
    };

    const apiField = fieldMapping[field] || field;
    
    if (sortBy === apiField) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(apiField);
      setSortOrder('asc');
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  // Filters for the table
  const filters = [
    <div key="search" className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Search interviews, companies, positions..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="pl-10 w-full sm:w-64"
      />
    </div>
  ];

  return (
    <div className="space-y-6">

  <Table
      useModernUI={true}
      title="Interview Sessions"
      description={`${interviewsData?.totalCount || 0} total interviews`}
      headerActions={[
        <Button key="start-interview" onClick={() => setOpenAdd(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Start New Interview
        </Button>
      ]}
      filters={filters}
      table_head={tableHead}
      table_rows={tableData}
      actions={true}
      handleOpenView={handleView}
      handleOpenDelete={handleDelete}
      isLoading={isLoading}
      
      // Built-in pagination
      currentPage={currentPage}
      totalPages={interviewsData?.totalPages || 1}
      totalCount={interviewsData?.totalCount || 0}
      itemsPerPage={itemsPerPage}
      onPageChange={handlePageChange}
      onItemsPerPageChange={handleItemsPerPageChange}
      
      // Built-in sorting
      sortBy={sortBy}
      sortOrder={sortOrder}
      onSort={handleSort}
      sortableColumns={['startDate', 'duration']}
      
      emptyState="No interviews found. Start your first mock interview to begin practicing."
    />

      {/* Modals */}
      {openAdd && (
        <AddModal
          open={openAdd}
          setOpen={setOpenAdd}
          refetch={refetch}
          onStartRecording={handleStartRecording}
        />
      )}

      {openView && (
        <ViewModal
          interview={selectedInterview}
          open={openView}
          setOpen={setOpenView}
          onStartRecording={handleStartRecording}
        />
      )}

      {openDelete && (
        <DeleteModal
          id={selectedInterview?.interviewId}
          openDelete={openDelete}
          setOpenDelete={setOpenDelete}
          refetch={refetch}
        />
      )}

      {openRecording && (
        <InterviewRecordingModal
          open={openRecording}
          setOpen={setOpenRecording}
          interviewId={recordingInterviewId}
          refetch={refetch}
        />
      )}
    </div>
  );
}