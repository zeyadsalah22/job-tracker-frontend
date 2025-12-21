import React, { useEffect, useRef } from "react";
import {
  Trash2,
  PencilLine,
  Rows3,
  ArrowDownUp,
  EllipsisVertical,
  Search as SearchIcon,
  Eye,
  Edit,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import ReactLoading from "react-loading";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/Card";
import { Badge } from "./ui/Badge";
import Button from "./ui/Button";
import Input from "./ui/Input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/Select";
import { CheckboxWithLabel as Checkbox } from "./ui/Checkbox";

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
  // New modern UI props
  useModernUI = false,
  title,
  description,
  headerActions,
  filters,
  pagination,
  bulkActions = false,
  selectedItems = new Set(),
  onSelectAll,
  onSelectItem,
  customRenderers = {},
  emptyState,
  // Built-in pagination props
  currentPage,
  totalPages,
  totalCount,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
  // Built-in sorting props
  sortBy,
  sortOrder,
  onSort,
  sortableColumns = [],
  // Custom action buttons
  customActions,
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

  // Render modern UI if enabled
  if (useModernUI) {
    return (
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">{title}</h1>
            {description && <p className="text-muted-foreground">{description}</p>}
          </div>
          {headerActions && (
            <div className="flex gap-2">
              {headerActions}
            </div>
          )}
        </div>

        <Card>
          <CardHeader>
            {filters && (
              <div className="flex flex-col md:flex-row gap-4">
                {filters}
              </div>
            )}
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <div className="overflow-x-auto">
                <table className="w-full caption-bottom text-sm">
                  <thead className="[&_tr]:border-b">
                    <tr className="border-b transition-colors hover:bg-muted/50">
                      {bulkActions && (
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground w-12">
                          <Checkbox
                            checked={Array.isArray(table_rows) && selectedItems.size === table_rows.length && table_rows.length > 0}
                            onCheckedChange={onSelectAll}
                          />
                        </th>
                      )}
                      {table_head.map((head, index) => {
                        const isSortable = sortableColumns.includes(head.key) || selectedOrders?.find((order) => order === head.key);
                        const isCurrentSort = sortBy === head.key;
                        
                        return (
                          <th
                            key={index}
                            className={`h-12 px-4 text-left align-middle font-medium text-muted-foreground ${
                              isSortable ? 'cursor-pointer hover:bg-muted/50' : ''
                            }`}
                            onClick={() => {
                              if (isSortable) {
                                if (onSort) {
                                  onSort(head.key);
                                } else if (setOrder) {
                                  setOrder(head.key);
                                }
                              }
                            }}
                          >
                            <div className="flex items-center gap-2">
                              {head.name}
                              {isSortable && (
                                <div className="flex flex-col">
                                  {isCurrentSort ? (
                                    sortOrder === 'asc' ? (
                                      <ArrowUp className="w-3 h-3" />
                                    ) : (
                                      <ArrowDown className="w-3 h-3" />
                                    )
                                  ) : (
                                    <ArrowUpDown className="w-3 h-3 opacity-50" />
                                  )}
                                </div>
                              )}
                            </div>
                          </th>
                        );
                      })}
                      {actions && <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground w-24">Actions</th>}
                    </tr>
                  </thead>
                  <tbody className="[&_tr:last-child]:border-0">
                    {isLoading ? (
                      <tr>
                        <td colSpan={table_head.length + (bulkActions ? 1 : 0) + (actions ? 1 : 0)} className="text-center py-8">
                          <div className="flex justify-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                          </div>
                        </td>
                      </tr>
                    ) : !Array.isArray(table_rows) || table_rows.length === 0 ? (
                      <tr>
                        <td colSpan={table_head.length + (bulkActions ? 1 : 0) + (actions ? 1 : 0)} className="text-center py-8 text-muted-foreground">
                          {emptyState && typeof emptyState === 'object' && emptyState.title ? (
                            <div className="flex flex-col items-center gap-4">
                              <div className="space-y-2">
                                <p className="text-lg font-semibold text-foreground">{emptyState.title}</p>
                                {emptyState.description && (
                                  <p className="text-sm text-muted-foreground">{emptyState.description}</p>
                                )}
                              </div>
                              {emptyState.action && <div>{emptyState.action}</div>}
                            </div>
                          ) : (
                            emptyState || "No data found"
                          )}
                        </td>
                      </tr>
                    ) : (
                      table_rows.map((row, rowIndex) => (
                        <tr key={rowIndex} className="border-b transition-colors hover:bg-muted/50">
                          {bulkActions && (
                            <td className="p-4 align-middle">
                              <Checkbox
                                checked={selectedItems.has(row.id?.toString())}
                                onCheckedChange={(checked) => onSelectItem(row.id, checked)}
                              />
                            </td>
                          )}
                          {table_head.map((head, cellIndex) => {
                            const value = row[head.key];
                            const renderer = customRenderers[head.key];
                            
                            return (
                              <td key={cellIndex} className="p-4 align-middle">
                                {renderer ? renderer(value, row) : value}
                              </td>
                            );
                          })}
                          {actions && (
                            <td className="p-4 align-middle">
                              <div className="flex items-center gap-1">
                                {/* Custom actions first */}
                                {customActions && customActions.map((action, actionIndex) => (
                                  <Button
                                    key={actionIndex}
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => action.onClick(row)}
                                    className={typeof action.className === 'function' ? action.className(row) : action.className}
                                    title={action.title}
                                  >
                                    {action.icon}
                                  </Button>
                                ))}
                                
                                {/* Standard actions */}
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleOpenView && handleOpenView(row)}
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                                {handleOpenEdit && (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleOpenEdit(row)}
                                  >
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                )}
                                {handleOpenDelete && (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleOpenDelete(row)}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                )}
                              </div>
                            </td>
                          )}
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              
              {/* Built-in pagination or custom pagination */}
              {(pagination || (currentPage && totalPages && totalCount !== undefined)) && (
                <div className="flex flex-col items-center space-y-4 py-4">
                  {pagination ? (
                    pagination
                  ) : (
                    <>
                      {/* Rows per page selector */}
                      <div className="flex items-center space-x-2">
                        <p className="text-sm font-medium">Rows per page</p>
                        <Select
                          value={itemsPerPage?.toString()}
                          onValueChange={(value) => onItemsPerPageChange && onItemsPerPageChange(Number(value))}
                        >
                          <SelectTrigger className="h-8 w-[70px]">
                            <SelectValue placeholder={itemsPerPage?.toString()} />
                          </SelectTrigger>
                          <SelectContent side="top" className="min-w-[70px]">
                            <SelectItem value="10">10</SelectItem>
                            <SelectItem value="25">25</SelectItem>
                            <SelectItem value="50">50</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      {/* Pagination info and controls */}
                      <div className="flex items-center space-x-6">
                        <div className="flex items-center justify-center text-sm font-medium">
                          <span className="mr-2">
                            Showing {Math.min((currentPage - 1) * itemsPerPage + 1, totalCount)} to{" "}
                            {Math.min(currentPage * itemsPerPage, totalCount)} of {totalCount} results
                          </span>
                          <span className="text-muted-foreground">
                            • Page {currentPage} of {totalPages}
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            className="h-8 w-8 p-0"
                            onClick={() => onPageChange && onPageChange(Math.max(1, currentPage - 1))}
                            disabled={currentPage === 1}
                          >
                            <ChevronLeft className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            className="h-8 w-8 p-0"
                            onClick={() => onPageChange && onPageChange(Math.min(totalPages, currentPage + 1))}
                            disabled={currentPage === totalPages}
                          >
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Legacy UI rendering
  return (
    <div className="flex flex-col gap-2">
      <div className="flex self-end">
        {viewSearch && (
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search..."
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        )}
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
