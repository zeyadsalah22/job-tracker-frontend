import { useState } from "react";
import { toast } from "react-toastify";
import ReactLoading from "react-loading";
import { useAxiosPrivate } from "../../utils/axios";

const DeleteModal = ({ id, openDelete, setOpenDelete, refetch }) => {
  const [loading, setLoading] = useState(false);
  const axiosPrivate = useAxiosPrivate();

  const handleDelete = async () => {
    if (!id) {
      toast.error("No test selected for deletion");
      return;
    }

    setLoading(true);
    try {
      console.log("Deleting resume test with ID:", id);
      await axiosPrivate.delete(`/resumetest/${id}`);
      console.log("Resume test deleted successfully");
      
      setOpenDelete(false);
      setLoading(false);
      toast.success("Resume test deleted successfully");
      
      // Refresh the main table data
      if (refetch) {
        refetch();
      }
    } catch (error) {
      console.error("Error deleting resume test:", error);
      setLoading(false);
      
      let errorMessage = "An error occurred while deleting the test. Please try again.";
      if (error.response?.data) {
        if (typeof error.response.data === 'string') {
          errorMessage = error.response.data;
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.data.error) {
          errorMessage = error.response.data.error;
        } else if (error.response.data.title) {
          errorMessage = error.response.data.title;
        }
      }
      
      toast.error(errorMessage);
    }
  };

  if (!openDelete) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h2 className="text-xl font-semibold mb-4">Delete Resume Test</h2>
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete this resume test? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-4">
          <button
            onClick={() => setOpenDelete(false)}
            className="px-4 py-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-all"
            disabled={loading}
          >
            Cancel
          </button>
          {loading ? (
            <button
              disabled
              className="px-4 py-2 bg-red-600 text-white rounded-lg cursor-not-allowed flex items-center gap-2"
            >
              <ReactLoading type="bubbles" color="#ffffff" height={18} width={18} />
              Deleting...
            </button>
          ) : (
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all"
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeleteModal; 