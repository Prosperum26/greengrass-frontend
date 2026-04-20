// Section Title Component
export const SectionTitle = ({ title, subtitle, className = '', animated = true }) => {
  return (
    <div className={`text-center mb-10 ${className} ${animated ? 'group' : ''}`}>
      <h2 className="text-3xl md:text-4xl font-bold text-brown-900 mb-4 relative inline-block">
        {title}
        {animated && (
          <span className="absolute -bottom-1 left-0 w-0 h-1 bg-primary rounded-full group-hover:w-full transition-all duration-500" />
        )}
      </h2>
      {subtitle && (
        <p className="text-gray-600 text-lg max-w-2xl mx-auto group-hover:text-ink/70 transition-colors duration-300">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default SectionTitle;
