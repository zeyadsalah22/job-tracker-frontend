import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, X } from "lucide-react";

export default function RunTestModal({ openRunTest, setOpenRunTest }) {
  const navigate = useNavigate();
  const [selectedResume, setSelectedResume] = useState("");
  const [jobDescription, setJobDescription] = useState("");

  // Dummy data for resumes - this should come from the user's profile in the future
  const resumes = [
    { id: 1, name: "Software Engineer Resume" },
    { id: 2, name: "Frontend Developer Resume" },
    { id: 3, name: "Full Stack Developer Resume" },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement actual API call to run the test
    // For now, we'll just navigate to a dummy test result
    navigate("/resume-matching/1");
    setOpenRunTest(false);
  };

  if (!openRunTest) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-4/5 max-w-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Run New Resume Test</h2>
          <button
            onClick={() => setOpenRunTest(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Resume
            </label>
            <select
              value={selectedResume}
              onChange={(e) => setSelectedResume(e.target.value)}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              required
            >
              <option value="">Select a resume</option>
              {resumes.map((resume) => (
                <option key={resume.id} value={resume.id}>
                  {resume.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Job Description
            </label>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary h-32"
              placeholder="Paste the job description here..."
              required
            />
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => setOpenRunTest(false)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 flex items-center gap-2"
            >
              <FileText size={18} />
              Run Test
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 