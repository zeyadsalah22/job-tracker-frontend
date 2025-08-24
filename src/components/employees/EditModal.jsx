import React, { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useAxiosPrivate } from "../../utils/axios";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/Dialog";
import Button from "../ui/Button";
import Input from "../ui/Input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/Select";
import Label from "../ui/Label";
import { toast } from "react-toastify";
import { X, Loader2, User, Building2, Mail, Phone, Linkedin, Edit } from 'lucide-react';
import useUserStore from "../../store/user.store";

export default function EditModal({ id, refetch, openEdit, setOpenEdit }) {
  const [formData, setFormData] = useState({
    name: '',
    linkedinLink: '',
    email: '',
    jobTitle: '',
    contacted: '',
    phone: '',
    department: '',
    companyId: null,
  });
  const [companySearch, setCompanySearch] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();
  const user = useUserStore((state) => state.user);

  // Fetch employee details
  const fetchEmployee = async () => {
    if (!id) return null;
    try {
      setIsLoading(true);
      const response = await axiosPrivate.get(`/employees/${id}`);
      console.log("Employee details for edit:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching employee details:", error);
      toast.error("Failed to load employee details");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const { data: employee } = useQuery(
    ["employee", id],
    fetchEmployee,
    {
      enabled: !!id && openEdit,
    }
  );

  // Fetch companies for selection
  const fetchCompanies = async () => {
    try {
      const response = await axiosPrivate.get('/companies', {
        params: {
          SearchTerm: companySearch || undefined,
          PageSize: 100,
        }
      });
      
      let companies = [];
      if (Array.isArray(response.data)) {
        companies = response.data;
      } else if (response.data && Array.isArray(response.data.items)) {
        companies = response.data.items;
      }
      
      return companies;
    } catch (error) {
      console.error("Error fetching companies:", error);
      return [];
    }
  };

  const { data: companies = [], isLoading: companiesLoading } = useQuery(
    ["companies-for-employee", companySearch],
    fetchCompanies,
    {
      staleTime: 5 * 60 * 1000,
    }
  );

  // Update employee mutation
  const updateEmployeeMutation = useMutation(
    async (employeeData) => {
      const submitData = {
        name: employeeData.name,
        linkedinLink: employeeData.linkedinLink || undefined,
        email: employeeData.email || undefined,
        jobTitle: employeeData.jobTitle,
        contacted: employeeData.contacted || undefined,
        phone: employeeData.phone || undefined,
        department: employeeData.department || undefined,
      };
      
      console.log("Updating employee with data:", submitData);
      return await axiosPrivate.put(`/employees/${id}`, submitData);
    },
    {
      onSuccess: () => {
        toast.success("Employee updated successfully!");
        setOpenEdit(false);
        refetch();
        queryClient.invalidateQueries(["employees"]);
        queryClient.invalidateQueries(["employee", id]);
      },
      onError: (error) => {
        console.error("Error updating employee:", error);
        const errorMessage = error.response?.data?.message || 
                           error.response?.data?.title ||
                           "Failed to update employee. Please try again.";
        toast.error(errorMessage);
      },
    }
  );

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name.trim()) {
      toast.error("Employee name is required");
      return;
    }
    if (!formData.jobTitle.trim()) {
      toast.error("Job title is required");
      return;
    }

    setIsSubmitting(true);
    try {
      await updateEmployeeMutation.mutateAsync(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Load employee data into form when available
  useEffect(() => {
    if (employee && openEdit) {
      setFormData({
        name: employee.name || '',
        linkedinLink: employee.linkedinLink || '',
        email: employee.email || '',
        jobTitle: employee.jobTitle || '',
        contacted: employee.contacted || '',
        phone: employee.phone || '',
        department: employee.department || '',
        companyId: employee.companyId || null,
      });
    }
  }, [employee, openEdit]);

  // Reset form when modal closes
  useEffect(() => {
    if (!openEdit) {
      setFormData({
        name: '',
        linkedinLink: '',
        email: '',
        jobTitle: '',
        contacted: '',
        phone: '',
        department: '',
        companyId: null,
      });
      setCompanySearch('');
    }
  }, [openEdit]);

  const contactStatusOptions = [
    { value: "yes", label: "Contacted" },
    { value: "no", label: "Not Contacted" },
    { value: "pending", label: "Pending Response" },
  ];

  const departmentOptions = [
    "Engineering",
    "HR",
    "Sales", 
    "Marketing",
    "Finance",
    "Operations",
    "Product",
    "Design",
    "Legal",
    "Other"
  ];

  return (
    <Dialog open={openEdit} onOpenChange={setOpenEdit}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Edit className="w-5 h-5" />
              Edit Employee
            </div>
            <button
              onClick={() => setOpenEdit(false)}
              className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </button>
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <User className="w-4 h-4" />
                Personal Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Full Name *</Label>
                  <Input
                    placeholder="Enter employee name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Job Title *</Label>
                  <Input
                    placeholder="e.g., Software Engineer"
                    value={formData.jobTitle}
                    onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Department</Label>
                  <Select value={formData.department} onValueChange={(value) => handleInputChange('department', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select department">
                        {formData.department}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {departmentOptions.map((dept) => (
                        <SelectItem key={dept} value={dept}>
                          {dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Contact Status</Label>
                  <Select value={formData.contacted} onValueChange={(value) => handleInputChange('contacted', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select contact status">
                        {formData.contacted && contactStatusOptions.find(opt => opt.value === formData.contacted)?.label}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {contactStatusOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Contact Information Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Contact Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      type="email"
                      placeholder="employee@company.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <Label>LinkedIn Profile</Label>
                  <div className="relative">
                    <Linkedin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-600 w-4 h-4" />
                    <Input
                      type="url"
                      placeholder="https://linkedin.com/in/employee-name"
                      value={formData.linkedinLink}
                      onChange={(e) => handleInputChange('linkedinLink', e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Company Information Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                Company Information
              </h3>
              
              <div className="space-y-2">
                <Label>Current Company</Label>
                <div className="p-3 bg-muted rounded-md">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">
                      {employee?.companyName || employee?.company?.name || 'Unknown Company'}
                    </span>
                  </div>
                  {employee?.company?.location && (
                    <div className="text-sm text-muted-foreground mt-1">
                      {employee.company.location}
                    </div>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Company information cannot be changed in edit mode. Please create a new employee record if needed.
                </p>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpenEdit(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Updating Employee...
                  </>
                ) : (
                  <>
                    <Edit className="w-4 h-4 mr-2" />
                    Update Employee
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
