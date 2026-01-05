import { useState, useRef, useEffect } from "react";
import { ChevronDown, Search, X } from "lucide-react";

const SearchableSelect = ({ 
  options = [], 
  value, 
  onChange, 
  placeholder = "Select...",
  label,
  className = "",
  showSearch = true,
  required = false,
  allowCustomValue = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchQuery("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter options based on search query
  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isCustomSelection =
    allowCustomValue &&
    value &&
    typeof value === "object" &&
    value.__isCustom === true &&
    typeof value.label === "string";

  // Get selected option label
  const selectedOption = !isCustomSelection
    ? options.find(opt => opt.value === value)
    : null;

  const displayText = isCustomSelection
    ? value.label
    : selectedOption
      ? selectedOption.label
      : placeholder;

  const handleSelect = (optionValue) => {
    onChange(optionValue);
    setIsOpen(false);
    setSearchQuery("");
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onChange(null);
    setSearchQuery("");
  };

  const normalizedSearch = searchQuery.trim();
  const hasExactMatch = filteredOptions.some(
    (option) => option.label.toLowerCase() === normalizedSearch.toLowerCase()
  );
  const shouldShowCustomOption =
    allowCustomValue && !!normalizedSearch && !hasExactMatch;

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      {label && (
        <label className={`block text-sm font-medium text-gray-700 mb-1 ${required ? 'required' : ''}`}>
          {label}
        </label>
      )}
      
      {/* Selected Value Display */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-full px-4 py-2.5 text-left bg-white border rounded-lg
          flex items-center justify-between
          transition-all duration-200
          ${isOpen ? 'border-primary ring-2 ring-primary ring-opacity-20' : 'border-gray-300'}
          hover:border-gray-400
          focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-20
          ${!selectedOption && !isCustomSelection ? 'text-gray-500' : 'text-gray-900'}
        `}
      >
        <span className={`truncate ${!selectedOption && !isCustomSelection ? "text-gray-500" : ""}`}>
          {displayText}
        </span>
        <div className="flex items-center gap-1">
          {value !== null && value !== undefined && (
            <X
              className="h-4 w-4 text-gray-400 hover:text-gray-600"
              onClick={handleClear}
            />
          )}
          <ChevronDown
            className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${
              isOpen ? 'transform rotate-180' : ''
            }`}
          />
        </div>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-80 overflow-hidden">
          {/* Search Input */}
          {showSearch && (
            <div className="p-2 border-b border-gray-200 sticky top-0 bg-white">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>
          )}

          {/* Options List */}
          <div className="overflow-y-auto max-h-64">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <button
                  key={option.value ?? 'null'}
                  type="button"
                  onClick={() => handleSelect(option.value)}
                  className={`
                    w-full px-4 py-2.5 text-left transition-colors
                    ${option.value === value
                      ? 'bg-primary text-white font-medium'
                      : 'hover:bg-gray-100 text-gray-900'
                    }
                  `}
                >
                  {option.label}
                </button>
              ))
            ) : (
              <div className="px-4 py-8 text-center text-gray-500">
                No options found
              </div>
            )}
            {shouldShowCustomOption && (
              <button
                type="button"
                onClick={() =>
                  handleSelect({
                    __isCustom: true,
                    label: normalizedSearch,
                  })
                }
                className="w-full px-4 py-2.5 text-left text-primary font-medium hover:bg-primary/5 border-t border-gray-100"
              >
                Use &quot;{normalizedSearch}&quot;
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchableSelect;




