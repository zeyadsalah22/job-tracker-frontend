import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { useAxiosPrivate } from "../utils/axios";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/Select";
import { Badge } from "../components/ui/Badge";
import { 
  Plus, 
  Search, 
  Star,
  Building2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import Table from "../components/Table";
import AddModal from "../components/user-companies/AddModal";
import EditModal from "../components/user-companies/EditModal";
import DeleteModal from "../components/user-companies/DeleteModal";
import ViewModal from "../components/user-companies/ViewModal";
import useUserStore from "../store/user.store";

export default function UserCompanies() {
  const [searchTerm, setSearchTerm] = useState('');
  const [interestFilter, setInterestFilter] = useState('');
  const [favoriteFilter, setFavoriteFilter] = useState('');
  const [sortColumn, setSortColumn] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedUserCompany, setSelectedUserCompany] = useState(null);
  const [selectedId, setSelectedId] = useState(null);

  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();
  const user = useUserStore((state) => state.user);

  // Fetch user companies with all filters
  const fetchUserCompanies = async () => {
    try {
      const response = await axiosPrivate.get('/user-companies', {
        params: {
          SearchTerm: searchTerm || undefined,
          UserId: user?.userId || undefined,
          InterestLevel: interestFilter || undefined,
          Favorite: favoriteFilter === 'true' ? true : favoriteFilter === 'false' ? false : undefined,
          PageNumber: currentPage,
          PageSize: itemsPerPage,
          SortBy: sortColumn || undefined,
          SortDescending: sortDirection === 'desc',
        }
      });
      
      console.log("User Companies API Response:", response.data);
      
      // Handle different response structures
      let companies = [];
      let totalPages = 1;
      let totalCount = 0;
      
      if (Array.isArray(response.data)) {
        // If response is a direct array (all companies returned, we handle pagination client-side)
        const allCompanies = response.data;
        totalCount = allCompanies.length;
        totalPages = Math.ceil(totalCount / itemsPerPage);
        
        // Client-side pagination
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        companies = allCompanies.slice(startIndex, endIndex);
      } else if (response.data && Array.isArray(response.data.items)) {
        // If response has items array (server-side paginated response)
        companies = response.data.items;
        totalPages = response.data.totalPages || Math.ceil((response.data.totalCount || companies.length) / itemsPerPage);
        totalCount = response.data.totalCount || companies.length;
      }
      
      return {
        companies: companies,
        totalPages: Math.max(1, totalPages),
        totalCount: totalCount,
        hasNext: currentPage < totalPages,
        hasPrevious: currentPage > 1
      };
    } catch (error) {
      console.error("Error fetching user companies:", error);
      return { companies: [], totalPages: 1, totalCount: 0, hasNext: false, hasPrevious: false };
    }
  };

  const {
    data: companiesData,
    isLoading,
    refetch,
  } = useQuery(
    ["user-companies", { searchTerm, interestFilter, favoriteFilter, currentPage, itemsPerPage, sortColumn, sortDirection, userId: user?.userId }], 
    fetchUserCompanies,
    {
      enabled: !!user?.userId,
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false
    }
  );

  const paginatedCompanies = Array.isArray(companiesData?.companies) ? companiesData.companies : [];
  const totalPages = companiesData?.totalPages || 1;

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const handleEdit = (userCompany) => {
    setSelectedUserCompany(userCompany);
    setSelectedId(userCompany.companyId);
    setIsEditModalOpen(true);
  };

  const handleDelete = (userCompany) => {
    setSelectedUserCompany(userCompany);
    setSelectedId(userCompany.companyId);
    setIsDeleteModalOpen(true);
  };

  const handleView = (userCompany) => {
    setSelectedUserCompany(userCompany);
    setIsDetailModalOpen(true);
  };

  const getInterestBadgeColor = (level) => {
    switch (level) {
      case "High": return "bg-red-100 text-red-800 border-red-200";
      case "Medium": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Low": return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  // Prepare data for Table component
  const tableData = paginatedCompanies.map(userCompany => ({
    id: userCompany.companyId,
    company: {
      name: userCompany.companyName,
      location: userCompany.companyLocation,
      favorite: userCompany.favorite
    },
    interestLevel: userCompany.interestLevel,
    personalNotes: userCompany.personalNotes,
    tags: userCompany.tags || [],
    dateAdded: userCompany.createdAt,
    _originalData: userCompany // Keep original data for actions
  }));

  const table_head = [
    { name: "Company", key: "company" },
    { name: "Interest Level", key: "interestLevel" },
    { name: "Personal Notes", key: "personalNotes" },
    { name: "Tags", key: "tags" },
    { name: "Date Added", key: "dateAdded" },
  ];

  // Custom renderers for special columns
  const customRenderers = {
    company: (value) => (
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center text-lg">
          🏢
        </div>
        <div>
          <div className="flex items-center gap-2">
            <div className="font-medium">{value.name}</div>
            {value.favorite && (
              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
            )}
          </div>
          <div className="text-sm text-muted-foreground">{value.location}</div>
        </div>
      </div>
    ),
    interestLevel: (value) => (
      <Badge variant="outline" className={getInterestBadgeColor(value)}>
        {value}
      </Badge>
    ),
    personalNotes: (value) => (
      <div className="max-w-xs">
        <p className="text-sm truncate" title={value}>
          {value || 'No notes'}
        </p>
      </div>
    ),
    tags: (value) => (
      <div className="flex flex-wrap gap-1">
        {Array.isArray(value) && value.length > 0 ? (
          <>
            {value.slice(0, 2).map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {value.length > 2 && (
              <Badge variant="secondary" className="text-xs">
                +{value.length - 2}
              </Badge>
            )}
          </>
        ) : (
          <span className="text-sm text-muted-foreground">No tags</span>
        )}
      </div>
    ),
    dateAdded: (value) => formatDate(value),
  };

  // Header actions
  const headerActions = [
    <Button key="add" onClick={() => setIsAddModalOpen(true)}>
      <Plus className="w-4 h-4 mr-2" />
      Add Company
    </Button>
  ];

  // Filters
  const filters = [
    <div key="search" className="flex-1">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder="Search companies or notes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>
    </div>,
    <Select key="interest" value={interestFilter} onValueChange={setInterestFilter}>
      <SelectTrigger className="w-full md:w-48">
        <SelectValue placeholder="Filter by interest" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="">All Interests</SelectItem>
        <SelectItem value="High">High</SelectItem>
        <SelectItem value="Medium">Medium</SelectItem>
        <SelectItem value="Low">Low</SelectItem>
      </SelectContent>
    </Select>,
    <Select key="favorite" value={favoriteFilter} onValueChange={setFavoriteFilter}>
      <SelectTrigger className="w-full md:w-48">
        <SelectValue placeholder="Filter by favorite" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="">All Companies</SelectItem>
        <SelectItem value="true">Favorites Only</SelectItem>
        <SelectItem value="false">Non-Favorites</SelectItem>
      </SelectContent>
    </Select>
  ];

  // Pagination component
  const paginationComponent = (
    <>
      {/* Rows per page selector */}
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
      
      {/* Pagination info and controls */}
      <div className="flex items-center space-x-6">
        <div className="flex items-center justify-center text-sm font-medium">
          <span className="mr-2">
            Showing {Math.min((currentPage - 1) * itemsPerPage + 1, companiesData?.totalCount || 0)} to {Math.min(currentPage * itemsPerPage, companiesData?.totalCount || 0)} of {companiesData?.totalCount || 0} results
          </span>
          <span className="mx-2">•</span>
          <span>Page {currentPage} of {totalPages}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
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
        title="My Companies"
        description="Track companies you're interested in"
        headerActions={headerActions}
        filters={filters}
        pagination={paginationComponent}
        table_head={table_head}
        table_rows={tableData}
        isLoading={isLoading}
        actions={true}
        customRenderers={customRenderers}
        handleOpenView={(row) => handleView(row._originalData)}
        handleOpenEdit={(row) => handleEdit(row._originalData)}
        handleOpenDelete={(row) => handleDelete(row._originalData)}
        selectedOrders={["company", "interestLevel", "dateAdded"]}
        setOrder={handleSort}
        emptyState={
          <div className="text-center py-8 text-muted-foreground">
            <Building2 className="mx-auto h-12 w-12 mb-4 opacity-50" />
            <p className="text-lg font-medium mb-2">No companies found</p>
            <p>Start building your company watchlist by adding companies you're interested in.</p>
          </div>
        }
      />

      {/* Modals */}
      <AddModal 
        refetch={refetch} 
        openAdd={isAddModalOpen} 
        setOpenAdd={setIsAddModalOpen} 
      />
      <EditModal
        id={selectedId}
        refetch={refetch}
        openEdit={isEditModalOpen}
        setOpenEdit={setIsEditModalOpen}
      />
      <DeleteModal
        id={selectedId}
        openDelete={isDeleteModalOpen}
        setOpenDelete={setIsDeleteModalOpen}
        refetch={refetch}
      />
      
      <ViewModal
        userCompany={selectedUserCompany}
        open={isDetailModalOpen}
        setOpen={setIsDetailModalOpen}
      />
    </>
  );
}
