import React, { useState, useEffect } from "react";
import { useQuery } from "react-query";
import { useAxiosPrivate } from "../../utils/axios";
import { toast } from "react-toastify";
import useUserStore from "../../store/user.store";
import { X, Star, Loader2 } from "lucide-react";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Label from "../ui/Label";
import Textarea from "../ui/Textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/Select";
import { Badge } from "../ui/Badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/Dialog";

export default function AddModal({ openAdd, setOpenAdd, refetch }) {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [applicationSearch, setApplicationSearch] = useState("");
  const [newTag, setNewTag] = useState("");
  
  const axiosPrivate = useAxiosPrivate();
  const user = useUserStore((state) => state.user);

  const [formData, setFormData] = useState({
    applicationId: "",
    companyName: "",
    jobTitle: "",
    applicationStatus: "",
    questionText: "",
    questionType: "",
    difficulty: 1,
    myAnswer: "",
    answerStatus: "NotStarted",
    tags: [],
    notes: "",
    isFavorite: false,
  });

  // Reset form when modal opens
  useEffect(() => {
    if (openAdd) {
      setFormData({
        applicationId: "",
        companyName: "",
        jobTitle: "",
        applicationStatus: "",
        questionText: "",
        questionType: "",
        difficulty: 1,
        myAnswer: "",
        answerStatus: "NotStarted",
        tags: [],
        notes: "",
        isFavorite: false,
      });
      setErrors({});
      setNewTag("");
    }
  }, [openAdd]);

  // Fetch applications for dropdown
  const fetchApplications = async () => {
    try {
      const params = {
        SearchTerm: applicationSearch || undefined,
        PageSize: 100
      };
      
      const response = await axiosPrivate.get('/applications', { params });
      return response.data?.items || [];
    } catch (error) {
      console.error("Error fetching applications:", error);
      return [];
    }
  };

  const { data: applications = [], isLoading: applicationsLoading } = useQuery(
    ["applications-for-questions", applicationSearch],
    fetchApplications,
    {
      staleTime: 5 * 60 * 1000,
    }
  );

  // Handle application selection
  const handleApplicationSelect = (applicationId) => {
    const selectedApp = applications.find(app => app.applicationId.toString() === applicationId);
    if (selectedApp) {
      setFormData({
        ...formData,
        applicationId: selectedApp.applicationId,
        companyName: selectedApp.companyName,
        jobTitle: selectedApp.jobTitle,
        applicationStatus: selectedApp.status,
      });
    }
  };

  // Handle tag management
  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, newTag.trim()]
      });
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    });
  };

  // Render star rating
  const renderStarRating = () => {
    return (
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }, (_, i) => (
          <Star
            key={i}
            className={`h-5 w-5 cursor-pointer ${
              i < formData.difficulty 
                ? 'text-yellow-500 fill-yellow-500' 
                : 'text-gray-300 hover:text-yellow-400'
            }`}
            onClick={() => setFormData({...formData, difficulty: i + 1})}
          />
        ))}
        <span className="ml-2 text-sm text-muted-foreground">
          ({formData.difficulty}/5)
        </span>
      </div>
    );
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    // Validation
    const newErrors = {};
    if (!formData.applicationId) newErrors.applicationId = "Please select an application";
    if (!formData.questionText.trim()) newErrors.questionText = "Question text is required";
    if (!formData.questionType) newErrors.questionType = "Please select a question type";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    // Prepare data for API
    const questionData = {
      question1: formData.questionText,
      answer: formData.myAnswer || "",
      applicationId: parseInt(formData.applicationId, 10),
      type: formData.questionType,
      answerStatus: formData.answerStatus,
      difficulty: formData.difficulty,
      preparationNote: formData.notes || "",
      favorite: formData.isFavorite,
      tags: formData.tags
    };

    try {
      await axiosPrivate.post("/questions", questionData);
      toast.success("Question added successfully");
      setOpenAdd(false);
      refetch();
    } catch (error) {
      console.error("Error adding question:", error);
      
      let errorMessage = "An error occurred. Please try again";
      if (error.response?.data) {
        if (typeof error.response.data === 'string') {
          errorMessage = error.response.data;
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.data.errors) {
          errorMessage = Object.values(error.response.data.errors).flat().join(", ");
        }
      }
      
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={openAdd} onOpenChange={setOpenAdd}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Interview Question</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="application">Related Application *</Label>
                <Select
                  value={formData.applicationId.toString()}
                  onValueChange={handleApplicationSelect}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select an application">
                      {formData.companyName && (
                        <span>{formData.companyName} - {formData.jobTitle} - {formData.applicationStatus}</span>
                      )}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <div className="p-2">
                      <Input
                        placeholder="Search applications..."
                        value={applicationSearch}
                        onChange={(e) => setApplicationSearch(e.target.value)}
                        className="mb-2"
                      />
                    </div>
                    {applications.map(app => (
                      <SelectItem key={app.applicationId} value={app.applicationId.toString()}>
                        {app.companyName} - {app.jobTitle} - {app.status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.applicationId && (
                  <p className="text-sm text-destructive">{errors.applicationId}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="questionType">Question Type *</Label>
                <Select
                  value={formData.questionType}
                  onValueChange={(value) => setFormData({...formData, questionType: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select question type">
                      {formData.questionType && (
                        <span>
                          {formData.questionType === 'CompanySpecific' ? 'Company-Specific' :
                           formData.questionType === 'CulturalFit' ? 'Cultural Fit' :
                           formData.questionType === 'ApplicationForm' ? 'Application Form' :
                           formData.questionType}
                        </span>
                      )}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Technical">Technical</SelectItem>
                    <SelectItem value="Behavioral">Behavioral</SelectItem>
                    <SelectItem value="CompanySpecific">Company-Specific</SelectItem>
                    <SelectItem value="CulturalFit">Cultural Fit</SelectItem>
                    <SelectItem value="ApplicationForm">Application Form</SelectItem>
                  </SelectContent>
                </Select>
                {errors.questionType && (
                  <p className="text-sm text-destructive">{errors.questionType}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Difficulty Level</Label>
                {renderStarRating()}
              </div>

              <div className="space-y-2">
                <Label htmlFor="answerStatus">Answer Status</Label>
                <Select
                  value={formData.answerStatus}
                  onValueChange={(value) => setFormData({...formData, answerStatus: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select answer status">
                      {formData.answerStatus && (
                        <span>
                          {formData.answerStatus === 'NotStarted' ? 'Not Started' :
                           formData.answerStatus === 'InProgress' ? 'In Progress' :
                           formData.answerStatus}
                        </span>
                      )}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NotStarted">Not Started</SelectItem>
                    <SelectItem value="InProgress">In Progress</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="favorite"
                  checked={formData.isFavorite}
                  onChange={(e) => setFormData({...formData, isFavorite: e.target.checked})}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="favorite" className="text-sm font-medium">
                  ⭐ Mark as favorite
                </Label>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="questionText">Question Text *</Label>
                <Textarea
                  id="questionText"
                  value={formData.questionText}
                  onChange={(e) => setFormData({...formData, questionText: e.target.value})}
                  placeholder="Enter the interview question..."
                  rows={4}
                  maxLength={1000}
                />
                <div className="text-sm text-muted-foreground">
                  {formData.questionText.length}/1000 characters
                </div>
                {errors.questionText && (
                  <p className="text-sm text-destructive">{errors.questionText}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Tags</Label>
                <div className="flex gap-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Add a tag"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                  />
                  <Button type="button" onClick={handleAddTag} variant="outline">
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {tag}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => handleRemoveTag(tag)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Full Width Fields */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="myAnswer">My Answer</Label>
              <Textarea
                id="myAnswer"
                value={formData.myAnswer}
                onChange={(e) => setFormData({...formData, myAnswer: e.target.value})}
                placeholder="Write your answer here... Use the STAR method for behavioral questions."
                rows={6}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Preparation Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                placeholder="Additional notes for preparation..."
                rows={3}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => setOpenAdd(false)}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading || !formData.applicationId || !formData.questionText || !formData.questionType}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Adding...
                </>
              ) : (
                "Add Question"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}