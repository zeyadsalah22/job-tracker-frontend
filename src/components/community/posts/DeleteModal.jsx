import { useState } from "react";
import { useAxiosPrivate } from "../../../utils/axios";
import { toast } from "react-toastify";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../ui/Dialog";
import Button from "../../ui/Button";
import { AlertCircle } from "lucide-react";

const DeletePostModal = ({ isOpen, onClose, post, onPostDeleted }) => {
  const axiosPrivate = useAxiosPrivate();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      await axiosPrivate.delete(`/posts/${post.postId}`);
      toast.success("Post deleted successfully");
      onPostDeleted();
      onClose();
    } catch (error) {
      console.error("Error deleting post:", error);
      const errorMessage = error.response?.data?.message || "Failed to delete post";
      toast.error(errorMessage);
    } finally {
      setIsDeleting(false);
    }
  };

  if (!post) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertCircle className="h-5 w-5" />
            Delete Post
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-gray-700">
            Are you sure you want to delete this post? This action cannot be undone.
          </p>

          {post.title && (
            <div className="bg-gray-50 p-3 rounded-md">
              <p className="font-medium text-gray-900">{post.title}</p>
            </div>
          )}

          {post.commentCount > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
              <p className="text-sm text-yellow-800">
                <strong>Warning:</strong> This post has {post.commentCount} comment(s). 
                All comments will be hidden when you delete this post.
              </p>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t">
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
              variant="destructive" 
              onClick={handleDelete} 
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete Post"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeletePostModal;

