import { getErrorMessage } from './errorMessages';

/**
 * Handle API errors and display them via error context
 * @param {Error} error - The error from API call
 * @param {Function} addError - The addError function from useError hook
 * @param {Object} options - Additional options
 * @returns {string} - The error message
 */
export const handleApiError = (error, addError, options = {}) => {
  const message = getErrorMessage(error);
  
  // Show error in toast if addError is provided
  if (addError && options.showToast !== false) {
    addError(message, { type: 'error', duration: options.duration || 5000 });
  }

  // Log to console in development
  if (import.meta.env.DEV) {
    console.error('[API Error]:', error);
  }

  return message;
};

/**
 * Handle form validation errors
 * @param {Object} errors - Validation errors object
 * @param {Function} addError - The addError function from useError hook
 */
export const handleValidationErrors = (errors, addError) => {
  Object.values(errors).forEach((error) => {
    if (error) {
      addError(error, { type: 'error', duration: 5000 });
    }
  });
};

/**
 * Wrap API calls with error handling
 * @param {Function} apiCall - The API call function
 * @param {Function} addError - The addError function from useError hook
 * @param {Object} options - Additional options
 * @returns {Promise} - The result of the API call
 */
export const withErrorHandling = async (apiCall, addError, options = {}) => {
  try {
    return await apiCall();
  } catch (error) {
    handleApiError(error, addError, options);
    throw error;
  }
};
