import Layout from "../components/Layout";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function StartInterview() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    company: "",
    application: "",
    position: "",
    jobDescription: "",
  });

  // Static data for demonstration
  const companies = [
    { id: 1, name: "TechCorp" },
    { id: 2, name: "DataSystems" },
    { id: 3, name: "WebSolutions" },
  ];

  const applications = [
    { id: 1, job_title: "Software Engineer", company: "TechCorp" },
    { id: 2, job_title: "Data Analyst", company: "DataSystems" },
    { id: 3, job_title: "Frontend Developer", company: "WebSolutions" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Save interview data
    console.log("Form submitted:", formData);
    navigate("/interviews/recording");
  };

  const showPositionFields = !formData.application;

  return (
    <Layout>
      <div className="bg-white rounded-lg h-full flex flex-col p-4">
        <div className="flex items-center gap-2 pb-4 border-b-2">
          <button
            onClick={() => navigate("/interviews")}
            className="py-2 px-4 hover:bg-[#f1f1f1] transition-all w-fit rounded-lg flex items-center gap-2 text-sm"
          >
            Back
          </button>
          <h1 className="text-lg font-semibold">Start New Interview</h1>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6 mt-6">
          <div className="flex flex-col gap-2">
            <label htmlFor="company" className="text-sm font-medium text-gray-700">
              Company (Optional)
            </label>
            <select
              id="company"
              name="company"
              value={formData.company}
              onChange={handleChange}
              className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Select a company</option>
              {companies.map((company) => (
                <option key={company.id} value={company.id}>
                  {company.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="application" className="text-sm font-medium text-gray-700">
              Application (Optional)
            </label>
            <select
              id="application"
              name="application"
              value={formData.application}
              onChange={handleChange}
              className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Select an application</option>
              {applications.map((app) => (
                <option key={app.id} value={app.id}>
                  {app.job_title} - {app.company}
                </option>
              ))}
            </select>
          </div>

          {showPositionFields && (
            <>
              <div className="flex flex-col gap-2">
                <label htmlFor="position" className="text-sm font-medium text-gray-700">
                  Position *
                </label>
                <input
                  type="text"
                  id="position"
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  required
                  className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter position"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="jobDescription" className="text-sm font-medium text-gray-700">
                  Job Description *
                </label>
                <textarea
                  id="jobDescription"
                  name="jobDescription"
                  value={formData.jobDescription}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter job description"
                />
              </div>
            </>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Start Interview
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
} 