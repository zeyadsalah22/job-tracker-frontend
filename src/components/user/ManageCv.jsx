import useUserStore from "../../store/user.store";
import { useQuery } from "react-query";
import { toast } from "react-toastify";
import { Trash2, Download, Eye } from "lucide-react";
import ReactLoading from "react-loading";
import { useAxiosPrivate } from "../../utils/axios";
import { useEffect, useState } from "react";

export default function ManageCv() {
  const user = useUserStore((state) => state.user);
  const axiosPrivate = useAxiosPrivate();
  const [resumeUrls, setResumeUrls] = useState({});

  const fetchCvs = async () => {
    try {
      const response = await axiosPrivate.get(`/cvs`);
      console.log("Fetched CVs:", response.data);
      return response.data || [];
    } catch (error) {
      console.error("Error fetching CVs:", error);
      return [];
    }
  };

  const { data = [], isLoading, refetch } = useQuery(["cvs"], fetchCvs);

  // Convert base64 resume data to blob URLs for viewing
  useEffect(() => {
    const urls = {};
    data.forEach(cv => {
      try {
        if (cv.resumeFile) {
          // Convert base64 to blob
          const binaryString = atob(cv.resumeFile);
          const bytes = new Uint8Array(binaryString.length);
          for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }
          const blob = new Blob([bytes], { type: 'application/pdf' });
          urls[cv.resumeId] = URL.createObjectURL(blob);
        }
      } catch (error) {
        console.error(`Error creating URL for resume ${cv.resumeId}:`, error);
      }
    });
    setResumeUrls(urls);

    // Clean up URLs on component unmount
    return () => {
      Object.values(urls).forEach(url => URL.revokeObjectURL(url));
    };
  }, [data]);

  const handleUpload = async (e) => {
    if (e.target.files.length === 0) return;

    if (data && data.length >= 5) {
      toast.error("You can only upload 5 files");
      return;
    }

    // Check if user and userId exist
    if (!user || !user.userId) {
      toast.error("User information not available");
      return;
    }

    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);
    
    try {
      console.log("Uploading CV...");
      const response = await axiosPrivate.post("/cvs", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("CV upload response:", response.data);
      refetch();
      toast.success("CV uploaded successfully");
    } catch (error) {
      console.error("Error uploading CV:", error);
      toast.error("An error occurred. Please try again");
    }
  };

  const handleDelete = async (id) => {
    try {
      console.log(`Deleting CV with ID: ${id}`);
      await axiosPrivate.delete(`/cvs/${id}`);
      refetch();
      toast.success("CV deleted successfully");
    } catch (error) {
      console.error("Error deleting CV:", error);
      toast.error("An error occurred. Please try again");
    }
  };

  return (
    <div className="flex flex-col gap-4 w-[50%] my-8">
      <div className="flex flex-col gap-4">
        <h1>Upload resume</h1>
        <label
          htmlFor="file"
          className="border border-blue-500 gap-4 border-dashed flex flex-col rounded  items-center justify-center h-20 cursor-pointer"
        >
          <input
            type="file"
            name="file"
            id="file"
            accept=".pdf,.doc,.docx"
            className="hidden"
            onChange={handleUpload}
          />
          <div className="flex flex-col items-center">
            Upload the files that you want (maximum 5 files)
          </div>
        </label>
      </div>
      <div className="flex flex-col gap-4">
        <h1 className="font-medium text-lg">Submitted CVs</h1>
        <div className="flex flex-col gap-2 text-sm">
          {isLoading ? (
            <ReactLoading
              type="bubbles"
              color="#3b82f6"
              height={25}
              width={25}
            />
          ) : !data || data.length === 0 ? (
            <p>No resumes submitted</p>
          ) : (
            data.map((cv) => (
              <div
                key={cv.resumeId}
                className="flex justify-between items-center gap-4"
              >
                <span className="text-gray-700">
                  Resume {cv.resumeId} ({new Date(cv.createdAt).toLocaleDateString()})
                </span>
                <div className="flex items-center gap-3">
                  {resumeUrls[cv.resumeId] && (
                    <>
                      <a
                        href={resumeUrls[cv.resumeId]}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-500 hover:text-blue-700 transition-colors"
                        title="View Resume"
                      >
                        <Eye size={18} />
                      </a>
                      <a
                        href={resumeUrls[cv.resumeId]}
                        download={`resume_${cv.resumeId}.pdf`}
                        className="text-green-500 hover:text-green-700 transition-colors"
                        title="Download Resume"
                      >
                        <Download size={18} />
                      </a>
                    </>
                  )}
                  <button
                    onClick={() => handleDelete(cv.resumeId)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                    title="Delete Resume"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
