// Reusable Card Component
export const Card = ({ children, className = '', hover = false, interactive = false }) => {
  const baseStyles = 'bg-surface-high rounded-xl overflow-hidden';
  const hoverStyles = hover
    ? 'transition-all duration-300 hover:bg-surface-highest hover:shadow-xl hover:-translate-y-1 hover:shadow-primary/10 cursor-pointer'
    : '';
  const interactiveStyles = interactive
    ? 'transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 active:scale-[0.98] hover:shadow-primary/15'
    : '';

  return (
    <div className={`${baseStyles} ${hoverStyles} ${interactiveStyles} ${className}`}>
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className = '' }) => (
  <div className={`px-6 py-4 ${className}`}>
    {children}
  </div>
);

export const CardBody = ({ children, className = '' }) => (
  <div className={`px-6 py-4 ${className}`}>
    {children}
  </div>
);

export const CardFooter = ({ children, className = '' }) => (
  <div className={`px-6 py-4 bg-surface-low ${className}`}>
    {children}
  </div>
);

export default Card;
