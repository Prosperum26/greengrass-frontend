// Loading Component
export const Loading = ({ size = 'md', text = 'Đang tải...' }) => {
  const sizes = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className={`${sizes[size]} animate-spin`}>
        <div className="w-full h-full border-4 border-green-200 border-t-green-600 rounded-full" />
      </div>
      {text && <p className="text-gray-500 text-sm">{text}</p>}
    </div>
  );
};

export default Loading;
