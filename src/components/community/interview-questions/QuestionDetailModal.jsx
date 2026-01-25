import { useState, useEffect } from "react";
import { useAxiosPrivate } from "../../../utils/axios";
import { toast } from "react-toastify";
import { Dialog } from "../../ui/Dialog";
import Button from "../../ui/Button";
import { Badge } from "../../ui/Badge";
import { X, Building2, Users, MessageSquare, Calendar, CheckCircle2, Trash2 } from "lucide-react";
import AnswerForm from "./AnswerForm";
import AnswerCard from "./AnswerCard";
import DeleteQuestionModal from "./DeleteQuestionModal";
import {
  resolveRoleTypeLabel,
  resolveQuestionTypeLabel,
  resolveDifficultyMetadata,
  getDifficultyColorClasses,
} from "../../../utils/interviewQuestionMetadata";
import { getLogoUrl } from "../../../utils/logoUtils";

const QuestionDetailModal = ({ isOpen, onClose, question, onUpdate }) => {
  const axiosPrivate = useAxiosPrivate();
  const currentUserId = parseInt(localStorage.getItem("userId"));
  const [questionDetail, setQuestionDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAnswerForm, setShowAnswerForm] = useState(false);
  const [isMarking, setIsMarking] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [hasUserMarkedAsked, setHasUserMarkedAsked] = useState(false);

  useEffect(() => {
    if (isOpen && question) {
      fetchQuestionDetail();
    }
  }, [isOpen, question]);

  const fetchQuestionDetail = async () => {
    try {
      setLoading(true);
      const response = await axiosPrivate.get(`/community/interview-questions/${question.questionId}`);
      setQuestionDetail(response.data);
    } catch (error) {
      console.error("Error fetching question details:", error);
      toast.error("Failed to load question details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (questionDetail) {
      setHasUserMarkedAsked(Boolean(questionDetail.currentUserAskedThis));
    } else {
      setHasUserMarkedAsked(false);
    }
  }, [questionDetail]);

  const handleAnswerSubmitted = () => {
    setShowAnswerForm(false);
    fetchQuestionDetail();
    onUpdate();
  };

  const handleToggleMarkAsked = async () => {
    if (!questionDetail) return;

    setIsMarking(true);
    const endpoint = `/community/interview-questions/${questionDetail.questionId}/mark-asked`;

    try {
      if (hasUserMarkedAsked) {
        await axiosPrivate.delete(endpoint);
        toast.success("Removed from your asked list");
        setHasUserMarkedAsked(false);
      } else {
        await axiosPrivate.post(endpoint);
        toast.success("Marked as asked!");
        setHasUserMarkedAsked(true);
      }

      // Refresh question detail to get updated state
      await fetchQuestionDetail();
      // Update the parent component to refresh the question list
      onUpdate();
    } catch (error) {
      if (!hasUserMarkedAsked && error.response?.status === 400) {
        toast.info("You've already marked this question");
        setHasUserMarkedAsked(true);
      } else {
        console.error("Error updating asked status:", error);
        toast.error("Failed to update asked status");
        // Revert optimistic update on error
        setHasUserMarkedAsked(!hasUserMarkedAsked);
      }
    } finally {
      setIsMarking(false);
    }
  };

  const handleQuestionDeleted = () => {
    onUpdate();
    onClose();
  };

  const isOwner = questionDetail && currentUserId === questionDetail.userId;

  const roleTypeLabel = resolveRoleTypeLabel(questionDetail, question);
  const questionTypeLabel = resolveQuestionTypeLabel(questionDetail, question);
  const { value: resolvedDifficultyValue, label: resolvedDifficultyLabel } = resolveDifficultyMetadata(
    questionDetail,
    question
  );

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  if (!questionDetail && loading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full p-12">
            <div className="flex justify-center items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          </div>
        </div>
      </Dialog>
    );
  }

  if (!questionDetail) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b bg-gray-50">
            <h2 className="text-2xl font-bold text-gray-900">Interview Question</h2>
            <div className="flex items-center gap-2">
              {isOwner && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsDeleteModalOpen(true)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              )}
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)] space-y-6">
            {/* Question Details */}
            <div className="space-y-4">
              {/* Company */}
              {questionDetail.companyName && (
                <div className="flex items-center gap-2">
                  {(() => {
                    const logoUrl = getLogoUrl(questionDetail.companyLogo, questionDetail.companyName);
                    return logoUrl ? (
                      <img
                        src={logoUrl}
                        alt={questionDetail.companyName}
                        className="w-8 h-8 rounded object-contain"
                      />
                    ) : (
                      <Building2 className="h-6 w-6 text-gray-400" />
                    );
                  })()}
                  <span className="text-lg font-semibold text-gray-900">{questionDetail.companyName}</span>
                </div>
              )}

              {/* Badges */}
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">
                  {roleTypeLabel}
                </Badge>
                <Badge variant="outline">
                  {questionTypeLabel}
                </Badge>
                <Badge className={getDifficultyColorClasses(resolvedDifficultyValue)}>
                  {resolvedDifficultyLabel}
                </Badge>
              </div>

              {/* Question Text */}
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-900 text-lg leading-relaxed whitespace-pre-wrap">
                  {questionDetail.questionText}
                </p>
              </div>

              {/* Stats and Actions */}
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center gap-6 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    <span>Asked by {questionDetail.askedCount} {questionDetail.askedCount === 1 ? 'person' : 'people'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    <span>{questionDetail.answerCount} {questionDetail.answerCount === 1 ? 'answer' : 'answers'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    <span>{formatDate(questionDetail.createdAt)}</span>
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleToggleMarkAsked}
                  disabled={isMarking}
                  className={`flex items-center gap-2 transition-colors ${
                    hasUserMarkedAsked
                      ? "bg-purple-600 text-white hover:bg-purple-700 border-purple-600"
                      : "border-gray-300 hover:border-purple-200"
                  }`}
                >
                  <CheckCircle2 className={`h-4 w-4 ${hasUserMarkedAsked ? "text-white" : ""}`} />
                  {isMarking ? "Updating..." : "I was asked this too"}
                </Button>
              </div>

              {/* Posted by */}
              <div className="flex items-center gap-2 text-sm text-gray-600">
                {questionDetail.userProfilePictureUrl ? (
                  <img
                    src={questionDetail.userProfilePictureUrl}
                    alt={questionDetail.userName}
                    className="w-6 h-6 rounded-full"
                  />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center">
                    <span className="text-xs font-medium text-gray-600">
                      {questionDetail.userName?.charAt(0)?.toUpperCase()}
                    </span>
                  </div>
                )}
                <span>Posted by <strong>{questionDetail.userName}</strong></span>
              </div>
            </div>

            {/* Answers Section */}
            <div className="border-t pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">
                  Answers ({questionDetail.answerCount})
                </h3>
                {!showAnswerForm && (
                  <Button onClick={() => setShowAnswerForm(true)} size="sm">
                    Add Answer
                  </Button>
                )}
              </div>

              {/* Answer Form */}
              {showAnswerForm && (
                <div className="mb-6">
                  <AnswerForm
                    questionId={questionDetail.questionId}
                    onAnswerSubmitted={handleAnswerSubmitted}
                    onCancel={() => setShowAnswerForm(false)}
                  />
                </div>
              )}

              {/* Answers List */}
              <div className="space-y-4">
                {questionDetail.answers && questionDetail.answers.length > 0 ? (
                  questionDetail.answers.map(answer => (
                    <AnswerCard
                      key={answer.answerId}
                      answer={answer}
                      onUpdate={() => {
                        fetchQuestionDetail();
                        onUpdate();
                      }}
                    />
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <MessageSquare className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                    <p>No answers yet. Be the first to answer!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Modal */}
      {questionDetail && (
        <DeleteQuestionModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          question={questionDetail}
          onQuestionDeleted={handleQuestionDeleted}
        />
      )}
    </Dialog>
  );
};

export default QuestionDetailModal;

