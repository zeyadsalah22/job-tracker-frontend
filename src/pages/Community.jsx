import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAxiosPrivate } from "../utils/axios";
import { toast } from "react-toastify";
import Button from "../components/ui/Button";
import { Plus, Filter, MessageSquare, ThumbsUp, Bookmark, TrendingUp, HelpCircle, BookOpen, Users, Trophy, FileText, MoreHorizontal, FileText as DraftIcon, HelpCircle as QuestionIcon } from "lucide-react";
import AddPostModal from "../components/community/posts/AddModal";
import PostCard from "../components/community/posts/PostCard";
import { Select } from "../components/ui/Select";
import Input from "../components/ui/Input";
import OnboardingTour from "../components/onboarding/OnboardingTour";
import { Badge } from "../components/ui/Badge";

const Community = () => {
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();
  
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 20,
    totalCount: 0,
    totalPages: 0,
    hasNext: false,
    hasPrevious: false,
  });

  // Filters
  const [filters, setFilters] = useState({
    postType: "",
    sortBy: "CreatedAt",
    sortDescending: true,
    searchTerm: "",
    tags: [],
  });

  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);

  const postTypes = [
    { value: "", label: "All Types", icon: Filter, color: "bg-gray-100 text-gray-800" },
    { value: "QUESTION", label: "Question", icon: HelpCircle, color: "bg-blue-100 text-blue-800" },
    { value: "EXPERIENCE", label: "Experience", icon: BookOpen, color: "bg-green-100 text-green-800" },
    { value: "JOB_REFERRAL", label: "Job Referral", icon: Users, color: "bg-purple-100 text-purple-800" },
    { value: "SUCCESS_STORY", label: "Success Story", icon: Trophy, color: "bg-yellow-100 text-yellow-800" },
    { value: "RESOURCE", label: "Resource", icon: FileText, color: "bg-pink-100 text-pink-800" },
    { value: "OTHER", label: "Other", icon: MoreHorizontal, color: "bg-gray-100 text-gray-800" },
  ];

  const sortOptions = [
    { value: "CreatedAt", label: "Newest" },
    { value: "Trending", label: "Trending" },
  ];

  useEffect(() => {
    fetchPosts();
    fetchTags();
  }, [filters, pagination.currentPage]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      
      const params = new URLSearchParams({
        pageNumber: pagination.currentPage.toString(),
        pageSize: pagination.pageSize.toString(),
        sortBy: filters.sortBy,
        sortDescending: filters.sortDescending.toString(),
        status: "PUBLISHED",
      });

      if (filters.postType) params.append("postType", filters.postType);
      if (filters.searchTerm) params.append("searchTerm", filters.searchTerm);
      if (selectedTags.length > 0) {
        selectedTags.forEach(tag => params.append("tags", tag));
      }

      const response = await axiosPrivate.get(`/posts?${params.toString()}`);
      setPosts(response.data.items || response.data);
      
      // Extract pagination from headers
      if (response.headers["x-pagination-totalcount"]) {
        setPagination(prev => ({
          ...prev,
          totalCount: parseInt(response.headers["x-pagination-totalcount"]),
          totalPages: parseInt(response.headers["x-pagination-totalpages"]),
          hasNext: response.headers["x-pagination-hasnext"] === "true",
          hasPrevious: response.headers["x-pagination-hasprevious"] === "true",
        }));
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
      toast.error("Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  const fetchTags = async () => {
    try {
      const response = await axiosPrivate.get("/posts/tags");
      setTags(response.data || []);
    } catch (error) {
      console.error("Error fetching tags:", error);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const handleTagToggle = (tagName) => {
    setSelectedTags(prev => {
      if (prev.includes(tagName)) {
        return prev.filter(t => t !== tagName);
      } else {
        if (prev.length < 5) {
          return [...prev, tagName];
        }
        toast.warning("Maximum 5 tags allowed");
        return prev;
      }
    });
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const handlePostCreated = () => {
    setPagination(prev => ({ ...prev, currentPage: 1 }));
    fetchPosts();
    setIsAddModalOpen(false);
  };

  const handlePostClick = (postId) => {
    navigate(`/community/posts/${postId}`);
  };

  const handleNextPage = () => {
    if (pagination.hasNext) {
      setPagination(prev => ({ ...prev, currentPage: prev.currentPage + 1 }));
    }
  };

  const handlePreviousPage = () => {
    if (pagination.hasPrevious) {
      setPagination(prev => ({ ...prev, currentPage: prev.currentPage - 1 }));
    }
  };

  return (
    <>
      <OnboardingTour page="community" />
      <div className="p-6 max-w-7xl mx-auto" data-tour="community-feed">
        {/* Header */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Community</h1>
              <p className="text-gray-600 mt-1">Share experiences, ask questions, and connect with fellow job seekers</p>
            </div>
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              onClick={() => navigate("/community/interview-questions")} 
              className="flex items-center gap-2"
            >
              <QuestionIcon className="h-4 w-4" />
              Interview Questions
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate("/community/saved")} 
              className="flex items-center gap-2"
            >
              <Bookmark className="h-4 w-4" />
              Saved Posts
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate("/community/drafts")} 
              className="flex items-center gap-2"
            >
              <DraftIcon className="h-4 w-4" />
              Drafts
            </Button>
            <Button onClick={() => setIsAddModalOpen(true)} className="flex items-center gap-2" data-tour="create-post-btn">
              <Plus className="h-4 w-4" />
              Create Post
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <Input
                placeholder="Search posts..."
                value={filters.searchTerm}
                onChange={(e) => handleFilterChange("searchTerm", e.target.value)}
                className="w-full"
              />
            </div>

            {/* Sort */}
            <div>
              <Select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange("sortBy", e.target.value)}
                className="w-full"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </Select>
            </div>
          </div>

          {/* Post Type Filter Pills */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-3">Filter by post type:</p>
            <div className="flex flex-wrap gap-2">
              {postTypes.map(type => {
                const Icon = type.icon;
                const isSelected = filters.postType === type.value;
                return (
                  <button
                    key={type.value}
                    onClick={() => handleFilterChange("postType", type.value)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-all ${
                      isSelected
                        ? type.color + " ring-2 ring-offset-2 ring-current"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {type.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tags Filter */}
          {tags.length > 0 && (
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Filter by tags (max 5):</p>
              <div className="flex flex-wrap gap-2">
                {tags.slice(0, 20).map(tag => (
                  <Badge
                    key={tag.tagId}
                    variant={selectedTags.includes(tag.name) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => handleTagToggle(tag.name)}
                  >
                    {tag.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Posts Feed */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : posts.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <MessageSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No posts found</h3>
          <p className="text-gray-600 mb-4">Be the first to share something with the community!</p>
          <Button onClick={() => setIsAddModalOpen(true)}>Create First Post</Button>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map(post => (
            <PostCard 
              key={post.postId} 
              post={post} 
              onClick={() => handlePostClick(post.postId)}
              onUpdate={fetchPosts}
            />
          ))}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="bg-white rounded-lg shadow-sm p-4 flex justify-between items-center">
              <div className="text-sm text-gray-600">
                Page {pagination.currentPage} of {pagination.totalPages} ({pagination.totalCount} posts)
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={handlePreviousPage}
                  disabled={!pagination.hasPrevious}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  onClick={handleNextPage}
                  disabled={!pagination.hasNext}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Add Post Modal */}
      <AddPostModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onPostCreated={handlePostCreated}
      />
      </div>
    </>
  );
};

export default Community;

