import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from "react-query";
import { useAxiosPrivate } from "../utils/axios";
import { format } from "date-fns";
import { toast } from "react-toastify";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/Select";
import { Badge } from "../components/ui/Badge";
import { 
  Search, 
  CheckCircle, 
  XCircle,
  ChevronLeft,
  ChevronRight,
  Eye,
  Filter,
} from 'lucide-react';
import Table from "../components/Table";
import RejectRequestModal from "../components/companies/RejectRequestModal";
import CompanyRequestViewModal from "../components/companies/CompanyRequestViewModal";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../components/ui/Dialog";

export default function CompanyRequests() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [industryFilter, setIndustryFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isApproveConfirmOpen, setIsApproveConfirmOpen] = useState(false);

  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();

  // Get user role from localStorage
  const userRole = localStorage.getItem("role");
  const isAdmin = userRole === "Admin" || userRole === "1" || parseInt(userRole) === 1;

  // Redirect if not admin
  if (!isAdmin) {
    window.location.href = '/dashboard';
    return null;
  }

  // Fetch industries for filter dropdown
  const fetchIndustries = async () => {
    try {
      const response = await axiosPrivate.get('/industries/all');
      return response.data;
    } catch (error) {
      console.error("Error fetching industries:", error);
      return [];
    }
  };

  const { data: industries = [] } = useQuery(['industries'], fetchIndustries);

  // Fetch company requests
  const fetchCompanyRequests = async () => {
    try {
      const response = await axiosPrivate.get('/company-requests', {
        params: {
          SearchTerm: searchTerm || undefined,
          RequestStatus: statusFilter !== '' ? parseInt(statusFilter) : undefined,
          IndustryId: industryFilter || undefined,
          PageNumber: currentPage,
          PageSize: itemsPerPage,
          SortBy: 'RequestedAt',
          SortDescending: true,
        }
      });
      
      return {
        requests: response.data.items || [],
        totalPages: response.data.totalPages || 1,
        totalCount: response.data.totalCount || 0,
        hasNext: response.data.hasNext || false,
        hasPrevious: response.data.hasPrevious || false
      };
    } catch (error) {
      console.error("Error fetching company requests:", error);
      toast.error("Failed to fetch company requests");
      return { requests: [], totalPages: 1, totalCount: 0, hasNext: false, hasPrevious: false };
    }
  };

  const { data: requestsData = { requests: [], totalPages: 1, totalCount: 0 }, isLoading, refetch } = useQuery(
    ["company-requests", searchTerm, statusFilter, industryFilter, currentPage, itemsPerPage],
    fetchCompanyRequests,
    {
      keepPreviousData: true,
      staleTime: 30000,
    }
  );

  // Approve request mutation
  const approveMutation = useMutation(
    async (requestId) => {
      await axiosPrivate.post(`/company-requests/${requestId}/approve`);
    },
    {
      onSuccess: () => {
        toast.success("Company request approved successfully");
        queryClient.invalidateQueries(["company-requests"]);
        setIsApproveConfirmOpen(false);
        setSelectedRequest(null);
      },
      onError: (error) => {
        let errorMessage = "Failed to approve request";
        if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        } else if (typeof error.response?.data === 'string') {
          errorMessage = error.response.data;
        }
        toast.error(errorMessage);
      }
    }
  );

  // Reject request mutation
  const rejectMutation = useMutation(
    async ({ requestId, rejectionReason }) => {
      await axiosPrivate.post(`/company-requests/${requestId}/reject`, { rejectionReason });
    },
    {
      onSuccess: () => {
        toast.success("Company request rejected successfully");
        queryClient.invalidateQueries(["company-requests"]);
        setIsRejectModalOpen(false);
        setSelectedRequest(null);
      },
      onError: (error) => {
        let errorMessage = "Failed to reject request";
        if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        } else if (typeof error.response?.data === 'string') {
          errorMessage = error.response.data;
        }
        toast.error(errorMessage);
        throw error;
      }
    }
  );

  // Handle approve
  const handleApprove = (request) => {
    setSelectedRequest(request);
    setIsApproveConfirmOpen(true);
  };

  const confirmApprove = () => {
    if (selectedRequest) {
      approveMutation.mutate(selectedRequest.requestId);
    }
  };

  // Handle reject
  const handleReject = (request) => {
    setSelectedRequest(request);
    setIsRejectModalOpen(true);
  };

  const confirmReject = async (requestId, rejectionReason) => {
    await rejectMutation.mutateAsync({ requestId, rejectionReason });
  };

  // Handle view details
  const handleViewDetails = (request) => {
    setSelectedRequest(request);
    setIsDetailModalOpen(true);
  };

  // Get status badge
  const getStatusBadge = (status) => {
    // Handle both string and number status values
    const normalizedStatus = typeof status === 'string' ? status.toLowerCase() : status;
    
    switch (normalizedStatus) {
      case 0:
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">Pending</Badge>;
      case 1:
      case 'approved':
        return <Badge className="bg-green-100 text-green-800 border-green-300">Approved</Badge>;
      case 2:
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800 border-red-300">Rejected</Badge>;
      default:
        return <Badge variant="secondary">Unknown ({status})</Badge>;
    }
  };

  // Transform requests to table format
  const tableData = requestsData.requests.map((request) => ({
    companyName: request.companyName || 'N/A',
    userName: request.userName || 'N/A',
    industryName: request.industryName || 'N/A',
    location: request.location || 'N/A',
    status: request.requestStatus, // Keep as number for getStatusBadge
    requestedDate: request.requestedAt ? format(new Date(request.requestedAt), 'MMM dd, yyyy') : 'N/A',
    _originalData: request
  }));

  const table_head = [
    { name: "Company Name", key: "companyName" },
    { name: "Requested By", key: "userName" },
    { name: "Industry", key: "industryName" },
    { name: "Location", key: "location" },
    { name: "Status", key: "status" },
    { name: "Requested Date", key: "requestedDate" },
  ];

  // Custom renderers
  const customRenderers = {
    companyName: (value, row) => (
      <div className="font-medium">{value}</div>
    ),
    status: (value) => getStatusBadge(value), // Now value is the number
  };

  // Custom action buttons
  const renderCustomActions = (row) => {
    const request = row._originalData;
    return (
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant="ghost"
          onClick={() => handleViewDetails(request)}
          title="View Details"
        >
          <Eye className="h-4 w-4" />
        </Button>
        {(request.requestStatus === 0 || request.requestStatus?.toLowerCase() === 'pending') && (
          <>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => handleApprove(request)}
              className="text-green-600 hover:text-green-700 hover:bg-green-50"
              title="Approve"
            >
              <CheckCircle className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => handleReject(request)}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
              title="Reject"
            >
              <XCircle className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>
    );
  };

  // Header actions
  const headerActions = [];

  // Filters
  const filters = [
    <div key="search" className="flex-1">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder="Search company name..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="pl-10"
        />
      </div>
    </div>,
    <Select
      key="status"
      value={statusFilter}
      onValueChange={(value) => {
        setStatusFilter(value);
        setCurrentPage(1);
      }}
    >
      <SelectTrigger className="w-full md:w-48">
        <SelectValue placeholder="All Statuses">
          {statusFilter === '' ? 'All Statuses' : 
           statusFilter === '0' ? 'Pending' :
           statusFilter === '1' ? 'Approved' : 'Rejected'}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="">All Statuses</SelectItem>
        <SelectItem value="0">Pending</SelectItem>
        <SelectItem value="1">Approved</SelectItem>
        <SelectItem value="2">Rejected</SelectItem>
      </SelectContent>
    </Select>,
    <Select
      key="industry"
      value={industryFilter}
      onValueChange={(value) => {
        setIndustryFilter(value);
        setCurrentPage(1);
      }}
    >
      <SelectTrigger className="w-full md:w-48">
        <SelectValue placeholder="All Industries">
          {industryFilter ? industries.find(i => i.industryId.toString() === industryFilter)?.name : 'All Industries'}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="">All Industries</SelectItem>
        {industries.map((industry) => (
          <SelectItem key={industry.industryId} value={industry.industryId.toString()}>
            {industry.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  ];

  // Pagination component
  const paginationComponent = (
    <>
      <div className="flex items-center space-x-2">
        <p className="text-sm font-medium">Rows per page</p>
        <Select
          value={itemsPerPage.toString()}
          onValueChange={(value) => {
            setItemsPerPage(Number(value));
            setCurrentPage(1);
          }}
        >
          <SelectTrigger className="h-8 w-[70px]">
            <SelectValue placeholder={itemsPerPage.toString()} />
          </SelectTrigger>
          <SelectContent side="top" className="min-w-[70px]">
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="25">25</SelectItem>
            <SelectItem value="50">50</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex items-center space-x-6">
        <div className="flex items-center justify-center text-sm font-medium">
          <span>
            Showing {Math.min((currentPage - 1) * itemsPerPage + 1, requestsData.totalCount)} to {Math.min(currentPage * itemsPerPage, requestsData.totalCount)} of {requestsData.totalCount} results
          </span>
          <span className="mx-2">•</span>
          <span>Page {currentPage} of {requestsData.totalPages}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={!requestsData.hasPrevious || isLoading}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(p => p + 1)}
            disabled={!requestsData.hasNext || isLoading}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </>
  );

  return (
    <>
      <Table
        useModernUI={true}
        title="Company Requests"
        description="Review and manage company requests from users"
        headerActions={headerActions}
        filters={filters}
        pagination={paginationComponent}
        table_head={table_head}
        table_rows={tableData}
        isLoading={isLoading}
        actions={true}
        customRenderers={customRenderers}
        handleOpenView={(row) => handleViewDetails(row._originalData)}
        renderCustomActions={renderCustomActions}
        emptyState={
          <div className="text-center py-8 text-muted-foreground">
            <Filter className="mx-auto h-12 w-12 mb-4 opacity-50" />
            <p className="text-lg font-medium mb-2">No company requests found</p>
            <p>Try adjusting your filters or check back later.</p>
          </div>
        }
      />

      {/* Approve Confirmation Dialog */}
      <Dialog open={isApproveConfirmOpen} onOpenChange={setIsApproveConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Company Request</DialogTitle>
            <DialogDescription>
              Are you sure you want to approve the request for "{selectedRequest?.companyName}"? 
              This will add the company to the global companies database and notify the user.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 mt-4">
            <Button
              variant="outline"
              onClick={() => setIsApproveConfirmOpen(false)}
              disabled={approveMutation.isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={confirmApprove}
              disabled={approveMutation.isLoading}
              className="bg-green-600 hover:bg-green-700"
            >
              {approveMutation.isLoading ? "Approving..." : "Approve"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Reject Modal */}
      <RejectRequestModal
        isOpen={isRejectModalOpen}
        onClose={() => {
          setIsRejectModalOpen(false);
          setSelectedRequest(null);
        }}
        request={selectedRequest}
        onReject={confirmReject}
      />

      {/* View Details Modal */}
      <CompanyRequestViewModal
        request={selectedRequest}
        open={isDetailModalOpen}
        setOpen={setIsDetailModalOpen}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </>
  );
}
