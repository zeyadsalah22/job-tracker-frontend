import { useState } from "react";
import { useAxiosPrivate } from "../../../utils/axios";
import { toast } from "react-toastify";
import Button from "../../ui/Button";
import Textarea from "../../ui/Textarea";
import Label from "../../ui/Label";
import { Send } from "lucide-react";

const AnswerForm = ({ questionId, onAnswerSubmitted, onCancel }) => {
  const axiosPrivate = useAxiosPrivate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    answerText: "",
    gotOffer: false,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.answerText.trim()) {
      toast.error("Please enter your answer");
      return;
    }

    if (formData.answerText.length > 5000) {
      toast.error("Answer text cannot exceed 5000 characters");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        answerText: formData.answerText.trim(),
        gotOffer: formData.gotOffer,
      };

      await axiosPrivate.post(`/community/interview-questions/${questionId}/answers`, payload);
      toast.success("Answer submitted successfully! +5 reputation points");
      onAnswerSubmitted();
      setFormData({ answerText: "", gotOffer: false });
    } catch (error) {
      console.error("Error creating answer:", error);
      toast.error(error.response?.data?.message || "Failed to submit answer");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Answer Text */}
        <div>
          <Label htmlFor="answerText">Your Answer</Label>
          <Textarea
            id="answerText"
            value={formData.answerText}
            onChange={(e) => setFormData({ ...formData, answerText: e.target.value })}
            placeholder="Share your experience and insights about this interview question..."
            rows={6}
            maxLength={5000}
            required
            className="w-full"
          />
          <div className="text-sm text-gray-500 text-right mt-1">
            {formData.answerText.length} / 5000
          </div>
        </div>

        {/* Got Offer Checkbox */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="gotOffer"
            checked={formData.gotOffer}
            onChange={(e) => setFormData({ ...formData, gotOffer: e.target.checked })}
            className="w-4 h-4 text-primary rounded focus:ring-primary"
          />
          <Label htmlFor="gotOffer" className="cursor-pointer mb-0">
            I received an offer after this interview
          </Label>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel} size="sm">
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={loading}
            size="sm"
            className="flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Submitting...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Submit Answer
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AnswerForm;

