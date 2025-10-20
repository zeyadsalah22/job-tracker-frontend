import React from 'react';
import { useQuery } from "react-query";
import { useAxiosPrivate } from "../../utils/axios";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/Dialog";
import { Badge } from "../ui/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { ExternalLink, Building2, MapPin, Briefcase, X, Calendar, Star, Heart } from 'lucide-react';

export default function ViewModal({ userCompany, open, setOpen }) {
  const axiosPrivate = useAxiosPrivate();

  // Fetch detailed user company data
  const fetchUserCompanyDetails = async () => {
    if (!userCompany?.companyId) return null;
    const { data } = await axiosPrivate.get(`/user-companies/${userCompany.companyId}`);
    return data;
  };

  const { data: detailedUserCompany, isLoading } = useQuery(
    ["user-company-details", userCompany?.companyId],
    fetchUserCompanyDetails,
    {
      enabled: !!userCompany?.companyId && open,
    }
  );

  // Use detailed user company data if available, otherwise use the passed data
  const displayUserCompany = detailedUserCompany || userCompany;

  if (!displayUserCompany) return null;

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
            <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center overflow-hidden">
              {displayUserCompany.companyLogoUrl && (displayUserCompany.companyLogoUrl.startsWith('http://') || displayUserCompany.companyLogoUrl.startsWith('https://')) ? (
                <img 
                  src={displayUserCompany.companyLogoUrl} 
                  alt={`${displayUserCompany.companyName} logo`}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML = '<span class="text-2xl">🏢</span>';
                  }}
                />
              ) : (
                <span className="text-2xl">🏢</span>
              )}
            </div>
            <div>
              <DialogTitle className="text-2xl flex items-center gap-2">
                {displayUserCompany.companyName}
                {displayUserCompany.favorite && (
                  <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                )}
              </DialogTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className={getInterestBadgeColor(displayUserCompany.interestLevel)}>
                  {displayUserCompany.interestLevel} Interest
                </Badge>
                <span className="text-muted-foreground">•</span>
                <span className="text-muted-foreground">{displayUserCompany.companyLocation}</span>
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
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5" />
                  My Interest & Notes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Interest Level</label>
                    <div className="mt-1">
                      <Badge variant="outline" className={getInterestBadgeColor(displayUserCompany.interestLevel)}>
                        {displayUserCompany.interestLevel}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Favorite</label>
                    <div className="flex items-center gap-2 mt-1">
                      {displayUserCompany.favorite ? (
                        <>
                          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                          <span>Yes, this is a favorite company</span>
                        </>
                      ) : (
                        <span className="text-muted-foreground">Not marked as favorite</span>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Date Added</label>
                    <div className="flex items-center gap-2 mt-1">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span>{formatDate(displayUserCompany.createdAt)}</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Last Updated</label>
                    <div className="flex items-center gap-2 mt-1">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span>{formatDate(displayUserCompany.updatedAt)}</span>
                    </div>
                  </div>
                </div>
                
                {displayUserCompany.personalNotes && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Personal Notes</label>
                    <p className="mt-1 text-sm bg-muted/50 p-3 rounded-md">{displayUserCompany.personalNotes}</p>
                  </div>
                )}

                {displayUserCompany.tags && displayUserCompany.tags.length > 0 && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Tags</label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {displayUserCompany.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

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
                    <label className="text-sm font-medium text-muted-foreground">Company Name</label>
                    <div className="mt-1">
                      <span className="font-medium">{displayUserCompany.companyName}</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Location</label>
                    <div className="flex items-center gap-2 mt-1">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span>{displayUserCompany.companyLocation || 'Not provided'}</span>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <label className="text-sm font-medium text-muted-foreground">External Links</label>
                  <div className="flex gap-4 mt-2">
                    {displayUserCompany.companyCareersLink ? (
                      <a 
                        href={displayUserCompany.companyCareersLink} 
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
                    
                    {displayUserCompany.companyLinkedinLink ? (
                      <a 
                        href={displayUserCompany.companyLinkedinLink} 
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
              </CardContent>
            </Card>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
