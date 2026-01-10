import React, { useState, useMemo, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from "react-query";
import { useAxiosPrivate } from "../utils/axios";
import { useSearchParams } from "react-router-dom";
import { format } from "date-fns";
import { toast } from "react-toastify";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/Select";
import { Badge } from "../components/ui/Badge";
import { 
  Plus, 
  Search, 
  ExternalLink, 
  Download, 
  Upload,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import Table from "../components/Table";
import AddModal from "../components/companies/AddModal";
import EditModal from "../components/companies/EditModal";
import DeleteModal from "../components/companies/DeleteModal";
import ViewModal from "../components/companies/ViewModal";
import { fetchAllData, exportToCSV } from "../utils/csvExport";

export default function Companies() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [companies, setCompanies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [industryFilter, setIndustryFilter] = useState('');
  const [sizeFilter, setSizeFilter] = useState('');
  const [sortColumn, setSortColumn] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [selectedCompanies, setSelectedCompanies] = useState(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [isExporting, setIsExporting] = useState(false);

  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();

  // Get user role from localStorage (1 = Admin, 0 = User)
  const userRole = parseInt(localStorage.getItem("role")) || 0;
  const isAdmin = userRole === 1;

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

  // Fetch companies with all filters
  const fetchCompanies = async () => {
    try {
      const response = await axiosPrivate.get('/companies', {
        params: {
          SearchTerm: searchTerm || undefined,
          Location: locationFilter || undefined,
          Name: undefined, // We use SearchTerm for general search
          IndustryId: industryFilter || undefined,
          CompanySize: sizeFilter || undefined,
          PageNumber: currentPage,
          PageSize: itemsPerPage,
          SortBy: sortColumn || undefined,
          SortDescending: sortDirection === 'desc',
        }
      });
      
      console.log("API Response:", response.data); // Debug log
      console.log("Current Page:", currentPage, "Items Per Page:", itemsPerPage); // Debug pagination
      console.log("Response structure:", {
        isArray: Array.isArray(response.data),
        hasItems: response.data?.items,
        hasCompanies: response.data?.companies,
        dataLength: Array.isArray(response.data) ? response.data.length : 'not array'
      });
      
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
        
        console.log("Client-side pagination:", {
          totalCount,
          totalPages,
          currentPage,
          itemsPerPage,
          startIndex,
          endIndex,
          companiesReturned: companies.length
        });
      } else if (response.data && Array.isArray(response.data.items)) {
        // If response has items array (server-side paginated response)
        companies = response.data.items;
        totalPages = response.data.totalPages || Math.ceil((response.data.totalCount || companies.length) / itemsPerPage);
        totalCount = response.data.totalCount || companies.length;
      } else if (response.data && response.data.companies) {
        companies = response.data.companies;
        totalCount = companies.length;
        totalPages = Math.ceil(totalCount / itemsPerPage);
      }
      
      return {
        companies: companies,
        totalPages: Math.max(1, totalPages),
        totalCount: totalCount,
        hasNext: currentPage < totalPages,
        hasPrevious: currentPage > 1
      };
    } catch (error) {
      console.error("Error fetching companies:", error);
      return { companies: [], totalPages: 1, totalCount: 0, hasNext: false, hasPrevious: false };
    }
  };

  const {
    data: companiesData,
    isLoading,
    refetch,
  } = useQuery(
    ["companies", { searchTerm, locationFilter, industryFilter, sizeFilter, currentPage, itemsPerPage, sortColumn, sortDirection }], 
    fetchCompanies
  );

  const paginatedCompanies = Array.isArray(companiesData?.companies) ? companiesData.companies : [];
  const totalPages = companiesData?.totalPages || 1;

  // Auto-open view modal from URL parameter (from search results)
  useEffect(() => {
    const viewId = searchParams.get('view');
    if (viewId) {
      // First check if item is in current page
      const companyToView = paginatedCompanies.find(c => c.companyId?.toString() === viewId || c.id?.toString() === viewId);
      if (companyToView) {
        setSelectedId(companyToView.companyId || companyToView.id);
        setSelectedCompany(companyToView);
        setIsDetailModalOpen(true);
        // Remove the query param after opening
        searchParams.delete('view');
        setSearchParams(searchParams, { replace: true });
      } else {
        // If not in current page, fetch it directly by ID
        axiosPrivate.get(`/companies/${viewId}`)
          .then(response => {
            const fetchedCompany = response.data;
            if (fetchedCompany) {
              setSelectedId(fetchedCompany.companyId || fetchedCompany.id);
              setSelectedCompany(fetchedCompany);
              setIsDetailModalOpen(true);
              // Remove the query param after opening
              searchParams.delete('view');
              setSearchParams(searchParams, { replace: true });
            }
          })
          .catch(error => {
            console.error('Error fetching company by ID:', error);
            // Remove the query param even if fetch fails
            searchParams.delete('view');
            setSearchParams(searchParams, { replace: true });
          });
      }
    }
  }, [searchParams, setSearchParams, paginatedCompanies, axiosPrivate]);

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const handleSelectAll = (checked) => {
    if (checked && Array.isArray(paginatedCompanies)) {
      setSelectedCompanies(new Set(paginatedCompanies.map(c => c?.companyId?.toString()).filter(Boolean)));
    } else {
      setSelectedCompanies(new Set());
    }
  };

  const handleSelectCompany = (companyId, checked) => {
    const newSelected = new Set(selectedCompanies);
    if (checked) {
      newSelected.add(companyId.toString());
    } else {
      newSelected.delete(companyId.toString());
    }
    setSelectedCompanies(newSelected);
  };

  const handleEdit = (company) => {
    if (!isAdmin) return;
    setSelectedCompany(company);
    setSelectedId(company.companyId);
    setIsEditModalOpen(true);
  };

  const handleDelete = (company) => {
    if (!isAdmin) return;
    setSelectedCompany(company);
    setSelectedId(company.companyId);
    setIsDeleteModalOpen(true);
  };

  // Export handler
  const handleExport = async () => {
    try {
      setIsExporting(true);
      toast.info('Preparing export... This may take a moment for large datasets.');

      // Fetch all companies using pagination
      const allCompanies = await fetchAllData(
        (pageNumber, pageSize) => axiosPrivate.get('/companies', {
          params: { PageNumber: pageNumber, PageSize: pageSize }
        })
      );

      // Transform data for CSV export
      const csvData = allCompanies.map(company => ({
        'Company Name': company.name || 'N/A',
        'Industry': company.industry?.name || 'N/A',
        'Location': company.location || 'N/A',
        'Company Size': company.companySize || 'N/A',
        'Careers Link': company.careersLink || '',
        'LinkedIn Link': company.linkedinLink || '',
        'Logo URL': company.logoUrl || '',
        'Description': company.description || '',
        'Created At': company.createdAt ? format(new Date(company.createdAt), 'MMM dd, yyyy') : 'N/A',
        'Updated At': company.updatedAt ? format(new Date(company.updatedAt), 'MMM dd, yyyy') : 'N/A'
      }));

      // Export to CSV
      exportToCSV(csvData, 'companies');
      
      toast.success(`Successfully exported ${allCompanies.length} company(s)!`);
    } catch (error) {
      console.error('Error exporting companies:', error);
      toast.error('Failed to export companies. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleView = (company) => {
    setSelectedCompany(company);
    setIsDetailModalOpen(true);
  };

  const getSizeColor = (size) => {
    switch (size) {
      case 'Startup': return 'bg-primary/10 text-primary border-primary/20';
      case 'Small': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Medium': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'Large': return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'Enterprise': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const companySize = ['Startup', 'Small', 'Medium', 'Large', 'Enterprise'];

  // Prepare data for Table component
  const tableData = paginatedCompanies.map(company => ({
    id: company.companyId,
    logo: company.logoUrl || '🏢',
    name: company.name,
    industry: company.industry?.name || 'N/A',
    location: company.location,
    links: { careersLink: company.careersLink, linkedinLink: company.linkedinLink },
    size: company.companySize,
    _originalData: company // Keep original data for actions
  }));

  const table_head = [
    { name: "Logo", key: "logo" },
    { name: "Company Name", key: "name" },
    { name: "Industry", key: "industry" },
    { name: "Location", key: "location" },
    { name: "Links", key: "links" },
    { name: "Size", key: "size" },
  ];

  // Custom renderers for special columns
  const customRenderers = {
    logo: (value) => (
      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center overflow-hidden">
        {value && value !== '🏢' && (value.startsWith('http://') || value.startsWith('https://')) ? (
          <img 
            src={value} 
            alt="Company logo" 
            className="w-full h-full object-contain"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.parentElement.innerHTML = '<span class="text-sm">🏢</span>';
            }}
          />
        ) : (
          <span className="text-sm">{value}</span>
        )}
      </div>
    ),
    name: (value) => <span className="font-medium">{value}</span>,
    links: (value) => (
      <div className="flex gap-2">
        {value.careersLink && (
          <a 
            href={value.careersLink} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary hover:underline flex items-center gap-1 text-sm"
          >
            Careers
            <ExternalLink className="w-3 h-3" />
          </a>
        )}
        {value.linkedinLink && (
          <a 
            href={value.linkedinLink} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary hover:underline flex items-center gap-1 text-sm"
          >
            LinkedIn
            <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>
    ),
    size: (value) => (
      <Badge variant="outline" className={getSizeColor(value)}>
        {value}
      </Badge>
    ),
  };

  // Header actions
  const headerActions = [
    <Button key="import" variant="outline" size="sm" disabled>
      <Upload className="w-4 h-4 mr-2" />
      Import
    </Button>,
    <Button 
      key="export" 
      variant="outline" 
      size="sm"
      onClick={handleExport}
      disabled={isExporting}
    >
      <Download className="w-4 h-4 mr-2" />
      {isExporting ? 'Exporting...' : 'Export'}
    </Button>,
    ...(isAdmin ? [
      <Button key="add" onClick={() => setIsAddModalOpen(true)}>
        <Plus className="w-4 h-4 mr-2" />
        Add Company
      </Button>
    ] : [])
  ];

  // Filters
  const filters = [
    <div key="search" className="flex-1">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder="Search companies..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>
    </div>,
    <Select key="location" value={locationFilter} onValueChange={setLocationFilter}>
      <SelectTrigger className="w-full md:w-48">
        <SelectValue placeholder="Filter by location" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="">All Locations</SelectItem>
        {Array.from(new Set(
          (Array.isArray(paginatedCompanies) ? paginatedCompanies : [])
            .map(c => c?.location)
            .filter(Boolean)
        )).map(location => (
          <SelectItem key={location} value={location}>{location}</SelectItem>
        ))}
      </SelectContent>
    </Select>,
    <Select key="industry" value={industryFilter} onValueChange={setIndustryFilter}>
      <SelectTrigger className="w-full md:w-48">
        <SelectValue placeholder="Filter by industry" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="">All Industries</SelectItem>
        {industries.map(industry => (
          <SelectItem key={industry.industryId} value={industry.industryId.toString()}>
            {industry.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>,
    <Select key="size" value={sizeFilter} onValueChange={setSizeFilter}>
      <SelectTrigger className="w-full md:w-48">
        <SelectValue placeholder="Filter by size" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="">All Sizes</SelectItem>
        {companySize.map(size => (
          <SelectItem key={size} value={size}>{size}</SelectItem>
        ))}
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
        title="Companies"
        description={`Manage your target companies and track applications${!isAdmin ? ' (View only - Admin access required for modifications)' : ''}`}
        headerActions={headerActions}
        filters={filters}
        pagination={paginationComponent}
        table_head={table_head}
        table_rows={tableData}
        isLoading={isLoading}
        actions={true}
        bulkActions={true}
        selectedItems={selectedCompanies}
        onSelectAll={handleSelectAll}
        onSelectItem={handleSelectCompany}
        customRenderers={customRenderers}
        handleOpenView={(row) => handleView(row._originalData)}
        handleOpenEdit={isAdmin ? (row) => handleEdit(row._originalData) : null}
        handleOpenDelete={isAdmin ? (row) => handleDelete(row._originalData) : null}
        selectedOrders={["name", "industry", "location"]}
        setOrder={handleSort}
        emptyState="No companies found"
      />

      {/* Modals */}
      {isAdmin && (
        <>
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
        </>
      )}
      
      <ViewModal
        company={selectedCompany}
        open={isDetailModalOpen}
        setOpen={setIsDetailModalOpen}
      />
    </>
  );
} 