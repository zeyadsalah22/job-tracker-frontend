import React, { useEffect, useRef } from "react";
import { Typography } from "@material-tailwind/react";
import { Ellipsis, Trash2, PencilLine, Rows3 } from "lucide-react";
import Search from "./Search";
import ReactLoading from "react-loading";

function Actions({ handleOpenEdit, handleOpenDelete, handleOpenView }) {
  return (
    <div className="flex items-center gap-3">
      <Typography
        onClick={handleOpenEdit}
        variant="small"
        color="blue-gray"
        className="font-normal cursor-pointer hover:text-primary transition-all"
      >
        <PencilLine size={18} />
      </Typography>
      <Typography
        onClick={handleOpenDelete}
        variant="small"
        color="blue-gray"
        className="font-normal cursor-pointer hover:text-primary transition-all"
      >
        <Trash2 size={18} />
      </Typography>
      <Typography
        onClick={handleOpenView}
        variant="small"
        color="blue-gray"
        className="font-normal cursor-pointer hover:text-primary transition-all"
      >
        <Rows3 size={18} />
      </Typography>
    </div>
  );
}

export default function Table({
  table_head,
  table_rows,
  handleOpenDelete,
  handleOpenEdit,
  handleOpenView,
  search,
  setSearch,
  isLoading,
}) {
  const [openDropdownIndex, setOpenDropdownIndex] = React.useState(null);

  const dropdownRefs = useRef([]);

  const handleOpen = (index) => {
    setOpenDropdownIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  const handleClickOutside = (event) => {
    if (
      dropdownRefs.current.every((ref) => ref && !ref.contains(event.target))
    ) {
      setOpenDropdownIndex(null);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex flex-col gap-4 mt-4">
      <div className="flex justify-between items-center">
        <p className="font-semibold">Data Table</p>
        <Search setSearch={setSearch} />
      </div>
      <table className="w-full min-w-max table-auto text-left border">
        <thead>
          <tr>
            {table_head.map((head) => (
              <th
                key={head}
                className="border-b border-blue-gray-100 bg-[#ECEFF1] p-4"
              >
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="leading-none font-semibold"
                >
                  {head}
                </Typography>
              </th>
            ))}
            <th className="border-b border-blue-gray-100 bg-[#ECEFF1] p-4">
              <Typography
                variant="small"
                color="blue-gray"
                className="leading-none font-semibold"
              >
                Actions
              </Typography>
            </th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <ReactLoading type="spinningBubbles" color="#11664F" />
          ) : table_rows?.length === 0 && search ? (
            <div className="p-4">No search results</div>
          ) : table_rows?.length === 0 ? (
            <div className="p-4">The table is empty. Add data to show it!</div>
          ) : (
            table_rows?.map((object, rowIndex) => (
              <tr key={rowIndex} className="even:bg-[#ECEFF1]">
                {Object.entries(object)
                  .filter(([key]) => key !== "id")
                  .map(([key, value], valueIndex) => (
                    <td key={valueIndex} className="p-4">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {value}
                      </Typography>
                    </td>
                  ))}
                <td className="p-4 cursor-pointer">
                  <div ref={(el) => (dropdownRefs.current[rowIndex] = el)}>
                    {openDropdownIndex === rowIndex ? (
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        <Actions
                          handleOpenEdit={() => handleOpenEdit(object.id)}
                          handleOpenDelete={() => handleOpenDelete(object.id)}
                          handleOpenView={() => handleOpenView(object.id)}
                        />
                      </Typography>
                    ) : (
                      <Typography
                        onClick={() => handleOpen(rowIndex)}
                        variant="small"
                        color="blue-gray"
                        className="font-normal hover:text-primary transition-all"
                      >
                        <Ellipsis size={18} />
                      </Typography>
                    )}
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
