import React from 'react';
import { useError } from '../../hooks/useError';

export const Toast = () => {
  const { errors, removeError } = useError();

  if (errors.length === 0) return null;

  return (
    <div className="fixed bottom-0 right-0 z-[9999] p-4 pointer-events-none">
      <div className="space-y-2">
        {errors.map((error) => (
          <div
            key={error.id}
            className={`
              pointer-events-auto
              p-4 rounded-lg shadow-lg flex items-start gap-3 max-w-sm
              animate-in fade-in slide-in-from-right-5
              ${
                error.type === 'error'
                  ? 'bg-red-900/90 text-white border border-red-700'
                  : error.type === 'success'
                  ? 'bg-green-900/90 text-white border border-green-700'
                  : error.type === 'warning'
                  ? 'bg-yellow-900/90 text-white border border-yellow-700'
                  : 'bg-blue-900/90 text-white border border-blue-700'
              }
            `}
          >
            <div className="flex-1 text-sm font-medium leading-snug">{error.message}</div>
            <button
              onClick={() => removeError(error.id)}
              className="text-white/60 hover:text-white transition-colors flex-shrink-0"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Toast;
