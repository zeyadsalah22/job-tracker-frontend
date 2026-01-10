/**
 * Generic pagination handler that fetches all data across multiple pages
 * @param {Function} fetchFunction - Function that takes (pageNumber, pageSize) and returns a Promise with API response
 * @param {number} pageSize - Number of records per page (default: 500)
 * @returns {Promise<Array>} Complete array of all records
 */
export const fetchAllData = async (fetchFunction, pageSize = 500) => {
  let allData = [];
  let pageNumber = 1;
  let hasMore = true;
  
  console.log('Starting data fetch for export...');
  
  while (hasMore) {
    try {
      console.log(`Fetching page ${pageNumber} with pageSize ${pageSize}...`);
      const response = await fetchFunction(pageNumber, pageSize);
      
      // Check if response is paginated (has items property) or direct array
      const isPaginated = response.data && typeof response.data === 'object' && 'items' in response.data;
      
      let items;
      if (isPaginated) {
        // Paginated response: { items: [...], pageNumber, totalPages, ... }
        items = response.data.items || [];
        console.log(`Received ${items.length} items from paginated page ${pageNumber}`);
      } else if (Array.isArray(response.data)) {
        // Direct array response: [...]
        items = response.data;
        console.log(`Received ${items.length} items from direct array (non-paginated)`);
        // For direct array endpoints, we got all data at once, so stop after first fetch
        allData = [...allData, ...items];
        hasMore = false;
        break;
      } else {
        // Unknown structure
        console.warn('Unknown response structure:', response.data);
        items = [];
      }
      
      allData = [...allData, ...items];
      
      // For paginated endpoints, stop if we received fewer items than pageSize (indicates last page)
      if (isPaginated) {
        hasMore = items.length === pageSize;
      }
      
      pageNumber++;
    } catch (error) {
      console.error(`Error fetching page ${pageNumber}:`, error);
      throw error;
    }
  }
  
  console.log(`Fetch complete. Total records: ${allData.length}`);
  return allData;
};

/**
 * Escapes a value for CSV format according to RFC 4180
 * @param {*} value - Value to escape
 * @returns {string} Escaped value
 */
const escapeCSVValue = (value) => {
  if (value === null || value === undefined) {
    return '';
  }
  
  // Convert to string
  const stringValue = String(value);
  
  // If value contains comma, quote, or newline, wrap in quotes and escape internal quotes
  if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n') || stringValue.includes('\r')) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  
  return stringValue;
};

/**
 * Converts an array of objects to CSV format and triggers download
 * @param {Array<Object>} data - Array of objects to export
 * @param {string} filename - Base filename (timestamp will be added)
 */
export const exportToCSV = (data, filename) => {
  try {
    if (!data || data.length === 0) {
      console.warn('No data to export');
      // Still create CSV with headers if data structure is available
      return;
    }
    
    // Get headers from first object's keys
    const headers = Object.keys(data[0]);
    
    // Create CSV header row
    const headerRow = headers.map(escapeCSVValue).join(',');
    
    // Create CSV data rows
    const dataRows = data.map(row => {
      return headers.map(header => escapeCSVValue(row[header])).join(',');
    });
    
    // Combine header and data
    const csvContent = [headerRow, ...dataRows].join('\n');
    
    // Create Blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    // Create download link
    const link = document.createElement('a');
    link.setAttribute('href', url);
    
    // Add timestamp to filename
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    link.setAttribute('download', `${filename}_${timestamp}.csv`);
    
    // Trigger download
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Cleanup
    URL.revokeObjectURL(url);
    
    console.log(`CSV export successful: ${filename}_${timestamp}.csv (${data.length} records)`);
  } catch (error) {
    console.error('Error exporting to CSV:', error);
    throw error;
  }
};

