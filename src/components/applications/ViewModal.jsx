import axios from "axios";
import Modal from "../Modal";
import { useQuery } from "react-query";

export default function ViewModal({ id, openView, setOpenView }) {
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
    <Modal open={openView} setOpen={setOpenView} width="600px">
      <div className="flex flex-col gap-4">
        <p className="font-semibold text-lg">Application {id}</p>
      </div>
    </Modal>
  );
}
