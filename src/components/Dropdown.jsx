import { useState, useEffect, useRef } from "react";
import { useDebouncedCallback } from "use-debounce";

const Dropdown = ({ options, setQuery, setValue, isLoading, add, id }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(""); // State to store selected value
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setIsOpen(true);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  const debounced = useDebouncedCallback((value) => {
    setQuery(value);
  }, 500);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="dropdown w-full" ref={dropdownRef}>
      <input
        type="text"
        placeholder="Search..."
        className="rounded"
        value={selectedValue} // Display selected value
        onChange={(e) => {
          setSelectedValue(e.target.value); // Update input value dynamically
          debounced(e.target.value);
        }}
        onClick={toggleDropdown}
      />
      {isOpen && (
        <ul className="dropdown-list">
          {isLoading ? (
            <div className="p-4 flex justify-center items-center">
              <p>Loading...</p>
            </div>
          ) : (
            options?.map((option, index) => (
              <li
                onClick={() => {
                  setSelectedValue(option.name); // Set the selected option's name in the input
                  setValue(option.id);
                  setIsOpen(false);
                }}
                key={index}
                className="dropdown-list-item justify-between flex"
              >
                <p>{option.name}</p>
              </li>
            ))
          )}
          <li
            onClick={() => {
              setSelectedValue(add.name); // Set the "Add Company" option in the input
              setValue(add.value);
              setIsOpen(false);
            }}
            className="dropdown-list-item justify-between flex text-gray-600"
          >
            <p>{add.name}</p>
          </li>
        </ul>
      )}
    </div>
  );
};

export default Dropdown;
