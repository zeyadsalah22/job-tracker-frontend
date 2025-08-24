import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { useAxiosPrivate } from "../utils/axios";
import { format } from "date-fns";
import {
  Search,
  Plus,
  Star,
  HelpCircle,
  Eye,
  Edit,
  Trash2,
} from "lucide-react";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/Select";
import { Badge } from "../components/ui/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import Table from "../components/Table";
import AddModal from "../components/questions/AddModal";
import EditModal from "../components/questions/EditModal";
import ViewModal from "../components/questions/ViewModal";
import DeleteModal from "../components/questions/DeleteModal";

const Questions = () => {
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();

  // State management
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("");
  const [applicationFilter, setApplicationFilter] = useState("");
  const [favoriteFilter, setFavoriteFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);

  // Fetch questions with filters and pagination
  const fetchQuestions = async () => {
    const params = new URLSearchParams({
      SearchTerm: searchTerm,
      PageNumber: currentPage.toString(),
      PageSize: itemsPerPage.toString(),
      SortBy: sortBy,
      SortDescending: sortOrder === "desc" ? "true" : "false",
    });

    if (typeFilter && typeFilter !== "") params.append("Type", typeFilter);
    if (statusFilter && statusFilter !== "") params.append("AnswerStatus", statusFilter);
    if (difficultyFilter && difficultyFilter !== "") params.append("Difficulty", difficultyFilter);
    if (applicationFilter && applicationFilter !== "") params.append("ApplicationId", applicationFilter);
    if (favoriteFilter && favoriteFilter !== "") params.append("Favorite", favoriteFilter);

    const response = await axiosPrivate.get(`/questions?${params}`);
    return response.data;
  };

  // Fetch all applications for filter dropdown
  const fetchApplicationsForFilter = async () => {
    try {
      const response = await axiosPrivate.get("/applications?PageSize=500");
      return response.data?.items || [];
    } catch (error) {
      console.error("Error fetching applications for filter:", error);
      return [];
    }
  };

  const {
    data: questionsData,
    isLoading,
    error,
    refetch,
  } = useQuery(
    ["questions", searchTerm, typeFilter, statusFilter, difficultyFilter, applicationFilter, favoriteFilter, currentPage, itemsPerPage, sortBy, sortOrder],
    fetchQuestions,
    {
      keepPreviousData: true,
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );

  const { data: applicationsForFilter = [] } = useQuery(
    ["applications-for-questions-filter"],
    fetchApplicationsForFilter,
    {
      staleTime: 10 * 60 * 1000, // 10 minutes
    }
  );

  const questions = questionsData?.items || [];
  const totalPages = questionsData?.totalPages || 1;
  const totalCount = questionsData?.totalCount || 0;

  // Toggle favorite mutation
  const toggleFavoriteMutation = useMutation(
    async ({ questionId, favorite }) => {
      const response = await axiosPrivate.patch(`/questions/${questionId}`, { favorite });
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("questions");
      },
    }
  );

  // Helper functions
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "completed": return "success";
      case "inprogress": return "warning";
      case "notstarted": return "secondary";
      default: return "secondary";
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "Technical": return "bg-blue-100 text-blue-800 border-blue-200";
      case "Behavioral": return "bg-purple-100 text-purple-800 border-purple-200";
      case "CompanySpecific": return "bg-green-100 text-green-800 border-green-200";
      case "CulturalFit": return "bg-orange-100 text-orange-800 border-orange-200";
      case "ApplicationForm": return "bg-indigo-100 text-indigo-800 border-indigo-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getDifficultyStars = (difficulty) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-3 h-3 ${
          i < difficulty ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
        }`}
      />
    ));
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return format(new Date(dateString), "MMM dd, yyyy");
    } catch (error) {
      return "Invalid date";
    }
  };

  const formatType = (type) => {
    switch (type) {
      case "CompanySpecific": return "Company-Specific";
      case "CulturalFit": return "Cultural Fit";
      case "ApplicationForm": return "Application Form";
      default: return type;
    }
  };

  const formatStatus = (status) => {
    switch (status) {
      case "InProgress": return "In Progress";
      case "NotStarted": return "Not Started";
      default: return status;
    }
  };

  // Table configuration
  const tableHead = [
    { name: "Question", key: "question" },
    { name: "Type", key: "type" },
    { name: "Application", key: "application" },
    { name: "Answer Status", key: "answerStatus" },
    { name: "Difficulty", key: "difficulty" },
  ];

  // Prepare table data
  const tableData = questions.map((question) => {
    // Find the application for this question
    const application = applicationsForFilter.find(app => app.applicationId === question.applicationId);
    
    return {
      question: question.question1 || "N/A",
      type: question.type || "N/A",
      application: application ? {
        companyName: application.companyName,
        jobTitle: application.jobTitle,
        status: application.status
      } : null,
      answerStatus: question.answerStatus || "NotStarted",
      difficulty: question.difficulty || 1,
      favorite: question.favorite || false,
      tags: question.tags || [],
      _originalData: question, // Store original data for actions
    };
  });

  // Custom renderers for specific columns
  const customRenderers = {
    question: (value, row) => (
      <div className="max-w-md">
        <p className="font-medium truncate" title={value}>
          {value.length > 60 ? `${value.substring(0, 60)}...` : value}
        </p>
        <div className="flex items-center gap-2 mt-1">
          {row.favorite && (
            <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
          )}
          {Array.isArray(row.tags) && row.tags.slice(0, 2).map((tag, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
          {Array.isArray(row.tags) && row.tags.length > 2 && (
            <Badge variant="secondary" className="text-xs">
              +{row.tags.length - 2}
            </Badge>
          )}
        </div>
      </div>
    ),
    type: (value) => (
      <Badge variant="outline" className={getTypeColor(value)}>
        {formatType(value)}
      </Badge>
    ),
    application: (value) => (
      <div>
        {value ? (
          <>
            <div className="font-medium text-sm">{value.companyName}</div>
            <div className="text-xs text-muted-foreground">{value.jobTitle}</div>
            {value.status && (
              <Badge variant="outline" className="text-xs mt-1">
                {value.status}
              </Badge>
            )}
          </>
        ) : (
          <span className="text-muted-foreground text-sm">No application</span>
        )}
      </div>
    ),
    answerStatus: (value) => (
      <Badge variant={getStatusColor(value)} className="text-xs">
        {formatStatus(value)}
      </Badge>
    ),
    difficulty: (value) => (
      <div className="flex items-center gap-1">
        {getDifficultyStars(value)}
      </div>
    ),
  };

  // Handle actions
  const handleView = (row) => {
    const question = row._originalData || row;
    setSelectedQuestion(question);
    setIsViewModalOpen(true);
  };

  const handleEdit = (row) => {
    const question = row._originalData || row;
    setSelectedQuestion(question);
    setIsEditModalOpen(true);
  };

  const handleDelete = (row) => {
    const question = row._originalData || row;
    setSelectedQuestion(question);
    setIsDeleteModalOpen(true);
  };

  const handleToggleFavorite = (row) => {
    const question = row._originalData || row;
    toggleFavoriteMutation.mutate({
      questionId: question.questionId,
      favorite: !question.favorite
    });
  };

  // Handle sorting
  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  // Handle pagination
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  // Custom actions for the table - removed favorite toggle as requested

  // Header actions
  const headerActions = [
    <Button key="add" onClick={() => setIsAddModalOpen(true)}>
      <Plus className="w-4 h-4 mr-2" />
      Add Question
    </Button>
  ];

  // Filters
  const filters = [
    <div key="search" className="flex-1">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder="Search questions, companies, or job titles..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>
    </div>,
    
    <Select key="type" value={typeFilter} onValueChange={setTypeFilter}>
      <SelectTrigger className="w-full sm:w-48">
        <SelectValue placeholder="Filter by type" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="">All Types</SelectItem>
        <SelectItem value="Technical">Technical</SelectItem>
        <SelectItem value="Behavioral">Behavioral</SelectItem>
        <SelectItem value="CompanySpecific">Company-Specific</SelectItem>
        <SelectItem value="CulturalFit">Cultural Fit</SelectItem>
        <SelectItem value="ApplicationForm">Application Form</SelectItem>
      </SelectContent>
    </Select>,

    <Select key="status" value={statusFilter} onValueChange={setStatusFilter}>
      <SelectTrigger className="w-full sm:w-40">
        <SelectValue placeholder="Answer status" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="">All Status</SelectItem>
        <SelectItem value="Completed">Completed</SelectItem>
        <SelectItem value="InProgress">In Progress</SelectItem>
        <SelectItem value="NotStarted">Not Started</SelectItem>
      </SelectContent>
    </Select>,

    <Select key="difficulty" value={difficultyFilter} onValueChange={setDifficultyFilter}>
      <SelectTrigger className="w-full sm:w-40">
        <SelectValue placeholder="Difficulty" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="">All Levels</SelectItem>
        <SelectItem value="1">⭐ (1)</SelectItem>
        <SelectItem value="2">⭐⭐ (2)</SelectItem>
        <SelectItem value="3">⭐⭐⭐ (3)</SelectItem>
        <SelectItem value="4">⭐⭐⭐⭐ (4)</SelectItem>
        <SelectItem value="5">⭐⭐⭐⭐⭐ (5)</SelectItem>
      </SelectContent>
    </Select>,

    <Select key="application" value={applicationFilter} onValueChange={setApplicationFilter}>
      <SelectTrigger className="w-full sm:w-48">
        <SelectValue placeholder="Filter by application" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="">All Applications</SelectItem>
        {applicationsForFilter.map((app) => (
          <SelectItem key={app.applicationId} value={app.applicationId.toString()}>
            <div className="flex flex-col">
              <span className="font-medium">{app.companyName}</span>
              <span className="text-xs text-muted-foreground">{app.jobTitle}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>,

    <Select key="favorite" value={favoriteFilter} onValueChange={setFavoriteFilter}>
      <SelectTrigger className="w-full sm:w-40">
        <SelectValue placeholder="Favorites" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="">All Questions</SelectItem>
        <SelectItem value="true">⭐ Favorites Only</SelectItem>
        <SelectItem value="false">Non-Favorites</SelectItem>
      </SelectContent>
    </Select>
  ];

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-destructive mb-2">Error loading questions</p>
          <Button onClick={() => refetch()}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Main Content */}
      <Table
        useModernUI={true}
        title="Question Bank"
        description="Manage your interview questions and preparation notes"
        headerActions={headerActions}
        filters={filters}
        table_head={tableHead}
        table_rows={tableData}
        customRenderers={customRenderers}
        actions={true}

        handleOpenView={handleView}
        handleOpenEdit={handleEdit}
        handleOpenDelete={handleDelete}
        isLoading={isLoading}
        // Built-in pagination props
        currentPage={currentPage}
        totalPages={totalPages}
        totalCount={totalCount}
        itemsPerPage={itemsPerPage}
        onPageChange={handlePageChange}
        onItemsPerPageChange={handleItemsPerPageChange}
        // Built-in sorting props
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSort={handleSort}
        sortableColumns={["answerStatus", "difficulty", "createdAt"]}
        emptyState={
          <div className="text-center py-8 text-muted-foreground">
            <HelpCircle className="mx-auto h-12 w-12 mb-4 opacity-50" />
            <p className="text-lg font-medium mb-2">No questions found</p>
            <p>Start building your question bank by adding interview questions.</p>
          </div>
        }
      />

      {/* Modals */}
      <AddModal
        openAdd={isAddModalOpen}
        setOpenAdd={setIsAddModalOpen}
        refetch={() => {
          queryClient.invalidateQueries("questions");
          queryClient.invalidateQueries("applications-for-questions-filter");
        }}
      />

      <EditModal
        id={selectedQuestion?.questionId}
        openEdit={isEditModalOpen}
        setOpenEdit={setIsEditModalOpen}
        refetch={() => {
          queryClient.invalidateQueries("questions");
          queryClient.invalidateQueries("applications-for-questions-filter");
        }}
      />

      <ViewModal
        question={selectedQuestion}
        open={isViewModalOpen}
        setOpen={setIsViewModalOpen}
      />

      <DeleteModal
        id={selectedQuestion?.questionId}
        openDelete={isDeleteModalOpen}
        setOpenDelete={setIsDeleteModalOpen}
        refetch={() => {
          queryClient.invalidateQueries("questions");
          queryClient.invalidateQueries("applications-for-questions-filter");
        }}
      />
    </div>
  );
};

export default Questions;