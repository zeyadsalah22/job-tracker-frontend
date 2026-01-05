import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAxiosPrivate } from "../utils/axios";
import { toast } from "react-toastify";
import Button from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import Avatar from "../components/ui/Avatar";
import {
  ArrowLeft,
  ThumbsUp,
  ThumbsDown,
  Lightbulb,
  Brain,
  Heart,
  Bookmark,
  BookmarkCheck,
  MoreVertical,
  Edit,
  Trash2,
  MessageSquare,
  Eye,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import EditPostModal from "../components/community/posts/EditModal";
import DeletePostModal from "../components/community/posts/DeleteModal";
import CommentSection from "../components/community/comments/CommentSection";
import WhoReactedModal from "../components/community/reactions/WhoReactedModal";

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();
  const currentUserId = parseInt(localStorage.getItem("userId"));

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isWhoReactedModalOpen, setIsWhoReactedModalOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [reactions, setReactions] = useState({
    upvoteCount: 0,
    downvoteCount: 0,
    helpfulCount: 0,
    insightfulCount: 0,
    thanksCount: 0,
    userReaction: null,
  });

  const postTypeBadgeColors = {
    QUESTION: "bg-blue-100 text-blue-800",
    EXPERIENCE: "bg-green-100 text-green-800",
    JOB_REFERRAL: "bg-purple-100 text-purple-800",
    SUCCESS_STORY: "bg-yellow-100 text-yellow-800",
    RESOURCE: "bg-pink-100 text-pink-800",
    OTHER: "bg-gray-100 text-gray-800",
  };

  const reactionConfig = [
    { type: "UPVOTE", icon: ThumbsUp, label: "Upvote" },
    { type: "HELPFUL", icon: Lightbulb, label: "Helpful" },
    { type: "INSIGHTFUL", icon: Brain, label: "Insightful" },
    { type: "THANKS", icon: Heart, label: "Thanks" },
    { type: "DOWNVOTE", icon: ThumbsDown, label: "Downvote" },
  ];

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const response = await axiosPrivate.get(`/posts/${id}`);
      setPost(response.data);
      setIsSaved(response.data.isSaved || false);
      setReactions({
        upvoteCount: response.data.upvoteCount || 0,
        downvoteCount: response.data.downvoteCount || 0,
        helpfulCount: response.data.helpfulCount || 0,
        insightfulCount: response.data.insightfulCount || 0,
        thanksCount: response.data.thanksCount || 0,
        userReaction: response.data.userReaction || null,
      });
    } catch (error) {
      console.error("Error fetching post:", error);
      toast.error("Failed to load post");
      if (error.response?.status === 404) {
        navigate("/community");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReaction = async (reactionType) => {
    try {
      const response = await axiosPrivate.post("/PostReactions", {
        postId: parseInt(id),
        reactionType: reactionType,
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
      console.error("Error reacting to post:", error);
      toast.error("Failed to react to post");
    }
  };

  const handleSaveToggle = async () => {
    try {
      if (isSaved) {
        await axiosPrivate.delete(`/community/posts/${id}/save`);
        setIsSaved(false);
        toast.success("Post removed from saved");
      } else {
        await axiosPrivate.post(`/community/posts/${id}/save`);
        setIsSaved(true);
        toast.success("Post saved");
      }
    } catch (error) {
      console.error("Error toggling save:", error);
      toast.error("Failed to save post");
    }
  };

  const handlePostDeleted = () => {
    toast.success("Post deleted successfully");
    navigate("/community");
  };

  const getTotalReactions = () => {
    return reactions.upvoteCount + reactions.downvoteCount + reactions.helpfulCount +
           reactions.insightfulCount + reactions.thanksCount;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="p-6 max-w-4xl mx-auto text-center">
        <p className="text-gray-600">Post not found</p>
      </div>
    );
  }

  const isOwner = currentUserId === post.userId;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Back Button */}
      <Button variant="ghost" onClick={() => navigate("/community")} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Community
      </Button>

      {/* Post Card */}
      <div className="bg-white rounded-lg shadow-md p-8 mb-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-3 flex-1">
            <Avatar
              src={post.authorProfilePictureUrl}
              fallback={post.isAnonymous ? "A" : post.authorName?.[0] || "U"}
              className="h-12 w-12"
            />
            <div>
              <div className="flex items-center gap-2">
                <p className="font-semibold text-gray-900 text-lg">
                  {post.isAnonymous ? "Anonymous User" : post.authorName || "Unknown User"}
                </p>
                <Badge className={postTypeBadgeColors[post.postType] || "bg-gray-100 text-gray-800"}>
                  {post.postTypeName || post.postType}
                </Badge>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                <span>{post.relativeTime || "Just now"}</span>
                {post.isEdited && <span className="text-gray-400">• Edited</span>}
                {post.viewCount !== undefined && (
                  <span className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    {post.viewCount} views
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={handleSaveToggle} className="text-gray-600">
              {isSaved ? <BookmarkCheck className="h-5 w-5" /> : <Bookmark className="h-5 w-5" />}
            </Button>

            {isOwner && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setIsEditModalOpen(true)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Post
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setIsDeleteModalOpen(true)} className="text-red-600">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Post
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="mb-6">
          {post.title && <h1 className="text-2xl font-bold text-gray-900 mb-4">{post.title}</h1>}
          <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{post.content}</p>
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {post.tags.map((tag) => (
              <Badge key={tag.tagId || tag.name} variant="outline">
                {tag.name}
              </Badge>
            ))}
          </div>
        )}

        {/* Reactions */}
        <div className="border-t border-b border-gray-200 py-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-gray-600">
              {getTotalReactions() > 0 && (
                <button
                  onClick={() => setIsWhoReactedModalOpen(true)}
                  className="hover:underline cursor-pointer"
                >
                  {getTotalReactions()} {getTotalReactions() === 1 ? "reaction" : "reactions"}
                </button>
              )}
            </p>
            <p className="text-sm text-gray-600">
              {post.commentCount || 0} {post.commentCount === 1 ? "comment" : "comments"}
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {reactionConfig.map(({ type, icon: Icon, label }) => {
              const count = reactions[`${type.toLowerCase()}Count`];
              const isActive = reactions.userReaction === type;

              return (
                <button
                  key={type}
                  onClick={() => handleReaction(type)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                    isActive
                      ? "bg-primary text-white border-primary"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-sm font-medium">{label}</span>
                  {count > 0 && <span className="text-sm">({count})</span>}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Comments Section */}
      <CommentSection postId={parseInt(id)} />

      {/* Modals */}
      <EditPostModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        post={post}
        onPostUpdated={fetchPost}
      />

      <DeletePostModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        post={post}
        onPostDeleted={handlePostDeleted}
      />

      <WhoReactedModal
        isOpen={isWhoReactedModalOpen}
        onClose={() => setIsWhoReactedModalOpen(false)}
        postId={parseInt(id)}
      />
    </div>
  );
};

export default PostDetail;

