import { useState, useEffect } from "react";
import { useAxiosPrivate } from "../../../utils/axios";
import { toast } from "react-toastify";
import { Badge } from "../../ui/Badge";
import { Building2, Users, MessageSquare, CheckCircle2, Calendar, MoreVertical, Trash2 } from "lucide-react";
import Button from "../../ui/Button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from "../../ui/dropdown-menu";
import DeleteQuestionModal from "./DeleteQuestionModal";
import {
  resolveRoleTypeLabel,
  resolveQuestionTypeLabel,
  resolveDifficultyMetadata,
  getDifficultyColorClasses,
} from "../../../utils/interviewQuestionMetadata";
import { getLogoUrl } from "../../../utils/logoUtils";

const QuestionCard = ({ question, onClick, onUpdate }) => {
  const axiosPrivate = useAxiosPrivate();
  const currentUserId = parseInt(localStorage.getItem("userId"));
  const [isMarking, setIsMarking] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [hasUserMarkedAsked, setHasUserMarkedAsked] = useState(Boolean(question.currentUserAskedThis));
  const [localAskedCount, setLocalAskedCount] = useState(question.askedCount ?? 0);

  useEffect(() => {
    // Only update from question prop if currentUserAskedThis is explicitly provided
    // This prevents resetting state when the list endpoint doesn't include this field
    if (question.currentUserAskedThis !== undefined) {
      setHasUserMarkedAsked(Boolean(question.currentUserAskedThis));
    }
    // Always update the asked count from the question prop
    if (question.askedCount !== undefined) {
      setLocalAskedCount(question.askedCount);
    }
  }, [question.questionId, question.currentUserAskedThis, question.askedCount]);

  const isOwner = currentUserId === question.userId;

  const roleTypeLabel = resolveRoleTypeLabel(question);
  const questionTypeLabel = resolveQuestionTypeLabel(question);
  const { value: resolvedDifficultyValue, label: resolvedDifficultyLabel } = resolveDifficultyMetadata(question);

  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const truncateText = (text, maxLength = 200) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  const handleToggleMarkAsked = async (e) => {
    e.stopPropagation();

    setIsMarking(true);
    const endpoint = `/community/interview-questions/${question.questionId}/mark-asked`;

    try {
      if (hasUserMarkedAsked) {
        await axiosPrivate.delete(endpoint);
        toast.success("Removed from your asked list");
        setHasUserMarkedAsked(false);
        setLocalAskedCount(prev => Math.max(0, prev - 1));
      } else {
        await axiosPrivate.post(endpoint);
        toast.success("Marked as asked!");
        setHasUserMarkedAsked(true);
        setLocalAskedCount(prev => prev + 1);
      }

      // Call onUpdate to refresh the question list
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
        setLocalAskedCount(prev => hasUserMarkedAsked ? prev + 1 : Math.max(0, prev - 1));
      }
    } finally {
      setIsMarking(false);
    }
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    setIsDeleteModalOpen(true);
  };

  const handleQuestionDeleted = () => {
    onUpdate();
  };

  return (
    <div
      onClick={() => onClick(question)}
      className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer border border-gray-200"
    >
      <div className="space-y-4">
        {/* Header with Company, Date and Difficulty Badge */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            {question.companyName && (
              <div className="flex items-center gap-2 mb-2">
                {(() => {
                  const logoUrl = getLogoUrl(question.companyLogo, question.companyName);
                  return logoUrl ? (
                    <img
                      src={logoUrl}
                      alt={question.companyName}
                      className="w-6 h-6 rounded object-contain"
                    />
                  ) : (
                    <Building2 className="h-5 w-5 text-gray-400" />
                  );
                })()}
                <span className="font-semibold text-gray-900">{question.companyName}</span>
              </div>
            )}
          </div>
          
          <div className="flex items-start gap-2">
            {question.createdAt && (
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Calendar className="h-3.5 w-3.5" />
                <span>{formatDate(question.createdAt)}</span>
              </div>
            )}

            {isOwner && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={(e) => e.stopPropagation()}
                    className="h-8 w-8 p-0"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleDelete} className="text-red-600">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Question
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>

        {/* Metadata Badges - Role Type, Question Type, Difficulty */}
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="text-xs">
            {roleTypeLabel}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {questionTypeLabel}
          </Badge>
          <Badge className={getDifficultyColorClasses(resolvedDifficultyValue)}>
            {resolvedDifficultyLabel}
          </Badge>
        </div>

        {/* Question Text */}
        <div>
          <p className="text-gray-900 text-base leading-relaxed">
            {truncateText(question.questionText)}
          </p>
          {question.questionText.length > 200 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClick(question);
              }}
              className="text-primary hover:underline text-sm mt-1"
            >
              Read more
            </button>
          )}
        </div>

        {/* Footer Stats and Actions */}
        <div className="flex items-center flex-wrap gap-4 pt-4 border-t border-gray-100">
          <Button
            variant="outline"
            size="sm"
            onClick={handleToggleMarkAsked}
            disabled={isMarking}
            className={`flex items-center gap-1.5 text-xs h-8 transition-colors ${
              hasUserMarkedAsked
                ? "bg-purple-600 text-white hover:bg-purple-700 border-purple-600"
                : "border-gray-300 hover:border-purple-200"
            }`}
          >
            <CheckCircle2 className={`h-3.5 w-3.5 ${hasUserMarkedAsked ? "text-white" : ""}`} />
            {isMarking ? "Updating..." : "I was asked this too"}
          </Button>
          
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <Users className="h-4 w-4" />
            <span>Asked by {localAskedCount} {localAskedCount === 1 ? 'person' : 'people'}</span>
          </div>

          <div className="flex items-center gap-1 text-sm text-gray-600">
            <MessageSquare className="h-4 w-4" />
            <span>{question.answerCount} {question.answerCount === 1 ? 'answer' : 'answers'}</span>
          </div>
        </div>
      </div>

      {/* Delete Modal */}
      <DeleteQuestionModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        question={question}
        onQuestionDeleted={handleQuestionDeleted}
      />
    </div>
  );
};

export default QuestionCard;

