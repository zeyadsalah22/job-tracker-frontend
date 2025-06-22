import { useQuery } from "react-query";
import { Link, useParams } from "react-router-dom";
import Layout from "../Layout";
import {
  ArrowLeft,
  FileText,
  ClipboardList,
  AlertTriangle,
} from "lucide-react";
import { useAxiosPrivate } from "../../utils/axios";

export default function ViewModal() {
  const { id } = useParams();
  const axiosPrivate = useAxiosPrivate();

  const fetchResumeTest = async () => {
    try {
      console.log("Fetching resume test with ID:", id);
      const response = await axiosPrivate.get(`/resumetest/${id}`);
      console.log("Resume test details response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching resume test details:", error);
      throw error;
    }
  };

  const fetchCv = async (resumeId) => {
    try {
      console.log("Fetching CV for resumeId:", resumeId);
      const response = await axiosPrivate.get('/cvs');
      console.log("CVs response:", response.data);
      const cvs = response.data || [];
      return cvs.find(cv => cv.resumeId === resumeId);
    } catch (error) {
      console.error("Error fetching CV:", error);
      return null;
    }
  };

  const { data: testDetails, isLoading, error } = useQuery(
    ["resumeTest", { id }],
    fetchResumeTest,
    {
      enabled: !!id,
    }
  );

  const { data: cvData } = useQuery(
    ["cv", { resumeId: testDetails?.resumeId }],
    () => fetchCv(testDetails?.resumeId),
    {
      enabled: !!testDetails?.resumeId,
    }
  );

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

  // Format the date
  const formattedDate = testDetails?.testDate ? 
    new Date(testDetails.testDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }) : '';

  // Format ATS Score with color
  const getScoreColor = (score) => {
    if (score >= 86) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <Layout>
      <div className="bg-white rounded-lg h-full flex flex-col p-4 justify-between">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 pb-4 border-b-2">
            <Link
              to={`/resume-matching`}
              className="py-2 px-4 hover:bg-[#f1f1f1] transition-all w-fit rounded-lg flex items-center gap-2"
            >
              <ArrowLeft size={19} />
            </Link>
            <h1 className="text-lg font-semibold">Resume Test Details</h1>
          </div>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <span className="ml-2">Loading test details...</span>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-red-600">
                Error loading test details. Please try again.
              </div>
            </div>
          ) : testDetails ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Resume Section */}
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="text-primary" size={20} />
                  <h2 className="text-xl font-semibold">Resume</h2>
                </div>
                <div className="space-y-4">
                  <p className="text-gray-600">
                    View the submitted resume for this test.
                  </p>
                  {resumeLink ? (
                    <a
                      href={resumeLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-primary hover:text-primary/80"
                    >
                      <FileText size={16} />
                      View Resume PDF (Resume {testDetails.resumeId})
                    </a>
                  ) : (
                    <p className="text-gray-500 italic">
                      Resume {testDetails.resumeId} (PDF not available)
                    </p>
                  )}
                </div>
              </div>

              {/* Job Description Section */}
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center gap-2 mb-4">
                  <ClipboardList className="text-primary" size={20} />
                  <h2 className="text-xl font-semibold">Job Description</h2>
                </div>
                <div className="space-y-4">
                  <div className="text-gray-600 whitespace-pre-line max-h-48 overflow-y-auto">
                    {testDetails.jobDescription}
                  </div>
                </div>
              </div>

              {/* ATS Score Section */}
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className={`text-sm font-semibold ${getScoreColor(testDetails.atsScore)}`}>
                      {testDetails.atsScore}%
                    </span>
                  </div>
                  <h2 className="text-xl font-semibold">Matching Score</h2>
                </div>
                <div className="space-y-4">
                  <p className="text-gray-600">
                    This score represents how well your resume matches the job description.
                  </p>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className={`h-2.5 rounded-full ${
                        testDetails.atsScore >= 86 ? 'bg-green-500' :
                        testDetails.atsScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${testDetails.atsScore}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Missing Skills Section */}
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center gap-2 mb-4">
                  <AlertTriangle className="text-yellow-500" size={20} />
                  <h2 className="text-xl font-semibold">Missing Skills</h2>
                </div>
                <div className="space-y-4">
                  {testDetails.missingSkills && testDetails.missingSkills.length > 0 ? (
                    <>
                      <p className="text-gray-600">
                        These are the skills mentioned in the job description that were not found in your resume:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {testDetails.missingSkills.map((skill, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </>
                  ) : (
                    <p className="text-green-600">
                      Great! No missing skills detected. Your resume covers all the key requirements mentioned in the job description.
                    </p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center py-8">
              <div className="text-gray-500">
                Test details not found.
              </div>
            </div>
          )}

          {testDetails && (
            <div className="mt-6 text-sm text-gray-500">
              Test conducted on: {formattedDate}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
} 