// Reusable Button Component
export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
  onClick,
  type = 'button',
  fullWidth = false,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-surface active:scale-95 touch-manipulation';

  const variants = {
    primary: 'bg-primary text-white hover:bg-primary-light hover:shadow-lg hover:-translate-y-0.5 hover:shadow-primary/25 focus:ring-primary',
    secondary: 'bg-surface-highest text-ink hover:bg-surface-high hover:shadow-md hover:-translate-y-0.5 focus:ring-secondary',
    cta: 'bg-accent text-white hover:bg-accent-hover hover:shadow-lg hover:-translate-y-0.5 hover:shadow-accent/30 focus:ring-accent animate-pulse-glow',
    ghost: 'text-ink/70 hover:bg-surface-highest hover:text-primary hover:-translate-y-0.5 focus:ring-secondary',
    danger: 'bg-accent-hover text-white hover:brightness-110 hover:shadow-lg hover:-translate-y-0.5 focus:ring-accent-hover',
    outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 focus:ring-primary',
    white: 'bg-white text-primary hover:bg-white/90 hover:shadow-lg hover:-translate-y-0.5 hover:shadow-white/30 focus:ring-white',
  };

  // Responsive sizes - larger touch targets on mobile
  const sizes = {
    sm: 'px-3 sm:px-4 py-2.5 sm:py-2 text-sm min-h-[40px] sm:min-h-[36px]',
    md: 'px-4 sm:px-5 py-3 sm:py-2.5 text-sm sm:text-base min-h-[44px] sm:min-h-[40px]',
    lg: 'px-5 sm:px-6 py-3.5 sm:py-3 text-base sm:text-lg min-h-[48px] sm:min-h-[44px]',
    xl: 'px-6 sm:px-8 py-4 sm:py-4 text-lg sm:text-xl min-h-[52px] sm:min-h-[48px]',
  };

  const widthClass = fullWidth ? 'w-full' : '';

  const classes = `${baseStyles} ${variants[variant]} ${sizes[size]} ${widthClass} ${disabled ? 'opacity-50 cursor-not-allowed hover:transform-none hover:shadow-none' : ''} ${className}`;

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
