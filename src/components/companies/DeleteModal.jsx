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
    <Modal open={openDelete} setOpen={setOpenDelete} width="400px">
      <div className="flex flex-col gap-4">
        <h1 className="font-semibold text-lg">Delete Company</h1>
        <p className="text-gray-500">
          Are you sure you want to delete this company? This action cannot be
          undone.
        </p>
        <div className="flex gap-4">
          <button
            onClick={() => setOpenDelete(false)}
            className="flex-1 rounded border border-gray-300 px-4 py-2 text-gray-500 transition hover:bg-gray-50"
          >
            Cancel
          </button>
          {loading ? (
            <button
              disabled
              className="flex-1 rounded cursor-not-allowed flex items-center justify-center bg-red-500 px-4 py-2 text-white transition"
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
              className="flex-1 rounded bg-red-500 px-4 py-2 text-white transition hover:bg-red-600"
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
} 