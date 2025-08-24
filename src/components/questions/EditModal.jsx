import React, { useState, useEffect } from "react";
import { useQuery } from "react-query";
import { useAxiosPrivate } from "../../utils/axios";
import { toast } from "react-toastify";
import useUserStore from "../../store/user.store";
import { X, Star, Loader2, Building2 } from "lucide-react";
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

export default function EditModal({ id, openEdit, setOpenEdit, refetch }) {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
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

  // Fetch question details
  const fetchQuestion = async () => {
    if (!id) return null;
    try {
      const response = await axiosPrivate.get(`/questions/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching question details:", error);
      throw error;
    }
  };

  const { data: question, isLoading: questionLoading } = useQuery(
    ["question", id],
    fetchQuestion,
    {
      enabled: !!id && openEdit,
    }
  );

  // Fetch application details for the question
  const fetchApplication = async () => {
    if (!question?.applicationId) return null;
    try {
      const response = await axiosPrivate.get(`/applications/${question.applicationId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching application:", error);
      return null;
    }
  };

  const { data: application } = useQuery(
    ["application-for-question", question?.applicationId],
    fetchApplication,
    {
      enabled: !!question?.applicationId,
    }
  );

  // Populate form when question data is loaded
  useEffect(() => {
    if (question && openEdit) {
      setFormData({
        applicationId: question.applicationId || "",
        companyName: application?.companyName || "",
        jobTitle: application?.jobTitle || "",
        applicationStatus: application?.status || "",
        questionText: question.question1 || "",
        questionType: question.type || "",
        difficulty: question.difficulty || 1,
        myAnswer: question.answer || "",
        answerStatus: question.answerStatus || "NotStarted",
        tags: Array.isArray(question.tags) ? question.tags : [],
        notes: question.preparationNote || "",
        isFavorite: question.favorite || false,
      });
      setErrors({});
      setNewTag("");
    }
  }, [question, application, openEdit]);

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
    if (!formData.questionText.trim()) newErrors.questionText = "Question text is required";
    if (!formData.questionType) newErrors.questionType = "Please select a question type";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    // Prepare data for API (PATCH request)
    const questionData = {
      applicationId: parseInt(formData.applicationId, 10),
      question1: formData.questionText,
      answer: formData.myAnswer || "",
      type: formData.questionType,
      answerStatus: formData.answerStatus,
      difficulty: formData.difficulty,
      preparationNote: formData.notes || "",
      favorite: formData.isFavorite,
      tags: formData.tags
    };

    try {
      await axiosPrivate.patch(`/questions/${id}`, questionData);
      toast.success("Question updated successfully");
      setOpenEdit(false);
      refetch();
    } catch (error) {
      console.error("Error updating question:", error);
      
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

  if (questionLoading) {
    return (
      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent className="max-w-md">
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin" />
            <span className="ml-2">Loading question...</span>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={openEdit} onOpenChange={setOpenEdit}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Interview Question</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Related Application</Label>
                <div className="p-3 bg-muted rounded-md">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <div className="font-medium">{formData.companyName}</div>
                      <div className="text-sm text-muted-foreground">{formData.jobTitle}</div>
                      {formData.applicationStatus && (
                        <Badge variant="outline" className="text-xs mt-1">
                          {formData.applicationStatus}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
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
                  {Array.isArray(formData.tags) && formData.tags.map((tag, index) => (
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
            <Button type="button" variant="outline" onClick={() => setOpenEdit(false)}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading || !formData.questionText || !formData.questionType}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Question"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}