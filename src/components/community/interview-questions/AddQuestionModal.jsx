import { useState, useEffect } from "react";
import { useAxiosPrivate } from "../../../utils/axios";
import { toast } from "react-toastify";
import { Dialog } from "../../ui/Dialog";
import Button from "../../ui/Button";
import Textarea from "../../ui/Textarea";
import Label from "../../ui/Label";
import { X, Plus } from "lucide-react";
import SearchableSelect from "../../ui/SearchableSelect";

const AddQuestionModal = ({ isOpen, onClose, onQuestionCreated, companies }) => {
  const axiosPrivate = useAxiosPrivate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    questionText: "",
    companyId: null,
    customCompanyName: "",
    companyLogoUrl: "",
    roleType: null,
    customRoleType: "",
    questionType: null,
    customQuestionType: "",
    difficulty: "0",
  });

  const roleTypes = [
    { value: "0", label: "Software Engineer" },
    { value: "1", label: "Product Manager" },
    { value: "2", label: "Data Scientist" },
    { value: "3", label: "Data Analyst" },
    { value: "4", label: "UX/UI Designer" },
    { value: "5", label: "DevOps Engineer" },
    { value: "6", label: "QA Engineer" },
    { value: "7", label: "Project Manager" },
    { value: "8", label: "Business Analyst" },
    { value: "9", label: "Backend Developer" },
    { value: "10", label: "Frontend Developer" },
    { value: "11", label: "Full Stack Developer" },
    { value: "12", label: "Mobile Developer" },
    { value: "13", label: "Security Engineer" },
    { value: "14", label: "Cloud Architect" },
  ];

  const questionTypes = [
    { value: "0", label: "Technical" },
    { value: "1", label: "Behavioral" },
    { value: "2", label: "Case Study" },
    { value: "3", label: "System Design" },
    { value: "4", label: "Coding" },
    { value: "5", label: "Problem Solving" },
    { value: "6", label: "Leadership" },
    { value: "7", label: "Situational" },
  ];

  const difficulties = [
    { value: "0", label: "Easy" },
    { value: "1", label: "Medium" },
    { value: "2", label: "Hard" },
  ];

  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

  const resetForm = () => {
    setFormData({
      questionText: "",
      companyId: null,
      customCompanyName: "",
      companyLogoUrl: "",
      roleType: null,
      customRoleType: "",
      questionType: null,
      customQuestionType: "",
      difficulty: "0",
    });
    setErrors({});
  };

  const getCompanyDisplayName = (company) => {
    if (!company) return "";
    return (
      company.name ||
      company.companyName ||
      company.displayName ||
      company.title ||
      ""
    ).trim();
  };

  const safeCompanies = Array.isArray(companies) ? companies : [];
  const selectableCompanies = [{ value: null, label: "No Company" }];

  safeCompanies.forEach((company) => {
    if (!company || company.companyId === undefined || company.companyId === null) {
      return;
    }
    if (selectableCompanies.some((option) => option.value === company.companyId)) {
      return;
    }
    selectableCompanies.push({
      value: company.companyId,
      label: getCompanyDisplayName(company) || "Unnamed Company",
    });
  });

  const isCustomSelection = (selection) =>
    selection &&
    typeof selection === "object" &&
    selection.__isCustom === true &&
    typeof selection.label === "string";

  const normalizeCompanySlug = (name) =>
    name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "");

  const buildCompanyLogoUrl = (name) => {
    const slug = normalizeCompanySlug(name);
    if (!slug) return "";
    return `https://logo.clearbit.com/${slug}.com`;
  };

  const hasRoleTypeSelection = formData.roleType !== null && formData.roleType !== "";
  const hasQuestionTypeSelection = formData.questionType !== null && formData.questionType !== "";
  const canSubmit =
    Boolean(formData.questionText.trim()) &&
    (hasRoleTypeSelection || Boolean(formData.customRoleType.trim())) &&
    (hasQuestionTypeSelection || Boolean(formData.customQuestionType.trim()));

  const handleCompanySelection = (selection) => {
    if (selection === null || selection === undefined) {
      setFormData((prev) => ({
        ...prev,
        companyId: null,
        customCompanyName: "",
        companyLogoUrl: "",
      }));
      return;
    }

    if (isCustomSelection(selection)) {
      const customName = selection.label.trim();
      if (!customName) {
        setFormData((prev) => ({
          ...prev,
          customCompanyName: "",
          companyLogoUrl: "",
        }));
        return;
      }

      setFormData((prev) => ({
        ...prev,
        companyId: null,
        customCompanyName: customName,
        companyLogoUrl: buildCompanyLogoUrl(customName),
      }));
      return;
    }

    const numericCompanyId = Number(selection);
    setFormData((prev) => ({
      ...prev,
      companyId: Number.isNaN(numericCompanyId) ? null : numericCompanyId,
      customCompanyName: "",
      companyLogoUrl: "",
    }));
  };

  const handleRoleTypeSelection = (selection) => {
    if (selection === null || selection === undefined) {
      setFormData((prev) => ({ ...prev, roleType: null, customRoleType: "" }));
      return;
    }

    if (isCustomSelection(selection)) {
      setFormData((prev) => ({
        ...prev,
        roleType: null,
        customRoleType: selection.label.trim(),
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      roleType: selection,
      customRoleType: "",
    }));
  };

  const handleQuestionTypeSelection = (selection) => {
    if (selection === null || selection === undefined) {
      setFormData((prev) => ({ ...prev, questionType: null, customQuestionType: "" }));
      return;
    }

    if (isCustomSelection(selection)) {
      setFormData((prev) => ({
        ...prev,
        questionType: null,
        customQuestionType: selection.label.trim(),
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      questionType: selection,
      customQuestionType: "",
    }));
  };

  const companyFieldValue = formData.customCompanyName
    ? { __isCustom: true, label: formData.customCompanyName }
    : formData.companyId;

  const roleFieldValue = formData.customRoleType
    ? { __isCustom: true, label: formData.customRoleType }
    : formData.roleType;

  const questionFieldValue = formData.customQuestionType
    ? { __isCustom: true, label: formData.customQuestionType }
    : formData.questionType;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedQuestionText = formData.questionText.trim();
    const trimmedCustomCompany = formData.customCompanyName.trim();
    const trimmedCustomRole = formData.customRoleType.trim();
    const trimmedCustomQuestion = formData.customQuestionType.trim();

    const validationErrors = {};

    if (!trimmedQuestionText) {
      validationErrors.questionText = "Please enter a question";
    } else if (trimmedQuestionText.length > 3000) {
      validationErrors.questionText = "Question text cannot exceed 3000 characters";
    }

    if (!hasRoleTypeSelection && !trimmedCustomRole) {
      validationErrors.roleType = "Select a role type or enter your own";
    }

    if (!hasQuestionTypeSelection && !trimmedCustomQuestion) {
      validationErrors.questionType = "Select a question type or enter your own";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setLoading(true);
    try {
      const parsedDifficulty = parseInt(formData.difficulty, 10);
      const normalizedDifficulty = Number.isNaN(parsedDifficulty) ? 0 : parsedDifficulty;
      const payload = {
        questionText: trimmedQuestionText,
        difficulty: normalizedDifficulty,
      };

      if (trimmedCustomCompany) {
        payload.companyName = trimmedCustomCompany;
        payload.companyLogo = formData.companyLogoUrl || buildCompanyLogoUrl(trimmedCustomCompany);
      } else if (formData.companyId !== null && formData.companyId !== undefined) {
        const numericCompanyId = Number(formData.companyId);
        if (!Number.isNaN(numericCompanyId)) {
          payload.companyId = numericCompanyId;
        }
      }

      if (trimmedCustomRole) {
        payload.roleType = 99;
        payload.addedRoleType = trimmedCustomRole;
      } else if (hasRoleTypeSelection) {
        const parsedRole = parseInt(formData.roleType, 10);
        if (!Number.isNaN(parsedRole)) {
          payload.roleType = parsedRole;
        }
      }

      if (trimmedCustomQuestion) {
        payload.questionType = 99;
        payload.addedQuestionType = trimmedCustomQuestion;
      } else if (hasQuestionTypeSelection) {
        const parsedQuestionType = parseInt(formData.questionType, 10);
        if (!Number.isNaN(parsedQuestionType)) {
          payload.questionType = parsedQuestionType;
        }
      }

      await axiosPrivate.post("/community/interview-questions", payload);
      toast.success("Interview question submitted successfully!");
      onQuestionCreated();
    } catch (error) {
      console.error("Error creating question:", error);
      toast.error(error.response?.data?.message || "Failed to submit question");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-2xl font-bold text-gray-900">Add Interview Question</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto max-h-[calc(90vh-140px)]">
            {/* Question Text */}
            <div>
              <Label htmlFor="questionText" className="required">
                Question Text
              </Label>
              <Textarea
                id="questionText"
                value={formData.questionText}
                onChange={(e) => setFormData({ ...formData, questionText: e.target.value })}
                placeholder="Describe the interview question you were asked..."
                rows={5}
                maxLength={3000}
                required
                className="w-full"
              />
              <div className="text-sm text-gray-500 text-right mt-1">
                {formData.questionText.length} / 3000
              </div>
              {errors.questionText && (
                <p className="text-sm text-destructive mt-1">{errors.questionText}</p>
              )}
            </div>

            {/* Company (Searchable with custom entry) */}
            <div className="space-y-2">
              <SearchableSelect
                options={selectableCompanies}
                value={companyFieldValue}
                onChange={handleCompanySelection}
                placeholder="Select or type a company (Optional)"
                label="Company (Optional)"
                showSearch={true}
                allowCustomValue={true}
              />
              <p className="text-xs text-gray-500">
                Start typing a company name to store it with this question (logo powered by Clearbit).
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Role Type */}
              <div className="space-y-2">
                <SearchableSelect
                  options={roleTypes}
                  value={roleFieldValue}
                  onChange={handleRoleTypeSelection}
                  placeholder="Select or type a role"
                  label="Role Type"
                  required={true}
                  showSearch={true}
                  allowCustomValue={true}
                />
                <p className="text-xs text-gray-500">
                  Don&apos;t see your role? Type it and we&apos;ll add it instantly.
                </p>
                {errors.roleType && (
                  <p className="text-sm text-destructive">{errors.roleType}</p>
                )}
              </div>

              {/* Question Type */}
              <div className="space-y-2">
                <SearchableSelect
                  options={questionTypes}
                  value={questionFieldValue}
                  onChange={handleQuestionTypeSelection}
                  placeholder="Select or type a question type"
                  label="Question Type"
                  required={true}
                  showSearch={true}
                  allowCustomValue={true}
                />
                <p className="text-xs text-gray-500">
                  Describe unique question formats by typing your own label.
                </p>
                {errors.questionType && (
                  <p className="text-sm text-destructive">{errors.questionType}</p>
                )}
              </div>

              {/* Difficulty */}
              <SearchableSelect
                options={difficulties}
                value={formData.difficulty}
                onChange={(value) => setFormData({ ...formData, difficulty: value || "0" })}
                placeholder="Select Difficulty"
                label="Difficulty"
                required={true}
                showSearch={false}
              />
            </div>
          </form>

          {/* Footer */}
          <div className="flex justify-end gap-3 px-6 py-4 border-t bg-gray-50">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              onClick={handleSubmit}
              disabled={loading || !canSubmit}
              className="flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  Submit Question
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default AddQuestionModal;

