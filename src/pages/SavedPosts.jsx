import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAxiosPrivate } from "../utils/axios";
import { toast } from "react-toastify";
import { Bookmark, ArrowLeft } from "lucide-react";
import Button from "../components/ui/Button";
import PostCard from "../components/community/posts/PostCard";

const SavedPosts = () => {
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();

  const [savedPosts, setSavedPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSavedPosts();
  }, []);

  const fetchSavedPosts = async () => {
    try {
      setLoading(true);
      const response = await axiosPrivate.get("/community/users/me/saved-posts");
      
      // The response contains saved post objects with post details
      const posts = response.data.map(savedPost => ({
        ...savedPost.post,
        savedAt: savedPost.savedAt,
        isSaved: true,
      }));
      
      setSavedPosts(posts);
    } catch (error) {
      console.error("Error fetching saved posts:", error);
      toast.error("Failed to load saved posts");
    } finally {
      setLoading(false);
    }
  };

  const handlePostClick = (postId) => {
    navigate(`/community/posts/${postId}`);
  };

  const handlePostUpdate = () => {
    fetchSavedPosts();
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
          <Bookmark className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Saved Posts</h1>
            <p className="text-gray-600 mt-1">Posts you've bookmarked for later</p>
          </div>
        </div>
      </div>

      {/* Saved Posts */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : savedPosts.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <Bookmark className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No saved posts yet</h3>
          <p className="text-gray-600 mb-4">
            Save posts you find interesting to easily access them later
          </p>
          <Button onClick={() => navigate("/community")}>Browse Community</Button>
        </div>
      ) : (
        <div className="space-y-4">
          {savedPosts.map((post) => (
            <PostCard
              key={post.postId}
              post={post}
              onClick={() => handlePostClick(post.postId)}
              onUpdate={handlePostUpdate}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedPosts;

