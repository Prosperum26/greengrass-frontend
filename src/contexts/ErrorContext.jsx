import React, { createContext, useCallback, useState } from 'react';

export const ErrorContext = createContext(null);

export const ErrorProvider = ({ children }) => {
  const [errors, setErrors] = useState([]);

  const addError = useCallback(
    (message, options = {}) => {
      const id = Math.random().toString(36).substr(2, 9);
      const duration = options.duration || 5000;
      
      setErrors((prev) => [...prev, { id, message, type: options.type || 'error' }]);

      if (duration > 0) {
        const timer = setTimeout(() => {
          removeError(id);
        }, duration);

        return () => clearTimeout(timer);
      }
    },
    []
  );

  const removeError = useCallback((id) => {
    setErrors((prev) => prev.filter((err) => err.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setErrors([]);
  }, []);

  return (
    <ErrorContext.Provider value={{ errors, addError, removeError, clearAll }}>
      {children}
    </ErrorContext.Provider>
  );
};

export default ErrorContext;
