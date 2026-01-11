import React, { useState } from "react";
import { useQuery } from "react-query";
import { useAxiosPrivate } from "../../utils/axios";
import { toast } from "react-toastify";
import { X, Loader2 } from "lucide-react";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Label from "../ui/Label";
import Textarea from "../ui/Textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/Select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/Dialog";

export default function CompanyRequestModal({ 
  isOpen, 
  onClose, 
  isAdminMode = false, 
  onSuccess 
}) {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const axiosPrivate = useAxiosPrivate();

  const [formData, setFormData] = useState({
    name: "",
    location: "",
    industryId: "",
    linkedinLink: "",
    careersLink: "",
    logoUrl: "",
    description: "",
    companySize: "",
  });

  // Fetch industries for dropdown
  const fetchIndustries = async () => {
    try {
      const response = await axiosPrivate.get('/industries/all');
      return response.data;
    } catch (error) {
      console.error("Error fetching industries:", error);
      return [];
    }
  };

  const { data: industries = [] } = useQuery(['industries'], fetchIndustries);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Company name is required";
    } else if (formData.name.length > 100) {
      newErrors.name = "Company name must not exceed 100 characters";
    }

    if (formData.location && formData.location.length > 100) {
      newErrors.location = "Location must not exceed 100 characters";
    }

    if (formData.linkedinLink && !isValidUrl(formData.linkedinLink)) {
      newErrors.linkedinLink = "Please enter a valid URL";
    } else if (formData.linkedinLink && formData.linkedinLink.length > 255) {
      newErrors.linkedinLink = "LinkedIn link must not exceed 255 characters";
    }

    if (formData.careersLink && !isValidUrl(formData.careersLink)) {
      newErrors.careersLink = "Please enter a valid URL";
    } else if (formData.careersLink && formData.careersLink.length > 255) {
      newErrors.careersLink = "Careers link must not exceed 255 characters";
    }

    if (formData.logoUrl && !isValidUrl(formData.logoUrl)) {
      newErrors.logoUrl = "Please enter a valid URL";
    } else if (formData.logoUrl && formData.logoUrl.length > 255) {
      newErrors.logoUrl = "Logo URL must not exceed 255 characters";
    }

    if (formData.description && formData.description.length > 2000) {
      newErrors.description = "Description must not exceed 2000 characters";
    }

    if (isAdminMode && !formData.industryId) {
      newErrors.industryId = "Industry is required";
    }

    if (isAdminMode && !formData.companySize) {
      newErrors.companySize = "Company size is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      let payload;
      
      if (isAdminMode) {
        // Admin adding company to /companies endpoint
        payload = {
          name: formData.name,
          location: formData.location || null,
          industryId: formData.industryId ? parseInt(formData.industryId) : null,
          linkedinLink: formData.linkedinLink || null,
          careersLink: formData.careersLink || null,
          logoUrl: formData.logoUrl || null,
          description: formData.description || null,
          companySize: formData.companySize,
        };
      } else {
        // User requesting company to /company-requests endpoint
        payload = {
          companyName: formData.name,
          location: formData.location || null,
          industryId: formData.industryId ? parseInt(formData.industryId) : null,
          linkedinLink: formData.linkedinLink || null,
          careersLink: formData.careersLink || null,
          description: formData.description || null,
        };
      }

      // Remove null values for cleaner payload
      const cleanedPayload = Object.fromEntries(
        Object.entries(payload).filter(([_, value]) => value !== null && value !== "")
      );

      // Use different endpoints based on mode
      const endpoint = isAdminMode ? '/companies' : '/company-requests';
      const response = await axiosPrivate.post(endpoint, cleanedPayload);

      const successMessage = isAdminMode 
        ? "Company added successfully"
        : "Your company request has been submitted successfully. You'll be notified once it's reviewed.";
      
      toast.success(successMessage);

      // Reset form
      setFormData({
        name: "",
        location: "",
        industryId: "",
        linkedinLink: "",
        careersLink: "",
        logoUrl: "",
        description: "",
        companySize: "",
      });
      setErrors({});

      // Call success callback with new company data (for admin mode)
      if (onSuccess && isAdminMode && response.data) {
        onSuccess(response.data);
      } else if (onSuccess) {
        onSuccess();
      }

      onClose();

    } catch (error) {
      console.error("Error submitting company:", error);
      
      let errorMessage = "An error occurred. Please try again";
      if (error.response?.data) {
        if (typeof error.response.data === 'string') {
          errorMessage = error.response.data;
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.data.errors) {
          errorMessage = Object.values(error.response.data.errors).flat().join(", ");
        } else if (error.response.data.title) {
          errorMessage = error.response.data.title;
        }
      }
      
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: "",
      location: "",
      industryId: "",
      linkedinLink: "",
      careersLink: "",
      logoUrl: "",
      description: "",
      companySize: "",
    });
    setErrors({});
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            {isAdminMode ? "Add New Company" : "Request New Company"}
            <button
              onClick={handleClose}
              className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </button>
          </DialogTitle>
          {!isAdminMode && (
            <DialogDescription>
              Can't find your company? Request to add it to our database. We'll review your request and notify you once it's approved.
            </DialogDescription>
          )}
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Company Name */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="name">Company Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g. Google"
                maxLength={100}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name}</p>
              )}
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                placeholder="e.g. Mountain View, CA"
                maxLength={100}
              />
              {errors.location && (
                <p className="text-sm text-destructive">{errors.location}</p>
              )}
            </div>

            {/* Industry */}
            <div className="space-y-2">
              <Label htmlFor="industryId">Industry {isAdminMode && "*"}</Label>
              <Select
                value={formData.industryId}
                onValueChange={(value) => setFormData(prev => ({ ...prev, industryId: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select industry">
                    {formData.industryId && industries.find(i => i.industryId.toString() === formData.industryId)?.name}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {industries.map((industry) => (
                    <SelectItem key={industry.industryId} value={industry.industryId.toString()}>
                      {industry.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.industryId && (
                <p className="text-sm text-destructive">{errors.industryId}</p>
              )}
            </div>

            {/* Company Size (Admin only) */}
            {isAdminMode && (
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="companySize">Company Size *</Label>
                <Select
                  value={formData.companySize}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, companySize: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select company size">
                      {formData.companySize || "Select company size"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Small">Small (1-50 employees)</SelectItem>
                    <SelectItem value="Medium">Medium (51-500 employees)</SelectItem>
                    <SelectItem value="Large">Large (500+ employees)</SelectItem>
                  </SelectContent>
                </Select>
                {errors.companySize && (
                  <p className="text-sm text-destructive">{errors.companySize}</p>
                )}
              </div>
            )}

            {/* LinkedIn Link */}
            <div className="space-y-2">
              <Label htmlFor="linkedinLink">LinkedIn Link</Label>
              <Input
                id="linkedinLink"
                value={formData.linkedinLink}
                onChange={(e) => setFormData(prev => ({ ...prev, linkedinLink: e.target.value }))}
                placeholder="https://www.linkedin.com/company/..."
                maxLength={255}
              />
              {errors.linkedinLink && (
                <p className="text-sm text-destructive">{errors.linkedinLink}</p>
              )}
            </div>

            {/* Careers Link */}
            <div className="space-y-2">
              <Label htmlFor="careersLink">Careers Link</Label>
              <Input
                id="careersLink"
                value={formData.careersLink}
                onChange={(e) => setFormData(prev => ({ ...prev, careersLink: e.target.value }))}
                placeholder="https://company.com/careers"
                maxLength={255}
              />
              {errors.careersLink && (
                <p className="text-sm text-destructive">{errors.careersLink}</p>
              )}
            </div>

            {/* Logo URL */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="logoUrl">Logo URL</Label>
              <Input
                id="logoUrl"
                value={formData.logoUrl}
                onChange={(e) => setFormData(prev => ({ ...prev, logoUrl: e.target.value }))}
                placeholder="https://company.com/logo.png"
                maxLength={255}
              />
              {errors.logoUrl && (
                <p className="text-sm text-destructive">{errors.logoUrl}</p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Brief description of the company..."
                maxLength={2000}
                rows={4}
              />
              <p className="text-xs text-muted-foreground">
                {formData.description.length}/2000 characters
              </p>
              {errors.description && (
                <p className="text-sm text-destructive">{errors.description}</p>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="min-w-[100px]"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Submitting...</span>
                </div>
              ) : (
                isAdminMode ? "Add Company" : "Submit Request"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

