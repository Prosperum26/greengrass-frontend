// Reusable Button Component
export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
  onClick,
  type = 'button',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-surface active:scale-95';

  const variants = {
    primary: 'bg-primary text-white hover:bg-primary-light hover:shadow-lg hover:-translate-y-0.5 hover:shadow-primary/25 focus:ring-primary',
    secondary: 'bg-surface-highest text-ink hover:bg-surface-high hover:shadow-md hover:-translate-y-0.5 focus:ring-secondary',
    cta: 'bg-accent text-white hover:bg-accent-hover hover:shadow-lg hover:-translate-y-0.5 hover:shadow-accent/30 focus:ring-accent animate-pulse-glow',
    ghost: 'text-ink/70 hover:bg-surface-highest hover:text-primary hover:-translate-y-0.5 focus:ring-secondary',
    danger: 'bg-accent-hover text-white hover:brightness-110 hover:shadow-lg hover:-translate-y-0.5 focus:ring-accent-hover',
    outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 focus:ring-primary',
    white: 'bg-white text-primary hover:bg-white/90 hover:shadow-lg hover:-translate-y-0.5 hover:shadow-white/30 focus:ring-white',
  };

  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2.5 text-base',
    lg: 'px-6 py-3 text-base',
    xl: 'px-8 py-4 text-lg',
  };

  const classes = `${baseStyles} ${variants[variant]} ${sizes[size]} ${disabled ? 'opacity-50 cursor-not-allowed hover:transform-none hover:shadow-none' : ''} ${className}`;

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
