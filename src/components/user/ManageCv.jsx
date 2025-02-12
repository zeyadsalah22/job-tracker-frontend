import useUserStore from "../../store/user.store";
import { useQuery } from "react-query";
import { toast } from "react-toastify";
import { Trash2 } from "lucide-react";
import ReactLoading from "react-loading";
import { useAxiosPrivate } from "../../utils/axios";

export default function ManageCv() {
  const user = useUserStore((state) => state.user);
  const axiosPrivate = useAxiosPrivate();

  const fetchCvs = async () => {
    const { data } = await axiosPrivate.get(`/cvs`);
    return data.results;
  };

  const { data, isLoading, refetch } = useQuery(["cvs"], fetchCvs);

  const handleUpload = async (e) => {
    if (e.target.files.length === 0) return;

    if (data.length === 5) {
      toast.error("You can only upload 5 files");
      return;
    }
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("cv", file);
    formData.append("user_id", user.id);
    await axiosPrivate
      .post("/cvs", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then(() => {
        refetch();
        toast.success("CV uploaded successfully");
      })
      .catch(() => {
        toast.error("An error occurred. Please try again");
      });
  };

  const handleDelete = async (id) => {
    await axiosPrivate
      .delete(`/cvs/${id}`)
      .then(() => {
        refetch();
        toast.success("CV deleted successfully");
      })
      .catch(() => {
        toast.error("An error occurred. Please try again");
      });
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
            multiple
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
          ) : data.length === 0 ? (
            <p>No resumes submitted</p>
          ) : (
            data.map((cv) => (
              <div
                key={cv.id}
                className="flex justify-between items-center gap-4"
              >
                <a
                  key={cv.id}
                  href={cv.cv}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-500 underline"
                >
                  {cv.cv.split("/").pop()}
                </a>
                <button
                  onClick={() => handleDelete(cv.id)}
                  className="text-red-500"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
