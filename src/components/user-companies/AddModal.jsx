import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useQuery } from "react-query";
import { useAxiosPrivate } from "../../utils/axios";
import useUserStore from "../../store/user.store";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/Dialog";
import Label from "../ui/Label";
import Input from "../ui/Input";
import Textarea from "../ui/Textarea";
import Button from "../ui/Button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/Select";
import { Badge } from "../ui/Badge";
import { CheckboxWithLabel } from "../ui/Checkbox";
import { Loader2, X } from "lucide-react";

export default function AddModal({ refetch, openAdd, setOpenAdd }) {
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [newTag, setNewTag] = useState("");
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const user = useUserStore((state) => state.user);
  const axiosPrivate = useAxiosPrivate();

  const [formData, setFormData] = useState({
    userId: user?.userId,
    companyId: "",
    companyName: "",
    industry: "",
    companyLogo: "",
    interestLevel: "",
    personalNotes: "",
    tags: [],
    favorite: false,
  });

  // Fetch companies for dropdown
  const fetchCompanies = async () => {
    try {
      const response = await axiosPrivate.get('/companies', {
        params: {
          SearchTerm: searchTerm || undefined,
          PageNumber: 1,
          PageSize: 50,
        }
      });
      
      // Handle different response structures
      let companies = [];
      if (Array.isArray(response.data)) {
        companies = response.data;
      } else if (response.data && Array.isArray(response.data.items)) {
        companies = response.data.items;
      }
      
      return companies;
    } catch (error) {
      console.error("Error fetching companies:", error);
      return [];
    }
  };

  const { data: companies = [] } = useQuery(
    ["companies-for-add", searchTerm], 
    fetchCompanies,
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    }
  );

  useEffect(() => {
    if (searchTerm) {
      setFilteredCompanies(
        companies.filter(company =>
          company.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    } else {
      setFilteredCompanies(companies);
    }
  }, [searchTerm, companies]);

  // Update userId when user data becomes available
  useEffect(() => {
    if (user?.userId && !formData.userId) {
      setFormData(prev => ({
        ...prev,
        userId: user.userId
      }));
    }
  }, [user?.userId, formData.userId]);

  const handleCompanySelect = (companyId) => {
    const selectedCompany = companies.find(c => c.companyId === companyId);
    if (selectedCompany) {
      setFormData({
        ...formData,
        companyId: selectedCompany.companyId,
        companyName: selectedCompany.name,
        industry: selectedCompany.industry?.name || "",
        companyLogo: selectedCompany.logo || "🏢",
      });
    }
  };

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
    if (!formData.companyId || !formData.interestLevel) {
      toast.error("Please select a company and interest level");
      return;
    }

    setLoading(true);
    try {
      // Prepare data for API - only send what the backend expects
      const submitData = {
        userId: user?.userId || formData.userId,
        companyId: formData.companyId,
        personalNotes: formData.personalNotes || "",
        interestLevel: formData.interestLevel,
        favorite: formData.favorite || false,
        tags: Array.isArray(formData.tags) ? formData.tags : [],
      };

      console.log("Submitting user company data:", submitData);
      await axiosPrivate.post("/user-companies", submitData);
      setOpenAdd(false);
      
      // Reset form
      setFormData({
        userId: user?.userId,
        companyId: "",
        companyName: "",
        industry: "",
        companyLogo: "",
        interestLevel: "",
        personalNotes: "",
        tags: [],
        favorite: false,
      });
      setSearchTerm("");
      
      toast.success("Company added to your list successfully");
      refetch();
    } catch (error) {
      toast.error(
        error.response?.data?.message || 
        "The company you are trying to add is already in your list" ||
        "An error occurred. Please try again"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={openAdd} onOpenChange={setOpenAdd}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Company to My List</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="company">Company *</Label>
            <Select
              value={formData.companyId}
              onValueChange={handleCompanySelect}
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
              <SelectContent>
                <div className="p-2">
                  <Input
                    placeholder="Search companies..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="mb-2"
                  />
                </div>
                {filteredCompanies.map(company => (
                  <SelectItem key={company.companyId} value={company.companyId}>
                    <div className="flex items-center gap-2">
                      <span>{company.logo || "🏢"}</span>
                      <span>{company.name}</span>
                      {company.industry?.name && (
                        <span className="text-muted-foreground">({company.industry.name})</span>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
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
            <Button type="button" variant="outline" onClick={() => setOpenAdd(false)}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading || !formData.companyId || !formData.interestLevel}
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
              Add Company
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
