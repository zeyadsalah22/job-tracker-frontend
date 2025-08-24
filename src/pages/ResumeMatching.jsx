import React, { useState, useEffect } from "react";
import { useQuery } from "react-query";
import { useAxiosPrivate } from "../utils/axios";
import { 
  FileText, 
  TrendingUp, 
  Award, 
  Calendar, 
  Plus,
  BarChart3,
  Target,
  Search,
  Filter
} from "lucide-react";
import Button from "../components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import Input from "../components/ui/Input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/Select";
import Table from "../components/Table";
import RunTestModal from "../components/resume-matching/RunTestModal";
import ViewModal from "../components/resume-matching/ViewModal";
import DeleteModal from "../components/resume-matching/DeleteModal";

const ResumeMatching = () => {
  const axiosPrivate = useAxiosPrivate();
  
  // Modal states
  const [openRunTest, setOpenRunTest] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedTest, setSelectedTest] = useState(null);
  
  // Table states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  
  // Filters
  const [scoreFilter, setScoreFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, scoreFilter, dateFilter, sortBy, sortOrder]);

  // Fetch stats for cards
  const fetchStats = async () => {
    try {
      const response = await axiosPrivate.get('/resumetest/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching stats:', error);
      return {
        totalTests: 0,
        averageScore: 0,
        bestScore: 0,
        testsThisMonth: 0
      };
    }
  };

  const { data: stats = {} } = useQuery(
    ["resume-stats"],
    fetchStats,
    {
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false
    }
  );

  // Fetch score distribution
  const fetchScoreDistribution = async () => {
    try {
      const response = await axiosPrivate.get('/resumetest/scores');
      return response.data;
    } catch (error) {
      console.error('Error fetching score distribution:', error);
      return {
        range_90_100: 0,
        range_80_89: 0,
        range_70_79: 0,
        range_60_69: 0,
        range_50_59: 0,
        range_0_59: 0
      };
    }
  };

  const { data: scoreDistribution = {} } = useQuery(
    ["resume-score-distribution"],
    fetchScoreDistribution,
    {
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false
    }
  );

  // Fetch CVs for resume names
  const fetchCvs = async () => {
    try {
      const response = await axiosPrivate.get('/cvs');
      return response.data || [];
    } catch (error) {
      console.error('Error fetching CVs:', error);
      return [];
    }
  };

  const { data: cvs = [] } = useQuery(["cvs"], fetchCvs);

  // Fetch resume tests
  const fetchResumeTests = async () => {
    try {
      const params = {
        PageNumber: currentPage,
        PageSize: itemsPerPage,
      };

      if (searchTerm.trim()) {
        params.SearchTerm = searchTerm.trim();
      }

      if (scoreFilter) {
        params.AtsScore = parseInt(scoreFilter);
      }

      if (sortBy) {
        params.SortBy = sortBy;
        params.SortDescending = sortOrder === 'desc';
      }

      const response = await axiosPrivate.get('/resumetest', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching resume tests:', error);
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

  const { data: resumeTestsData, isLoading, refetch } = useQuery(
    ["resumeTests", { currentPage, itemsPerPage, searchTerm, scoreFilter, sortBy, sortOrder }],
    fetchResumeTests,
    {
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false
    }
  );

  // Create resume lookup map
  const resumeMap = {};
  cvs.forEach(cv => {
    resumeMap[cv.resumeId] = cv;
  });

  // Helper functions
  const getScoreColor = (score) => {
    if (score >= 85) return "text-green-600";
    if (score >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBgColor = (score) => {
    if (score >= 85) return "bg-green-100";
    if (score >= 70) return "bg-yellow-100";
    return "bg-red-100";
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    // Option 1: Full date and time (e.g., "Aug 24, 2025, 02:30 PM")
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
    { name: "Test Date", key: "testDate" },
    { name: "Resume", key: "resume" },
    { name: "ATS Score", key: "atsScore" },
    { name: "Missing Skills", key: "missingSkills" },
    { name: "Status", key: "status" }
  ];

  const tableData = resumeTestsData?.items?.map((test) => {
    const resumeData = resumeMap[test.resumeId];
    const resumeName = resumeData ? `Resume ${test.resumeId}` : `Resume ${test.resumeId}`;
    
    return {
      id: test.testId,
      testDate: formatDate(test.testDate),
      resume: (
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{resumeName}</span>
        </div>
      ),
      atsScore: (
        <div className="flex items-center gap-2">
          <div className={`px-2 py-1 rounded-full text-sm font-medium ${getScoreBgColor(test.atsScore)} ${getScoreColor(test.atsScore)}`}>
            {test.atsScore}%
          </div>
        </div>
      ),
      missingSkills: (
        <div className="flex flex-wrap gap-1">
          {test.missingSkills?.slice(0, 2).map((skill, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {skill}
            </Badge>
          ))}
          {test.missingSkills?.length > 2 && (
            <Badge variant="outline" className="text-xs">
              +{test.missingSkills.length - 2} more
            </Badge>
          )}
        </div>
      ),
      status: (
        <Badge variant="outline" className="bg-green-100 text-green-800">
          Complete
        </Badge>
      ),
      _originalData: test
    };
  }) || [];

  // Event handlers
  const handleView = (row) => {
    const test = row._originalData || row;
    setSelectedTest(test);
    setOpenView(true);
  };

  const handleDelete = (row) => {
    const test = row._originalData || row;
    setSelectedTest(test);
    setOpenDelete(true);
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
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

  // Score distribution data for chart
  const scoreDistributionData = [
    { range: "90-100", count: scoreDistribution.range_90_100 || 0, color: "bg-green-500" },
    { range: "80-89", count: scoreDistribution.range_80_89 || 0, color: "bg-blue-500" },
    { range: "70-79", count: scoreDistribution.range_70_79 || 0, color: "bg-yellow-500" },
    { range: "60-69", count: scoreDistribution.range_60_69 || 0, color: "bg-orange-500" },
    { range: "50-59", count: scoreDistribution.range_50_59 || 0, color: "bg-red-400" },
    { range: "0-49", count: scoreDistribution.range_0_59 || 0, color: "bg-red-600" }
  ];

  const maxCount = Math.max(...scoreDistributionData.map(item => item.count), 1);

  // Filters for the table
  const filters = [
    <div key="search" className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Search resumes..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="pl-10 w-full sm:w-64"
      />
    </div>,

    <Select key="score" value={scoreFilter} onValueChange={setScoreFilter}>
      <SelectTrigger className="w-full sm:w-40">
        <SelectValue placeholder="Score range" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="">All Scores</SelectItem>
        <SelectItem value="90">90-100</SelectItem>
        <SelectItem value="80">80-89</SelectItem>
        <SelectItem value="70">70-79</SelectItem>
        <SelectItem value="60">60-69</SelectItem>
        <SelectItem value="50">50-59</SelectItem>
        <SelectItem value="0">0-49</SelectItem>
      </SelectContent>
    </Select>
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Resume Matching & ATS Analysis</h1>
          <p className="text-muted-foreground">
            Optimize your resumes for better ATS compatibility and job matching
          </p>
        </div>
        <Button onClick={() => setOpenRunTest(true)} size="md">
          <Plus className="h-4 w-4 mr-2" />
          Run New Test
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            <FileText className="h-8 w-8 mx-auto mb-2 mt-4 text-primary" />
            <div className="text-2xl font-bold">{stats.totalTests || 0}</div>
            <p className="text-sm text-muted-foreground">Total Tests</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <TrendingUp className="h-8 w-8 mx-auto mb-2 mt-4 text-blue-500" />
            <div className="text-2xl font-bold">{stats.averageScore || 0}%</div>
            <p className="text-sm text-muted-foreground">Average Score</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <Award className="h-8 w-8 mx-auto mb-2 mt-4 text-green-500" />
            <div className="text-2xl font-bold">{stats.bestScore || 0}%</div>
            <p className="text-sm text-muted-foreground">Best Score</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <Calendar className="h-8 w-8 mx-auto mb-2 mt-4 text-purple-500" />
            <div className="text-2xl font-bold">{stats.testsThisMonth || 0}</div>
            <p className="text-sm text-muted-foreground">This Month</p>
          </CardContent>
        </Card>
      </div>

      {/* Score Distribution Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Score Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {scoreDistributionData.map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-16 text-sm font-medium">{item.range}</div>
                  <div className="flex-1">
                    <div className="h-6 bg-muted rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${item.color} transition-all duration-500`}
                        style={{ width: `${(item.count / maxCount) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div className="w-8 text-sm text-muted-foreground">{item.count}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Recent Tests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {tableData.slice(0, 5).map((test, index) => (
                <div key={test.id} className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-muted text-xs font-medium">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">Resume {test._originalData?.resumeId}</p>
                    <p className="text-xs text-muted-foreground">{test.testDate}</p>
                  </div>
                  <div className={`text-sm font-medium ${getScoreColor(test._originalData?.atsScore)}`}>
                    {test._originalData?.atsScore}%
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Test Results Table */}
      <Table
        useModernUI={true}
        title="Test Results"
        description={`${resumeTestsData?.totalCount || 0} total tests`}
        headerActions={[]}
        filters={filters}
        table_head={tableHead}
        table_rows={tableData}
        actions={true}
        handleOpenView={handleView}
        handleOpenDelete={handleDelete}
        isLoading={isLoading}
        
        // Built-in pagination
        currentPage={currentPage}
        totalPages={resumeTestsData?.totalPages || 1}
        totalCount={resumeTestsData?.totalCount || 0}
        itemsPerPage={itemsPerPage}
        onPageChange={handlePageChange}
        onItemsPerPageChange={handleItemsPerPageChange}
        
        // Built-in sorting
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSort={handleSort}
        sortableColumns={['testDate', 'atsScore']}
        
        emptyState={{
          title: "No tests found",
          description: "Run your first resume test to get started with ATS analysis.",
          action: (
            <Button onClick={() => setOpenRunTest(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Run New Test
            </Button>
          )
        }}
      />

      {/* Modals */}
      {openRunTest && (
        <RunTestModal
          openRunTest={openRunTest}
          setOpenRunTest={setOpenRunTest}
          refetch={refetch}
        />
      )}

      {openView && (
        <ViewModal
          test={selectedTest}
          open={openView}
          setOpen={setOpenView}
        />
      )}

      {openDelete && (
        <DeleteModal
          id={selectedTest?.testId}
          openDelete={openDelete}
          setOpenDelete={setOpenDelete}
          refetch={refetch}
        />
      )}
    </div>
  );
};

export default ResumeMatching;