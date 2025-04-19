const DeleteModal = ({ id, openDelete, setOpenDelete, refetch }) => {
  if (!openDelete) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 className="text-xl font-semibold mb-4">Delete Interview</h2>
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete this interview? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-4">
          <button
            onClick={() => setOpenDelete(false)}
            className="px-4 py-2 text-gray-600 hover:text-gray-900"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              // TODO: Implement delete functionality
              console.log("Deleting interview:", id);
              setOpenDelete(false);
              refetch();
            }}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal; 