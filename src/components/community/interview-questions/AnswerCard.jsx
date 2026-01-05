import { useState } from "react";
import { useAxiosPrivate } from "../../../utils/axios";
import { toast } from "react-toastify";
import { Badge } from "../../ui/Badge";
import { ThumbsUp, Award, Calendar } from "lucide-react";
import Button from "../../ui/Button";

const AnswerCard = ({ answer, onUpdate }) => {
  const axiosPrivate = useAxiosPrivate();
  const [isTogglingHelpful, setIsTogglingHelpful] = useState(false);

  const handleToggleHelpful = async () => {
    setIsTogglingHelpful(true);
    try {
      if (answer.currentUserMarkedHelpful) {
        // Remove helpful vote
        await axiosPrivate.delete(`/community/interview-questions/answers/${answer.answerId}/helpful`);
        toast.success("Helpful vote removed");
      } else {
        // Add helpful vote
        await axiosPrivate.post(`/community/interview-questions/answers/${answer.answerId}/helpful`);
        toast.success("Marked as helpful!");
      }
      onUpdate();
    } catch (error) {
      console.error("Error toggling helpful:", error);
      if (error.response?.status === 400) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to update helpful status");
      }
    } finally {
      setIsTogglingHelpful(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5 space-y-4">
      {/* Header with User Info */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          {answer.userProfilePictureUrl ? (
            <img
              src={answer.userProfilePictureUrl}
              alt={answer.userName}
              className="w-10 h-10 rounded-full"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-sm font-semibold text-primary">
                {answer.userName?.charAt(0)?.toUpperCase()}
              </span>
            </div>
          )}
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-900">{answer.userName}</span>
              {answer.gotOffer && (
                <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
                  <Award className="h-3 w-3" />
                  Got Offer
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Calendar className="h-3 w-3" />
              <span>{formatDate(answer.createdAt)}</span>
            </div>
          </div>
        </div>

        {/* Helpful Count */}
        <div className="flex items-center gap-1 text-sm text-gray-600">
          <ThumbsUp className="h-4 w-4" />
          <span className="font-medium">{answer.helpfulCount}</span>
        </div>
      </div>

      {/* Answer Text */}
      <div className="prose prose-sm max-w-none">
        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
          {answer.answerText}
        </p>
      </div>

      {/* Footer with Actions */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <div className="text-xs text-gray-500">
          {answer.currentUserMarkedHelpful && (
            <span className="text-primary font-medium">You found this helpful</span>
          )}
        </div>
        
        <Button
          variant={answer.currentUserMarkedHelpful ? "default" : "outline"}
          size="sm"
          onClick={handleToggleHelpful}
          disabled={isTogglingHelpful}
          className={`flex items-center gap-1.5 ${
            answer.currentUserMarkedHelpful ? "bg-primary text-white" : ""
          }`}
        >
          <ThumbsUp className={`h-4 w-4 ${answer.currentUserMarkedHelpful ? "fill-current" : ""}`} />
          {isTogglingHelpful ? "..." : answer.currentUserMarkedHelpful ? "Helpful" : "Mark as Helpful"}
        </Button>
      </div>
    </div>
  );
};

export default AnswerCard;




