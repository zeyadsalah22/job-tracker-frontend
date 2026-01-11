import React, { useState, useEffect } from "react";
import { useQuery } from "react-query";
import { useAxiosPrivate } from "../../utils/axios";
import { toast } from "react-toastify";
import useUserStore from "../../store/user.store";
import { X, CalendarIcon, Loader2, Building2 } from "lucide-react";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Label from "../ui/Label";
import Textarea from "../ui/Textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/Select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/Dialog";
import { Calendar } from "../ui/Calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../ui/Popover";
import { format } from "date-fns";
import { cn } from "../../lib/utils.ts";

export default function EditModal({ id, refetch, openEdit, setOpenEdit }) {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoadingApplication, setIsLoadingApplication] = useState(false);
  const [employeeSearch, setEmployeeSearch] = useState("");
  const user = useUserStore((state) => state.user);
  const axiosPrivate = useAxiosPrivate();

  const [formData, setFormData] = useState({
    jobTitle: "",
    jobType: "",
    description: "",
    link: "",
    submittedCvId: "",
    atsScore: "",
    stage: "",
    status: "",
    submissionDate: null,
    contactedEmployeeIds: []
  });

  const [applicationData, setApplicationData] = useState(null);

  // Fetch application data when modal opens
  useEffect(() => {
    if (openEdit && id) {
      setIsLoadingApplication(true);
      const fetchApplication = async () => {
        try {
          const response = await axiosPrivate.get(`/applications/${id}`);
          console.log("Fetched application for edit:", response.data);
          const app = response.data;
          setApplicationData(app);
          
          // Pre-populate form data
          setFormData({
            jobTitle: app.jobTitle || "",
            jobType: app.jobType || "",
            description: app.description || "",
            link: app.link || "",
            submittedCvId: app.submittedCvId?.toString() || "",
            atsScore: app.atsScore?.toString() || "",
            stage: app.stage || "",
            status: app.status || "",
            submissionDate: app.submissionDate ? new Date(app.submissionDate) : null,
            contactedEmployeeIds: app.contactedEmployees?.map(emp => emp.employeeId) || []
          });
        } catch (error) {
          console.error("Error fetching application:", error);
          toast.error("Failed to load application data");
        } finally {
          setIsLoadingApplication(false);
        }
      };
      fetchApplication();
    }
  }, [openEdit, id, axiosPrivate]);

  // Fetch employees for the application's company
  const fetchEmployees = async () => {
    if (!applicationData?.companyId) return [];
    
    try {
      const params = { 
        CompanyId: applicationData.companyId,
        PageSize: 100
      };
      
      const response = await axiosPrivate.get('/employees', { params });
      
      let employees = [];
      if (Array.isArray(response.data)) {
        employees = response.data;
      } else if (response.data && Array.isArray(response.data.items)) {
        employees = response.data.items;
      }
      
      return employees;
    } catch (error) {
      console.error("Error fetching employees:", error);
      return [];
    }
  };

  const { data: employees = [], isLoading: employeesLoading } = useQuery(
    ["employees-for-edit-application", applicationData?.companyId],
    fetchEmployees,
    {
      enabled: !!applicationData?.companyId,
      staleTime: 5 * 60 * 1000,
    }
  );

  // Fetch CVs
  const fetchCvs = async () => {
    try {
      const response = await axiosPrivate.get('/cvs');
      return response.data || [];
    } catch (error) {
      console.error("Error fetching CVs:", error);
      return [];
    }
  };

  const { data: cvs = [], isLoading: cvsLoading } = useQuery(
    ["cvs"],
    fetchCvs,
    {
      staleTime: 10 * 60 * 1000,
    }
  );

  const validateForm = () => {
    const newErrors = {};

    if (!formData.jobTitle.trim()) {
      newErrors.jobTitle = "Job title is required";
    }
    if (!formData.jobType) {
      newErrors.jobType = "Job type is required";
    }
    if (!formData.stage) {
      newErrors.stage = "Stage is required";
    }
    if (!formData.status) {
      newErrors.status = "Status is required";
    }
    if (!formData.submittedCvId) {
      newErrors.submittedCvId = "CV is required";
    }
    if (formData.atsScore && (isNaN(Number(formData.atsScore)) || Number(formData.atsScore) < 0 || Number(formData.atsScore) > 100)) {
      newErrors.atsScore = "ATS Score must be between 0 and 100";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      const submitData = {
        jobTitle: formData.jobTitle,
        jobType: formData.jobType,
        description: formData.description,
        link: formData.link,
        submittedCvId: parseInt(formData.submittedCvId, 10),
        atsScore: formData.atsScore ? parseInt(formData.atsScore, 10) : 0,
        stage: formData.stage,
        status: formData.status,
        submissionDate: formData.submissionDate ? formData.submissionDate.toISOString().split('T')[0] : applicationData?.submissionDate,
        contactedEmployeeIds: formData.contactedEmployeeIds.map(id => parseInt(id, 10))
      };

      console.log("Updating application data:", submitData);
      
      await axiosPrivate.put(`/applications/${id}`, submitData);
      
      toast.success("Application updated successfully");
      setOpenEdit(false);
      refetch();
      
    } catch (error) {
      console.error("Error updating application:", error);
      
      let errorMessage = "An error occurred. Please try again";
      if (error.response?.data) {
        if (typeof error.response.data === 'string') {
          errorMessage = error.response.data;
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.data.errors) {
          errorMessage = Object.values(error.response.data.errors).flat().join(", ");
        }
      }
      
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleEmployeeToggle = (employeeId) => {
    setFormData(prev => ({
      ...prev,
      contactedEmployeeIds: prev.contactedEmployeeIds.includes(employeeId)
        ? prev.contactedEmployeeIds.filter(id => id !== employeeId)
        : [...prev.contactedEmployeeIds, employeeId]
    }));
  };

  return (
    <Dialog open={openEdit} onOpenChange={setOpenEdit}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Edit Application
            <button
              onClick={() => setOpenEdit(false)}
              className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </button>
          </DialogTitle>
        </DialogHeader>

        {isLoadingApplication ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Read-only Company Information */}
            <div className="space-y-2">
              <Label>Current Company</Label>
              <div className="p-3 bg-muted rounded-md">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">
                    {applicationData?.companyName || applicationData?.company?.name || 'Unknown Company'}
                  </span>
                </div>
                {applicationData?.company?.location && (
                  <div className="text-sm text-muted-foreground mt-1">
                    {applicationData.company.location}
                  </div>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Company information cannot be changed in edit mode.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Job Title */}
              <div className="space-y-2">
                <Label htmlFor="jobTitle">Job Title *</Label>
                <Input
                  id="jobTitle"
                  value={formData.jobTitle}
                  onChange={(e) => setFormData(prev => ({ ...prev, jobTitle: e.target.value }))}
                  placeholder="e.g. Senior Software Engineer"
                />
                {errors.jobTitle && (
                  <p className="text-sm text-destructive">{errors.jobTitle}</p>
                )}
              </div>

              {/* Job Type */}
              <div className="space-y-2">
                <Label htmlFor="jobType">Job Type *</Label>
                <Select
                  value={formData.jobType}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, jobType: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select job type">
                      {formData.jobType || "Select job type"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Full-time">Full-time</SelectItem>
                    <SelectItem value="Part-time">Part-time</SelectItem>
                    <SelectItem value="Contract">Contract</SelectItem>
                    <SelectItem value="Internship">Internship</SelectItem>
                  </SelectContent>
                </Select>
                {errors.jobType && (
                  <p className="text-sm text-destructive">{errors.jobType}</p>
                )}
              </div>

              {/* ATS Score */}
              <div className="space-y-2">
                <Label htmlFor="atsScore">ATS Score (0-100)</Label>
                <Input
                  id="atsScore"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.atsScore}
                  onChange={(e) => setFormData(prev => ({ ...prev, atsScore: e.target.value }))}
                  placeholder="85"
                />
                {errors.atsScore && (
                  <p className="text-sm text-destructive">{errors.atsScore}</p>
                )}
              </div>

              {/* Stage */}
              <div className="space-y-2">
                <Label htmlFor="stage">Stage *</Label>
                <Select
                  value={formData.stage}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, stage: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select stage">
                      {formData.stage || "Select stage"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Applied">Applied</SelectItem>
                    <SelectItem value="PhoneScreen">Phone Screen</SelectItem>
                    <SelectItem value="Assessment">Assessment</SelectItem>
                    <SelectItem value="HrInterview">HR Interview</SelectItem>
                    <SelectItem value="TechnicalInterview">Technical Interview</SelectItem>
                    <SelectItem value="Offer">Offer</SelectItem>
                  </SelectContent>
                </Select>
                {errors.stage && (
                  <p className="text-sm text-destructive">{errors.stage}</p>
                )}
              </div>

              {/* Status */}
              <div className="space-y-2">
                <Label htmlFor="status">Status *</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status">
                      {formData.status || "Select status"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Accepted">Accepted</SelectItem>
                    <SelectItem value="Rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
                {errors.status && (
                  <p className="text-sm text-destructive">{errors.status}</p>
                )}
              </div>

              {/* CV Selection */}
              <div className="space-y-2">
                <Label htmlFor="cvId">CV Used *</Label>
                <Select
                  value={formData.submittedCvId}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, submittedCvId: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select CV">
                      {formData.submittedCvId 
                        ? (() => {
                            const selectedCv = cvs.find(cv => cv.resumeId.toString() === formData.submittedCvId);
                            return selectedCv 
                              ? `Resume ${selectedCv.resumeId} (${new Date(selectedCv.createdAt).toLocaleDateString()})`
                              : "Select CV";
                          })()
                        : "Select CV"
                      }
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {cvsLoading ? (
                      <div className="flex items-center justify-center py-4">
                        <Loader2 className="h-4 w-4 animate-spin" />
                      </div>
                    ) : cvs.length > 0 ? (
                      cvs.map((cv) => (
                        <SelectItem key={cv.resumeId} value={cv.resumeId.toString()}>
                          Resume {cv.resumeId} ({new Date(cv.createdAt).toLocaleDateString()})
                        </SelectItem>
                      ))
                    ) : (
                      <div className="py-4 text-center text-sm text-muted-foreground">
                        No CVs found
                      </div>
                    )}
                  </SelectContent>
                </Select>
                {errors.submittedCvId && (
                  <p className="text-sm text-destructive">{errors.submittedCvId}</p>
                )}
              </div>
            </div>

            {/* Application Link */}
            <div className="space-y-2">
              <Label htmlFor="applicationLink">Application Link</Label>
              <Input
                id="applicationLink"
                type="url"
                value={formData.link}
                onChange={(e) => setFormData(prev => ({ ...prev, link: e.target.value }))}
                placeholder="https://..."
              />
            </div>

            {/* Job Description */}
            <div className="space-y-2">
              <Label htmlFor="jobDescription">Job Description</Label>
              <Textarea
                id="jobDescription"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe the job requirements and responsibilities..."
                rows={4}
              />
            </div>

            {/* Submission Date */}
            <div className="space-y-2">
              <Label>Submission Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.submissionDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.submissionDate ? (
                      format(formData.submissionDate, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.submissionDate || undefined}
                    onSelect={(date) => setFormData(prev => ({ ...prev, submissionDate: date || null }))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Contacted Employees */}
            {applicationData?.companyId && (
              <div className="space-y-2">
                <Label>Contacted Employees</Label>
                <Select
                  value=""
                  onValueChange={(value) => {
                    const employeeId = parseInt(value, 10);
                    if (!formData.contactedEmployeeIds.includes(employeeId)) {
                      setFormData(prev => ({
                        ...prev,
                        contactedEmployeeIds: [...prev.contactedEmployeeIds, employeeId]
                      }));
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Search and select employees..." />
                  </SelectTrigger>
                  <SelectContent>
                    <div className="p-2">
                      <Input
                        placeholder="Search employees..."
                        value={employeeSearch}
                        onChange={(e) => setEmployeeSearch(e.target.value)}
                        className="mb-2"
                      />
                    </div>
                    {employeesLoading ? (
                      <div className="flex items-center justify-center py-4">
                        <Loader2 className="h-4 w-4 animate-spin" />
                      </div>
                    ) : employees.length > 0 ? (
                      employees
                        .filter(employee => 
                          !employeeSearch || 
                          employee.name.toLowerCase().includes(employeeSearch.toLowerCase()) ||
                          (employee.jobTitle && employee.jobTitle.toLowerCase().includes(employeeSearch.toLowerCase()))
                        )
                        .map((employee) => (
                          <SelectItem 
                            key={employee.employeeId} 
                            value={employee.employeeId.toString()}
                            disabled={formData.contactedEmployeeIds.includes(employee.employeeId)}
                          >
                            <div className="flex flex-col">
                              <span className="font-medium">{employee.name}</span>
                              {employee.jobTitle && (
                                <span className="text-xs text-muted-foreground">{employee.jobTitle}</span>
                              )}
                            </div>
                          </SelectItem>
                        ))
                    ) : (
                      <div className="py-4 text-center text-sm text-muted-foreground">
                        No employees found
                      </div>
                    )}
                  </SelectContent>
                </Select>
                
                {/* Selected Employees Display */}
                {formData.contactedEmployeeIds.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-sm text-muted-foreground">Selected Employees:</Label>
                    <div className="flex flex-wrap gap-2">
                      {formData.contactedEmployeeIds.map((employeeId) => {
                        const employee = employees.find(emp => emp.employeeId === employeeId);
                        return (
                          <div
                            key={employeeId}
                            className="flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm"
                          >
                            <span>{employee?.name || 'Loading...'}</span>
                            <button
                              type="button"
                              onClick={() => setFormData(prev => ({
                                ...prev,
                                contactedEmployeeIds: prev.contactedEmployeeIds.filter(id => id !== employeeId)
                              }))}
                              className="hover:bg-primary/20 rounded-full w-4 h-4 flex items-center justify-center"
                            >
                              ×
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Form Actions */}
            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setOpenEdit(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Application"
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
