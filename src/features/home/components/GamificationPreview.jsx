import React from 'react';
import { Button } from '../../../components/ui';
import { useNavigate } from 'react-router-dom';
import leaderboardImg from '../../../assets/leaderboard_dummy.png';

// eslint-disable-next-line no-unused-vars
export const GamificationPreview = ({ stats, leaderboard = [] }) => {
  const navigate = useNavigate();

  return (
    <section className="bg-white">
      <div className="flex flex-col lg:flex-row min-h-[500px]">
        {/* Left Side: Text and Content */}
        <div className="w-full lg:w-1/2 bg-accent text-white p-12 lg:p-20 xl:p-28 flex flex-col justify-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white drop-shadow-md">Ghi Danh Trên Bảng Vàng</h2>
          <p className="text-orange-50 text-lg mb-8 max-w-lg leading-relaxed">
            Mỗi đóng góp của bạn đều được ghi nhận. Tích lũy điểm rèn luyện, thu thập huy hiệu độc đáo và thi đua cùng {stats?.totalStudents || 'hàng ngàn'} sinh viên khác trên toàn quốc. Sự nỗ lực của bạn là nguồn cảm hứng cho cộng đồng.
          </p>
          
          <div className="space-y-4 mb-10">
            <div className="group flex items-start p-4 rounded-xl transition-all duration-300 hover:bg-white/10 hover:-translate-x-1 cursor-pointer">
              <span className="text-2xl mr-4 group-hover:scale-125 group-hover:rotate-12 transition-transform duration-300">🥇</span>
              <div>
                <h4 className="font-bold text-xl drop-shadow-sm group-hover:text-white transition-colors">Người Dẫn Đầu</h4>
                <p className="text-orange-100 group-hover:text-orange-50 transition-colors">Top xuất sắc hàng tháng nhận giải.</p>
              </div>
            </div>
            <div className="group flex items-start p-4 rounded-xl transition-all duration-300 hover:bg-white/10 hover:-translate-x-1 cursor-pointer">
              <span className="text-2xl mr-4 group-hover:scale-125 group-hover:rotate-12 transition-transform duration-300">🏆</span>
              <div>
                <h4 className="font-bold text-xl drop-shadow-sm group-hover:text-white transition-colors">Huy Hiệu Giới Hạn</h4>
                <p className="text-orange-100 group-hover:text-orange-50 transition-colors">Chứng nhận hoạt động tích cực.</p>
              </div>
            </div>
          </div>
          
          <div>
            <Button 
              size="lg" 
              onClick={() => navigate('/leaderboard')} 
              className="bg-brown-900 text-white hover:bg-brown-800 border-none shadow-xl focus:ring-brown-800"
            >
              Xem Leaderboard
            </Button>
          </div>
        </div>

        {/* Right Side: Image */}
        <div className="w-full lg:w-1/2 relative bg-gray-100 min-h-[400px] lg:min-h-auto">
          <img 
            src={leaderboardImg} 
            alt="Leaderboard Preview" 
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
      </div>
    </section>
  );
};

export default GamificationPreview;
