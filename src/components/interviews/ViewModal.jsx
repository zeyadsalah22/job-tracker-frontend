import React, { useState } from "react";
import { useQuery } from "react-query";
import { useAxiosPrivate } from "../../utils/axios";
import { useInterviewFeedback } from "../../hooks/useInterviewFeedback";
import AnswerFeedbackCard from "./feedback/AnswerFeedbackCard";
import VideoFeedbackCard from "./feedback/VideoFeedbackCard";
import {
  Building2,
  Clock,
  Calendar,
  FileText,
  MessageSquare,
  Play,
  User,
  MapPin,
  X,
  Sparkles,
  Loader2,
  AlertCircle
} from "lucide-react";
import { Badge } from "../ui/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/Dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/Tabs";
import Button from "../ui/Button";

export default function ViewModal({ interview, open, setOpen, onStartRecording }) {
  const axiosPrivate = useAxiosPrivate();
  const [activeTab, setActiveTab] = useState("overview");

  // Use the feedback hook
  const {
    answersFeedback,
    videoFeedback,
    isLoading: isFeedbackLoading,
    hasFeedback,
    refetchAll
  } = useInterviewFeedback(interview?.interviewId);

  // Fetch application data if exists
  const fetchApplication = async () => {
    if (!interview?.applicationId) return null;
    try {
      const response = await axiosPrivate.get(`/applications/${interview.applicationId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching application:", error);
      return null;
    }
  };

  // Fetch company data if exists
  const fetchCompany = async () => {
    if (!interview?.companyId) return null;
    try {
      const response = await axiosPrivate.get(`/user-companies/${interview.companyId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching company:", error);
      return null;
    }
  };

  const { data: application } = useQuery(
    ["application-for-interview", interview?.applicationId],
    fetchApplication,
    {
      enabled: !!interview?.applicationId && open,
    }
  );

  const { data: company } = useQuery(
    ["company-for-interview", interview?.companyId],
    fetchCompany,
    {
      enabled: !!interview?.companyId && open,
    }
  );

  // Helper functions
  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getInterviewStatus = (interview) => {
    const startDate = new Date(interview.startDate);
    const now = new Date();
    const diffMinutes = (now - startDate) / (1000 * 60);
    
    if (diffMinutes > (interview.duration || 60)) {
      return { label: "Completed", color: "bg-green-100 text-green-800" };
    } else if (diffMinutes > 0) {
      return { label: "In Progress", color: "bg-yellow-100 text-yellow-800" };
    } else {
      return { label: "Scheduled", color: "bg-blue-100 text-blue-800" };
    }
  };

  if (!interview) return null;

  const status = getInterviewStatus(interview);
  const companyName = company?.companyName || company?.name || 
                     application?.companyName || "Unknown Company";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <button
          onClick={() => setOpen(false)}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 z-10"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>
        
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <MessageSquare className="h-6 w-6" />
            <div>
              <div className="flex items-center gap-2">
                <span>Interview Details</span>
                <Badge variant="outline" className={status.color}>
                  {status.label}
                </Badge>
                {hasFeedback.hasAny && (
                  <Badge className="bg-primary-glow text-white">
                    <Sparkles className="h-3 w-3 mr-1" />
                    AI Feedback Available
                  </Badge>
                )}
              </div>
              <div className="text-sm text-muted-foreground font-normal">
                {companyName} • {interview.position}
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="questions">
              Questions
              {interview.interviewQuestions && ` (${interview.interviewQuestions.length})`}
            </TabsTrigger>
            <TabsTrigger value="feedback" className="relative">
              Feedback
              {hasFeedback.hasAny && (
                <span className="ml-1 inline-block h-2 w-2 rounded-full bg-primary-glow animate-pulse"></span>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6 mt-6">
            {/* Interview Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Interview Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Start Date</p>
                        <p className="font-medium">{formatDateTime(interview.startDate)}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Duration</p>
                        <p className="font-medium">{interview.duration} minutes</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Company</p>
                        <p className="font-medium">{companyName}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Position</p>
                        <p className="font-medium">{interview.position}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Job Description */}
            {(interview.jobDescription || application?.description) && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Job Description
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <p className="leading-relaxed whitespace-pre-line">
                      {interview.jobDescription || application?.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Company Information */}
            {(company || application) && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    Company Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium mb-2">{companyName}</h4>
                        {(company?.location || application?.location) && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="h-4 w-4" />
                            <span>{company?.location || application?.location}</span>
                          </div>
                        )}
                      </div>
                      
                      {application && (
                        <div className="space-y-2">
                          {application.jobType && (
                            <div>
                              <span className="text-sm text-muted-foreground">Job Type: </span>
                              <Badge variant="outline">{application.jobType}</Badge>
                            </div>
                          )}
                          {application.status && (
                            <div>
                              <span className="text-sm text-muted-foreground">Application Status: </span>
                              <Badge variant="outline">{application.status}</Badge>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Notes */}
            {interview.notes && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Interview Notes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <p className="leading-relaxed whitespace-pre-line">
                      {interview.notes}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Interview Metadata */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Interview Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Interview ID:</span>
                    <span className="ml-2 font-medium">{interview.interviewId}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Status:</span>
                    <Badge variant="outline" className={`ml-2 ${status.color}`}>
                      {status.label}
                    </Badge>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Start Date:</span>
                    <span className="ml-2 font-medium">{formatDateTime(interview.startDate)}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Duration:</span>
                    <span className="ml-2 font-medium">{interview.duration} minutes</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Questions Tab */}
          <TabsContent value="questions" className="space-y-6 mt-6">
            {interview.interviewQuestions && interview.interviewQuestions.length > 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Interview Questions ({interview.interviewQuestions.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {interview.interviewQuestions.map((q, index) => (
                      <div key={index} className="bg-muted/50 p-4 rounded-lg">
                        <div className="space-y-3">
                          <div>
                            <h4 className="font-medium text-sm text-muted-foreground mb-1">
                              Question {index + 1}
                            </h4>
                            <p className="font-medium">{q.question}</p>
                          </div>
                          
                          {q.answer && (
                            <div>
                              <h4 className="font-medium text-sm text-muted-foreground mb-1">
                                Answer
                              </h4>
                              <p className="text-sm leading-relaxed whitespace-pre-line">
                                {q.answer}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No questions available</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Feedback Tab */}
          <TabsContent value="feedback" className="space-y-6 mt-6">
            {isFeedbackLoading ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Loader2 className="h-12 w-12 text-primary mx-auto mb-4 animate-spin" />
                  <p className="text-muted-foreground">Loading feedback...</p>
                </CardContent>
              </Card>
            ) : !hasFeedback.hasAny ? (
              <Card>
                <CardContent className="py-12 text-center space-y-4">
                  <Sparkles className="h-12 w-12 text-muted-foreground mx-auto" />
                  <div>
                    <h3 className="font-semibold text-lg mb-2">No Feedback Generated Yet</h3>
                    <p className="text-muted-foreground mb-4">
                      AI feedback is generated automatically after completing your interview.
                    </p>
                    <p className="text-sm text-muted-foreground">
                      If you just finished this interview, the feedback should be ready in a few moments.
                    </p>
                  </div>
                  <Button onClick={refetchAll} variant="outline">
                    <Loader2 className="h-4 w-4 mr-2" />
                    Check for Feedback
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {/* Video Feedback */}
                {videoFeedback && videoFeedback.status === "success" && (
                  <VideoFeedbackCard videoFeedback={videoFeedback} />
                )}

                {/* Answer Feedback */}
                {answersFeedback && answersFeedback.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <MessageSquare className="h-5 w-5" />
                        Answer Feedback
                      </h3>
                      <Badge variant="outline">
                        {answersFeedback.length} {answersFeedback.length === 1 ? 'Question' : 'Questions'} Graded
                      </Badge>
                    </div>
                    <div className="space-y-4">
                      {answersFeedback.map((feedback, index) => (
                        <AnswerFeedbackCard
                          key={feedback.interviewQuestionId || index}
                          feedback={feedback}
                          index={index}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* If only one type of feedback is available */}
                {hasFeedback.hasVideo && !hasFeedback.hasAnswers && (
                  <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200">
                    <CardContent className="py-6 text-center">
                      <AlertCircle className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                      <p className="text-sm text-blue-800 dark:text-blue-200">
                        Answer feedback is still being generated. Check back in a moment.
                      </p>
                    </CardContent>
                  </Card>
                )}
                {hasFeedback.hasAnswers && !hasFeedback.hasVideo && (
                  <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200">
                    <CardContent className="py-6 text-center">
                      <AlertCircle className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                      <p className="text-sm text-blue-800 dark:text-blue-200">
                        Video feedback is still being analyzed. Check back in a moment.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}