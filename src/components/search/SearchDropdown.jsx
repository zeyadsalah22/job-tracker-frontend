import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowRight } from 'lucide-react';
import SearchResultItem from './SearchResultItem';
import SearchSkeleton from './SearchSkeleton';

export default function SearchDropdown({ results, isLoading, searchQuery, onClose, hasQuery }) {
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Flatten all results for keyboard navigation
  const allResults = [];
  const categories = [
    { key: 'applications', label: 'Applications', data: results.applications },
    { key: 'companies', label: 'Companies', data: results.companies },
    { key: 'userCompanies', label: 'Your Companies', data: results.userCompanies },
    { key: 'employees', label: 'Employees', data: results.employees },
    { key: 'questions', label: 'Questions', data: results.questions }
  ];

  categories.forEach(cat => {
    cat.data.forEach(item => {
      allResults.push({ category: cat.key, item });
    });
  });

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!hasQuery) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => 
            prev < allResults.length ? prev + 1 : prev
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => (prev > -1 ? prev - 1 : -1));
          break;
        case 'Enter':
          e.preventDefault();
          if (selectedIndex === -1 || selectedIndex === allResults.length) {
            // Navigate to full search results page
            navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
            onClose();
          } else if (selectedIndex >= 0 && selectedIndex < allResults.length) {
            // Navigate to selected result
            const selected = allResults[selectedIndex];
            const resultItem = dropdownRef.current?.querySelector(
              `[data-result-index="${selectedIndex}"]`
            );
            if (resultItem) resultItem.click();
          }
          break;
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, allResults.length, searchQuery, navigate, onClose, hasQuery]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        // Check if click is on the search input
        const searchInput = document.querySelector('input[placeholder*="Search"]');
        if (searchInput && !searchInput.contains(e.target)) {
          onClose();
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  // Don't show if no query
  if (!hasQuery) {
    return null;
  }

  const handleViewAllResults = () => {
    navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    onClose();
  };

  return (
    <div
      ref={dropdownRef}
      className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-2xl border border-gray-200 max-h-[500px] overflow-y-auto z-50 w-full max-w-2xl"
    >
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Search className="w-4 h-4 text-gray-400" />
          <span className="text-sm font-medium text-gray-700">
            Search Results
          </span>
        </div>
        {results.totalResults > 0 && (
          <span className="text-xs text-gray-500">
            {results.totalResults} result{results.totalResults !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="p-4">
          <SearchSkeleton />
        </div>
      )}

      {/* Results */}
      {!isLoading && results.totalResults > 0 && (
        <div className="py-2">
          {categories.map((category) => {
            if (category.data.length === 0) return null;

            return (
              <div key={category.key} className="mb-4 last:mb-2">
                <div className="px-4 py-2 bg-gray-50">
                  <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    {category.label} ({category.data.length})
                  </h3>
                </div>
                <div className="px-2">
                  {category.data.map((item, index) => {
                    const globalIndex = allResults.findIndex(
                      r => r.category === category.key && r.item === item
                    );
                    return (
                      <div
                        key={`${category.key}-${item.id || index}`}
                        data-result-index={globalIndex}
                      >
                        <SearchResultItem
                          result={item}
                          category={category.key}
                          onSelect={onClose}
                          isSelected={selectedIndex === globalIndex}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* View All Results Button */}
          <div className="border-t border-gray-100 p-2">
            <button
              onClick={handleViewAllResults}
              className={`w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                selectedIndex === allResults.length
                  ? 'bg-primary text-white'
                  : 'hover:bg-gray-50 text-gray-700'
              }`}
            >
              <span className="text-sm font-medium">View All Results</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && results.totalResults === 0 && (
        <div className="p-8 text-center">
          <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-sm font-medium text-gray-700 mb-1">
            No results found
          </p>
          <p className="text-xs text-gray-500">
            Try searching with different keywords
          </p>
        </div>
      )}
    </div>
  );
}

