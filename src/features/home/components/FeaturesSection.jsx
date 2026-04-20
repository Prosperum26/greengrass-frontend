import React from 'react';
import { SectionTitle } from '../../../components/ui';

const features = [
  {
    title: 'Khám phá Sự kiện',
    description: 'Tìm kiếm dự án xanh, hoạt động tình nguyện một cách dễ dàng và nhanh chóng.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
    ),
  },
  {
    title: 'Check-in QR & GPS',
    description: 'Ghi nhận tham gia chính xác bằng công nghệ quét QR chống gian lận.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" /></svg>
    ),
  },
  {
    title: 'Điểm & Huy hiệu',
    description: 'Gamification hấp dẫn giúp bạn luôn có động lực tương tác sống xanh mỗi ngày.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
    ),
  },
  {
    title: 'Bản đồ Điểm Xanh',
    description: 'Theo dõi trực quan mạng lưới cộng đồng bảo vệ môi trường xung quanh bạn.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
    ),
  }
];

export const FeaturesSection = () => {
  return (
    <section className="py-16 md:py-24 bg-gray-50 border-t border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle 
          title="Hệ Sinh Thái Tính Năng"
          subtitle="Tất cả những gì bạn cần để bắt đầu hành trình xanh, trong một nền tảng duy nhất."
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
          {features.map((feature, idx) => (
            <div key={idx} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-[0_25px_60px_rgba(35,70,18,0.12)] hover:border-primary/30 hover:-translate-y-3 transition-all duration-500 group cursor-pointer relative overflow-hidden">
              {/* Shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

              <div className="w-14 h-14 bg-green-50 text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300 rounded-xl flex items-center justify-center mb-6 group-hover:shadow-lg group-hover:scale-110 group-hover:rotate-3">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-brown-900 mb-3 group-hover:text-primary transition-colors duration-300">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed text-sm md:text-base group-hover:text-ink/70 transition-colors duration-300">{feature.description}</p>

              {/* Hover arrow */}
              <div className="mt-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-[-10px] group-hover:translate-x-0">
                <span className="text-primary text-sm font-medium flex items-center gap-1">
                  Tìm hiểu thêm
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
