import { useState } from "react";
import { useAxiosPrivate } from "../../../utils/axios";
import { toast } from "react-toastify";
import { Dialog } from "../../ui/Dialog";
import Button from "../../ui/Button";
import { AlertCircle } from "lucide-react";

const DeleteQuestionModal = ({ isOpen, onClose, question, onQuestionDeleted }) => {
  const axiosPrivate = useAxiosPrivate();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      await axiosPrivate.delete(`/community/interview-questions/${question.questionId}`);
      toast.success("Question deleted successfully");
      onQuestionDeleted();
      onClose();
    } catch (error) {
      console.error("Error deleting question:", error);
      const errorMessage = error.response?.data?.message || "Failed to delete question";
      toast.error(errorMessage);
    } finally {
      setIsDeleting(false);
    }
  };

  if (!question) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
          {/* Header */}
          <div className="flex items-center gap-2 p-6 border-b">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <h2 className="text-xl font-bold text-red-600">Delete Question</h2>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            <p className="text-gray-700">
              Are you sure you want to delete this question? This action cannot be undone.
            </p>

            <div className="bg-gray-50 p-3 rounded-md">
              <p className="text-gray-900 line-clamp-3">
                {question.questionText}
              </p>
            </div>

            {question.answerCount > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
                <p className="text-sm text-yellow-800">
                  <strong>Warning:</strong> This question has {question.answerCount} answer(s). 
                  All answers will be permanently deleted.
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 px-6 py-4 border-t bg-gray-50">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose} 
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button 
              type="button" 
              onClick={handleDelete} 
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isDeleting ? "Deleting..." : "Delete Question"}
            </Button>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default DeleteQuestionModal;




