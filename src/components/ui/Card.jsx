// Reusable Card Component
export const Card = ({ children, className = '', hover = false }) => {
  const baseStyles = 'bg-surface-high rounded-xl overflow-hidden';
  const hoverStyles = hover ? 'transition duration-300 hover:bg-surface-highest cursor-pointer' : '';
  
  return (
    <div className={`${baseStyles} ${hoverStyles} ${className}`}>
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
