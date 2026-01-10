import React, { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "react-query";
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
  Users,
  Building2,
  Mail,
  Phone,
  Linkedin,
  ChevronLeft,
  ChevronRight,
  FileDown,
  FileUp,
} from 'lucide-react';
import Table from "../components/Table";
import AddModal from "../components/employees/AddModal";
import EditModal from "../components/employees/EditModal";
import DeleteModal from "../components/employees/DeleteModal";
import ViewModal from "../components/employees/ViewModal";
import useUserStore from "../store/user.store";
import { fetchAllData, exportToCSV } from "../utils/csvExport";

export default function Employees() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [companyFilter, setCompanyFilter] = useState(''); // This will store companyId
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [contactedFilter, setContactedFilter] = useState('');
  const [sortColumn, setSortColumn] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [isExporting, setIsExporting] = useState(false);

  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();
  const user = useUserStore((state) => state.user);

  // Fetch all employees for filter options (without pagination)
  const fetchAllEmployeesForFilters = async () => {
    try {
      const response = await axiosPrivate.get('/employees', {
        params: {
          PageSize: 500, // Get a large number to capture all employees for filter options
        }
      });
      
      let allEmployees = [];
      if (Array.isArray(response.data)) {
        allEmployees = response.data;
      } else if (response.data && Array.isArray(response.data.items)) {
        allEmployees = response.data.items;
      }
      
      return allEmployees;
    } catch (error) {
      console.error("Error fetching all employees for filters:", error);
      return [];
    }
  };

  // Fetch employees with all filters
  const fetchEmployees = async () => {
    try {
      const params = {
        Search: searchTerm || undefined,
        CompanyId: companyFilter || undefined, // Use CompanyId instead of CompanyName
        Department: departmentFilter || undefined, // Add Department parameter
        ContactStatus: contactedFilter || undefined, // Use ContactStatus instead of contacted
        SortBy: sortColumn || undefined,
        SortDescending: sortDirection === 'desc',
        PageNumber: currentPage,
        PageSize: itemsPerPage,
      };
      
      console.log("Employees API Request Params:", params);
      
      const response = await axiosPrivate.get('/employees', { params });
      
      console.log("Employees API Response:", response.data);
      
      // Handle different response structures
      let employees = [];
      let totalPages = 1;
      let totalCount = 0;
      
      if (Array.isArray(response.data)) {
        // If response is a direct array (all employees returned, we handle pagination client-side)
        const allEmployees = response.data;
        totalCount = allEmployees.length;
        totalPages = Math.ceil(totalCount / itemsPerPage);
        
        // Client-side pagination
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        employees = allEmployees.slice(startIndex, endIndex);
      } else if (response.data && Array.isArray(response.data.items)) {
        // If response has items array (server-side paginated response)
        employees = response.data.items;
        totalPages = response.data.totalPages || Math.ceil((response.data.totalCount || employees.length) / itemsPerPage);
        totalCount = response.data.totalCount || employees.length;
      }
      
      return {
        employees: employees,
        totalPages: Math.max(1, totalPages),
        totalCount: totalCount,
        hasNext: currentPage < totalPages,
        hasPrevious: currentPage > 1
      };
    } catch (error) {
      console.error("Error fetching employees:", error);
      return { employees: [], totalPages: 1, totalCount: 0, hasNext: false, hasPrevious: false };
    }
  };

  const {
    data: employeesData,
    isLoading,
    refetch,
  } = useQuery(
    ["employees", { searchTerm, companyFilter, departmentFilter, contactedFilter, currentPage, itemsPerPage, sortColumn, sortDirection }], 
    fetchEmployees,
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false
    }
  );

  // Fetch all employees for filter options
  const { data: allEmployeesForFilters = [] } = useQuery(
    ["all-employees-for-filters"],
    fetchAllEmployeesForFilters,
    {
      staleTime: 10 * 60 * 1000, // 10 minutes - filters don't need to update as frequently
      refetchOnWindowFocus: false
    }
  );

  const paginatedEmployees = Array.isArray(employeesData?.employees) ? employeesData.employees : [];
  const totalPages = employeesData?.totalPages || 1;

  // Auto-open view modal from URL parameter (from search results)
  useEffect(() => {
    const viewId = searchParams.get('view');
    if (viewId) {
      // First check if item is in current page
      const employeeToView = paginatedEmployees.find(e => e.employeeId?.toString() === viewId || e.id?.toString() === viewId);
      if (employeeToView) {
        setSelectedId(employeeToView.employeeId || employeeToView.id);
        setSelectedEmployee(employeeToView);
        setIsDetailModalOpen(true);
        // Remove the query param after opening
        searchParams.delete('view');
        setSearchParams(searchParams, { replace: true });
      } else {
        // If not in current page, fetch it directly by ID
        axiosPrivate.get(`/employees/${viewId}`)
          .then(response => {
            const fetchedEmployee = response.data;
            if (fetchedEmployee) {
              setSelectedId(fetchedEmployee.employeeId || fetchedEmployee.id);
              setSelectedEmployee(fetchedEmployee);
              setIsDetailModalOpen(true);
              // Remove the query param after opening
              searchParams.delete('view');
              setSearchParams(searchParams, { replace: true });
            }
          })
          .catch(error => {
            console.error('Error fetching employee by ID:', error);
            // Remove the query param even if fetch fails
            searchParams.delete('view');
            setSearchParams(searchParams, { replace: true });
          });
      }
    }
  }, [searchParams, setSearchParams, paginatedEmployees, axiosPrivate]);

  // Extract unique filter options from all employees data
  const getUniqueCompanies = () => {
    const companies = new Map();
    allEmployeesForFilters.forEach(employee => {
      const companyName = employee.companyName || employee.company?.name;
      const companyId = employee.companyId || employee.company?.companyId;
      if (companyName && companyId) {
        companies.set(companyId, {
          id: companyId,
          name: companyName,
          location: employee.company?.location
        });
      }
    });
    return Array.from(companies.values()).sort((a, b) => a.name.localeCompare(b.name));
  };

  const getUniqueDepartments = () => {
    const departments = new Set();
    allEmployeesForFilters.forEach(employee => {
      if (employee.department && employee.department.trim()) {
        departments.add(employee.department.trim());
      }
    });
    return Array.from(departments).sort();
  };

  const getUniqueContactStatuses = () => {
    const statuses = new Set();
    allEmployeesForFilters.forEach(employee => {
      if (employee.contacted && employee.contacted.trim()) {
        statuses.add(employee.contacted.trim());
      }
    });
    return Array.from(statuses).sort();
  };

  const uniqueCompanies = getUniqueCompanies();
  const uniqueDepartments = getUniqueDepartments();
  const uniqueContactStatuses = getUniqueContactStatuses();

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const handleEdit = (employee) => {
    setSelectedEmployee(employee);
    setSelectedId(employee.employeeId);
    setIsEditModalOpen(true);
  };

  const handleDelete = (employee) => {
    setSelectedEmployee(employee);
    setSelectedId(employee.employeeId);
    setIsDeleteModalOpen(true);
  };

  // Export handler
  const handleExport = async () => {
    try {
      setIsExporting(true);
      toast.info('Preparing export... This may take a moment for large datasets.');

      // Fetch all employees using pagination
      const allEmployees = await fetchAllData(
        (pageNumber, pageSize) => axiosPrivate.get('/employees', {
          params: { PageNumber: pageNumber, PageSize: pageSize }
        })
      );

      // Transform data for CSV export
      const csvData = allEmployees.map(employee => ({
        'Name': employee.name || 'N/A',
        'Email': employee.email || 'N/A',
        'Phone': employee.phone || '',
        'LinkedIn': employee.linkedinLink || '',
        'Company': employee.company?.name || employee.companyName || 'N/A',
        'Job Title': employee.jobTitle || 'N/A',
        'Department': employee.department || 'N/A',
        'Contacted': employee.contacted || 'N/A',
        'Created At': employee.createdAt ? format(new Date(employee.createdAt), 'MMM dd, yyyy') : 'N/A',
        'Updated At': employee.updatedAt ? format(new Date(employee.updatedAt), 'MMM dd, yyyy') : 'N/A'
      }));

      // Export to CSV
      exportToCSV(csvData, 'employees');
      
      toast.success(`Successfully exported ${allEmployees.length} employee(s)!`);
    } catch (error) {
      console.error('Error exporting employees:', error);
      toast.error('Failed to export employees. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleView = (employee) => {
    setSelectedEmployee(employee);
    setIsDetailModalOpen(true);
  };

  const getContactedBadgeColor = (contacted) => {
    switch (contacted?.toLowerCase()) {
      case "yes": 
      case "contacted": 
      case "true": 
        return "bg-green-100 text-green-800 border-green-200";
      case "no": 
      case "not contacted": 
      case "false": 
        return "bg-red-100 text-red-800 border-red-200";
      default: 
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getDepartmentBadgeColor = (department) => {
    const colors = {
      "Engineering": "bg-blue-100 text-blue-800 border-blue-200",
      "HR": "bg-purple-100 text-purple-800 border-purple-200",
      "Sales": "bg-green-100 text-green-800 border-green-200",
      "Marketing": "bg-orange-100 text-orange-800 border-orange-200",
      "Finance": "bg-yellow-100 text-yellow-800 border-yellow-200",
      "Operations": "bg-indigo-100 text-indigo-800 border-indigo-200",
    };
    return colors[department] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  // Prepare data for Table component
  const tableData = paginatedEmployees.map(employee => ({
    id: employee.employeeId,
    employee: {
      name: employee.name,
      jobTitle: employee.jobTitle,
      companyName: employee.companyName || employee.company?.name,
    },
    contactInfo: {
      email: employee.email,
      phone: employee.phone,
      linkedinLink: employee.linkedinLink,
    },
    department: employee.department,
    company: {
      name: employee.companyName || employee.company?.name,
      location: employee.company?.location,
    },
    contacted: employee.contacted,
    dateAdded: employee.createdAt,
    _originalData: employee // Keep original data for actions
  }));

  const table_head = [
    { name: "Employee", key: "employee" },
    { name: "Contact Info", key: "contactInfo" },
    { name: "Department", key: "department" },
    { name: "Company", key: "company" },
    { name: "Contacted", key: "contacted" },
  ];

  // Custom renderers for special columns
  const customRenderers = {
    employee: (value) => (
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-lg font-semibold">
          {value.name?.charAt(0)?.toUpperCase() || '?'}
        </div>
        <div>
          <div className="font-medium">{value.name}</div>
          <div className="text-sm text-muted-foreground">{value.jobTitle}</div>
          <div className="text-xs text-muted-foreground">{value.companyName}</div>
        </div>
      </div>
    ),
    contactInfo: (value) => (
      <div className="space-y-1">
        {value.email && (
          <div className="flex items-center gap-2 text-sm">
            <Mail className="w-3 h-3 text-muted-foreground" />
            <span>{value.email}</span>
          </div>
        )}
        {value.phone && (
          <div className="flex items-center gap-2 text-sm">
            <Phone className="w-3 h-3 text-muted-foreground" />
            <span>{value.phone}</span>
          </div>
        )}
        {value.linkedinLink && (
          <div className="flex items-center gap-2 text-sm">
            <Linkedin className="w-3 h-3 text-blue-600" />
            <a 
              href={value.linkedinLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              LinkedIn
            </a>
          </div>
        )}
      </div>
    ),
    department: (value) => (
      <Badge variant="outline" className={getDepartmentBadgeColor(value)}>
        {value || 'Not specified'}
      </Badge>
    ),
    company: (value) => (
      <div>
        <div className="font-medium flex items-center gap-2">
          <Building2 className="w-4 h-4 text-muted-foreground" />
          {value.name}
        </div>
        {value.location && (
          <div className="text-sm text-muted-foreground">{value.location}</div>
        )}
      </div>
    ),
    contacted: (value) => (
      <Badge variant="outline" className={getContactedBadgeColor(value)}>
        {value || 'Unknown'}
      </Badge>
    ),
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
    <Button key="add" onClick={() => setIsAddModalOpen(true)}>
      <Plus className="w-4 h-4 mr-2" />
      Add Employee
    </Button>
  ];

  // Filters
  const filters = [
    <div key="search" className="flex-1">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder="Search employees..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>
    </div>,
    <Select key="company" value={companyFilter} onValueChange={setCompanyFilter}>
      <SelectTrigger className="w-full md:w-48">
        <SelectValue placeholder="Filter by company">
          {companyFilter && uniqueCompanies.find(c => c.id.toString() === companyFilter)?.name}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="">All Companies</SelectItem>
        {uniqueCompanies.map((company) => (
          <SelectItem key={company.id} value={company.id.toString()}>
            <div className="flex flex-col">
              <span className="font-medium">{company.name}</span>
              {company.location && (
                <span className="text-xs text-muted-foreground">{company.location}</span>
              )}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>,
    <Select key="department" value={departmentFilter} onValueChange={setDepartmentFilter}>
      <SelectTrigger className="w-full md:w-48">
        <SelectValue placeholder="Filter by department">
          {departmentFilter}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="">All Departments</SelectItem>
        {uniqueDepartments.map((department) => (
          <SelectItem key={department} value={department}>
            {department}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>,
    <Select key="contacted" value={contactedFilter} onValueChange={setContactedFilter}>
      <SelectTrigger className="w-full md:w-48">
        <SelectValue placeholder="Filter by contact status">
          {contactedFilter}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="">All Statuses</SelectItem>
        {uniqueContactStatuses.map((status) => (
          <SelectItem key={status} value={status}>
            {status}
          </SelectItem>
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
            Showing {Math.min((currentPage - 1) * itemsPerPage + 1, employeesData?.totalCount || 0)} to {Math.min(currentPage * itemsPerPage, employeesData?.totalCount || 0)} of {employeesData?.totalCount || 0} results
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
        title="Employees"
        description="Manage your employee contacts and information"
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
        selectedOrders={["employee", "department", "company"]}
        setOrder={handleSort}
        emptyState={
          <div className="text-center py-8 text-muted-foreground">
            <Users className="mx-auto h-12 w-12 mb-4 opacity-50" />
            <p className="text-lg font-medium mb-2">No employees found</p>
            <p>Start building your employee network by adding contacts from companies you're interested in.</p>
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
        employee={selectedEmployee}
        open={isDetailModalOpen}
        setOpen={setIsDetailModalOpen}
      />
    </>
  );
}
