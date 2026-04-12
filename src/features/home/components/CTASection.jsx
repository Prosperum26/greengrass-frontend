import React from 'react';
import { Button } from '../../../components/ui';
import { useNavigate } from 'react-router-dom';

export const CTASection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-24 bg-primary relative overflow-hidden">
      {/* Decorative patterns */}
      <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-white opacity-5 rounded-full filter blur-xl"></div>
      <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-black opacity-10 rounded-full filter blur-xl"></div>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6 drop-shadow-md">
          Bắt đầu hành trình xanh của bạn hôm nay
        </h2>
        <p className="text-green-100 text-xl font-medium mb-10 max-w-2xl mx-auto drop-shadow-sm">
          Trở thành một phần của phong trào sống xanh vững mạnh và cùng chúng tôi tạo nên những thay đổi tích cực bắt đầu từ ngay bây giờ.
        </p>
        
        <Button 
          variant="white"
          size="lg" 
          onClick={() => navigate('/login')} 
          className="text-lg px-10 py-4 shadow-xl"
        >
          Tham Gia Ngay Miễn Phí
        </Button>
      </div>
    </section>
  );
};

export default CTASection;
