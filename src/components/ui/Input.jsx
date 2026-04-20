import { useId } from 'react';

// Reusable Input Component
export const Input = ({
  label,
  error,
  helperText,
  className = '',
  id,
  icon,
  ...props
}) => {
  const generatedId = useId();
  const inputId = id || generatedId;

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label htmlFor={inputId} className="block text-xs font-semibold tracking-wider text-ink/70 mb-2 uppercase hover:text-primary transition-colors duration-300 cursor-pointer">
          {label}
        </label>
      )}
      <div className={`group rounded-xl bg-surface-highest px-4 py-3 transition-all duration-300 hover:shadow-md hover:bg-white ${error ? 'ring-2 ring-accent-hover/40' : 'focus-within:ring-2 focus-within:ring-primary/40 focus-within:shadow-lg focus-within:bg-white hover:focus-within:ring-primary/50'}`}>
        <div className="flex items-center gap-3">
          {icon && (
            <span className="material-symbols-outlined text-ink/40 group-hover:text-primary group-focus-within:text-primary transition-all duration-300 group-hover:scale-110">
              {icon}
            </span>
          )}
          <input
            id={inputId}
            className="w-full bg-transparent text-ink placeholder:text-ink/40 outline-none"
            {...props}
          />
        </div>
        <div className={`mt-2 h-[2px] w-full rounded-full transition-all duration-300 ${error ? 'bg-accent-hover' : 'bg-primary/25 group-hover:bg-primary/40 group-focus-within:bg-primary group-focus-within:h-[3px]'}`} />
      </div>
      {error && <p className="mt-2 text-sm text-accent-hover animate-fade-in">{error}</p>}
      {helperText && !error && <p className="mt-2 text-sm text-ink/60">{helperText}</p>}
    </div>
  );
};

export default Input;
