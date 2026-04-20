// Reusable Modal Component
import { useEffect } from 'react';

export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-all duration-300"
        onClick={onClose}
      />
      <div className={`relative bg-surface-high rounded-2xl shadow-2xl w-full ${sizes[size]} max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-100 animate-fade-in`}>
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-surface-highest">
            <h3 className="text-lg font-semibold text-primary">{title}</h3>
            {showCloseButton && (
              <button
                onClick={onClose}
                className="text-ink/40 hover:text-accent hover:bg-accent/10 p-2 rounded-full transition-all duration-300 hover:rotate-90 hover:scale-110"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        )}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
