import React from 'react';
import { SectionTitle, Button } from '../../../components/ui';
import { useNavigate } from 'react-router-dom';
import img1 from '../../../assets/event_dummy1.png';
import img2 from '../../../assets/event_dummy2.png';
import img3 from '../../../assets/event_dummy3.png';

const events = [
  { img: img1, title: 'Hội Thảo Hành Động Xanh', time: 'Thứ 7, 15/05/2026', location: 'Hội trường A, ĐH Tôn Đức Thắng', participants: 120 },
  { img: img2, title: 'Quyên Góp Sách Đổi Cây', time: 'Chủ Nhật, 16/05/2026', location: 'Khu A Ký túc xá ĐHQG HCM', participants: 350 },
  { img: img3, title: 'Thu Gom Rác Hỗ Trợ Đảo Xa', time: 'Thứ 5, 20/05/2026', location: 'Khu vực bãi biển Cần Giờ', participants: 45 }
];

export const HighlightEvents = () => {
  const navigate = useNavigate();

  return (
    <section className="py-16 md:py-24 bg-gray-50 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle 
          title="Sự Kiện Nổi Bật Sắp Tới"
          subtitle="Rất nhiều sự kiện thú vị đang chờ đón bạn tham gia và đóng góp."
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {events.map((event, idx) => (
            <div key={idx} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-shadow duration-300 group cursor-pointer" onClick={() => navigate('/events')}>
              <div className="relative h-48 overflow-hidden bg-gray-200">
                <img src={event.img} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold text-primary shadow-sm">
                  {event.participants}+ tham gia
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-brown-900 mb-2 group-hover:text-primary transition-colors">{event.title}</h3>
                <div className="space-y-2 mt-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    {event.time}
                  </div>
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    {event.location}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Button variant="outline" size="lg" onClick={() => navigate('/events')}>
            Xem Tất Cả Sự Kiện
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HighlightEvents;
