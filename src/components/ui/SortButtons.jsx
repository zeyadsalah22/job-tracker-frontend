import { ArrowUpDown } from "lucide-react";

const SortButtons = ({ options = [], value, onChange, className = "" }) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
        <ArrowUpDown className="h-4 w-4" />
        <span>Sort by:</span>
      </div>
      <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`
              px-4 py-2 rounded-md text-sm font-medium transition-all duration-200
              ${value === option.value
                ? 'bg-white text-primary shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
              }
            `}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SortButtons;




