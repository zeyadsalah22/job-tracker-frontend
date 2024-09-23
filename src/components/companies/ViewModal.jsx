import axios from "axios";
import Modal from "../Modal";
import { useQuery } from "react-query";

export default function ViewModal({ id, openView, setOpenView }) {
  const fetchCompany = async () => {
    const { data } = await axios.get(
      `http://127.0.0.1:8000/api/companies/${id}`,
      {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      }
    );
    return data;
  };

  const {
    data: company,
    isLoading,
    error,
  } = useQuery(["company", { id }], fetchCompany, {
    enabled: !!id,
  });

  return (
    <Modal open={openView} setOpen={setOpenView} width="600px">
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className="flex flex-col gap-4">
          <p className="font-semibold text-lg">Company {company.id}</p>
          <div className="flex flex-col gap-1">
            {Object.entries(company).map(
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
