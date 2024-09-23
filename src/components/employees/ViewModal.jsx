import axios from "axios";
import Modal from "../Modal";
import { useQuery } from "react-query";

export default function ViewModal({ id, openView, setOpenView }) {
  const fetchEmployee = async () => {
    const { data } = await axios.get(
      `http://127.0.0.1:8000/api/employees/${id}`,
      {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      }
    );
    return data;
  };

  const {
    data: employee,
    isLoading,
    error,
  } = useQuery(["employee", { id }], fetchEmployee, {
    enabled: !!id,
  });

  const contacted = [
    {
      name: "Sent",
      value: "SENT",
    },
    {
      name: "Accepted",
      value: "ACCEPTED",
    },
    {
      name: "Messaged",
      value: "MESSAGED",
    },
    {
      name: "Replied",
      value: "REPLIED",
    },
    {
      name: "Established Connection",
      value: "STRONG_CONNECTION",
    },
  ];

  return (
    <Modal open={openView} setOpen={setOpenView} width="600px">
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className="flex flex-col gap-4">
          <p className="font-semibold text-lg">Employee {employee.id}</p>
          <div className="flex flex-col gap-1">
            {Object.entries(employee).map(
              ([key, value]) =>
                key !== "company" &&
                key !== "user" &&
                key !== "id" && (
                  <div key={key} className="flex gap-1">
                    <p className="font-semibold">{key}: </p>
                    <p>
                      {value === ""
                        ? "No provided Information."
                        : key === "contacted"
                        ? contacted.find((contact) => contact.value === value)
                            .name
                        : value}
                    </p>
                  </div>
                )
            )}
            <div className="flex flex-col gap-1">
              <p className="font-semibold mt-4 mb-1 text-gray-600">Company</p>
              <div className="flex flex-col gap-1">
                {Object.entries(employee.company).map(
                  ([key, value]) =>
                    key !== "id" && (
                      <div key={key} className="flex gap-1">
                        <p className="font-semibold">{key}: </p>
                        <p>{value}</p>
                      </div>
                    )
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}
