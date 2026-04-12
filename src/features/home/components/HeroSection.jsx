import React from 'react';
import { Button } from '../../../components/ui';
import { useNavigate } from 'react-router-dom';
import heroImage from '../../../assets/hero.png';

export const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative bg-gradient-to-b from-green-50 to-white pt-16 pb-20 lg:pt-24 lg:pb-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          <div className="flex flex-col space-y-8 animate-fade-in text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-brown-900 tracking-tight leading-tight">
              Hành động <span className="text-primary">Xanh</span>,<br />
              Kết nối <span className="text-accent">Cộng đồng</span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-600 max-w-lg">
              GreenGrass kết nối sinh viên và cộng đồng thông qua các sự kiện môi trường ý nghĩa. Tham gia, tích lũy điểm và góp phần xây dựng một lối sống bền vững.
            </p>
            
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 pt-4">
              <Button size="lg" onClick={() => navigate('/events')} className="shadow-lg shadow-primary/30">
                Tham gia Sự kiện
              </Button>
              <Button variant="outline" size="lg" onClick={() => navigate('/map')} className="bg-white">
                Khám phá Bản đồ
              </Button>
            </div>
            
            <div className="flex items-center space-x-6 pt-4 text-sm font-medium text-gray-500">
              <div className="flex items-center">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-primary font-bold mr-2">✓</span>
                Dễ dàng kiếm điểm
              </div>
              <div className="flex items-center">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-primary font-bold mr-2">✓</span>
                Kết bạn mới
              </div>
            </div>
          </div>
          
          <div className="relative mt-10 lg:mt-0 lg:ml-auto w-full max-w-md mx-auto z-10">
            {/* Decoration elements inside the hero image block */}
            <div className="absolute top-0 -left-4 w-72 h-72 bg-primary-light/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>
            <div className="absolute top-0 -right-4 w-72 h-72 bg-accent/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>
            
            <img 
               src={heroImage} 
               alt="GreenGrass Hero" 
               className="relative rounded-3xl shadow-2xl object-cover h-[450px] w-full border border-gray-100 transform transition hover:scale-[1.02] duration-500"
            />
            
            {/* Floating badge over image */}
            <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-xl shadow-xl border border-gray-100 flex items-center space-x-4 z-20">
              <div className="bg-orange-100 p-2 rounded-lg">
                <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium tracking-wide uppercase">Cộng đồng</p>
                <p className="text-brown-900 font-bold">1000+ sinh viên</p>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
