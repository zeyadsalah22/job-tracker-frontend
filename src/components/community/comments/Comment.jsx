import { useState } from "react";
import { useAxiosPrivate } from "../../../utils/axios";
import { toast } from "react-toastify";
import Avatar from "../../ui/Avatar";
import Button from "../../ui/Button";
import Textarea from "../../ui/Textarea";
import { ThumbsUp, ThumbsDown, Reply, Edit, Trash2, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";

const Comment = ({ comment, postId, onUpdate, isReply = false }) => {
  const axiosPrivate = useAxiosPrivate();
  const currentUserId = parseInt(localStorage.getItem("userId"));

  const [isEditing, setIsEditing] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [replyContent, setReplyContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reactions, setReactions] = useState({
    upvoteCount: comment.upvoteCount || 0,
    downvoteCount: comment.downvoteCount || 0,
    userReaction: comment.userReaction || null,
  });
  const [showReplies, setShowReplies] = useState(true);

  const isOwner = currentUserId === comment.userId;
  const canReply = comment.level === 0; // Only allow replies to top-level comments

  const handleReaction = async (reactionType) => {
    try {
      const response = await axiosPrivate.post("/CommentReactions", {
        commentId: comment.commentId,
        reactionType: reactionType === "UPVOTE" ? 0 : 1,
      });

      if (response.data.message?.includes("removed")) {
        // Reaction was removed
        setReactions((prev) => ({
          ...prev,
          [`${reactionType.toLowerCase()}Count`]: prev[`${reactionType.toLowerCase()}Count`] - 1,
          userReaction: null,
        }));
      } else {
        // Reaction was added or updated
        if (reactions.userReaction) {
          setReactions((prev) => ({
            ...prev,
            [`${reactions.userReaction.toLowerCase()}Count`]:
              prev[`${reactions.userReaction.toLowerCase()}Count`] - 1,
          }));
        }
        setReactions((prev) => ({
          ...prev,
          [`${reactionType.toLowerCase()}Count`]: prev[`${reactionType.toLowerCase()}Count`] + 1,
          userReaction: reactionType,
        }));
      }
    } catch (error) {
      console.error("Error reacting to comment:", error);
      toast.error("Failed to react to comment");
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditContent(comment.content);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditContent(comment.content);
  };

  const handleSaveEdit = async () => {
    if (!editContent.trim()) {
      toast.warning("Comment cannot be empty");
      return;
    }

    if (editContent.length > 2000) {
      toast.warning("Comment must be less than 2000 characters");
      return;
    }

    setIsSubmitting(true);

    try {
      await axiosPrivate.put(`/comments/${comment.commentId}`, {
        content: editContent,
        mentionedUserIds: [],
        rowversion: comment.rowversion,
      });

      toast.success("Comment updated successfully");
      setIsEditing(false);
      onUpdate();
    } catch (error) {
      console.error("Error updating comment:", error);
      const errorMessage = error.response?.data?.message || "Failed to update comment";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this comment?")) {
      return;
    }

    try {
      await axiosPrivate.delete(`/comments/${comment.commentId}`);
      toast.success("Comment deleted successfully");
      onUpdate();
    } catch (error) {
      console.error("Error deleting comment:", error);
      const errorMessage = error.response?.data?.message || "Failed to delete comment";
      toast.error(errorMessage);
    }
  };

  const handleReply = () => {
    setIsReplying(true);
  };

  const handleCancelReply = () => {
    setIsReplying(false);
    setReplyContent("");
  };

  const handleSubmitReply = async () => {
    if (!replyContent.trim()) {
      toast.warning("Reply cannot be empty");
      return;
    }

    if (replyContent.length > 2000) {
      toast.warning("Reply must be less than 2000 characters");
      return;
    }

    setIsSubmitting(true);

    try {
      await axiosPrivate.post("/comments", {
        postId: postId,
        parentCommentId: comment.commentId,
        content: replyContent,
        mentionedUserIds: [],
      });

      toast.success("Reply posted successfully");
      setReplyContent("");
      setIsReplying(false);
      onUpdate();
    } catch (error) {
      console.error("Error posting reply:", error);
      const errorMessage = error.response?.data?.message || "Failed to post reply";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getScore = () => {
    return reactions.upvoteCount - reactions.downvoteCount;
  };

  if (comment.isDeleted) {
    return (
      <div className={`${isReply ? "ml-12" : ""} bg-gray-50 rounded-lg p-4 border border-gray-200`}>
        <p className="text-gray-500 italic">[Deleted comment]</p>
        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-4 space-y-4">
            {comment.replies.map((reply) => (
              <Comment
                key={reply.commentId}
                comment={reply}
                postId={postId}
                onUpdate={onUpdate}
                isReply={true}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`${isReply ? "ml-12 border-l-2 border-gray-200 pl-4" : ""}`}>
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <Avatar
              src={comment.authorProfilePictureUrl}
              fallback={comment.authorName?.[0] || "U"}
              className="h-8 w-8"
            />
            <div>
              <p className="font-semibold text-gray-900 text-sm">{comment.authorName || "Unknown User"}</p>
              <p className="text-xs text-gray-500">
                {comment.timeAgo}
                {comment.isEdited && <span className="ml-2">(edited)</span>}
              </p>
            </div>
          </div>

          {isOwner && !isEditing && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleEdit}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDelete} className="text-red-600">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Parent comment preview for replies */}
        {isReply && comment.parentAuthorName && (
          <div className="mb-2 text-sm text-gray-600 bg-gray-50 p-2 rounded">
            <span className="font-medium">@{comment.parentAuthorName}</span> said:{" "}
            {comment.parentContentPreview && comment.parentContentPreview.substring(0, 50)}...
          </div>
        )}

        {/* Content */}
        {isEditing ? (
          <div className="mb-3">
            <Textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full min-h-[80px] mb-2"
              maxLength={2000}
            />
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500">{editContent.length}/2000</span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleCancelEdit} disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button size="sm" onClick={handleSaveEdit} disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : "Save"}
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-gray-700 mb-3 whitespace-pre-wrap">{comment.content}</p>
        )}

        {/* Actions */}
        {!isEditing && (
          <div className="flex items-center gap-4">
            {/* Upvote */}
            <button
              onClick={() => handleReaction("UPVOTE")}
              className={`flex items-center gap-1 px-2 py-1 rounded transition-colors ${
                reactions.userReaction === "UPVOTE"
                  ? "bg-green-100 text-green-700"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <ThumbsUp className="h-4 w-4" />
              {reactions.upvoteCount > 0 && <span className="text-xs">{reactions.upvoteCount}</span>}
            </button>

            {/* Downvote */}
            <button
              onClick={() => handleReaction("DOWNVOTE")}
              className={`flex items-center gap-1 px-2 py-1 rounded transition-colors ${
                reactions.userReaction === "DOWNVOTE"
                  ? "bg-red-100 text-red-700"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <ThumbsDown className="h-4 w-4" />
              {reactions.downvoteCount > 0 && <span className="text-xs">{reactions.downvoteCount}</span>}
            </button>

            {/* Score */}
            <span className="text-sm text-gray-600 font-medium">Score: {getScore()}</span>

            {/* Reply button (only for top-level comments) */}
            {canReply && !isReplying && (
              <button
                onClick={handleReply}
                className="flex items-center gap-1 px-2 py-1 rounded text-gray-600 hover:bg-gray-100"
              >
                <Reply className="h-4 w-4" />
                <span className="text-xs">Reply</span>
              </button>
            )}

            {/* Reply count */}
            {comment.replyCount > 0 && (
              <button
                onClick={() => setShowReplies(!showReplies)}
                className="text-xs text-gray-600 hover:text-primary"
              >
                {showReplies ? "Hide" : "Show"} {comment.replyCount}{" "}
                {comment.replyCount === 1 ? "reply" : "replies"}
              </button>
            )}
          </div>
        )}

        {/* Reply Form */}
        {isReplying && (
          <div className="mt-4 bg-gray-50 p-3 rounded-lg">
            <Textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder={`Reply to ${comment.authorName}...`}
              className="w-full min-h-[80px] mb-2"
              maxLength={2000}
            />
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500">{replyContent.length}/2000</span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleCancelReply} disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button size="sm" onClick={handleSubmitReply} disabled={isSubmitting}>
                  {isSubmitting ? "Posting..." : "Post Reply"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Nested Replies */}
      {showReplies && comment.replies && comment.replies.length > 0 && (
        <div className="mt-4 space-y-4">
          {comment.replies.map((reply) => (
            <Comment
              key={reply.commentId}
              comment={reply}
              postId={postId}
              onUpdate={onUpdate}
              isReply={true}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Comment;

