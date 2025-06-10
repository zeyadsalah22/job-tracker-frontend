import React, { useEffect, useRef } from "react";
import {
  Trash2,
  PencilLine,
  Rows3,
  ArrowDownUp,
  EllipsisVertical,
} from "lucide-react";
import Search from "./Search";
import ReactLoading from "react-loading";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

function Actions({ handleOpenEdit, handleOpenDelete, handleOpenView}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col top-6 -left-5 bg-white shadow rounded absolute z-[50]"
    >
      {handleOpenEdit !== null && typeof handleOpenEdit === "function" &&(
        <span
          onClick={handleOpenEdit}
          className="font-normal cursor-pointer p-2 hover:text-primary transition-all"
        >
          edit
        </span>
      )}
      <Link
        to={handleOpenView}
        className="font-normal cursor-pointer hover:text-primary transition-all p-2 border-t"
      >
        view
      </Link>
      <span
        onClick={handleOpenDelete}
        className="font-normal cursor-pointer hover:text-red-600 transition-all text-red-500 border-t p-2"
      >
        delete
      </span>
    </motion.div>
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
  actions,
  setOrder,
  viewSearch,
  selectedOrders,
}) {
  const [openDropdownIndex, setOpenDropdownIndex] = React.useState(null);
  const dropdownRefs = useRef([]);

  const handleOpen = (index) => {
    setOpenDropdownIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  const handleClickOutside = (event) => {
    if (dropdownRefs.current.every((ref) => ref && !ref.contains(event.target))) {
      setOpenDropdownIndex(null);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const rowVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
      },
    },
  };

  const sortIconVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.2 },
    active: { scale: 0.9 },
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex self-end">
        {viewSearch && <Search setSearch={setSearch} />}
      </div>
      <div className="w-full flex flex-col">
        <div className="flex w-full bg-[#FAFAFA] items-center border-b py-3">
          {table_head.map((head, index) => (
            <span
              key={index}
              className="flex items-center gap-2 w-full h-fit pl-4 font-semibold"
            >
              <p>{head.name}</p>
              {selectedOrders?.find((order) => order === head.key) && (
                <motion.span
                  className="cursor-pointer"
                  onClick={() => setOrder(head.key)}
                  variants={sortIconVariants}
                  initial="initial"
                  whileHover="hover"
                  whileTap="active"
                >
                  <ArrowDownUp size={13} />
                </motion.span>
              )}
            </span>
          ))}
          {actions && <span className="w-[15%] h-fit"></span>}
        </div>
        <motion.div
          className="flex flex-col"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {isLoading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-center py-8"
            >
              <ReactLoading
                type="bubbles"
                color="#7571F9"
                height={40}
                width={40}
              />
            </motion.div>
          ) : table_rows?.length === 0 && search ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-4"
            >
              No search results
            </motion.div>
          ) : table_rows?.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-4"
            >
              The table is empty. Add data to show it!
            </motion.div>
          ) : (
            table_rows?.map((object, rowIndex) => (
              <motion.div
                key={rowIndex}
                variants={rowVariants}
                className="flex w-full items-center py-4 border-b text-sm"
              >
                {Object.entries(object)
                  .filter(([key]) => key !== "id")
                  .map(([key, value], valueIndex) =>
                    key === "careers_link" ||
                    (key === "linkedin_link" &&
                      value !== "No provided Information.") ? (
                      <span key={valueIndex} className="w-full h-fit pl-4">
                        <a
                          className="text-blue-500 hover:underline hover:text-blue-800 transition-all"
                          href={value}
                          target="_blank"
                        >
                          {value.replace(/https?:\/\/(www\.)?/, "").split("/")[0]}
                        </a>
                      </span>
                    ) : (
                      <span
                        key={valueIndex}
                        className={`w-full h-fit pl-4 ${
                          (key === "answer" || "question") && "line-clamp-3"
                        }`}
                      >
                        {value}
                      </span>
                    )
                  )}
                {actions && (
                  <div
                    ref={(el) => (dropdownRefs.current[rowIndex] = el)}
                    className="w-[15%] h-fit flex justify-center items-center"
                  >
                    <span
                      onClick={() => handleOpen(rowIndex)}
                      className="cursor-pointer relative"
                    >
                      <EllipsisVertical size={18} />
                      <AnimatePresence>
                        {openDropdownIndex === rowIndex && (
                          <Actions
                            handleOpenEdit={typeof handleOpenEdit === "function" ? () => handleOpenEdit(object.id) : null}
                            handleOpenDelete={() => handleOpenDelete(object.id)}
                            handleOpenView={`/${handleOpenView}/${object.id}`}
                          />
                        )}
                      </AnimatePresence>
                    </span>
                  </div>
                )}
              </motion.div>
            ))
          )}
        </motion.div>
      </div>
    </div>
  );
}
