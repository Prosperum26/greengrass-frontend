// Section Title Component
export const SectionTitle = ({ title, subtitle, className = '' }) => {
  return (
    <div className={`text-center mb-10 ${className}`}>
      <h2 className="text-3xl md:text-4xl font-bold text-brown-900 mb-4">{title}</h2>
      {subtitle && (
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default SectionTitle;
