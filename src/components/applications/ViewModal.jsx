import React, { useState } from "react";
import { useQuery } from "react-query";
import { useAxiosPrivate } from "../../utils/axios";
import { 
  Edit, 
  Trash2, 
  ExternalLink, 
  Calendar, 
  User, 
  FileText, 
  Target, 
  CheckCircle, 
  Clock, 
  XCircle,
  X,
  Building2,
  MapPin,
  Briefcase,
  Users
} from "lucide-react";
import Button from "../ui/Button";
import { Badge } from "../ui/Badge";
import { Progress } from "../ui/Progress";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/Dialog";
import { Separator } from "../ui/Separator";

export default function ViewModal({ application, open, setOpen, onEdit, onDelete }) {
  const axiosPrivate = useAxiosPrivate();
  const [isLoading, setIsLoading] = useState(false);
  const [detailedApplication, setDetailedApplication] = useState(null);

  // Fetch detailed application data when modal opens
  React.useEffect(() => {
    if (open && application?.applicationId) {
      setIsLoading(true);
      const fetchDetailedApplication = async () => {
        try {
          const response = await axiosPrivate.get(`/applications/${application.applicationId}`);
          console.log("Detailed application data:", response.data);
          setDetailedApplication(response.data);
        } catch (error) {
          console.error("Error fetching detailed application:", error);
          setDetailedApplication(application); // Fallback to basic application data
        } finally {
          setIsLoading(false);
        }
      };
      fetchDetailedApplication();
    }
  }, [open, application?.applicationId, axiosPrivate]);

  if (!application) return null;

  const displayApplication = detailedApplication || application;

  const getStatusBadgeVariant = (status) => {
    switch (status?.toLowerCase()) {
      case "accepted": return "default";
      case "rejected": return "destructive";
      default: return "secondary";
    }
  };

  const getStageBadgeColor = (stage) => {
    const colors = {
      "Applied": "bg-blue-100 text-blue-800",
      "PhoneScreen": "bg-yellow-100 text-yellow-800",
      "Assessment": "bg-orange-100 text-orange-800", 
      "HrInterview": "bg-purple-100 text-purple-800",
      "TechnicalInterview": "bg-indigo-100 text-indigo-800",
      "Offer": "bg-green-100 text-green-800"
    };
    return colors[stage] || "bg-gray-100 text-gray-800";
  };

  const getTimelineIcon = (status) => {
    switch (status) {
      case "completed": return CheckCircle;
      case "current": return Clock;
      case "pending": return Clock;
      default: return Clock;
    }
  };

  const getTimelineIconColor = (status) => {
    switch (status) {
      case "completed": return "text-green-500 bg-green-50";
      case "current": return "text-blue-500 bg-blue-50";
      case "pending": return "text-gray-400 bg-gray-50";
      default: return "text-gray-400 bg-gray-50";
    }
  };

  // Generate timeline based on application data
  const generateTimeline = () => {
    const timeline = [];
    
    // Always add submission
    if (displayApplication.submissionDate) {
      timeline.push({
        date: displayApplication.submissionDate,
        event: "Application Submitted",
        description: "Application submitted through company website",
        icon: FileText,
        status: "completed"
      });
    }

    // Add current stage
    const currentStage = displayApplication.stage;
    if (currentStage && currentStage !== "Applied") {
      const stageEvents = {
        "PhoneScreen": "Phone Screening",
        "Assessment": "Assessment Round",
        "HrInterview": "HR Interview",
        "TechnicalInterview": "Technical Interview",
        "Offer": "Offer Extended"
      };
      
      timeline.push({
        date: new Date().toISOString().split('T')[0], // Current date as placeholder
        event: stageEvents[currentStage] || currentStage,
        description: `Currently in ${stageEvents[currentStage] || currentStage} stage`,
        icon: Clock,
        status: displayApplication.status === "Rejected" ? "completed" : "current"
      });
    }

    return timeline;
  };

  const timeline = generateTimeline();

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-xl font-semibold">
                    <Briefcase className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-xl font-semibold">{displayApplication.jobTitle || 'Unknown Position'}</div>
                    <div className="text-sm text-muted-foreground font-normal">
                      {displayApplication.companyName || displayApplication.company?.name || 'Unknown Company'}
                    </div>
                  </div>
                </div>
                
              </DialogTitle>
            </div>
            <div className="flex items-center gap-2">
              <button
                  onClick={() => setOpen(false)}
                  className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Close</span>
                </button>
            </div>
          </div>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Application Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Job Type</p>
                <p className="text-sm">{displayApplication.jobType || 'Not specified'}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Submission Date</p>
                <p className="text-sm">{formatDate(displayApplication.submissionDate)}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Application Link</p>
                {displayApplication.link ? (
                  <a 
                    href={displayApplication.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline flex items-center gap-1"
                  >
                    View Job Posting <ExternalLink className="h-3 w-3" />
                  </a>
                ) : (
                  <p className="text-sm text-muted-foreground">Not provided</p>
                )}
              </div>
            </div>

            <Separator />

            {/* Status and Progress */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Current Stage</p>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStageBadgeColor(displayApplication.stage)}`}>
                  {displayApplication.stage}
                </span>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Status</p>
                <Badge variant={getStatusBadgeVariant(displayApplication.status)}>
                  {displayApplication.status}
                </Badge>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">ATS Score</p>
                <div className="flex items-center gap-2">
                  <Progress value={displayApplication.atsScore || 0} className="flex-1" />
                  <span className="text-sm font-medium">{displayApplication.atsScore || 0}%</span>
                </div>
              </div>
            </div>

            <Separator />

            {/* Job Description */}
            {displayApplication.description && (
              <>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">Job Description</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {displayApplication.description}
                  </p>
                </div>
                <Separator />
              </>
            )}

            {/* Company Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="w-5 h-5" />
                  Company Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Company Name</p>
                      <p className="text-sm">{displayApplication.companyName || displayApplication.company?.name || 'Unknown'}</p>
                    </div>
                    {displayApplication.company?.location && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Location</p>
                        <p className="text-sm flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {displayApplication.company.location}
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="space-y-3">
                    {displayApplication.company?.industryId && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Industry</p>
                        <p className="text-sm">{displayApplication.company.industry?.name || 'Not specified'}</p>
                      </div>
                    )}
                    {displayApplication.company?.companySize && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Company Size</p>
                        <p className="text-sm flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {displayApplication.company.companySize}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* External Links */}
                <div className="border-t pt-4">
                  <p className="text-sm font-medium text-muted-foreground mb-2">External Links</p>
                  <div className="flex gap-4">
                    {displayApplication.company?.careersLink ? (
                      <a 
                        href={displayApplication.company.careersLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:underline flex items-center gap-1 text-sm"
                      >
                        Visit Careers Page <ExternalLink className="h-3 w-3" />
                      </a>
                    ) : (
                      <span className="text-muted-foreground text-sm">No careers link</span>
                    )}
                    {displayApplication.company?.linkedinLink ? (
                      <a 
                        href={displayApplication.company.linkedinLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:underline flex items-center gap-1 text-sm"
                      >
                        Visit LinkedIn <ExternalLink className="h-3 w-3" />
                      </a>
                    ) : (
                      <span className="text-muted-foreground text-sm">No LinkedIn link</span>
                    )}
                  </div>
                </div>

                {/* Company Description */}
                {displayApplication.company?.description && (
                  <div className="border-t pt-4">
                    <p className="text-sm font-medium text-muted-foreground mb-2">About</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {displayApplication.company.description}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Application Timeline */}
            {timeline.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Application Timeline
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {timeline.map((item, index) => {
                      const Icon = getTimelineIcon(item.status);
                      return (
                        <div key={index} className="flex items-start gap-3">
                          <div className={`p-2 rounded-full ${getTimelineIconColor(item.status)}`}>
                            <Icon className="h-4 w-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h4 className="text-sm font-medium">{item.event}</h4>
                              <span className="text-xs text-muted-foreground">
                                {formatDate(item.date)}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Contacted Employees */}
            {displayApplication.contactedEmployees && displayApplication.contactedEmployees.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Contacted Employees
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {displayApplication.contactedEmployees.map((employee, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-sm font-semibold">
                          {employee.name?.charAt(0)?.toUpperCase() || '?'}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-sm">{employee.name || 'Unknown Employee'}</div>
                          <div className="text-xs text-muted-foreground">{employee.jobTitle || 'No job title'}</div>
                          {employee.email && (
                            <div className="text-xs text-muted-foreground">{employee.email}</div>
                          )}
                        </div>
                        {employee.linkedinLink && (
                          <a 
                            href={employee.linkedinLink} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-primary hover:text-primary/80"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
