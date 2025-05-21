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
    setLoading(true);
    try {
      await axiosPrivate.delete(`/user-companies/${id}`);
      setOpenDelete(false);
      setLoading(false);
      toast.success("Company removed from your list successfully");
      refetch();
    } catch (error) {
      setLoading(false);
      setError(error);
      toast.error(
        error.response?.data?.message || 
        "An error occurred. Please try again"
      );
    }
  };

  return (
    <Modal open={openDelete} setOpen={setOpenDelete} width="600px">
      <div className="flex flex-col gap-4">
        <h1 className="font-semibold text-lg">Remove Company from My List</h1>
        <div className="flex flex-col gap-3">
          <p>Are you sure you want to remove this company from your list? This won't delete the company itself, just your association with it.</p>
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
                Remove
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
