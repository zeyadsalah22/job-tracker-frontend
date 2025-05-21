import Modal from "../Modal";
import { toast } from "react-toastify";
import { useState } from "react";
import ReactLoading from "react-loading";
import { useAxiosPrivate } from "../../utils/axios";

export default function DeleteModal({
  id,
  openDelete,
  setOpenDelete,
  refetch,
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const axiosPrivate = useAxiosPrivate();

  const handleDelete = async () => {
    try {
      setLoading(true);
      console.log(`Deleting application with id: ${id}`);
      
      await axiosPrivate.delete(`/applications/${id}`);
      
      setOpenDelete(false);
      setLoading(false);
      toast.success("Application deleted successfully");
      refetch();
    } catch (error) {
      console.error("Error deleting application:", error);
      setLoading(false);
      setError(error);
      
      let errorMessage = "An error occurred. Please try again";
      if (error.response?.data) {
        // Try to extract error message from different possible formats
        if (typeof error.response.data === 'string') {
          errorMessage = error.response.data;
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.data.error) {
          errorMessage = error.response.data.error;
        } else if (error.response.data.title) {
          errorMessage = error.response.data.title;
        } else if (error.response.data.errors) {
          errorMessage = Object.values(error.response.data.errors).flat().join(", ");
        } else if (error.response.data.name && Array.isArray(error.response.data.name)) {
          errorMessage = error.response.data.name.join(", ");
        }
      }
      
      toast.error(errorMessage);
    }
  };

  return (
    <Modal open={openDelete} setOpen={setOpenDelete} width="600px">
      <div className="flex flex-col gap-4">
        <h1 className="font-semibold text-lg">Delete Application</h1>
        <div className="flex flex-col gap-3">
          <p>Are you sure you want to delete this application?</p>
          <div className="flex gap-2 justify-end">
            {loading ? (
              <button
                disabled
                className="rounded-md cursor-not-allowed flex items-center justify-center bg-red-500 px-2 py-1 text-white transition h-10"
              >
                <ReactLoading
                  type="bubbles"
                  color="#ffffff"
                  height={25}
                  width={25}
                />
              </button>
            ) : (
              <button
                onClick={handleDelete}
                type="submit"
                className="rounded-md bg-red-500 px-2 py-1 text-white transition hover:bg-red-600 h-10"
              >
                Delete
              </button>
            )}
            <button
              onClick={() => setOpenDelete(false)}
              className="bg-gray-200 text-gray-800 px-2 py-1 text-sm rounded-md hover:bg-gray-300 transition-all h-10"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
