import React from 'react';
import './EventDetail.css';

export const EventDetail = () => {
  return (
    <div className="event-detail-container">
      {/* 1. Header */}
      <header className="site-header">
        <div className="logo-text">
          Green<span className="logo-highlight">Grass</span>
        </div>
        <nav className="main-nav">
          <a href="#about" className="nav-link">About Us</a>
          <a href="#report" className="nav-link">Report</a>
        </nav>
        <button className="btn-login">username</button>
      </header>

      {/* 2. Main Content */}
      <main className="event-detail-main">
        <h1 className="event-detail-title">Sự kiện 1</h1>
        <br></br>
        <p className="event-detail-org">Đơn vị tổ chức</p>

        {/* Action Bar */}
        <div className="event-action-bar" align="center">
          <div className="action-item">
            <div className="action-icon">📍</div>
            <span className="action-label">Explore</span>
          </div>
          <div className="action-item">
            <div className="action-icon">🔖</div>
            <span className="action-label">Join</span>
          </div>
          <div className="action-item">
            <div className="action-icon">📷</div>
            <span className="action-label">QR Scanning</span>
          </div>
        </div>

        {/* Description Body */}
        <div className="event-description-box">
          [Mô tả sơ qua]: Excepteur efficient emerging, minim veniam enim aute carefully curated Ginza conversation exquisite perfect nostrud nisi intricate Content. Qui international first-class nulla ut. Punctual adipisicing, essential lovely queen tempor eiusmod irure. Exclusive izakaya charming Scandinavian impeccable aute quality of life soft power pariatur Melbourne occaecat discerning. Qui wardrobe aliquip, et Porter destination Toto remarkable officia Helsinki excepteur Basset hound. Zürich sleepy perfect consectetur.
        </div>

        {/* Info Box */}
        <div className="event-info-block">
          <p>Thời gian:</p>
          <p>Địa điểm:</p>
          <p>Đơn vị tổ chức:</p>
        </div>

        {/* Image Grid */}
        <div className="event-image-grid">
          <img 
            src="https://images.unsplash.com/photo-1543157145-f78c636d023d" 
            alt="Event Reference 1" 
          />
          <img 
            src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085" 
            alt="Event Reference 2" 
          />
        </div>

        {/* Notes & Gifts */}
        <div className="event-notes">
          <p>Lưu ý:</p>
          <ul>
            <li>Nên đem theo ....</li>
          </ul>
          <p>Quà tặng: 1 bó rau má</p>
          <p style={{ marginTop: '1.5rem', marginBottom: '0.5rem' }}>Map:</p>
        </div>

        {/* Map Image Dummy */}
        <div className="event-map-container">
          <img 
            src="https://images.unsplash.com/photo-1473449176378-0056cb04c3c6?q=80&w=2000&auto=format&fit=crop" 
            alt="Map Preview" 
            className="event-map-img"
          />
        </div>
      </main>

      {/* 3. Participants Section */}
      <section className="event-participants-section">
        <div className="participants-inner">
          <h2 className="participants-title">Danh sách tham gia</h2>
          <div className="participants-list">
            <div className="participant-item">
              <div className="participant-avatar">A</div>
              <span className="participant-name">User X</span>
            </div>
            <div className="participant-item">
              <div className="participant-avatar">A</div>
              <span className="participant-name">User X</span>
            </div>
            <div className="participant-item">
              <div className="participant-avatar">A</div>
              <span className="participant-name">User X</span>
            </div>
            <div className="participant-item">
              <div className="participant-avatar">A</div>
              <span className="participant-name">User X</span>
            </div>
            <div className="participant-item">
              <div className="participant-avatar">A</div>
              <span className="participant-name">User X</span>
            </div>
            <div className="participant-item">
              <div className="participant-avatar">A</div>
              <span className="participant-name">User X</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Footer */}
      <footer className="site-footer">
        <div>
          <div className="logo-text">
            Green<span className="logo-highlight" style={{color: '#3A5E27'}}>Grass</span>
          </div>
          <p style={{ marginTop: "0.5rem", opacity: 0.7, fontSize: "0.9rem" }}>
            © 2026 GreenGrass System. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default EventDetail;
