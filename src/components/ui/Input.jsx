import { useId } from 'react';

// Reusable Input Component
export const Input = ({
  label,
  error,
  helperText,
  className = '',
  id,
  ...props
}) => {
  const generatedId = useId();
  const inputId = id || generatedId;
  
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label htmlFor={inputId} className="block text-xs font-semibold tracking-wider text-ink/70 mb-2 uppercase">
          {label}
        </label>
      )}
      <div className={`rounded-xl bg-surface-highest px-4 py-3 transition ${error ? 'ring-2 ring-accent-hover/40' : 'focus-within:ring-2 focus-within:ring-primary/40'}`}>
        <input
          id={inputId}
          className="w-full bg-transparent text-ink placeholder:text-ink/40 outline-none"
          {...props}
        />
        <div className={`mt-2 h-[2px] w-full rounded-full ${error ? 'bg-accent-hover' : 'bg-primary/25'}`} />
      </div>
      {error && <p className="mt-2 text-sm text-accent-hover">{error}</p>}
      {helperText && !error && <p className="mt-2 text-sm text-ink/60">{helperText}</p>}
    </div>
  );
};

export default Input;
