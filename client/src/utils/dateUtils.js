// Utility functions for date handling

/**
 * Format a date for API submission (YYYY-MM-DD format)
 * @param {Date|string} date - Date to format
 * @returns {string} Formatted date string
 */
export const formatDateForAPI = (date) => {
  if (!date) return '';
  
  // If it's already a string in the right format, return it
  if (typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return date;
  }
  
  // Convert to Date object if it's a string
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  // Get date components
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
};

/**
 * Format a date for display
 * @param {Date|string} date - Date to format
 * @returns {string} Formatted date string for display
 */
export const formatDateForDisplay = (date) => {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('en-US');
};

/**
 * Check if a date string is valid
 * @param {string} dateString - Date string to validate
 * @returns {boolean} True if valid, false otherwise
 */
export const isValidDate = (dateString) => {
  if (!dateString) return false;
  
  const date = new Date(dateString);
  return !isNaN(date.getTime());
};

