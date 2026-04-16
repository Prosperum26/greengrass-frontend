import React from 'react';
import { Link } from 'react-router-dom';
import './EventCard.css';

export const EventCard = ({ event, onRegister, onDetail }) => {
  const { title, description, date, location, points, imageUrl } = event;

  return (
    <div className="event-card">
      <div className="event-card-image">
        <img
          src={imageUrl || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09'}
          alt={title}
        />
        {points && (
          <div className="event-points-badge">
            +{points} điểm
          </div>
        )}
      </div>

      <div className="event-card-body">
        <h3 className="event-card-title">{title}</h3>
        
        <div className="event-card-details">
          <div className="event-card-detail-item">
            <span className="event-card-detail-icon">📅</span>
            <span>{date || 'Đang cập nhật'}</span>
          </div>
          <div className="event-card-detail-item">
            <span className="event-card-detail-icon">📍</span>
            <span>{location || 'Chưa có địa điểm'}</span>
          </div>
        </div>
        
        <p className="event-card-description">{description}</p>
        
        <div className="event-card-actions">
          <button 
            onClick={() => onRegister && onRegister(event)}
            className="btn-primary"
          >
            Tham gia
          </button>
          <button 
            onClick={() => onDetail && onDetail(event.id)}
            className="btn-secondary"
          >
            Chi tiết
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventCard;