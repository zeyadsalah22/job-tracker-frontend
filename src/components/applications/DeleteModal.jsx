import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/Dialog";
import { toast } from "react-toastify";
import { useState } from "react";
import ReactLoading from "react-loading";
import { useAxiosPrivate } from "../../utils/axios";

export default function DeleteDialog({
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
    <Dialog open={openDelete} onOpenChange={setOpenDelete}>
      <DialogContent className="max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Delete Application</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete this application? This action cannot be undone.
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
}
