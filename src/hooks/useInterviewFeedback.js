import { useQuery, useMutation, useQueryClient } from "react-query";
import { useAxiosPrivate } from "../utils/axios";
import { toast } from "react-toastify";

/**
 * Custom hook to manage interview feedback operations
 * @param {number} interviewId - The interview ID
 * @returns {Object} - Feedback data and mutation functions
 */
export const useInterviewFeedback = (interviewId) => {
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();

  // Fetch all answer feedback for the interview
  const fetchAnswersFeedback = async () => {
    if (!interviewId) return null;
    
    try {
      const response = await axiosPrivate.get(`/interview/${interviewId}/feedback/answers`);
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        // No feedback generated yet - this is expected
        return [];
      }
      throw error;
    }
  };

  const {
    data: answersFeedback,
    isLoading: isLoadingAnswers,
    error: answersError,
    refetch: refetchAnswers
  } = useQuery(
    ["interview-answers-feedback", interviewId],
    fetchAnswersFeedback,
    {
      enabled: !!interviewId,
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: (failureCount, error) => {
        // Don't retry on 404 (feedback not found)
        if (error.response?.status === 404) return false;
        return failureCount < 2;
      }
    }
  );

  // Fetch video feedback for the interview
  const fetchVideoFeedback = async () => {
    if (!interviewId) return null;
    
    try {
      const response = await axiosPrivate.get(`/interview/${interviewId}/feedback/video`);
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        // No video feedback generated yet - this is expected
        return null;
      }
      throw error;
    }
  };

  const {
    data: videoFeedback,
    isLoading: isLoadingVideo,
    error: videoError,
    refetch: refetchVideo
  } = useQuery(
    ["interview-video-feedback", interviewId],
    fetchVideoFeedback,
    {
      enabled: !!interviewId,
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: (failureCount, error) => {
        // Don't retry on 404 (feedback not found)
        if (error.response?.status === 404) return false;
        return failureCount < 2;
      }
    }
  );

  // Mutation to analyze video and generate feedback
  const analyzeVideoMutation = useMutation(
    async (videoFile) => {
      if (!interviewId) throw new Error("Interview ID is required");
      if (!videoFile) throw new Error("Video file is required");

      const formData = new FormData();
      formData.append("file", videoFile);

      const response = await axiosPrivate.post(
        `/interview/${interviewId}/feedback/analyze-video`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          timeout: 120000, // 2 minutes timeout for video upload/analysis
        }
      );

      return response.data;
    },
    {
      onSuccess: (data) => {
        // Invalidate and refetch video feedback
        queryClient.invalidateQueries(["interview-video-feedback", interviewId]);
        toast.success("Video analysis completed successfully!");
      },
      onError: (error) => {
        console.error("Video analysis error:", error);
        
        let errorMessage = "Failed to analyze video. Please try again.";
        
        if (error.response?.status === 504) {
          errorMessage = "Video analysis timed out. The service is taking too long. Please try again later.";
        } else if (error.response?.status === 502) {
          errorMessage = "AI service temporarily unavailable. Please try again later.";
        } else if (error.response?.status === 400) {
          errorMessage = error.response?.data?.message || "Invalid video file. Please check the format and size.";
        } else if (error.message?.includes("timeout")) {
          errorMessage = "Request timed out. Please check your connection and try again.";
        }
        
        toast.error(errorMessage);
      }
    }
  );

  // Mutation to grade all questions in batch
  const gradeQuestionsBatchMutation = useMutation(
    async ({ questionIds, context }) => {
      if (!interviewId) throw new Error("Interview ID is required");
      if (!questionIds || questionIds.length === 0) {
        throw new Error("Question IDs are required");
      }

      const response = await axiosPrivate.post(
        `/interview/${interviewId}/feedback/grade-questions-batch`,
        {
          interviewQuestionIds: questionIds,
          context: context || ""
        },
        {
          timeout: 60000, // 1 minute timeout for batch grading
        }
      );

      return response.data;
    },
    {
      onSuccess: (data) => {
        // Invalidate and refetch answers feedback
        queryClient.invalidateQueries(["interview-answers-feedback", interviewId]);
        toast.success(`Successfully graded ${data.length} questions!`);
      },
      onError: (error) => {
        console.error("Batch grading error:", error);
        
        let errorMessage = "Failed to grade questions. Please try again.";
        
        if (error.response?.status === 504) {
          errorMessage = "Grading timed out. The service is taking too long. Please try again later.";
        } else if (error.response?.status === 502) {
          errorMessage = "AI service temporarily unavailable. Please try again later.";
        } else if (error.response?.status === 400) {
          errorMessage = error.response?.data?.message || "Invalid request. Please ensure all questions have answers.";
        } else if (error.message?.includes("timeout")) {
          errorMessage = "Request timed out. Please check your connection and try again.";
        }
        
        toast.error(errorMessage);
      }
    }
  );

  // Mutation to grade a single question
  const gradeQuestionMutation = useMutation(
    async ({ questionId, context }) => {
      if (!interviewId) throw new Error("Interview ID is required");
      if (!questionId) throw new Error("Question ID is required");

      const response = await axiosPrivate.post(
        `/interview/${interviewId}/feedback/grade-question`,
        {
          interviewQuestionId: questionId,
          context: context || ""
        }
      );

      return response.data;
    },
    {
      onSuccess: (data) => {
        // Invalidate and refetch answers feedback
        queryClient.invalidateQueries(["interview-answers-feedback", interviewId]);
        toast.success("Question graded successfully!");
      },
      onError: (error) => {
        console.error("Question grading error:", error);
        toast.error("Failed to grade question. Please try again.");
      }
    }
  );

  // Helper function to check if feedback exists
  const hasFeedback = () => {
    const hasAnswers = answersFeedback && Array.isArray(answersFeedback) && answersFeedback.length > 0;
    const hasVideo = videoFeedback && videoFeedback.status === "success";
    return { hasAnswers, hasVideo, hasAny: hasAnswers || hasVideo };
  };

  // Helper function to generate all feedback (both video and answers)
  const generateAllFeedback = async (videoFile, questionIds, context) => {
    const results = {
      video: null,
      answers: null,
      errors: []
    };

    // Analyze video first
    if (videoFile) {
      try {
        results.video = await analyzeVideoMutation.mutateAsync(videoFile);
      } catch (error) {
        results.errors.push({ type: 'video', error });
      }
    }

    // Grade questions
    if (questionIds && questionIds.length > 0) {
      try {
        results.answers = await gradeQuestionsBatchMutation.mutateAsync({ questionIds, context });
      } catch (error) {
        results.errors.push({ type: 'answers', error });
      }
    }

    return results;
  };

  return {
    // Data
    answersFeedback,
    videoFeedback,
    
    // Loading states
    isLoadingAnswers,
    isLoadingVideo,
    isLoading: isLoadingAnswers || isLoadingVideo,
    
    // Error states
    answersError,
    videoError,
    
    // Refetch functions
    refetchAnswers,
    refetchVideo,
    refetchAll: () => {
      refetchAnswers();
      refetchVideo();
    },
    
    // Mutations
    analyzeVideo: analyzeVideoMutation.mutateAsync,
    gradeQuestionsBatch: gradeQuestionsBatchMutation.mutateAsync,
    gradeQuestion: gradeQuestionMutation.mutateAsync,
    generateAllFeedback,
    
    // Mutation states
    isAnalyzingVideo: analyzeVideoMutation.isLoading,
    isGradingQuestions: gradeQuestionsBatchMutation.isLoading,
    isGenerating: analyzeVideoMutation.isLoading || gradeQuestionsBatchMutation.isLoading,
    
    // Helpers
    hasFeedback: hasFeedback()
  };
};

