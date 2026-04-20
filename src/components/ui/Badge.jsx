// Reusable Badge Component
export const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  interactive = false,
}) => {
  const variants = {
    default: 'bg-surface-highest text-ink/70 hover:bg-surface-high hover:text-ink',
    primary: 'bg-primary/10 text-primary hover:bg-primary hover:text-white',
    success: 'bg-secondary/10 text-secondary hover:bg-secondary hover:text-white',
    warning: 'bg-accent/10 text-accent hover:bg-accent hover:text-white',
    danger: 'bg-accent-hover/10 text-accent-hover hover:bg-accent-hover hover:text-white',
    info: 'bg-blue-100 text-blue-800 hover:bg-blue-600 hover:text-white',
    verified: 'bg-primary-container/20 text-primary-container hover:bg-primary-container hover:text-white',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-sm',
    lg: 'px-3 py-1 text-base',
  };

  const interactiveStyles = interactive
    ? 'cursor-pointer transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 active:scale-95'
    : 'transition-colors duration-200';

  return (
    <span className={`inline-flex items-center font-medium rounded-full ${variants[variant]} ${sizes[size]} ${interactiveStyles} ${className}`}>
      {variant === 'verified' && (
        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      )}
      {children}
    </span>
  );
};

export default Badge;
