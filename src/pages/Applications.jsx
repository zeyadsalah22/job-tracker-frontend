import React, { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "react-query";
import { useAxiosPrivate } from "../utils/axios";
import { useSearchParams } from "react-router-dom";
import { format } from "date-fns";
import { toast } from "react-toastify";
import {
  Search,
  Plus,
  FileDown,
  FileUp,
  Building2,
  ExternalLink,
} from "lucide-react";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/Select";
import { Badge } from "../components/ui/Badge";
import { Progress } from "../components/ui/Progress";
import Table from "../components/Table";
import AddModal from "../components/applications/AddModal";
import EditModal from "../components/applications/EditModal";
import ViewModal from "../components/applications/ViewModal";
import DeleteModal from "../components/applications/DeleteModal";
import { fetchAllData, exportToCSV } from "../utils/csvExport";
import OnboardingTour from "../components/onboarding/OnboardingTour";

const Applications = () => {
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();

  // State management
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [stageFilter, setStageFilter] = useState("");
  const [companyFilter, setCompanyFilter] = useState("");
  const [jobTypeFilter, setJobTypeFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortBy, setSortBy] = useState("submissionDate");
  const [sortOrder, setSortOrder] = useState("desc");

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [isExporting, setIsExporting] = useState(false);

  // Fetch applications with filters and pagination
  const fetchApplications = async () => {
    const params = new URLSearchParams({
      SearchTerm: searchTerm,
      PageNumber: currentPage.toString(),
      PageSize: itemsPerPage.toString(),
      SortBy: sortBy,
      SortDescending: sortOrder === "desc" ? "true" : "false",
    });

    if (statusFilter && statusFilter !== "") params.append("Status", statusFilter);
    if (stageFilter && stageFilter !== "all") params.append("Stage", stageFilter);
    if (companyFilter && companyFilter !== "") params.append("CompanyName", companyFilter);
    if (jobTypeFilter && jobTypeFilter !== "") params.append("JobType", jobTypeFilter);

    const response = await axiosPrivate.get(`/applications?${params}`);
    return response.data;
  };

  // Fetch all applications for company filter (no pagination)
  const fetchAllApplicationsForFilters = async () => {
    const response = await axiosPrivate.get("/applications?PageSize=500");
    return response.data?.items || [];
  };

  const {
    data: applicationsData,
    isLoading,
    error,
    refetch,
  } = useQuery(
    ["applications", searchTerm, statusFilter, stageFilter, companyFilter, jobTypeFilter, currentPage, itemsPerPage, sortBy, sortOrder],
    fetchApplications,
    {
      keepPreviousData: true,
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );

  const { data: allApplicationsForFilters = [] } = useQuery(
    ["applications-for-filters"],
    fetchAllApplicationsForFilters,
    {
      staleTime: 10 * 60 * 1000, // 10 minutes
    }
  );

  const applications = applicationsData?.items || [];
  const totalPages = applicationsData?.totalPages || 1;
  const totalCount = applicationsData?.totalCount || 0;

  // Auto-open view modal from URL parameter (from search results)
  useEffect(() => {
    const viewId = searchParams.get('view');
    if (viewId) {
      // First check if item is in current page
      const appToView = applications.find(app => app.applicationId?.toString() === viewId || app.id?.toString() === viewId);
      if (appToView) {
        setSelectedApplication(appToView);
        setIsViewModalOpen(true);
        // Remove the query param after opening
        searchParams.delete('view');
        setSearchParams(searchParams, { replace: true });
      } else {
        // If not in current page, fetch it directly by ID
        axiosPrivate.get(`/applications/${viewId}`)
          .then(response => {
            const fetchedApp = response.data;
            if (fetchedApp) {
              setSelectedApplication(fetchedApp);
              setIsViewModalOpen(true);
              // Remove the query param after opening
              searchParams.delete('view');
              setSearchParams(searchParams, { replace: true });
            }
          })
          .catch(error => {
            console.error('Error fetching application by ID:', error);
            // Remove the query param even if fetch fails
            searchParams.delete('view');
            setSearchParams(searchParams, { replace: true });
          });
      }
    }
  }, [searchParams, setSearchParams, applications, axiosPrivate]);

  // Extract unique companies from all applications data (only dynamic filter needed)
  const getUniqueCompanies = () => {
    const companies = new Set();
    allApplicationsForFilters.forEach(app => {
      if (app.companyName && app.companyName.trim()) {
        companies.add(app.companyName.trim());
      }
    });
    return Array.from(companies).sort();
  };

  const uniqueCompanies = getUniqueCompanies();

  // Helper functions
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "accepted": return "success";
      case "rejected": return "destructive";
      case "pending": return "warning";
      default: return "secondary";
    }
  };

  const getStageColor = (stage) => {
    switch (stage) {
      case "Applied": return "secondary";
      case "PhoneScreen": return "warning";
      case "Assessment": return "warning";
      case "HrInterview": return "primary";
      case "TechnicalInterview": return "primary";
      case "Offer": return "success";
      default: return "secondary";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return format(new Date(dateString), "MMM dd, yyyy");
    } catch (error) {
      return "Invalid date";
    }
  };

  // Table configuration
  const tableHead = [
    { name: "Company", key: "companyName" },
    { name: "Job Title", key: "jobTitle" },
    { name: "Job Type", key: "jobType" },
    { name: "Submission Date", key: "submissionDate" },
    { name: "Stage", key: "stage" },
    { name: "Status", key: "status" },
    { name: "ATS Score", key: "atsScore" },
  ];

  // Prepare table data
  const tableData = applications.map((app) => ({
    companyName: app.companyName || "N/A",
    jobTitle: app.jobTitle || "N/A",
    jobType: app.jobType || "N/A",
    submissionDate: formatDate(app.submissionDate),
    stage: app.stage || "N/A",
    status: app.status || "N/A",
    atsScore: app.atsScore || 0,
    _originalData: app, // Store original data for actions
  }));

  // Custom renderers for specific columns
  const customRenderers = {
    companyName: (value, row) => (
      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setSelectedApplication(row._originalData);
            setIsViewModalOpen(true);
          }}
          className="p-0 h-auto font-medium text-primary hover:text-primary/80"
        >
          <Building2 className="w-4 h-4 mr-1" />
          {value}
        </Button>
      </div>
    ),
    stage: (value) => (
      <Badge variant={getStageColor(value)} className="text-xs">
        {value === "PhoneScreen" ? "Phone Screen" :
         value === "HrInterview" ? "HR Interview" :
         value === "TechnicalInterview" ? "Technical Interview" :
         value}
      </Badge>
    ),
    status: (value) => (
      <Badge variant={getStatusColor(value)} className="text-xs">
        {value}
      </Badge>
    ),
    atsScore: (value) => (
      <div className="flex items-center space-x-2">
        <Progress value={value} className="w-16 h-2" />
        <span className="text-xs font-medium">{value}%</span>
      </div>
    ),
  };

  // Handle actions
  const handleView = (row) => {
    const application = row._originalData || row;
    setSelectedApplication(application);
    setIsViewModalOpen(true);
  };

  const handleEdit = (row) => {
    const application = row._originalData || row;
    setSelectedApplication(application);
    setIsEditModalOpen(true);
  };

  const handleDelete = (row) => {
    const application = row._originalData || row;
    setSelectedApplication(application);
    setIsDeleteModalOpen(true);
  };

  // Export handler
  const handleExport = async () => {
    try {
      setIsExporting(true);
      toast.info('Preparing export... This may take a moment for large datasets.');

      // Fetch all applications using pagination
      const allApplications = await fetchAllData(
        (pageNumber, pageSize) => axiosPrivate.get('/applications', {
          params: { PageNumber: pageNumber, PageSize: pageSize }
        })
      );

      // Transform data for CSV export
      const csvData = allApplications.map(app => ({
        'Company Name': app.companyName || app.company?.name || 'N/A',
        'Job Title': app.jobTitle || 'N/A',
        'Job Type': app.jobType || 'N/A',
        'Submission Date': app.submissionDate ? format(new Date(app.submissionDate), 'MMM dd, yyyy') : 'N/A',
        'Stage': formatStageForExport(app.stage),
        'Status': app.status || 'N/A',
        'ATS Score': app.atsScore || 0,
        'Description': app.description || '',
        'Link': app.link || '',
        'Submitted CV ID': app.submittedCvId || '',
        'Created At': app.createdAt ? format(new Date(app.createdAt), 'MMM dd, yyyy') : 'N/A',
        'Updated At': app.updatedAt ? format(new Date(app.updatedAt), 'MMM dd, yyyy') : 'N/A'
      }));

      // Export to CSV
      exportToCSV(csvData, 'applications');
      
      toast.success(`Successfully exported ${allApplications.length} application(s)!`);
    } catch (error) {
      console.error('Error exporting applications:', error);
      toast.error('Failed to export applications. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  // Helper function to format stage enum for export
  const formatStageForExport = (stage) => {
    if (!stage) return 'N/A';
    // Stage values from API: Applied, PhoneScreen, HrInterview, TechnicalInterview, OnlineAssessment, FinalRound, Offer, Rejected
    switch (stage) {
      case 'PhoneScreen': return 'Phone Screen';
      case 'HrInterview': return 'HR Interview';
      case 'TechnicalInterview': return 'Technical Interview';
      case 'OnlineAssessment': return 'Online Assessment';
      case 'FinalRound': return 'Final Round';
      case 'Applied': return 'Applied';
      case 'Offer': return 'Offer';
      case 'Rejected': return 'Rejected';
      default: return stage;
    }
  };

  // Header actions
  const headerActions = [
    <Button key="import" variant="outline" size="sm" disabled>
      <FileUp className="w-4 h-4 mr-2" />
      Import
    </Button>,
    <Button 
      key="export" 
      variant="outline" 
      size="sm"
      onClick={handleExport}
      disabled={isExporting}
    >
      <FileDown className="w-4 h-4 mr-2" />
      {isExporting ? 'Exporting...' : 'Export'}
    </Button>,
    <Button key="add" onClick={() => setIsAddModalOpen(true)} data-tour="add-application-btn">
      <Plus className="w-4 h-4 mr-2" />
      Add Application
    </Button>
  ];

  // Filters
  const filters = [
    <div key="search" className="flex-1" data-tour="filters">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder="Search applications..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>
    </div>,
    
    <Select key="status" value={statusFilter} onValueChange={setStatusFilter}>
      <SelectTrigger className="w-full sm:w-40">
        <SelectValue placeholder="Status" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="">All Status</SelectItem>
        <SelectItem value="Pending">Pending</SelectItem>
        <SelectItem value="Accepted">Accepted</SelectItem>
        <SelectItem value="Rejected">Rejected</SelectItem>
      </SelectContent>
    </Select>,

    <Select key="stage" value={stageFilter} onValueChange={setStageFilter}>
      <SelectTrigger className="w-full sm:w-40">
        <SelectValue placeholder="Stage" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Stages</SelectItem>
        <SelectItem value="Applied">Applied</SelectItem>
        <SelectItem value="PhoneScreen">Phone Screen</SelectItem>
        <SelectItem value="Assessment">Assessment</SelectItem>
        <SelectItem value="HrInterview">HR Interview</SelectItem>
        <SelectItem value="TechnicalInterview">Technical Interview</SelectItem>
        <SelectItem value="Offer">Offer</SelectItem>
      </SelectContent>
    </Select>,

    <Select key="company" value={companyFilter} onValueChange={setCompanyFilter}>
      <SelectTrigger className="w-full sm:w-48">
        <SelectValue placeholder="Filter by company" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="">All Companies</SelectItem>
        {uniqueCompanies.map((company) => (
          <SelectItem key={company} value={company}>
            {company}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>,

    <Select key="jobType" value={jobTypeFilter} onValueChange={setJobTypeFilter}>
      <SelectTrigger className="w-full sm:w-40">
        <SelectValue placeholder="Job Type" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="">All Types</SelectItem>
        <SelectItem value="Full time">Full time</SelectItem>
        <SelectItem value="Part time">Part time</SelectItem>
        <SelectItem value="Contract">Contract</SelectItem>
        <SelectItem value="Internship">Internship</SelectItem>
      </SelectContent>
    </Select>
  ];

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

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-destructive mb-2">Error loading applications</p>
          <Button onClick={() => refetch()}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <OnboardingTour page="applications" />
      <div className="space-y-6" data-tour="application-table">
        <Table
          useModernUI={true}
          title="Applications"
          description="Track and manage your job applications"
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
        sortableColumns={["submissionDate", "companyName", "jobTitle", "stage", "status"]}
        emptyState="No applications found. Add your first application to get started!"
      />

      {/* Modals */}
      <AddModal
        openAdd={isAddModalOpen}
        setOpenAdd={setIsAddModalOpen}
        refetch={() => {
          queryClient.invalidateQueries("applications");
          queryClient.invalidateQueries("applications-for-filters");
        }}
      />

      <EditModal
        id={selectedApplication?.applicationId}
        openEdit={isEditModalOpen}
        setOpenEdit={setIsEditModalOpen}
        refetch={() => {
          queryClient.invalidateQueries("applications");
          queryClient.invalidateQueries("applications-for-filters");
        }}
      />

      <ViewModal
        application={selectedApplication}
        open={isViewModalOpen}
        setOpen={setIsViewModalOpen}
      />

      <DeleteModal
        id={selectedApplication?.applicationId}
        openDelete={isDeleteModalOpen}
        setOpenDelete={setIsDeleteModalOpen}
        refetch={() => {
          queryClient.invalidateQueries("applications");
          queryClient.invalidateQueries("applications-for-filters");
        }}
      />
      </div>
    </>
  );
};

export default Applications;