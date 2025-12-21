import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAxiosPrivate } from "../../../utils/axios";
import { 
  MessageSquare, 
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
  Eye
} from "lucide-react";
import { Badge } from "../../ui/Badge";
import Button from "../../ui/Button";
import Avatar from "../../ui/Avatar";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from "../../ui/dropdown-menu";
import EditPostModal from "./EditModal";
import DeletePostModal from "./DeleteModal";
import { toast } from "react-toastify";

const PostCard = ({ post, onClick, onUpdate }) => {
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();
  const currentUserId = parseInt(localStorage.getItem("userId"));
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(post.isSaved || false);
  const [reactions, setReactions] = useState({
    upvoteCount: post.upvoteCount || 0,
    downvoteCount: post.downvoteCount || 0,
    helpfulCount: post.helpfulCount || 0,
    insightfulCount: post.insightfulCount || 0,
    thanksCount: post.thanksCount || 0,
    userReaction: post.userReaction || null,
  });

  const isOwner = currentUserId === post.userId;

  const postTypeBadgeColors = {
    QUESTION: "bg-blue-100 text-blue-800",
    EXPERIENCE: "bg-green-100 text-green-800",
    JOB_REFERRAL: "bg-purple-100 text-purple-800",
    SUCCESS_STORY: "bg-yellow-100 text-yellow-800",
    RESOURCE: "bg-pink-100 text-pink-800",
    OTHER: "bg-gray-100 text-gray-800",
  };

  const reactionIcons = {
    UPVOTE: ThumbsUp,
    DOWNVOTE: ThumbsDown,
    HELPFUL: Lightbulb,
    INSIGHTFUL: Brain,
    THANKS: Heart,
  };

  const handleReaction = async (reactionType, e) => {
    e.stopPropagation();
    
    try {
      const response = await axiosPrivate.post("/PostReactions", {
        postId: post.postId,
        reactionType: reactionType,
      });

      if (response.data.message?.includes("removed")) {
        // Reaction was removed
        setReactions(prev => ({
          ...prev,
          [`${reactionType.toLowerCase()}Count`]: prev[`${reactionType.toLowerCase()}Count`] - 1,
          userReaction: null,
        }));
      } else {
        // Reaction was added or updated
        // First, remove old reaction count if exists
        if (reactions.userReaction) {
          setReactions(prev => ({
            ...prev,
            [`${reactions.userReaction.toLowerCase()}Count`]: prev[`${reactions.userReaction.toLowerCase()}Count`] - 1,
          }));
        }
        // Then add new reaction count
        setReactions(prev => ({
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

  const handleSaveToggle = async (e) => {
    e.stopPropagation();
    
    try {
      if (isSaved) {
        await axiosPrivate.delete(`/community/posts/${post.postId}/save`);
        setIsSaved(false);
        toast.success("Post removed from saved");
      } else {
        await axiosPrivate.post(`/community/posts/${post.postId}/save`);
        setIsSaved(true);
        toast.success("Post saved");
      }
    } catch (error) {
      console.error("Error toggling save:", error);
      toast.error("Failed to save post");
    }
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    setIsEditModalOpen(true);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    setIsDeleteModalOpen(true);
  };

  const handleView = (e) => {
    e.stopPropagation();
    navigate(`/community/posts/${post.postId}`);
  };

  const getContentExcerpt = (content, maxLength = 200) => {
    if (!content) return "";
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + "...";
  };

  return (
    <>
      <div 
        className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6 cursor-pointer border border-gray-200"
        onClick={onClick}
      >
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3 flex-1">
            <Avatar
              src={post.authorProfilePictureUrl}
              fallback={post.isAnonymous ? "A" : post.authorName?.[0] || "U"}
              className="h-10 w-10"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="font-semibold text-gray-900">
                  {post.isAnonymous ? "Anonymous User" : post.authorName || "Unknown User"}
                </p>
                <Badge className={postTypeBadgeColors[post.postType] || "bg-gray-100 text-gray-800"}>
                  {post.postTypeName || post.postType}
                </Badge>
              </div>
              <p className="text-sm text-gray-500">{post.relativeTime || "Just now"}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSaveToggle}
              className="text-gray-600 hover:text-primary"
            >
              {isSaved ? (
                <BookmarkCheck className="h-5 w-5" />
              ) : (
                <Bookmark className="h-5 w-5" />
              )}
            </Button>

            {isOwner && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" onClick={(e) => e.stopPropagation()}>
                    <MoreVertical className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleView}>
                    <Eye className="mr-2 h-4 w-4" />
                    View Details
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleEdit}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Post
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleDelete} className="text-red-600">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Post
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="mb-4">
          {post.title && (
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{post.title}</h3>
          )}
          <p className="text-gray-700 whitespace-pre-wrap">
            {getContentExcerpt(post.content || post.contentExcerpt)}
          </p>
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map(tag => (
              <Badge key={tag.tagId || tag.name} variant="outline" className="text-xs">
                {tag.name}
              </Badge>
            ))}
          </div>
        )}

        {/* Footer - Reactions and Comments */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="flex items-center gap-4">
            {/* Reactions */}
            <div className="flex items-center gap-2">
              {Object.entries(reactionIcons).map(([type, Icon]) => {
                const count = reactions[`${type.toLowerCase()}Count`];
                const isActive = reactions.userReaction === type;
                
                return (
                  <button
                    key={type}
                    onClick={(e) => handleReaction(type, e)}
                    className={`flex items-center gap-1 px-2 py-1 rounded-md transition-colors ${
                      isActive 
                        ? "bg-primary/10 text-primary" 
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {count > 0 && <span className="text-xs font-medium">{count}</span>}
                  </button>
                );
              })}
            </div>

            {/* Comments */}
            <div className="flex items-center gap-1 text-gray-600">
              <MessageSquare className="h-4 w-4" />
              <span className="text-sm">{post.commentCount || 0}</span>
            </div>
          </div>

          {/* View Count (if available) */}
          {post.viewCount !== undefined && (
            <div className="flex items-center gap-1 text-gray-500 text-sm">
              <Eye className="h-4 w-4" />
              <span>{post.viewCount} views</span>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <EditPostModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        post={post}
        onPostUpdated={onUpdate}
      />

      <DeletePostModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        post={post}
        onPostDeleted={onUpdate}
      />
    </>
  );
};

export default PostCard;

