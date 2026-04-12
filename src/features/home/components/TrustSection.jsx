import React from 'react';
import { SectionTitle } from '../../../components/ui';

export const TrustSection = () => {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          title="Tại sao nên dùng GreenGrass?"
          subtitle="Chúng tôi giải quyết những rào cản ngăn bạn đến với lối sống xanh."
        />

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          <div className="flex flex-col h-full p-6 bg-orange-50 rounded-2xl border border-orange-100 text-center transition-transform hover:-translate-y-1 duration-300">
            <div className="w-16 h-16 mx-auto bg-orange-200 text-accent rounded-full flex items-center justify-center mb-6">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            </div>
            <h3 className="text-xl font-bold text-brown-900 mb-3">Sự kiện rời rạc</h3>
            <p className="text-gray-600">Khó khăn trong việc tìm kiếm và theo dõi các hoạt động môi trường uy tín.</p>
          </div>

          <div className="flex flex-col h-full p-6 bg-red-50 rounded-2xl border border-red-100 text-center transition-transform hover:-translate-y-1 duration-300">
            <div className="w-16 h-16 mx-auto bg-red-200 text-red-600 rounded-full flex items-center justify-center mb-6">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <h3 className="text-xl font-bold text-brown-900 mb-3">Thiếu động lực</h3>
            <p className="text-gray-600">Dễ bỏ cuộc vì không có sự ghi nhận và phần thưởng xứng đáng.</p>
          </div>

          <div className="flex flex-col h-full p-6 bg-green-50 rounded-2xl border-2 border-primary-light/50 text-center transition-transform hover:-translate-y-1 duration-300 shadow-lg">
            <div className="w-16 h-16 mx-auto bg-primary text-white rounded-full flex items-center justify-center mb-6 shadow-md shadow-primary/30">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>
            </div>
            <h3 className="text-xl font-bold text-brown-900 mb-3">Giải pháp từ GreenGrass</h3>
            <p className="text-gray-700 font-medium">Hệ thống minh bạch, dễ dàng khám phá, kết hợp gamification điểm thưởng.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
