import React, { createContext, useCallback, useRef, useState, useEffect } from 'react';

export const ErrorContext = createContext(null);

// Generate unique ID with timestamp for better uniqueness
const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

export const ErrorProvider = ({ children }) => {
  const [errors, setErrors] = useState([]);
  const timersRef = useRef(new Map());

  // Cleanup all timers on unmount
  useEffect(() => {
    return () => {
      timersRef.current.forEach((timer) => clearTimeout(timer));
      timersRef.current.clear();
    };
  }, []);

  const removeError = useCallback((id) => {
    setErrors((prev) => prev.filter((err) => err.id !== id));
    // Clear timer if exists
    const timer = timersRef.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timersRef.current.delete(id);
    }
  }, []);

  const addError = useCallback(
    (message, options = {}) => {
      const id = generateId();
      const duration = options.duration ?? 5000;
      const type = options.type || 'error';
      
      setErrors((prev) => [...prev, { id, message, type }]);

      if (duration > 0) {
        const timer = setTimeout(() => {
          setErrors((prev) => prev.filter((err) => err.id !== id));
          timersRef.current.delete(id);
        }, duration);
        timersRef.current.set(id, timer);
      }

      return id; // Return ID for manual removal if needed
    },
    []
  );

  const clearAll = useCallback(() => {
    timersRef.current.forEach((timer) => clearTimeout(timer));
    timersRef.current.clear();
    setErrors([]);
  }, []);

  return (
    <ErrorContext.Provider value={{ errors, addError, removeError, clearAll }}>
      {children}
    </ErrorContext.Provider>
  );
};

export default ErrorContext;
