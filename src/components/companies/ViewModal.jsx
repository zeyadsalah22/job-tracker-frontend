import React from 'react';
import { useQuery } from "react-query";
import { useAxiosPrivate } from "../../utils/axios";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/Dialog";
import { Badge } from "../ui/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { ExternalLink, Building2, MapPin, Briefcase, X, Calendar } from 'lucide-react';

export default function ViewModal({ company, open, setOpen }) {
  const axiosPrivate = useAxiosPrivate();

  // Fetch detailed company data
  const fetchCompanyDetails = async () => {
    if (!company?.companyId) return null;
    const { data } = await axiosPrivate.get(`/companies/${company.companyId}`);
    return data;
  };

  const { data: detailedCompany, isLoading } = useQuery(
    ["company-details", company?.companyId],
    fetchCompanyDetails,
    {
      enabled: !!company?.companyId && open,
    }
  );

  // Use detailed company data if available, otherwise use the passed company data
  const displayCompany = detailedCompany || company;

  if (!displayCompany) return null;

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

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <button
          onClick={() => setOpen(false)}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 z-10"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>

        <DialogHeader>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-lg">
              {displayCompany.logo || '🏢'}
            </div>
            <div>
              <DialogTitle className="text-2xl">{displayCompany.name}</DialogTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className={getSizeColor(displayCompany.companySize)}>
                  {displayCompany.companySize}
                </Badge>
                <span className="text-muted-foreground">•</span>
                <span className="text-muted-foreground">{displayCompany.industry?.name || 'N/A'}</span>
              </div>
            </div>
          </div>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="space-y-6">
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
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Company Size</label>
                    <div className="mt-1">
                      <Badge variant="outline" className={getSizeColor(displayCompany.companySize)}>
                        {displayCompany.companySize}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Location</label>
                    <div className="flex items-center gap-2 mt-1">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span>{displayCompany.location || 'Not provided'}</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Industry</label>
                    <div className="flex items-center gap-2 mt-1">
                      <Briefcase className="w-4 h-4 text-muted-foreground" />
                      <span>{displayCompany.industry?.name || 'Not specified'}</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Created At</label>
                    <div className="flex items-center gap-2 mt-1">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span>{formatDate(displayCompany.createdAt)}</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Last Updated</label>
                    <div className="flex items-center gap-2 mt-1">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span>{formatDate(displayCompany.updatedAt)}</span>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <label className="text-sm font-medium text-muted-foreground">External Links</label>
                  <div className="flex gap-4 mt-2">
                    {displayCompany.careersLink ? (
                      <a 
                        href={displayCompany.careersLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:underline flex items-center gap-1"
                      >
                        Visit Careers Page
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <span className="text-muted-foreground text-sm">No careers link</span>
                    )}
                    
                    {displayCompany.linkedinLink ? (
                      <a 
                        href={displayCompany.linkedinLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:underline flex items-center gap-1"
                      >
                        Visit LinkedIn
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <span className="text-muted-foreground text-sm">No LinkedIn link</span>
                    )}
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <label className="text-sm font-medium text-muted-foreground">Description</label>
                  <p className="mt-1 text-sm">{displayCompany.description || 'No description provided'}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
} 