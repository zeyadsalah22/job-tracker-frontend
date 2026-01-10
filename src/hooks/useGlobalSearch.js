import { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import { useAxiosPrivate } from '../utils/axios';

export const useGlobalSearch = (searchQuery, pageSize = 3) => {
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const axiosPrivate = useAxiosPrivate();

  // Debounce the search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch search results
  const { data, isLoading, error, refetch } = useQuery(
    ['global-search', debouncedQuery, pageSize],
    async () => {
      // Don't search if query is too short
      if (!debouncedQuery || debouncedQuery.trim().length < 2) {
        return {
          applications: [],
          companies: [],
          userCompanies: [],
          employees: [],
          questions: [],
          totalResults: 0
        };
      }

      try {
        // Make parallel requests to all endpoints
        const [
          applicationsRes,
          companiesRes,
          userCompaniesRes,
          employeesRes,
          questionsRes
        ] = await Promise.allSettled([
          axiosPrivate.get('/applications', {
            params: { SearchTerm: debouncedQuery, PageSize: pageSize }
          }),
          axiosPrivate.get('/companies', {
            params: { SearchTerm: debouncedQuery, PageSize: pageSize }
          }),
          axiosPrivate.get('/user-companies', {
            params: { SearchTerm: debouncedQuery, PageSize: pageSize }
          }),
          axiosPrivate.get('/employees', {
            params: { SearchTerm: debouncedQuery, PageSize: pageSize }
          }),
          axiosPrivate.get('/questions', {
            params: { SearchTerm: debouncedQuery, PageSize: pageSize }
          })
        ]);

        // Extract data from successful responses
        const extractData = (result) => {
          if (result.status === 'fulfilled') {
            const data = result.value.data;
            // Handle both array and paginated response formats
            if (Array.isArray(data)) {
              return data;
            } else if (data && Array.isArray(data.items)) {
              return data.items;
            }
          }
          return [];
        };

        const applications = extractData(applicationsRes);
        const companies = extractData(companiesRes);
        const userCompanies = extractData(userCompaniesRes);
        const employees = extractData(employeesRes);
        const questions = extractData(questionsRes);

        const totalResults = 
          applications.length +
          companies.length +
          userCompanies.length +
          employees.length +
          questions.length;

        return {
          applications,
          companies,
          userCompanies,
          employees,
          questions,
          totalResults
        };
      } catch (error) {
        console.error('Error in global search:', error);
        throw error;
      }
    },
    {
      enabled: debouncedQuery.trim().length >= 2,
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1
    }
  );

  return {
    results: data || {
      applications: [],
      companies: [],
      userCompanies: [],
      employees: [],
      questions: [],
      totalResults: 0
    },
    isLoading: isLoading && debouncedQuery.trim().length >= 2,
    error,
    refetch,
    hasQuery: debouncedQuery.trim().length >= 2
  };
};

