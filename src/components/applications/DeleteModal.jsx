import Modal from "../Modal";
import axios from "axios";

export default function DeleteModal({ id, openDelete, setOpenDelete }) {
  const handleDelete = () => {
    axios
      .delete(`http://localhost:3001/applications/${id}`)
      .then((res) => {
        console.log(res);
        setOpenDelete(false);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <Modal open={openDelete} setOpen={setOpenDelete} width="600px">
      <div className="flex flex-col gap-4">
        <h1 className="font-semibold text-lg">Delete Application</h1>
        <div className="flex flex-col gap-3">
          <p>Are you sure you want to delete this application?</p>
          <div className="flex gap-2 justify-end">
            <button
              onClick={handleDelete}
              className="bg-red-500 text-white px-2 py-1 text-sm rounded-md hover:bg-red-600 transition-all"
            >
              Delete
            </button>
            <button
              onClick={() => setOpenDelete(false)}
              className="bg-gray-200 text-gray-800 px-2 py-1 text-sm rounded-md hover:bg-gray-300 transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
