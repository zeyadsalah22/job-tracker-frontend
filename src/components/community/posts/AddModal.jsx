import { useState, useEffect } from "react";
import { useAxiosPrivate } from "../../../utils/axios";
import { toast } from "react-toastify";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../ui/Dialog";
import Button from "../../ui/Button";
import Input from "../../ui/Input";
import Textarea from "../../ui/Textarea";
import { Select } from "../../ui/Select";
import { CheckboxWithLabel } from "../../ui/Checkbox";
import Label from "../../ui/Label";
import { Badge } from "../../ui/Badge";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem
} from "../../ui/dropdown-menu";
import { X, ChevronDown, HelpCircle, BookOpen, Users, Trophy, FileText, MoreHorizontal } from "lucide-react";

const AddPostModal = ({ isOpen, onClose, onPostCreated }) => {
  const axiosPrivate = useAxiosPrivate();

  const [formData, setFormData] = useState({
    postType: "QUESTION",
    title: "",
    content: "",
    isAnonymous: false,
    status: "PUBLISHED",
    tags: [],
  });

  const [availableTags, setAvailableTags] = useState([]);
  const [tagSearch, setTagSearch] = useState("");
  const [filteredTags, setFilteredTags] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const postTypes = [
    { value: "QUESTION", label: "Question", icon: HelpCircle, description: "Ask questions to the community" },
    { value: "EXPERIENCE", label: "Experience", icon: BookOpen, description: "Share your work experiences" },
    { value: "JOB_REFERRAL", label: "Job Referral", icon: Users, description: "Share job opportunities" },
    { value: "SUCCESS_STORY", label: "Success Story", icon: Trophy, description: "Share your achievements" },
    { value: "RESOURCE", label: "Resource", icon: FileText, description: "Share helpful resources" },
    { value: "OTHER", label: "Other", icon: MoreHorizontal, description: "Other topics" },
  ];

  useEffect(() => {
    if (isOpen) {
      fetchTags();
    }
  }, [isOpen]);

  useEffect(() => {
    if (tagSearch.trim()) {
      searchTags(tagSearch);
    } else {
      setFilteredTags([]);
    }
  }, [tagSearch]);

  const fetchTags = async () => {
    try {
      const response = await axiosPrivate.get("/posts/tags");
      setAvailableTags(response.data || []);
    } catch (error) {
      console.error("Error fetching tags:", error);
    }
  };

  const searchTags = async (searchTerm) => {
    try {
      const response = await axiosPrivate.get(`/posts/tags/search?searchTerm=${searchTerm}`);
      setFilteredTags(response.data || []);
    } catch (error) {
      console.error("Error searching tags:", error);
      setFilteredTags([]);
    }
  };

  const handleAddTag = (tagName) => {
    if (formData.tags.length >= 5) {
      toast.warning("Maximum 5 tags allowed");
      return;
    }
    
    if (!formData.tags.includes(tagName)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagName]
      }));
    }
    setTagSearch("");
    setFilteredTags([]);
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleAddCustomTag = () => {
    if (tagSearch.trim() && formData.tags.length < 5) {
      handleAddTag(tagSearch.trim());
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.content || formData.content.trim().length < 10) {
      newErrors.content = "Content must be at least 10 characters";
    }
    if (formData.content && formData.content.length > 10000) {
      newErrors.content = "Content must be less than 10,000 characters";
    }
    if (formData.title && formData.title.length > 200) {
      newErrors.title = "Title must be less than 200 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axiosPrivate.post("/posts", formData);
      toast.success(response.data.message || "Post created successfully");
      
      // Reset form
      setFormData({
        postType: "QUESTION",
        title: "",
        content: "",
        isAnonymous: false,
        status: "PUBLISHED",
        tags: [],
      });
      setTagSearch("");
      setErrors({});
      
      onPostCreated();
    } catch (error) {
      console.error("Error creating post:", error);
      const errorMessage = error.response?.data?.message || "Failed to create post";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveAsDraft = async () => {
    const draftData = { ...formData, status: "DRAFT" };
    
    setIsSubmitting(true);

    try {
      const response = await axiosPrivate.post("/posts", draftData);
      toast.success("Post saved as draft");
      
      setFormData({
        postType: "QUESTION",
        title: "",
        content: "",
        isAnonymous: false,
        status: "PUBLISHED",
        tags: [],
      });
      setTagSearch("");
      setErrors({});
      
      onClose();
    } catch (error) {
      console.error("Error saving draft:", error);
      toast.error("Failed to save draft");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Post</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Post Type */}
          <div>
            <Label htmlFor="postType">Post Type *</Label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full mt-1 justify-between h-10"
                  type="button"
                >
                  <div className="flex items-center gap-2">
                    {(() => {
                      const selectedType = postTypes.find(type => type.value === formData.postType);
                      const Icon = selectedType?.icon || HelpCircle;
                      return <Icon className="h-4 w-4" />;
                    })()}
                    <span>{postTypes.find(type => type.value === formData.postType)?.label || "Select post type"}</span>
                  </div>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-full min-w-[300px]">
                <DropdownMenuRadioGroup
                  value={formData.postType}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, postType: value }))}
                >
                  {postTypes.map(type => {
                    const Icon = type.icon;
                    return (
                      <DropdownMenuRadioItem key={type.value} value={type.value} className="p-3">
                        <div className="flex items-start gap-3 w-full">
                          <Icon className="h-5 w-5 mt-0.5 text-gray-600" />
                          <div className="flex-1">
                            <div className="font-medium">{type.label}</div>
                            <div className="text-sm text-gray-500">{type.description}</div>
                          </div>
                        </div>
                      </DropdownMenuRadioItem>
                    );
                  })}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Title */}
          <div>
            <Label htmlFor="title">Title (Optional)</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter a title for your post (max 200 characters)"
              className="mt-1"
              maxLength={200}
            />
            <p className="text-xs text-gray-500 mt-1">{formData.title.length}/200</p>
            {errors.title && <p className="text-xs text-red-600 mt-1">{errors.title}</p>}
          </div>

          {/* Content */}
          <div>
            <Label htmlFor="content">Content *</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              placeholder="Share your thoughts, experiences, or questions..."
              className="mt-1 min-h-[200px]"
              maxLength={10000}
            />
            <p className="text-xs text-gray-500 mt-1">{formData.content.length}/10,000</p>
            {errors.content && <p className="text-xs text-red-600 mt-1">{errors.content}</p>}
          </div>

          {/* Tags */}
          <div>
            <Label htmlFor="tags">Tags (up to 5)</Label>
            <div className="mt-1">
              <div className="relative">
                <Input
                  id="tags"
                  value={tagSearch}
                  onChange={(e) => setTagSearch(e.target.value)}
                  placeholder="Search or add tags..."
                  disabled={formData.tags.length >= 5}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddCustomTag();
                    }
                  }}
                />
                
                {/* Tag suggestions dropdown */}
                {filteredTags.length > 0 && tagSearch && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-40 overflow-y-auto">
                    {filteredTags.map(tag => (
                      <button
                        key={tag.tagId}
                        type="button"
                        onClick={() => handleAddTag(tag.name)}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                      >
                        {tag.name}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={handleAddCustomTag}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm font-medium text-primary border-t"
                    >
                      Add "{tagSearch}"
                    </button>
                  </div>
                )}
              </div>

              {/* Selected tags */}
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.tags.map(tag => (
                    <Badge key={tag} variant="default" className="flex items-center gap-1">
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-1 hover:text-red-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Anonymous */}
          <CheckboxWithLabel
            id="isAnonymous"
            checked={formData.isAnonymous}
            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isAnonymous: checked }))}
          >
            Post anonymously (your identity will be hidden)
          </CheckboxWithLabel>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleSaveAsDraft} 
              disabled={isSubmitting || !formData.content}
            >
              Save as Draft
            </Button>
            <Button type="submit" disabled={isSubmitting || !formData.content}>
              {isSubmitting ? "Publishing..." : "Publish Post"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddPostModal;

