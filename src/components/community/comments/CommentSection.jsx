import { useState, useEffect } from "react";
import { useAxiosPrivate } from "../../../utils/axios";
import { toast } from "react-toastify";
import Button from "../../ui/Button";
import Textarea from "../../ui/Textarea";
import { MessageSquare } from "lucide-react";
import Comment from "./Comment";

const CommentSection = ({ postId }) => {
  const axiosPrivate = useAxiosPrivate();

  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 10,
    totalCount: 0,
    totalPages: 0,
    hasNext: false,
    hasPrevious: false,
  });

  useEffect(() => {
    fetchComments();
  }, [postId, pagination.currentPage]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const response = await axiosPrivate.get(
        `/comments/post/${postId}?pageNumber=${pagination.currentPage}&pageSize=${pagination.pageSize}&level=0&sortBy=CreatedAt&sortOrder=DESC`
      );

      setComments(response.data.items || response.data);

      // Extract pagination from headers
      if (response.headers["x-pagination-totalcount"]) {
        setPagination((prev) => ({
          ...prev,
          totalCount: parseInt(response.headers["x-pagination-totalcount"]),
          totalPages: parseInt(response.headers["x-pagination-totalpages"]),
          hasNext: response.headers["x-pagination-hasnext"] === "true",
          hasPrevious: response.headers["x-pagination-hasprevious"] === "true",
        }));
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
      toast.error("Failed to load comments");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();

    if (!newComment.trim()) {
      toast.warning("Comment cannot be empty");
      return;
    }

    if (newComment.length > 2000) {
      toast.warning("Comment must be less than 2000 characters");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axiosPrivate.post("/comments", {
        postId: postId,
        parentCommentId: null,
        content: newComment,
        mentionedUserIds: [],
      });

      toast.success("Comment posted successfully");
      setNewComment("");
      
      // Refresh comments or add new comment to the list
      setPagination((prev) => ({ ...prev, currentPage: 1 }));
      fetchComments();
    } catch (error) {
      console.error("Error posting comment:", error);
      const errorMessage = error.response?.data?.message || "Failed to post comment";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLoadMore = () => {
    if (pagination.hasNext) {
      setPagination((prev) => ({ ...prev, currentPage: prev.currentPage + 1 }));
    }
  };

  const handleCommentUpdate = () => {
    fetchComments();
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <MessageSquare className="h-5 w-5" />
        Comments ({pagination.totalCount})
      </h2>

      {/* Add Comment Form */}
      <form onSubmit={handleSubmitComment} className="mb-6">
        <Textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
          className="w-full min-h-[100px] mb-2"
          maxLength={2000}
        />
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-500">{newComment.length}/2000</span>
          <Button type="submit" disabled={isSubmitting || !newComment.trim()}>
            {isSubmitting ? "Posting..." : "Post Comment"}
          </Button>
        </div>
      </form>

      {/* Comments List */}
      {loading && comments.length === 0 ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <MessageSquare className="h-12 w-12 mx-auto mb-2 text-gray-300" />
          <p>No comments yet. Be the first to comment!</p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {comments.map((comment) => (
              <Comment
                key={comment.commentId}
                comment={comment}
                postId={postId}
                onUpdate={handleCommentUpdate}
              />
            ))}
          </div>

          {/* Load More Button */}
          {pagination.hasNext && (
            <div className="mt-6 text-center">
              <Button variant="outline" onClick={handleLoadMore} disabled={loading}>
                {loading ? "Loading..." : `Load more comments (${pagination.totalCount - comments.length} remaining)`}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CommentSection;

