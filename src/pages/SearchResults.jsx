import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search, Filter, ChevronLeft, X } from 'lucide-react';
import { useGlobalSearch } from '../hooks/useGlobalSearch';
import SearchResultItem from '../components/search/SearchResultItem';
import SearchSkeleton from '../components/search/SearchSkeleton';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { CheckboxWithLabel } from '../components/ui/Checkbox';

export default function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const queryFromUrl = searchParams.get('q') || '';
  const [searchQuery, setSearchQuery] = useState(queryFromUrl);
  const [activeFilters, setActiveFilters] = useState({
    applications: true,
    companies: true,
    userCompanies: true,
    employees: true,
    questions: true
  });
  const [showFilters, setShowFilters] = useState(false);

  // Use global search hook with larger page size for full results
  const { results, isLoading, hasQuery } = useGlobalSearch(searchQuery, 50);

  // Update search query when URL param changes
  useEffect(() => {
    const query = searchParams.get('q') || '';
    if (query !== searchQuery) {
      setSearchQuery(query);
    }
  }, [searchParams]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchParams({ q: searchQuery.trim() });
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchParams({});
  };

  const toggleFilter = (filter) => {
    setActiveFilters(prev => ({
      ...prev,
      [filter]: !prev[filter]
    }));
  };

  const categories = [
    { 
      key: 'applications', 
      label: 'Applications', 
      data: results.applications,
      color: 'text-primary'
    },
    { 
      key: 'companies', 
      label: 'Companies', 
      data: results.companies,
      color: 'text-blue-600'
    },
    { 
      key: 'userCompanies', 
      label: 'Your Companies', 
      data: results.userCompanies,
      color: 'text-green-600'
    },
    { 
      key: 'employees', 
      label: 'Employees', 
      data: results.employees,
      color: 'text-purple-600'
    },
    { 
      key: 'questions', 
      label: 'Questions', 
      data: results.questions,
      color: 'text-orange-600'
    }
  ];

  const filteredCategories = categories.filter(cat => 
    activeFilters[cat.key] && cat.data.length > 0
  );

  const totalResults = filteredCategories.reduce((sum, cat) => sum + cat.data.length, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          {/* Breadcrumb */}
          <div className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center hover:text-primary transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <span>/</span>
            <span className="text-gray-900 font-medium">Search Results</span>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex items-center space-x-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search jobs, companies, employees..."
                className="pl-10 pr-10"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <Button type="submit">
              Search
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2"
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
            </Button>
          </form>

          {/* Results Count */}
          {hasQuery && !isLoading && (
            <div className="mt-4 text-sm text-gray-600">
              Found <span className="font-semibold text-gray-900">{totalResults}</span> result{totalResults !== 1 ? 's' : ''} 
              {searchQuery && <> for "<span className="font-medium text-gray-900">{searchQuery}</span>"</>}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Filters Sidebar */}
          {showFilters && (
            <div className="w-64 flex-shrink-0">
              <div className="bg-white rounded-lg shadow-sm border p-4 sticky top-24">
                <h3 className="font-semibold text-gray-900 mb-4">Filter by Category</h3>
                <div className="space-y-3">
                  {categories.map((category) => (
                    <CheckboxWithLabel
                      key={category.key}
                      id={`filter-${category.key}`}
                      checked={activeFilters[category.key]}
                      onCheckedChange={() => toggleFilter(category.key)}
                    >
                      {category.label} ({category.data.length})
                    </CheckboxWithLabel>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Results */}
          <div className="flex-1">
            {/* Loading State */}
            {isLoading && (
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <SearchSkeleton />
              </div>
            )}

            {/* Empty State - No Query */}
            {!hasQuery && !isLoading && (
              <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
                <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Start Searching
                </h3>
                <p className="text-gray-600">
                  Enter a search term to find applications, companies, employees, and more
                </p>
              </div>
            )}

            {/* Empty State - No Results */}
            {hasQuery && !isLoading && totalResults === 0 && (
              <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
                <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No Results Found
                </h3>
                <p className="text-gray-600 mb-4">
                  We couldn't find anything matching "{searchQuery}"
                </p>
                <p className="text-sm text-gray-500">
                  Try using different keywords or check your spelling
                </p>
              </div>
            )}

            {/* Results */}
            {!isLoading && totalResults > 0 && (
              <div className="space-y-6">
                {filteredCategories.map((category) => (
                  <div key={category.key} className="bg-white rounded-lg shadow-sm border">
                    <div className="border-b px-6 py-4">
                      <h2 className={`text-lg font-semibold ${category.color}`}>
                        {category.label}
                        <span className="ml-2 text-sm font-normal text-gray-500">
                          ({category.data.length} result{category.data.length !== 1 ? 's' : ''})
                        </span>
                      </h2>
                    </div>
                    <div className="p-4 space-y-1">
                      {category.data.map((item, index) => (
                        <SearchResultItem
                          key={`${category.key}-${item.id || index}`}
                          result={item}
                          category={category.key}
                          isSelected={false}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

