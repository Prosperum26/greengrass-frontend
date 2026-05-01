import React from 'react';
import { Button } from '../../../components/ui';
import { useNavigate } from 'react-router-dom';
import heroImage from '../../../assets/hero.png';

export const HeroSection = ({ stats }) => {
  const navigate = useNavigate();

  return (
    <section className="relative bg-gradient-to-b from-green-50 to-white pt-12 sm:pt-16 lg:pt-24 pb-16 sm:pb-20 lg:pb-28">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 items-center">

          {/* Text Content */}
          <div className="flex flex-col space-y-4 sm:space-y-6 lg:space-y-8 animate-fade-in text-left order-2 lg:order-1">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-brown-900 tracking-tight leading-tight">
              Hành động <span className="text-primary">Xanh</span>,<br className="hidden sm:block" />
              <span className="block sm:inline"> Kết nối <span className="text-accent">Cộng đồng</span></span>
            </h1>

            <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-lg">
              GreenGrass kết nối sinh viên và cộng đồng thông qua các sự kiện môi trường ý nghĩa. Tham gia, tích lũy điểm và góp phần xây dựng một lối sống bền vững.
            </p>

            <div className="flex flex-col xs:flex-row gap-3 sm:gap-4 pt-2 sm:pt-4">
              <Button size="lg" fullWidth onClick={() => navigate('/events')} className="shadow-lg shadow-primary/30">
                <span className="hidden xs:inline">Tham gia Sự kiện</span>
                <span className="xs:hidden">Tham gia</span>
              </Button>
              <Button variant="outline" size="lg" fullWidth onClick={() => navigate('/map')} className="bg-white">
                Khám phá Bản đồ
              </Button>
            </div>

            <div className="flex flex-col xs:flex-row items-start xs:items-center gap-3 sm:gap-6 pt-2 sm:pt-4 text-sm font-medium text-gray-500">
              <div className="group flex items-center cursor-pointer transition-all duration-300 hover:text-primary">
                <span className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-green-100 text-primary font-bold mr-2 transition-all duration-300 group-hover:bg-primary group-hover:text-white group-hover:scale-110 group-hover:shadow-md flex-shrink-0">✓</span>
                <span>Dễ dàng kiếm điểm</span>
              </div>
              <div className="group flex items-center cursor-pointer transition-all duration-300 hover:text-primary">
                <span className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-green-100 text-primary font-bold mr-2 transition-all duration-300 group-hover:bg-primary group-hover:text-white group-hover:scale-110 group-hover:shadow-md flex-shrink-0">✓</span>
                <span>Kết bạn mới</span>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative mt-4 sm:mt-6 lg:mt-0 lg:ml-auto w-full max-w-xs sm:max-w-sm md:max-w-md mx-auto z-10 order-1 lg:order-2">
            {/* Decoration elements */}
            <div className="absolute top-0 -left-4 w-48 h-48 sm:w-56 sm:h-56 lg:w-72 lg:h-72 bg-primary-light/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>
            <div className="absolute top-0 -right-4 w-48 h-48 sm:w-56 sm:h-56 lg:w-72 lg:h-72 bg-accent/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>

            <img
              src={heroImage}
              alt="GreenGrass Hero"
              className="relative rounded-2xl sm:rounded-3xl shadow-2xl object-cover h-[300px] sm:h-[380px] lg:h-[450px] w-full border border-gray-100 transform transition hover:scale-[1.02] duration-500"
            />

            {/* Floating badge */}
            <div className="absolute -bottom-4 -right-2 sm:-bottom-6 sm:-right-6 bg-white p-3 sm:p-4 rounded-lg sm:rounded-xl shadow-xl border border-gray-100 flex items-center space-x-2 sm:space-x-4 z-20 group hover:shadow-2xl hover:-translate-y-1 hover:scale-105 transition-all duration-500 cursor-pointer">
              <div className="bg-orange-100 p-1.5 sm:p-2 rounded-lg transition-all duration-300 group-hover:bg-accent group-hover:scale-110">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-accent group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <div>
                <p className="text-[10px] sm:text-xs text-gray-500 font-medium tracking-wide uppercase group-hover:text-accent transition-colors duration-300">Cộng đồng</p>
                <p className="text-sm sm:text-base text-brown-900 font-bold group-hover:text-primary transition-colors duration-300">{stats?.totalStudents || '1000+'}+ sinh viên</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;
