import React, { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useAxiosPrivate } from "../../utils/axios";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/Dialog";
import Button from "../ui/Button";
import Input from "../ui/Input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/Select";
import Label from "../ui/Label";
import { toast } from "react-toastify";
import { X, Loader2, User, Building2, Mail, Phone, Linkedin, Briefcase } from 'lucide-react';
import useUserStore from "../../store/user.store";

export default function AddModal({ refetch, openAdd, setOpenAdd }) {
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

  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();
  const user = useUserStore((state) => state.user);

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

  // Add employee mutation
  const addEmployeeMutation = useMutation(
    async (employeeData) => {
      const submitData = {
        userId: user?.userId || formData.userId,
        companyId: employeeData.companyId,
        name: employeeData.name,
        linkedinLink: employeeData.linkedinLink || undefined,
        email: employeeData.email || undefined,
        jobTitle: employeeData.jobTitle,
        contacted: employeeData.contacted || undefined,
        phone: employeeData.phone || undefined,
        department: employeeData.department || undefined,
      };
      
      console.log("Submitting employee data:", submitData);
      return await axiosPrivate.post("/employees", submitData);
    },
    {
      onSuccess: () => {
        toast.success("Employee added successfully!");
        setOpenAdd(false);
        refetch();
        resetForm();
        queryClient.invalidateQueries(["employees"]);
      },
      onError: (error) => {
        console.error("Error adding employee:", error);
        const errorMessage = error.response?.data?.message || 
                           error.response?.data?.title ||
                           "Failed to add employee. Please try again.";
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
    if (!formData.companyId) {
      toast.error("Please select a company");
      return;
    }

    setIsSubmitting(true);
    try {
      await addEmployeeMutation.mutateAsync(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
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
  };

  // Set userId when user data becomes available
  useEffect(() => {
    if (user?.userId) {
      setFormData(prev => ({
        ...prev,
        userId: user.userId
      }));
    }
  }, [user?.userId]);

  // Reset form when modal closes
  useEffect(() => {
    if (!openAdd) {
      resetForm();
    }
  }, [openAdd]);

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
    <Dialog open={openAdd} onOpenChange={setOpenAdd}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Add New Employee
            </div>
            <button
              onClick={() => setOpenAdd(false)}
              className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </button>
          </DialogTitle>
        </DialogHeader>

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
                    <SelectValue placeholder="Select department" />
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
                    <SelectValue placeholder="Select contact status" />
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
              <Label>Company *</Label>
              <Select 
                value={formData.companyId?.toString() || ''} 
                onValueChange={(value) => handleInputChange('companyId', parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a company">
                    {formData.companyId && companies.find(c => c.companyId === formData.companyId)?.name}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <div className="p-2">
                    <Input
                      placeholder="Search companies..."
                      value={companySearch}
                      onChange={(e) => setCompanySearch(e.target.value)}
                      className="mb-2"
                    />
                  </div>
                  {companiesLoading ? (
                    <div className="flex items-center justify-center py-4">
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                  ) : companies.length > 0 ? (
                    companies.map((company) => (
                      <SelectItem key={company.companyId} value={company.companyId.toString()}>
                        <div className="flex flex-col">
                          <span className="font-medium">{company.name}</span>
                          {company.location && (
                            <span className="text-xs text-muted-foreground">{company.location}</span>
                          )}
                        </div>
                      </SelectItem>
                    ))
                  ) : (
                    <div className="py-4 text-center text-sm text-muted-foreground">
                      No companies found
                    </div>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpenAdd(false)}
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
                  Adding Employee...
                </>
              ) : (
                <>
                  <User className="w-4 h-4 mr-2" />
                  Add Employee
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
