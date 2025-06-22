import Modal from "../Modal";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { applicationSchema } from "../../schemas/Schemas";
import FormInput from "../FormInput";
import ReactLoading from "react-loading";
import { useQuery } from "react-query";
import useUserStore from "../../store/user.store";
import AddModalCompanies from "../user-companies/AddModal";
import Dropdown from "../Dropdown";
import { useAxiosPrivate } from "../../utils/axios";
import { useNavigate } from "react-router-dom";

export default function AddModal({ open, setOpen }) {
  const axiosPrivate = useAxiosPrivate();
  const user = useUserStore((state) => state.user);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    userId: "",
    companyId: "",
    applicationId: "",
    position: "",
    jobDescription: "",
  });

  const [companySearch, setCompanySearch] = useState("");
  const [addCompany, setAddCompany] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({ ...prev, userId: user.userId }));
    }
  }, [user]);

  const fetchCompanies = async () => {
    try {
      const params = {
        SearchTerm: companySearch || undefined,
        PageSize: 100,
      };
      const res = await axiosPrivate.get("/user-companies", { params });
      const items = res.data.items || [];
      return {
        results: Array.isArray(items)
          ? items.map((company) => ({
              id: company.companyId,
              name: company.companyName || company.name,
              value: company.companyId,
              location: company.companyLocation || company.location,
            }))
          : [],
      };
    } catch (error) {
      console.error("Error fetching user companies:", error);
      return { results: [] };
    }
  };

  const {
    data: companies,
    isLoading: loadingCompanies,
    refetch: refetchCompanies,
  } = useQuery(["user-companies", companySearch], fetchCompanies);

  const { data: applicationsRaw = [], isLoading: loadingApplications } = useQuery(
    "applications",
    async () => {
      const res = await axiosPrivate.get(`/applications`);
      const apps = res.data ? res.data.items : [];
      return Array.isArray(apps)
        ? apps.filter((app) => app.status !== "Rejected")
        : [];
    }
  );

  const applications = Array.isArray(applicationsRaw) ? applicationsRaw : [];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const setCompanyId = (id) => {
    if (id === "add-company") {
      setAddCompany(true);
    } else {
      setFormData((prev) => ({ ...prev, companyId: id }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosPrivate.post("/mockinterview", {
        ...formData,
        applicationId: formData.applicationId ? parseInt(formData.applicationId) : null,
        companyId: formData.companyId ? parseInt(formData.companyId) : null,
        userId: formData.userId ? parseInt(formData.userId) : 0,
        position: formData.position || null,
        jobDescription: formData.jobDescription || null,
      });
      const interviewId = res.data.interviewId;
      setOpen(false);
      navigate(`/interviews/recording/${interviewId}`);
    } catch (error) {
      console.error("Failed to create interview:", error);
      alert("Failed to start interview. Please try again.");
    }
  };

  return (
    <Modal open={open} setOpen={setOpen} title="Start Interview" width="600px">
      <div className="z-[100]">
        {addCompany && (
          <AddModalCompanies
            openAdd={addCompany}
            setOpenAdd={setAddCompany}
            refetch={refetchCompanies}
          />
        )}
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label htmlFor="applicationId" className="block text-sm font-medium">
            Application
          </label>
          <select
            name="applicationId"
            value={formData.applicationId}
            onChange={handleChange}
            className="w-full border"
          >
            <option value="">No Application Selected</option>
            {(Array.isArray(applications) ? applications : []).map((app) => (
              <option key={app.applicationId} value={app.applicationId}>
                {app.title || app.jobTitle || "Untitled Application"} @ {app.companyName}
              </option>
            ))}
          </select>
        </div>

        {!formData.applicationId && (
          <>
            <div className="flex flex-col gap-2 w-full">
              <p className="text-sm text-gray-600">
                Choose Company<span className="text-red-500">*</span>
              </p>
              <Dropdown
                add={{ name: "Add Company", value: "add-company" }}
                id={formData.companyId}
                options={(Array.isArray(companies?.results) ? companies.results : [])}
                query={companySearch}
                setQuery={setCompanySearch}
                setValue={setCompanyId}
                isLoading={loadingCompanies}
                error={null}
                touched={true}
              />
            </div>

            <FormInput
              name="position"
              type="text"
              placeHolder="Enter position"
              value={formData.position}
              onChange={handleChange}
              required
              error={null}
              touched={true}
            />

            <div>
              <label htmlFor="jobDescription" className="block text-sm font-medium">
                Job Description
              </label>
              <textarea
                name="jobDescription"
                value={formData.jobDescription}
                onChange={handleChange}
                required
                rows={3}
                className="w-full border p-2 rounded-md"
                placeholder="Enter job description"
              />
            </div>
          </>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90"
          >
            Start Interview
          </button>
        </div>
      </form>
    </Modal>
  );
}
