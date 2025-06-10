import Modal from "../Modal";
import { toast } from "react-toastify";
import React, { useState } from "react";
import { useAxiosPrivate } from "../../utils/axios";
import ReactLoading from "react-loading";

export default function DeleteModal({ id, openDelete, setOpenDelete, refetch }) {
  const [loading, setLoading] = useState(false);
  const axiosPrivate = useAxiosPrivate();

  const handleDelete = async () => {
    if (!id) {
      toast.error("No interview selected for deletion.");
      return;
    }

    setLoading(true);
    try {
      await axiosPrivate.delete(`/mockinterview/${id}`);
      toast.success("Interview deleted successfully.");
      setOpenDelete(false);
      refetch(); // Refresh the interview list
    } catch (error) {
      console.error("Failed to delete interview:", error);
      toast.error("Failed to delete interview. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={openDelete} setOpen={setOpenDelete} width="400px">
      <div className="flex flex-col gap-4 p-4">
        <h1 className="text-lg font-semibold text-gray-800">Delete Interview</h1>
        <p className="text-gray-600">Are you sure you want to delete this interview?</p>
        <div className="flex justify-end gap-4 mt-4">
          <button
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            onClick={() => setOpenDelete(false)}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 flex items-center gap-2"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? (
              <ReactLoading type="spin" color="#fff" height={20} width={20} />
            ) : (
              "Delete"
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
}
