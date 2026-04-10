// Footer Component
export const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-green-600 rounded flex items-center justify-center">
              <span className="text-white font-bold text-xs">G</span>
            </div>
            <span className="text-sm text-gray-600">
              GreenGrass - Dự án Website quản lý sự kiện "Xanh"
            </span>
          </div>
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <a href="/about" className="hover:text-green-600">Về chúng tôi</a>
            <a href="/privacy" className="hover:text-green-600">Chính sách</a>
            <a href="/contact" className="hover:text-green-600">Liên hệ</a>
          </div>
          <p className="text-sm text-gray-400">
            2026 WebDev Studios. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
