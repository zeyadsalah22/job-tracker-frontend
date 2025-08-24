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

  const handleDelete = () => {
    setLoading(true);
    axiosPrivate
      .delete(`/companies/${id}`)
      .then(() => {
        setOpenDelete(false);
        setLoading(false);
        toast.success("Company deleted successfully");
        refetch();
      })
      .catch((error) => {
        setLoading(false);
        setError(error);
        toast.error(
          error.response?.data?.name?.map((error) => error) ||
            "An error occurred. Please try again"
        );
      });
  };

  return (
    <Dialog open={openDelete} onOpenChange={setOpenDelete}>
      <DialogContent className="max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Delete Company</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete this company? This action cannot be undone.
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