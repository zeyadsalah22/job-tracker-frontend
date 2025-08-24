import React, { useState, useEffect } from "react";
import { useQuery } from "react-query";
import { useAxiosPrivate } from "../../utils/axios";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/Dialog";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { 
  User, 
  Building2, 
  Mail, 
  Phone, 
  Linkedin, 
  ExternalLink,
  MapPin,
  Briefcase,
  Calendar,
  Users,
  X
} from 'lucide-react';

export default function ViewModal({ employee, open, setOpen }) {
  const [isLoading, setIsLoading] = useState(false);
  const [employeeDetails, setEmployeeDetails] = useState(null);
  const axiosPrivate = useAxiosPrivate();

  // Fetch detailed employee information when modal opens
  const fetchEmployeeDetails = async (employeeId) => {
    if (!employeeId) return null;
    
    try {
      setIsLoading(true);
      const response = await axiosPrivate.get(`/employees/${employeeId}`);
      console.log("Employee details:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching employee details:", error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (open && employee?.employeeId) {
      fetchEmployeeDetails(employee.employeeId).then(setEmployeeDetails);
    } else {
      setEmployeeDetails(null);
    }
  }, [open, employee?.employeeId]);

  // Use detailed data if available, otherwise fall back to basic employee data
  const displayEmployee = employeeDetails || employee;

  if (!employee) return null;

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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-xl font-semibold">
                {displayEmployee?.name?.charAt(0)?.toUpperCase() || '?'}
              </div>
              <div>
                <div className="text-xl font-semibold">{displayEmployee?.name || 'Unknown Employee'}</div>
                <div className="text-sm text-muted-foreground font-normal">
                  {displayEmployee?.jobTitle || 'No job title'} at {displayEmployee?.companyName || displayEmployee?.company?.name || 'Unknown Company'}
                </div>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
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
          <div className="space-y-6">
            {/* Employee Information Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Employee Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                    <p className="mt-1">{displayEmployee?.name || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Job Title</label>
                    <p className="mt-1">{displayEmployee?.jobTitle || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Department</label>
                    <div className="mt-1">
                      {displayEmployee?.department ? (
                        <Badge variant="outline" className={getDepartmentBadgeColor(displayEmployee.department)}>
                          {displayEmployee.department}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground">Not specified</span>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Contact Status</label>
                    <div className="mt-1">
                      <Badge variant="outline" className={getContactedBadgeColor(displayEmployee?.contacted)}>
                        {displayEmployee?.contacted || 'Unknown'}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <label className="text-sm font-medium text-muted-foreground">Contact Information</label>
                  <div className="mt-2 space-y-2">
                    {displayEmployee?.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{displayEmployee.email}</span>
                      </div>
                    )}
                    {displayEmployee?.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{displayEmployee.phone}</span>
                      </div>
                    )}
                    {displayEmployee?.linkedinLink && (
                      <div className="flex items-center gap-2">
                        <Linkedin className="w-4 h-4 text-blue-600" />
                        <a 
                          href={displayEmployee.linkedinLink} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                        >
                          LinkedIn Profile
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                <div className="border-t pt-4">
                  <label className="text-sm font-medium text-muted-foreground">Added Date</label>
                  <div className="mt-1 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{formatDate(displayEmployee?.createdAt)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Company Information Card */}
            {(displayEmployee?.company || displayEmployee?.companyName) && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="w-5 h-5" />
                    Company Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Company Name</label>
                      <p className="mt-1 font-medium">{displayEmployee?.companyName || displayEmployee?.company?.name || 'Not provided'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Location</label>
                      <div className="mt-1 flex items-center gap-2">
                        {displayEmployee?.company?.location ? (
                          <>
                            <MapPin className="w-4 h-4 text-muted-foreground" />
                            <span>{displayEmployee.company.location}</span>
                          </>
                        ) : (
                          <span className="text-muted-foreground">Not provided</span>
                        )}
                      </div>
                    </div>
                    {displayEmployee?.company?.companySize && (
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Company Size</label>
                        <div className="mt-1 flex items-center gap-2">
                          <Users className="w-4 h-4 text-muted-foreground" />
                          <span>{displayEmployee.company.companySize}</span>
                        </div>
                      </div>
                    )}
                    {displayEmployee?.company?.industry?.name && (
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Industry</label>
                        <div className="mt-1 flex items-center gap-2">
                          <Briefcase className="w-4 h-4 text-muted-foreground" />
                          <span>{displayEmployee.company.industry.name}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {(displayEmployee?.company?.linkedinLink || displayEmployee?.company?.careersLink) && (
                    <div className="border-t pt-4">
                      <label className="text-sm font-medium text-muted-foreground">Company Links</label>
                      <div className="flex gap-4 mt-2">
                        {displayEmployee?.company?.linkedinLink && (
                          <a 
                            href={displayEmployee.company.linkedinLink} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-primary hover:underline flex items-center gap-1"
                          >
                            <Linkedin className="w-4 h-4" />
                            LinkedIn
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                        {displayEmployee?.company?.careersLink && (
                          <a 
                            href={displayEmployee.company.careersLink} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-primary hover:underline flex items-center gap-1"
                          >
                            <Briefcase className="w-4 h-4" />
                            Careers
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  )}

                  {displayEmployee?.company?.description && (
                    <div className="border-t pt-4">
                      <label className="text-sm font-medium text-muted-foreground">Company Description</label>
                      <p className="mt-1 text-sm">{displayEmployee.company.description}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
