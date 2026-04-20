import React from 'react';
import { SectionTitle } from '../../../components/ui';

const steps = [
  { id: '01', title: 'Khám phá', desc: 'Tìm kiếm dự án & sự kiện phù hợp.' },
  { id: '02', title: 'Đăng ký', desc: 'Nhấn tham gia và chia sẻ cho bạn bè.' },
  { id: '03', title: 'Check-in', desc: 'Sử dụng mã QR & GPS để nhận diện.' },
  { id: '04', title: 'Tích điểm', desc: 'Nhận điểm rèn luyện & huy hiệu.' }
];

export const HowItWorksSection = () => {
  return (
    <section className="py-16 md:py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionTitle 
          title="Bắt đầu Hành Trình"
          subtitle="Chỉ với 4 bước vô cùng đơn giản, bạn đã chính thức trở thành một chiến binh xanh."
        />
        
        <div className="mt-16 flex flex-col md:flex-row justify-between items-start md:items-center relative">
          {/* Connector Line */}
          <div className="hidden md:block absolute top-[48px] left-[10%] right-[10%] h-[3px] bg-gray-100 z-0"></div>
          
          {steps.map((step, idx) => (
            <div key={idx} className="relative z-10 flex flex-col items-center mb-12 md:mb-0 w-full md:w-1/4 group">
              <div className="w-24 h-24 bg-white border-4 border-primary text-primary transition-all duration-500 hover:bg-primary hover:text-white hover:scale-110 hover:shadow-[0_15px_40px_rgba(35,70,18,0.3)] hover:rotate-6 rounded-full flex items-center justify-center text-3xl font-bold shadow-lg mb-6 cursor-pointer relative overflow-hidden">
                {/* Shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                <span className="relative z-10">{step.id}</span>
              </div>
              <h3 className="text-xl font-bold text-brown-900 mb-2 group-hover:text-primary transition-colors duration-300">{step.title}</h3>
              <p className="text-gray-500 text-center px-4 md:px-2 group-hover:text-ink/60 transition-colors duration-300">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
      
      {/* Decorative background circle */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-gray-50 rounded-full z-0 opacity-50"></div>
    </section>
  );
};

export default HowItWorksSection;
