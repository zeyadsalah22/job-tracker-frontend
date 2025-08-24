import React, { useState, useEffect } from "react";
import { useQuery } from "react-query";
import { useAxiosPrivate } from "../../utils/axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useUserStore from "../../store/user.store";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/Dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/Select";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import Label from "../ui/Label";
import Input from "../ui/Input";
import Textarea from "../ui/Textarea";
import Button from "../ui/Button";
import { Badge } from "../ui/Badge";
import { 
  Building2, 
  FileText, 
  Play, 
  Search,
  Loader2,
  AlertCircle
} from "lucide-react";

export default function AddModal({ open, setOpen, refetch, onStartRecording }) {
  const axiosPrivate = useAxiosPrivate();
  const user = useUserStore((state) => state.user);
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [companySearch, setCompanySearch] = useState("");
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    userId: user?.userId || "",
    companyId: "",
    applicationId: "",
    position: "",
    jobDescription: "",
  });

  // Update userId when user data becomes available
  useEffect(() => {
    if (user?.userId && !formData.userId) {
      setFormData(prev => ({
        ...prev,
        userId: user.userId
      }));
    }
  }, [user?.userId, formData.userId]);

  // Reset form when modal opens
  useEffect(() => {
    if (open) {
      setFormData({
        userId: user?.userId || "",
        companyId: "",
        applicationId: "",
        position: "",
        jobDescription: "",
      });
      setErrors({});
      setCompanySearch("");
    }
  }, [open, user?.userId]);

  // Fetch user companies for dropdown
  const fetchCompanies = async () => {
    try {
      const params = {
        SearchTerm: companySearch || undefined,
        PageSize: 100,
      };
      const response = await axiosPrivate.get("/user-companies", { params });
      const items = response.data?.items || [];
      
      return Array.isArray(items) ? items.map((company) => ({
        id: company.companyId,
        name: company.companyName || company.name,
        value: company.companyId,
        location: company.companyLocation || company.location,
      })) : [];
    } catch (error) {
      console.error("Error fetching user companies:", error);
      return [];
    }
  };

  const { data: companies = [], isLoading: loadingCompanies } = useQuery(
    ["user-companies-for-interview", companySearch],
    fetchCompanies,
    {
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
    }
  );

  // Fetch applications for dropdown
  const fetchApplications = async () => {
    try {
      const response = await axiosPrivate.get("/applications");
      const apps = response.data?.items || [];
      
      return Array.isArray(apps) 
        ? apps.filter((app) => app.status !== "Rejected")
        : [];
    } catch (error) {
      console.error("Error fetching applications:", error);
      return [];
    }
  };

  const { data: applications = [], isLoading: loadingApplications } = useQuery(
    ["applications-for-interview"],
    fetchApplications,
    {
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
    }
  );

  // Handle application selection
  const handleApplicationSelect = (applicationId) => {
    const selectedApp = applications.find(app => app.applicationId.toString() === applicationId);
    
    if (selectedApp) {
      setFormData({
        ...formData,
        applicationId: selectedApp.applicationId,
        position: selectedApp.jobTitle || "",
        jobDescription: selectedApp.description || "",
        companyId: "", // Clear company selection when application is selected
      });
    } else {
      setFormData({
        ...formData,
        applicationId: "",
        position: "",
        jobDescription: "",
      });
    }
  };

  // Handle company selection
  const handleCompanySelect = (companyId) => {
    setFormData({
      ...formData,
      companyId: companyId,
      applicationId: "", // Clear application selection when company is selected
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    const newErrors = {};
    
    if (!formData.applicationId && !formData.companyId) {
      newErrors.source = "Please select either an application or a company";
    }
    
    if (!formData.applicationId && !formData.position.trim()) {
      newErrors.position = "Position is required when not selecting an application";
    }
    
    if (!formData.applicationId && !formData.jobDescription.trim()) {
      newErrors.jobDescription = "Job description is required when not selecting an application";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    
    try {
      const submitData = {
        userId: parseInt(formData.userId, 10),
        applicationId: formData.applicationId ? parseInt(formData.applicationId, 10) : null,
        companyId: formData.companyId ? parseInt(formData.companyId, 10) : null,
        position: formData.position || null,
        jobDescription: formData.jobDescription || null
      };

      const response = await axiosPrivate.post("/mockinterview", submitData);
      const interviewId = response.data.interviewId;
      
      toast.success("Interview started successfully!");
      refetch();
      setOpen(false);
      
      // Open interview recording modal
      if (onStartRecording) {
        onStartRecording(interviewId);
      }
      
    } catch (error) {
      console.error("Failed to create interview:", error);
      
      let errorMessage = "Failed to start interview. Please try again.";
      if (error.response?.data) {
        if (typeof error.response.data === 'string') {
          errorMessage = error.response.data;
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message;
        }
      }
      
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Play className="h-5 w-5" />
            Start New Interview
          </DialogTitle>
          <DialogDescription>
            Set up your mock interview session. You can either select an existing application or create a custom interview.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Source Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Interview Source</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Application Selection */}
              <div className="space-y-2">
                <Label htmlFor="application">Select Application (Optional)</Label>
                <Select
                  value={formData.applicationId.toString()}
                  onValueChange={handleApplicationSelect}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose an existing application">
                      {formData.applicationId && applications.find(app => app.applicationId.toString() === formData.applicationId.toString()) && (
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          <span>
                            {applications.find(app => app.applicationId.toString() === formData.applicationId.toString())?.jobTitle} 
                            {" @ "}
                            {applications.find(app => app.applicationId.toString() === formData.applicationId.toString())?.companyName}
                          </span>
                        </div>
                      )}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">No Application Selected</SelectItem>
                    {applications.map((app) => (
                      <SelectItem key={app.applicationId} value={app.applicationId.toString()}>
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          <div>
                            <p className="font-medium">{app.jobTitle || "Untitled Position"}</p>
                            <p className="text-sm text-muted-foreground">{app.companyName}</p>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">
                  Select an application to auto-fill position and job description
                </p>
              </div>

              {/* OR Divider */}
              <div className="flex items-center gap-4">
                <div className="flex-1 border-t"></div>
                <Badge variant="outline" className="px-3 py-1">OR</Badge>
                <div className="flex-1 border-t"></div>
              </div>

              {/* Company Selection */}
              <div className="space-y-2">
                <Label htmlFor="company">Select Company (Optional)</Label>
                <Select
                  value={formData.companyId.toString()}
                  onValueChange={handleCompanySelect}
                  disabled={!!formData.applicationId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a company for custom interview">
                      {formData.companyId && companies.find(company => company.id.toString() === formData.companyId.toString()) && (
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4" />
                          <span>{companies.find(company => company.id.toString() === formData.companyId.toString())?.name}</span>
                        </div>
                      )}
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
                    <SelectItem value="">No Company Selected</SelectItem>
                    {companies.map((company) => (
                      <SelectItem key={company.id} value={company.id.toString()}>
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4" />
                          <div>
                            <p className="font-medium">{company.name}</p>
                            {company.location && (
                              <p className="text-sm text-muted-foreground">{company.location}</p>
                            )}
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">
                  Select a company for a custom interview setup
                </p>
              </div>

              {errors.source && (
                <div className="flex items-center gap-2 text-sm text-destructive">
                  <AlertCircle className="h-4 w-4" />
                  <span>{errors.source}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Interview Details - Only show if no application selected */}
          {!formData.applicationId && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Interview Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="position">Position *</Label>
                  <Input
                    id="position"
                    name="position"
                    value={formData.position}
                    onChange={(e) => setFormData({...formData, position: e.target.value})}
                    placeholder="e.g., Senior Frontend Developer"
                    disabled={!!formData.applicationId}
                  />
                  {errors.position && (
                    <p className="text-sm text-destructive">{errors.position}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="jobDescription">Job Description *</Label>
                  <Textarea
                    id="jobDescription"
                    name="jobDescription"
                    value={formData.jobDescription}
                    onChange={(e) => setFormData({...formData, jobDescription: e.target.value})}
                    placeholder="Paste the job description here..."
                    rows={4}
                    disabled={!!formData.applicationId}
                  />
                  {errors.jobDescription && (
                    <p className="text-sm text-destructive">{errors.jobDescription}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Application Preview - Show if application selected */}
          {formData.applicationId && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Selected Application</CardTitle>
              </CardHeader>
              <CardContent>
                {(() => {
                  const selectedApp = applications.find(app => app.applicationId.toString() === formData.applicationId.toString());
                  return selectedApp ? (
                    <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                      <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{selectedApp.jobTitle}</p>
                          <p className="text-sm text-muted-foreground">{selectedApp.companyName}</p>
                        </div>
                      </div>
                      {selectedApp.description && (
                        <div className="mt-2">
                          <p className="text-sm text-muted-foreground">Job Description:</p>
                          <p className="text-sm mt-1 line-clamp-3">{selectedApp.description}</p>
                        </div>
                      )}
                    </div>
                  ) : null;
                })()}
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading || (!formData.applicationId && !formData.companyId)}
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
              <Play className="w-4 h-4 mr-2" />
              Start Interview
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}