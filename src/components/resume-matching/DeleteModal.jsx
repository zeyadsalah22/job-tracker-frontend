import { useState } from "react";
import { toast } from "react-toastify";
import ReactLoading from "react-loading";
import { useAxiosPrivate } from "../../utils/axios";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/Dialog";

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

  return (
    <Dialog open={openDelete} onOpenChange={setOpenDelete}>
      <DialogContent className="max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Delete Resume Test</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete this resume test? This action cannot be undone.
          </p>
          <div className="flex gap-3 justify-end">
            <button
              onClick={() => setOpenDelete(false)}
              disabled={loading}
              className="px-4 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            {loading ? (
              <button
                disabled
                className="px-4 py-2 rounded bg-red-500 text-white cursor-not-allowed flex items-center gap-2"
              >
                <ReactLoading type="spin" color="#fff" height={16} width={16} />
                Deleting...
              </button>
            ) : (
              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteModal; 