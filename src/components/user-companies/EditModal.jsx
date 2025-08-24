import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useQuery } from "react-query";
import { useAxiosPrivate } from "../../utils/axios";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/Dialog";
import Label from "../ui/Label";
import Input from "../ui/Input";
import Textarea from "../ui/Textarea";
import Button from "../ui/Button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/Select";
import { Badge } from "../ui/Badge";
import { CheckboxWithLabel } from "../ui/Checkbox";
import { Loader2, X } from "lucide-react";

export default function EditModal({ id, refetch, openEdit, setOpenEdit }) {
  const [loading, setLoading] = useState(false);
  const [newTag, setNewTag] = useState("");
  const axiosPrivate = useAxiosPrivate();

  const [formData, setFormData] = useState({
    companyId: "",
    companyName: "",
    industry: "",
    companyLogo: "",
    interestLevel: "",
    personalNotes: "",
    tags: [],
    favorite: false,
  });

  const fetchUserCompany = async () => {
    try {
      const response = await axiosPrivate.get(`/user-companies/${id}`);
      console.log("User company data for edit:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching user company:", error);
      throw error;
    }
  };

  const { data: userCompany, isLoading } = useQuery(
    ["user-company-edit", { id }],
    fetchUserCompany,
    {
      enabled: !!id && openEdit,
    }
  );

  useEffect(() => {
    if (userCompany) {
      setFormData({
        companyId: userCompany.companyId,
        companyName: userCompany.companyName,
        industry: userCompany.industry || "",
        companyLogo: userCompany.companyLogo || "🏢",
        interestLevel: userCompany.interestLevel,
        personalNotes: userCompany.personalNotes || "",
        tags: Array.isArray(userCompany.tags) ? userCompany.tags : [],
        favorite: userCompany.favorite,
      });
    }
  }, [userCompany]);

  const handleAddTag = () => {
    if (newTag.trim() && !Array.isArray(formData.tags)) {
      // Initialize tags as empty array if it's not an array
      setFormData({
        ...formData,
        tags: [newTag.trim()]
      });
      setNewTag("");
      return;
    }
    
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, newTag.trim()]
      });
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    if (!Array.isArray(formData.tags)) return;
    
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.interestLevel) {
      toast.error("Please select an interest level");
      return;
    }

    setLoading(true);
    try {
      // Prepare data for API - only send what the backend expects
      const submitData = {
        personalNotes: formData.personalNotes,
        interestLevel: formData.interestLevel,
        favorite: formData.favorite,
        tags: Array.isArray(formData.tags) ? formData.tags : [],
      };

      await axiosPrivate.put(`/user-companies/${id}`, submitData);
      setOpenEdit(false);
      toast.success("Company information updated successfully");
      refetch();
    } catch (error) {
      toast.error(
        error.response?.data?.message || 
        "An error occurred. Please try again"
      );
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent className="sm:max-w-[600px]">
          <div className="flex justify-center items-center py-8">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={openEdit} onOpenChange={setOpenEdit}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {userCompany ? "Edit Company" : "Edit Company Information"}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="company">Company</Label>
            <Select
              value={formData.companyId}
              disabled={true}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a company">
                  {formData.companyName && (
                    <div className="flex items-center gap-2">
                      <span>{formData.companyLogo}</span>
                      <span>{formData.companyName}</span>
                      {formData.industry && (
                        <span className="text-muted-foreground">({formData.industry})</span>
                      )}
                    </div>
                  )}
                </SelectValue>
              </SelectTrigger>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="interestLevel">Interest Level *</Label>
            <Select 
              value={formData.interestLevel} 
              onValueChange={(value) => setFormData({...formData, interestLevel: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select interest level">
                  {formData.interestLevel && `${formData.interestLevel} Interest`}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="High">High Interest</SelectItem>
                <SelectItem value="Medium">Medium Interest</SelectItem>
                <SelectItem value="Low">Low Interest</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="personalNotes">Personal Description</Label>
            <Textarea
              id="personalNotes"
              value={formData.personalNotes}
              onChange={(e) => setFormData({...formData, personalNotes: e.target.value})}
              placeholder="Add your notes about this company (e.g., positions of interest, networking contacts, application status)"
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex gap-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add a tag (e.g., Dream Job, Remote Work)"
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

          <CheckboxWithLabel
            id="favorite"
            checked={formData.favorite}
            onCheckedChange={(checked) => setFormData({...formData, favorite: checked})}
          >
            High Priority Company
          </CheckboxWithLabel>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpenEdit(false)}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading || !formData.interestLevel}
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
              Update Company
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
