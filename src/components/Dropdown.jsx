import { useState, useEffect, useRef } from "react";
import { useDebouncedCallback } from "use-debounce";

const Dropdown = ({ options, setQuery, setValue, isLoading, add, id }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  console.log(options);

  const toggleDropdown = () => {
    setIsOpen(true);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  const debounced = useDebouncedCallback(
    (value) => {
      setQuery(value);
    },
    500
  );

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
        value={
          id &&
          options
            .filter((option) => option.id === id)
            .map((option) => option.name)
        }
        onChange={(e) => debounced(e.target.value)}
        onClick={toggleDropdown}
      />
      {isOpen && (
        <ul className="dropdown-list ">
          {isLoading ? (
            <div className="p-4 flex justify-center items-center">
              <p>Loading...</p>
            </div>
          ) : (
            options?.map((option, index) => (
              <li
                onClick={() => {
                  setValue(option.id);
                  setIsOpen(false);
                }}
                key={index}
                className="dropdown-list-item justify-between flex"
              >
                <p> {option.name}</p>
              </li>
            ))
          )}
          <li
            onClick={() => {
              setValue(add.value);
              setIsOpen(false);
            }}
            className="dropdown-list-item justify-between flex text-gray-600"
          >
            <p> {add.name} </p>
          </li>
        </ul>
      )}
    </div>
  );
};

export default Dropdown;
