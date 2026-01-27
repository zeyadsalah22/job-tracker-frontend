import React from 'react';
import { useAxiosPrivate } from "../../utils/axios";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/Dialog";
import { Badge } from "../ui/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import Button from "../ui/Button";
import { 
  ExternalLink, 
  Building2, 
  MapPin, 
  Briefcase, 
  X, 
  Calendar,
  User,
  FileText,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';
import { format } from "date-fns";
import { getLogoUrl } from "../../utils/logoUtils";

export default function CompanyRequestViewModal({ request, open, setOpen, onApprove, onReject }) {
  if (!request) return null;

  const getStatusBadge = (status) => {
    // Handle both string and number status values
    const normalizedStatus = typeof status === 'string' ? status.toLowerCase() : status;
    
    switch (normalizedStatus) {
      case 0:
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">Pending</Badge>;
      case 1:
      case 'approved':
        return <Badge className="bg-green-100 text-green-800 border-green-300">Approved</Badge>;
      case 2:
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800 border-red-300">Rejected</Badge>;
      default:
        return <Badge variant="secondary">Unknown ({status})</Badge>;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return format(new Date(dateString), 'MMM dd, yyyy');
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    return format(new Date(dateString), 'MMM dd, yyyy HH:mm');
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
              {(() => {
                const logoUrl = getLogoUrl(request.logoUrl, request.companyName);
                return logoUrl && (logoUrl.startsWith('http://') || logoUrl.startsWith('https://')) ? (
                  <img 
                    src={logoUrl} 
                    alt={`${request.companyName} logo`}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentElement.innerHTML = '<span class="text-2xl">🏢</span>';
                    }}
                  />
                ) : (
                  <span className="text-2xl">🏢</span>
                );
              })()}
            </div>
            <div>
              <DialogTitle className="text-2xl">{request.companyName}</DialogTitle>
              <div className="flex items-center gap-2 mt-1">
                {getStatusBadge(request.requestStatus)}
                {request.industryName && (
                  <>
                    <span className="text-muted-foreground">•</span>
                    <span className="text-muted-foreground">{request.industryName}</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </DialogHeader>

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
                  <label className="text-sm font-medium text-muted-foreground">Company Name</label>
                  <p className="mt-1 font-semibold">{request.companyName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Location</label>
                  <div className="flex items-center gap-2 mt-1">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span>{request.location || 'Not provided'}</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Industry</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Briefcase className="w-4 h-4 text-muted-foreground" />
                    <span>{request.industryName || 'Not specified'}</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Status</label>
                  <div className="mt-1">
                    {getStatusBadge(request.requestStatus)}
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <label className="text-sm font-medium text-muted-foreground">External Links</label>
                <div className="flex gap-4 mt-2 flex-wrap">
                  {request.careersLink ? (
                    <a 
                      href={request.careersLink} 
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
                  
                  {request.linkedinLink ? (
                    <a 
                      href={request.linkedinLink} 
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
              
              {request.description && (
                <div className="border-t pt-4">
                  <label className="text-sm font-medium text-muted-foreground">Description</label>
                  <p className="mt-1 text-sm whitespace-pre-wrap">{request.description}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Request Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Request Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Requested By</label>
                  <div className="flex items-center gap-2 mt-1">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span>{request.userName || 'N/A'}</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Requested Date</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span>{formatDateTime(request.requestedAt)}</span>
                  </div>
                </div>
                
                {request.reviewedAt && (
                  <>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Reviewed Date</label>
                      <div className="flex items-center gap-2 mt-1">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span>{formatDateTime(request.reviewedAt)}</span>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Reviewed By</label>
                      <div className="flex items-center gap-2 mt-1">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <span>{request.reviewedByAdminName || 'N/A'}</span>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {request.rejectionReason && (
                <div className="border-t pt-4">
                  <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                    <div className="flex items-start gap-2">
                      <XCircle className="w-5 h-5 text-red-700 mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-red-800">Rejection Reason</p>
                        <p className="text-sm text-red-700 mt-1 whitespace-pre-wrap">{request.rejectionReason}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          {(request.requestStatus === 0 || request.requestStatus?.toLowerCase() === 'pending') && onApprove && onReject && (
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                onClick={() => {
                  setOpen(false);
                  onApprove(request);
                }}
                className="bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Approve
              </Button>
              <Button
                onClick={() => {
                  setOpen(false);
                  onReject(request);
                }}
                variant="destructive"
              >
                <XCircle className="h-4 w-4 mr-2" />
                Reject
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

