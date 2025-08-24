import React from "react";
import { useQuery } from "react-query";
import { useAxiosPrivate } from "../../utils/axios";
import { 
  HelpCircle, 
  Star, 
  Calendar, 
  Building2,
  Tag,
  FileText,
  X,
} from "lucide-react";
import Button from "../ui/Button";
import { Badge } from "../ui/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/Dialog";

export default function ViewModal({ question, open, setOpen }) {
  const axiosPrivate = useAxiosPrivate();

  // Fetch application details for the question
  const fetchApplication = async () => {
    if (!question?.applicationId) return null;
    try {
      const response = await axiosPrivate.get(`/applications/${question.applicationId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching application:", error);
      return null;
    }
  };

  const { data: application } = useQuery(
    ["application-for-question-view", question?.applicationId],
    fetchApplication,
    {
      enabled: !!question?.applicationId && open,
    }
  );

  // Helper functions
  const getDifficultyStars = (difficulty) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={`h-4 w-4 ${i < difficulty ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} 
      />
    ));
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "Completed": return "bg-green-100 text-green-800 border-green-200";
      case "InProgress": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "In Progress": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "NotStarted": return "bg-gray-100 text-gray-800 border-gray-200";
      case "Not Started": return "bg-gray-100 text-gray-800 border-gray-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getTypeBadgeColor = (type) => {
    switch (type) {
      case "Technical": return "bg-blue-100 text-blue-800 border-blue-200";
      case "Behavioral": return "bg-purple-100 text-purple-800 border-purple-200";
      case "CompanySpecific": return "bg-green-100 text-green-800 border-green-200";
      case "Company-Specific": return "bg-green-100 text-green-800 border-green-200";
      case "CulturalFit": return "bg-orange-100 text-orange-800 border-orange-200";
      case "Cultural Fit": return "bg-orange-100 text-orange-800 border-orange-200";
      case "ApplicationForm": return "bg-indigo-100 text-indigo-800 border-indigo-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatType = (type) => {
    switch (type) {
      case "CompanySpecific": return "Company-Specific";
      case "CulturalFit": return "Cultural Fit";
      case "ApplicationForm": return "Application Form";
      default: return type;
    }
  };

  const formatStatus = (status) => {
    switch (status) {
      case "InProgress": return "In Progress";
      case "NotStarted": return "Not Started";
      default: return status;
    }
  };

  if (!question) return null;

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
          <DialogTitle className="flex items-center gap-3">
            <HelpCircle className="h-6 w-6" />
            <div>
              <div className="flex items-center gap-2">
                <span>Interview Question</span>
                {question.favorite && (
                  <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                )}
              </div>
              <div className="text-sm text-muted-foreground font-normal">
                {application?.companyName} - {application?.jobTitle}
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Question Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5" />
                Question Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-lg leading-relaxed">{question.question1}</p>
              </div>
              
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Type:</span>
                  <Badge variant="outline" className={getTypeBadgeColor(question.type)}>
                    {formatType(question.type)}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Difficulty:</span>
                  <div className="flex items-center gap-1">
                    {getDifficultyStars(question.difficulty)}
                    <span className="text-sm text-muted-foreground ml-1">
                      ({question.difficulty}/5)
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Status:</span>
                  <Badge variant="outline" className={getStatusBadgeColor(question.answerStatus)}>
                    {formatStatus(question.answerStatus)}
                  </Badge>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Added on {question.createdAt ? new Date(question.createdAt).toLocaleDateString() : 'N/A'}</span>
              </div>
            </CardContent>
          </Card>

          {/* Related Application */}
          {application && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Related Application
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{application.companyName}</h4>
                      <p className="text-sm text-muted-foreground">{application.jobTitle}</p>
                    </div>
                    <Badge variant="outline">
                      {application.status}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* My Answer */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                My Answer
              </CardTitle>
            </CardHeader>
            <CardContent>
              {question.answer ? (
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="leading-relaxed whitespace-pre-wrap">
                    {question.answer}
                  </p>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="mx-auto h-12 w-12 mb-4 opacity-50" />
                  <p className="text-lg font-medium mb-2">No answer yet</p>
                  <p>Start preparing your answer for this question.</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Tags */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tag className="h-5 w-5" />
                Tags
              </CardTitle>
            </CardHeader>
            <CardContent>
              {Array.isArray(question.tags) && question.tags.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {question.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground italic">No tags added yet.</p>
              )}
            </CardContent>
          </Card>

          {/* Notes */}
          {question.preparationNote && (
            <Card>
              <CardHeader>
                <CardTitle>Preparation Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="leading-relaxed whitespace-pre-wrap">
                    {question.preparationNote}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

        </div>
      </DialogContent>
    </Dialog>
  );
}