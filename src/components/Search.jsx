import { Search as SearchIcon } from "lucide-react";
import { useDebouncedCallback } from "use-debounce";

export default function Search({ setSearch }) {
  const debounced = useDebouncedCallback((value) => {
    setSearch(value);
  }, 500);
  return (
    <div className="flex border-2 border-gray-200 p-2 rounded-lg items-center focus-within:border-primary">
      <input
        className="w-[90%] border-none focus:outline-none focus:ring-0 p-0"
        type="text"
        placeholder="Search"
        onChange={(e) => debounced(e.target.value)}
      />
      <div className="w-[10%] flex items-center justify-center">
        <SearchIcon size={18} />
      </div>
    </div>
  );
}
