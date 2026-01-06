import { useState, useEffect } from "react";
import { useAxiosPrivate } from "../utils/axios";
import { toast } from "react-toastify";
import Button from "../components/ui/Button";
import { Plus, Filter, Search, Users } from "lucide-react";
import AddQuestionModal from "../components/community/interview-questions/AddQuestionModal";
import QuestionDetailModal from "../components/community/interview-questions/QuestionDetailModal";
import QuestionCard from "../components/community/interview-questions/QuestionCard";
import { Select } from "../components/ui/Select";
import Input from "../components/ui/Input";
import { Badge } from "../components/ui/Badge";
import SearchableSelect from "../components/ui/SearchableSelect";
import SortButtons from "../components/ui/SortButtons";

const InterviewQuestions = () => {
  const axiosPrivate = useAxiosPrivate();
  
  const [questions, setQuestions] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 20,
    totalCount: 0,
    totalPages: 0,
    hasNext: false,
    hasPrevious: false,
  });

  // Filters
  const [filters, setFilters] = useState({
    searchText: "",
    companyIds: [],
    roleType: null,
    questionType: null,
    difficulty: null,
    sortBy: "MostRecent",
  });

  const roleTypes = [
    { value: null, label: "All Roles" },
    { value: "0", label: "Software Engineer" },
    { value: "1", label: "Product Manager" },
    { value: "2", label: "Data Scientist" },
    { value: "3", label: "Data Analyst" },
    { value: "4", label: "UX/UI Designer" },
    { value: "5", label: "DevOps Engineer" },
    { value: "6", label: "QA Engineer" },
    { value: "7", label: "Project Manager" },
    { value: "8", label: "Business Analyst" },
    { value: "9", label: "Backend Developer" },
    { value: "10", label: "Frontend Developer" },
    { value: "11", label: "Full Stack Developer" },
    { value: "12", label: "Mobile Developer" },
    { value: "13", label: "Security Engineer" },
    { value: "14", label: "Cloud Architect" },
  ];

  const questionTypes = [
    { value: null, label: "All Types" },
    { value: "0", label: "Technical" },
    { value: "1", label: "Behavioral" },
    { value: "2", label: "Case Study" },
    { value: "3", label: "System Design" },
    { value: "4", label: "Coding" },
    { value: "5", label: "Problem Solving" },
    { value: "6", label: "Leadership" },
    { value: "7", label: "Situational" },
  ];

  const difficulties = [
    { value: null, label: "All Difficulties" },
    { value: "0", label: "Easy" },
    { value: "1", label: "Medium" },
    { value: "2", label: "Hard" },
  ];

  const sortOptions = [
    { value: "MostRecent", label: "Most Recent" },
    { value: "MostAsked", label: "Most Asked" },
    { value: "MostAnswered", label: "Most Answered" },
  ];

  useEffect(() => {
    fetchQuestions();
    fetchCompanies();
  }, [filters, pagination.currentPage]);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      
      const params = new URLSearchParams({
        page: pagination.currentPage.toString(),
        pageSize: pagination.pageSize.toString(),
        sortBy: filters.sortBy,
      });

      if (filters.searchText) params.append("searchText", filters.searchText);
      if (filters.roleType !== null) params.append("roleType", filters.roleType);
      if (filters.questionType !== null) params.append("questionType", filters.questionType);
      if (filters.difficulty !== null) params.append("difficulty", filters.difficulty);
      if (filters.companyIds.length > 0) {
        filters.companyIds.forEach(id => params.append("companyIds", id));
      }

      const response = await axiosPrivate.get(`/community/interview-questions?${params.toString()}`);
      const fetchedQuestions = response.data.items || response.data;
      setQuestions(fetchedQuestions);
      
      // If we have a selected question, try to find it in the new list and update it
      if (selectedQuestion) {
        const updatedQuestion = fetchedQuestions.find(q => q.questionId === selectedQuestion.questionId);
        if (updatedQuestion) {
          setSelectedQuestion(updatedQuestion);
        }
      }
      
      // Extract pagination from headers
      if (response.headers["x-pagination-totalcount"]) {
        setPagination(prev => ({
          ...prev,
          totalCount: parseInt(response.headers["x-pagination-totalcount"]),
          totalPages: parseInt(response.headers["x-pagination-totalpages"]),
          hasNext: response.headers["x-pagination-hasnext"] === "true",
          hasPrevious: response.headers["x-pagination-hasprevious"] === "true",
        }));
      }
    } catch (error) {
      console.error("Error fetching questions:", error);
      toast.error("Failed to load interview questions");
    } finally {
      setLoading(false);
    }
  };

  const fetchCompanies = async () => {
    try {
      const response = await axiosPrivate.get("/companies", {
        params: {
          PageSize: 100,
          PageNumber: 1,
        },
      });
      
      const data = response.data;
      let normalizedCompanies = [];

      if (Array.isArray(data)) {
        normalizedCompanies = data;
      } else if (Array.isArray(data?.items)) {
        normalizedCompanies = data.items;
      } else if (Array.isArray(data?.companies)) {
        normalizedCompanies = data.companies;
      } else if (Array.isArray(data?.data)) {
        normalizedCompanies = data.data;
      }

      setCompanies(normalizedCompanies);
    } catch (error) {
      console.error("Error fetching companies:", error);
      setCompanies([]);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const handleCompanyToggle = (companyId) => {
    setFilters(prev => ({
      ...prev,
      companyIds: prev.companyIds.includes(companyId)
        ? prev.companyIds.filter(id => id !== companyId)
        : [...prev.companyIds, companyId]
    }));
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const handleQuestionCreated = () => {
    setPagination(prev => ({ ...prev, currentPage: 1 }));
    fetchQuestions();
    setIsAddModalOpen(false);
  };

  const handleQuestionClick = (question) => {
    setSelectedQuestion(question);
  };

  const handleQuestionUpdate = async () => {
    // If a question detail modal is open, refresh its data first
    if (selectedQuestion) {
      await fetchQuestionDetail(selectedQuestion.questionId);
    }
    
    // Then refresh the question list to sync all questions
    // fetchQuestions will automatically update selectedQuestion if it exists in the list
    await fetchQuestions();
  };

  const fetchQuestionDetail = async (questionId) => {
    try {
      const response = await axiosPrivate.get(`/community/interview-questions/${questionId}`);
      setSelectedQuestion(response.data);
    } catch (error) {
      console.error("Error fetching question details:", error);
      toast.error("Failed to load question details");
    }
  };

  const handleNextPage = () => {
    if (pagination.hasNext) {
      setPagination(prev => ({ ...prev, currentPage: prev.currentPage + 1 }));
    }
  };

  const handlePreviousPage = () => {
    if (pagination.hasPrevious) {
      setPagination(prev => ({ ...prev, currentPage: prev.currentPage - 1 }));
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Interview Questions Database</h1>
            <p className="text-gray-600 mt-1">Browse and share interview questions from real job seekers</p>
          </div>
          <Button onClick={() => setIsAddModalOpen(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Interview Question
          </Button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
          {/* Search Bar */}
          <div>
            <Input
              placeholder="Search questions..."
              value={filters.searchText}
              onChange={(e) => handleFilterChange("searchText", e.target.value)}
              className="w-full"
            />
          </div>

          {/* Filter Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Role Type */}
            <SearchableSelect
              options={roleTypes}
              value={filters.roleType}
              onChange={(value) => handleFilterChange("roleType", value)}
              placeholder="All Roles"
              showSearch={true}
            />

            {/* Question Type */}
            <SearchableSelect
              options={questionTypes}
              value={filters.questionType}
              onChange={(value) => handleFilterChange("questionType", value)}
              placeholder="All Types"
              showSearch={true}
            />

            {/* Difficulty */}
            <SearchableSelect
              options={difficulties}
              value={filters.difficulty}
              onChange={(value) => handleFilterChange("difficulty", value)}
              placeholder="All Difficulties"
              showSearch={false}
            />

            {/* Company Filter */}
            <SearchableSelect
              options={[
                { value: null, label: "All Companies" },
                ...companies.map(company => ({
                  value: company.companyId,
                  label: company.name
                }))
              ]}
              value={filters.companyIds[0] || null}
              onChange={(value) => {
                handleFilterChange("companyIds", value ? [value] : []);
              }}
              placeholder="All Companies"
              showSearch={true}
            />
          </div>

          {/* Sort and Filters */}
          <div className="flex items-center justify-start flex-wrap gap-4 pt-2 border-t">
            {/* Sort Buttons */}
            <SortButtons
              options={sortOptions}
              value={filters.sortBy}
              onChange={(value) => handleFilterChange("sortBy", value)}
            />
          </div>
        </div>
      </div>

      {/* Questions Feed */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : questions.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No questions found</h3>
          <p className="text-gray-600 mb-4">Be the first to share an interview question!</p>
          <Button onClick={() => setIsAddModalOpen(true)}>Add First Question</Button>
        </div>
      ) : (
        <div className="space-y-4">
          {questions.map(question => (
            <QuestionCard 
              key={question.questionId} 
              question={question} 
              onClick={() => handleQuestionClick(question)}
              onUpdate={handleQuestionUpdate}
            />
          ))}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="bg-white rounded-lg shadow-sm p-4 flex justify-between items-center">
              <div className="text-sm text-gray-600">
                Page {pagination.currentPage} of {pagination.totalPages} ({pagination.totalCount} questions)
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={handlePreviousPage}
                  disabled={!pagination.hasPrevious}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  onClick={handleNextPage}
                  disabled={!pagination.hasNext}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Add Question Modal */}
      <AddQuestionModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onQuestionCreated={handleQuestionCreated}
        companies={companies}
      />

      {/* Question Detail Modal */}
      {selectedQuestion && (
        <QuestionDetailModal
          isOpen={!!selectedQuestion}
          onClose={() => setSelectedQuestion(null)}
          question={selectedQuestion}
          onUpdate={handleQuestionUpdate}
        />
      )}
    </div>
  );
};

export default InterviewQuestions;

