import axios from "axios";
import Modal from "../Modal";
import { useQuery } from "react-query";

export default function ViewModal({ id, openView, setOpenView }) {
  const fetchApplication = async () => {
    const { data } = await axios.get(
      `http://127.0.0.1:8000/api/applications/${id}`,
      {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      }
    );
    return data;
  };

  const { data: application, isLoading } = useQuery(
    ["application", { id }],
    fetchApplication,
    {
      enabled: !!id,
    }
  );

  console.log(application);

  return (
    <Modal open={openView} setOpen={setOpenView} width="600px">
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className="flex flex-col gap-4">
          <p className="font-semibold text-lg">Employee {application?.id}</p>
          <div className="flex flex-col gap-1">
            {Object.entries(application).map(
              ([key, value]) =>
                key !== "id" && (
                  <div key={key} className="flex gap-1">
                    <p className="font-semibold">{key}: </p>
                    <p>{value === "" ? "No provided Information." : value}</p>
                  </div>
                )
            )}
          </div>
        </div>
      )}
    </Modal>
  );
}
