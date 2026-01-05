import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAxiosPrivate } from "../utils/axios";
import { toast } from "react-toastify";
import { FileText, ArrowLeft, Edit, Trash2, Eye } from "lucide-react";
import Button from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import Avatar from "../components/ui/Avatar";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from "../components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import EditPostModal from "../components/community/posts/EditModal";
import DeletePostModal from "../components/community/posts/DeleteModal";

const DraftedPosts = () => {
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();
  const currentUserId = parseInt(localStorage.getItem("userId"));

  const [draftedPosts, setDraftedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  const postTypeBadgeColors = {
    QUESTION: "bg-blue-100 text-blue-800",
    EXPERIENCE: "bg-green-100 text-green-800",
    JOB_REFERRAL: "bg-purple-100 text-purple-800",
    SUCCESS_STORY: "bg-yellow-100 text-yellow-800",
    RESOURCE: "bg-pink-100 text-pink-800",
    OTHER: "bg-gray-100 text-gray-800",
  };

  useEffect(() => {
    fetchDraftedPosts();
  }, []);

  const fetchDraftedPosts = async () => {
    try {
      setLoading(true);
      const response = await axiosPrivate.get("/posts/my-drafts");
      
      setDraftedPosts(response.data.items || response.data || []);
    } catch (error) {
      console.error("Error fetching drafted posts:", error);
      toast.error("Failed to load drafted posts");
    } finally {
      setLoading(false);
    }
  };

  const handlePostClick = (postId) => {
    navigate(`/community/posts/${postId}`);
  };

  const handleEdit = (post, e) => {
    e.stopPropagation();
    setSelectedPost(post);
    setIsEditModalOpen(true);
  };

  const handleDelete = (post, e) => {
    e.stopPropagation();
    setSelectedPost(post);
    setIsDeleteModalOpen(true);
  };

  const handlePostUpdated = () => {
    fetchDraftedPosts();
    setIsEditModalOpen(false);
  };

  const handlePostDeleted = () => {
    fetchDraftedPosts();
    setIsDeleteModalOpen(false);
  };

  const getContentExcerpt = (content, maxLength = 200) => {
    if (!content) return "";
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + "...";
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
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Button variant="ghost" onClick={() => navigate("/community")} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Community
        </Button>

        <div className="flex items-center gap-3">
          <FileText className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Drafted Posts</h1>
            <p className="text-gray-600 mt-1">Your unpublished posts and drafts</p>
          </div>
        </div>
      </div>

      {/* Drafted Posts */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : draftedPosts.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No drafted posts yet</h3>
          <p className="text-gray-600 mb-4">
            Create a post and save it as draft to see it here
          </p>
          <Button onClick={() => navigate("/community")}>Go to Community</Button>
        </div>
      ) : (
        <div className="space-y-4">
          {draftedPosts.map((post) => (
            <div 
              key={post.postId}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-200"
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
                      <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                        Draft
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500">
                      Created: {formatDate(post.createdAt)}
                      {post.updatedAt !== post.createdAt && (
                        <span className="ml-2">• Updated: {formatDate(post.updatedAt)}</span>
                      )}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handlePostClick(post.postId)}
                    className="text-gray-600 hover:text-primary"
                  >
                    <Eye className="h-5 w-5" />
                  </Button>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" onClick={(e) => e.stopPropagation()}>
                        <MoreVertical className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handlePostClick(post.postId)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={(e) => handleEdit(post, e)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Draft
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={(e) => handleDelete(post, e)} className="text-red-600">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Draft
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* Content */}
              <div className="mb-4">
                {post.title && (
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{post.title}</h3>
                )}
                <p className="text-gray-700 whitespace-pre-wrap">
                  {getContentExcerpt(post.content)}
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
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      {selectedPost && (
        <>
          <EditPostModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            post={selectedPost}
            onPostUpdated={handlePostUpdated}
          />

          <DeletePostModal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            post={selectedPost}
            onPostDeleted={handlePostDeleted}
          />
        </>
      )}
    </div>
  );
};

export default DraftedPosts;
