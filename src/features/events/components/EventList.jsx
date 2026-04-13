import React from "react";
import { EventCard } from "./EventCard";
import { useNavigate } from "react-router-dom";
import "./EventList.css";

// Mock Data
const MOCK_EVENTS = [
  {
    id: 1,
    title: "Green Sunday: Dọn rác KTX Khu A",
    description:
      "Hoạt động dọn rác định kỳ do CLB Môi Trường UIT tổ chức nhằm cải thiện không gian sống xanh – sạch – đẹp cho sinh viên khu A.",
    date: "08:00 - 14/04/2026",
    location: "Ký túc xá Khu A, ĐHQG-HCM (Thủ Đức)",
    points: 5,
    imageUrl: "https://images.unsplash.com/photo-1618477461853-cf6ed80fca73",
  },
  {
    id: 2,
    title: "UIT x UEL: Trồng cây phủ xanh khuôn viên",
    description:
      "Sự kiện liên trường giữa UIT và UEL, cùng trồng 300 cây xanh quanh khu giảng đường.",
    date: "07:30 - 20/04/2026",
    location: "Khuôn viên Đại học Công nghệ Thông tin (UIT)",
    points: 6,
    imageUrl: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09",
  },
  {
    id: 3,
    title: "Workshop: Tái chế rác thải nhựa",
    description:
      "Tổ chức bởi CLB Green Life - USSH. Hướng dẫn phân loại và tái chế rác nhựa.",
    date: "14:00 - 25/04/2026",
    location: "ĐH KHXH&NV (USSH)",
    points: 3,
    imageUrl: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b",
  },
  {
    id: 4,
    title: "Đổi rác lấy cây",
    description:
      "Mang chai nhựa, pin cũ hoặc giấy vụn để đổi lấy cây xanh.",
    date: "09:00 - 05/05/2026",
    location: "Sân trung tâm ĐHQG-HCM",
    points: 4,
    imageUrl: "https://images.unsplash.com/photo-1543157145-f78c636d023d",
  },
  {
    id: 5,
    title: "Earth Hour ĐHQG 2026",
    description:
      "Sự kiện hưởng ứng Giờ Trái Đất.",
    date: "20:00 - 15/05/2026",
    location: "Nhà Văn hóa Sinh viên",
    points: 5,
    imageUrl: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085",
  },
  {
    id: 6,
    title: "Đạp xe xanh",
    description:
      "Hoạt động đạp xe tuyên truyền lối sống xanh.",
    date: "06:00 - 22/05/2026",
    location: "Làng Đại học ĐHQG-HCM",
    points: 8,
    imageUrl: "https://images.unsplash.com/photo-1523983388277-336a66bf9bcd",
  },
];

export const EventList = ({
  events = MOCK_EVENTS,
  isLoading,
  onRegister,
  onLoadMore,
  hasMore = true,
}) => {
  const navigate = useNavigate();

  const handleDetail = (eventId) => {
    navigate(`/events/${eventId}`);
  };

  const featuredEvents = events.slice(0, 3);
  const otherEvents = events.slice(3);

  return (
    <div className="page-container">
      {/* Header */}
      <header className="site-header">
        <div className="logo-text">
          Green<span className="logo-highlight">Grass</span>
        </div>
        <nav className="main-nav">
          <a href="#about" className="nav-link">About Us</a>
          <a href="#report" className="nav-link">Report</a>
        </nav>
        <button className="btn-login">Log In</button>
      </header>

      {/* Hero */}
      <section className="hero-section">
        <img
          src="https://images.unsplash.com/photo-1501004318641-b39e6451bec6"
          className="hero-bg"
          alt="background"
        />
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h2 className="hero-title">GreenGrass</h2>
          <p className="hero-desc">
            Khám phá và tham gia các sự kiện xanh trong Làng Đại học.
          </p>
        </div>
      </section>

      {/* Main */}
      <main className="main-content">
        {/* Featured */}
        <section className="section-wrapper section-white">
          <div className="container-inner">
            <h2 className="section-title">Sự Kiện Nổi Bật</h2>
            <div className="event-grid">
              {featuredEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  onRegister={onRegister}
                  onDetail={handleDetail}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Other */}
        <section className="section-wrapper section-green">
          <div className="container-inner">
            <h2 className="section-title">Sự Kiện Khác</h2>
            <div className="event-grid">
              {otherEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  onRegister={onRegister}
                  onDetail={handleDetail}
                />
              ))}
            </div>

            {hasMore && (
              <div className="text-center">
                <button
                  onClick={onLoadMore}
                  disabled={isLoading}
                  className="btn-load-more"
                >
                  {isLoading ? "Đang tải..." : "Xem thêm"}
                </button>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="site-footer">
        <div className="logo-text">
          Green<span className="logo-highlight">Grass</span>
        </div>
      </footer>
    </div>
  );
};

export default EventList;