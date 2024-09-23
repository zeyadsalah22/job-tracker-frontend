import Modal from "../Modal";
import axios from "axios";
import { useQuery } from "react-query";

export default function EditModal({ id, openEdit, setOpenEdit }) {
  const fetchApplication = async () => {
    const { data } = await axios.get(
      `http://localhost:3000/applications/${id}`,
      {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      }
    );
    return data;
  };

  const {
    data: application,
    isLoading,
    error,
  } = useQuery(["application", { id }], fetchApplication, {
    enabled: !!id,
  });

  return (
    <Modal open={openEdit} setOpen={setOpenEdit} width="600px">
      <h1>Edit Application</h1>
    </Modal>
  );
}
