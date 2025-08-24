import React from "react";
import { useQuery } from "react-query";
import { useAxiosPrivate } from "../../utils/axios";
import {
  FileText,
  ClipboardList,
  AlertTriangle,
  Award,
  Calendar,
  Target,
  X
} from "lucide-react";
import { Badge } from "../ui/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/Dialog";
import Button from "../ui/Button";

export default function ViewModal({ test, open, setOpen }) {
  const axiosPrivate = useAxiosPrivate();

  // Fetch detailed test data
  const fetchTestDetails = async () => {
    if (!test?.testId) return null;
    try {
      const response = await axiosPrivate.get(`/resumetest/${test.testId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching test details:", error);
      return null;
    }
  };

  const { data: testDetails, isLoading } = useQuery(
    ["resumeTest-detail", test?.testId],
    fetchTestDetails,
    {
      enabled: !!test?.testId && open,
    }
  );

  // Fetch CV data for resume link
  const fetchCv = async () => {
    if (!testDetails?.resumeId) return null;
    try {
      const response = await axiosPrivate.get('/cvs');
      const cvs = response.data || [];
      return cvs.find(cv => cv.resumeId === testDetails.resumeId);
    } catch (error) {
      console.error("Error fetching CV:", error);
      return null;
    }
  };

  const { data: cvData } = useQuery(
    ["cv-for-test", testDetails?.resumeId],
    fetchCv,
    {
      enabled: !!testDetails?.resumeId && open,
    }
  );

  // Helper functions
  const getScoreColor = (score) => {
    if (score >= 85) return "text-green-600";
    if (score >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBgColor = (score) => {
    if (score >= 85) return "bg-green-100";
    if (score >= 70) return "bg-yellow-100";
    return "bg-red-100";
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Create resume link if CV data is available
  let resumeLink = null;
  if (cvData && cvData.resumeFile) {
    try {
      const binaryString = atob(cvData.resumeFile);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const blob = new Blob([bytes], { type: 'application/pdf' });
      resumeLink = URL.createObjectURL(blob);
    } catch (error) {
      console.error("Error creating resume blob URL:", error);
    }
  }

  if (!test) return null;

  const displayData = testDetails || test;

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
            <Target className="h-6 w-6" />
            <div>
              <div className="flex items-center gap-2">
                <span>Resume Test Results</span>
                <Badge variant="outline" className="bg-green-100 text-green-800">
                  Complete
                </Badge>
              </div>
              <div className="text-sm text-muted-foreground font-normal">
                Resume {displayData.resumeId} • {formatDate(displayData.testDate)}
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2">Loading test details...</span>
          </div>
        ) : (
          <div className="space-y-6">
            {/* ATS Score Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  ATS Score Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-3xl font-bold flex items-center gap-2">
                      <span className={getScoreColor(displayData.atsScore)}>
                        {displayData.atsScore}%
                      </span>
                    </div>
                    <p className="text-muted-foreground">
                      {displayData.atsScore >= 85 ? "Excellent match!" : 
                       displayData.atsScore >= 70 ? "Good match with room for improvement" :
                       "Needs significant improvement"}
                    </p>
                  </div>
                  <div className={`w-20 h-20 rounded-full flex items-center justify-center ${getScoreBgColor(displayData.atsScore)}`}>
                    <span className={`text-xl font-bold ${getScoreColor(displayData.atsScore)}`}>
                      {displayData.atsScore}%
                    </span>
                  </div>
                </div>
                
                <div className="w-full bg-muted rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all duration-500 ${
                      displayData.atsScore >= 85 ? 'bg-green-500' :
                      displayData.atsScore >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${displayData.atsScore}%` }}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Resume Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Resume Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Resume {displayData.resumeId}</h4>
                      <p className="text-sm text-muted-foreground">
                        Tested on {formatDate(displayData.testDate)}
                      </p>
                    </div>
                    {resumeLink ? (
                      <Button variant="outline" asChild>
                        <a
                          href={resumeLink}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <FileText className="w-4 h-4 mr-2" />
                          View PDF
                        </a>
                      </Button>
                    ) : (
                      <Badge variant="outline">PDF not available</Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Job Description */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ClipboardList className="h-5 w-5" />
                  Job Description
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="leading-relaxed whitespace-pre-line max-h-48 overflow-y-auto">
                    {displayData.jobDescription}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Missing Skills */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Skills Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                {displayData.missingSkills && displayData.missingSkills.length > 0 ? (
                  <div className="space-y-4">
                    <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                      <h4 className="font-medium text-yellow-800 mb-2">Missing Skills</h4>
                      <p className="text-sm text-yellow-700 mb-3">
                        These skills were mentioned in the job description but not found in your resume:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {displayData.missingSkills.map((skill, index) => (
                          <Badge key={index} variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <h4 className="font-medium text-blue-800 mb-2">💡 Recommendations</h4>
                      <ul className="text-sm text-blue-700 space-y-1">
                        <li>• Consider adding the missing skills to your resume if you have experience with them</li>
                        <li>• Highlight relevant projects or experiences that demonstrate these skills</li>
                        <li>• Use keywords from the job description naturally throughout your resume</li>
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <div className="flex items-center gap-2 text-green-800">
                      <Award className="h-5 w-5" />
                      <h4 className="font-medium">Excellent Skills Match!</h4>
                    </div>
                    <p className="text-sm text-green-700 mt-2">
                      Great job! Your resume covers all the key skills mentioned in the job description.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Test Metadata */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Test Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Test ID:</span>
                    <span className="ml-2 font-medium">{displayData.testId}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Resume ID:</span>
                    <span className="ml-2 font-medium">{displayData.resumeId}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Test Date:</span>
                    <span className="ml-2 font-medium">{formatDate(displayData.testDate)}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Status:</span>
                    <Badge variant="outline" className="ml-2 bg-green-100 text-green-800">
                      Complete
                    </Badge>
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