import React from "react";
import { EventCard } from "./EventCard";
import { eventsApi } from "../../../api";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";

export const EventList = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get('keyword') || '';
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const params = { page: 1, limit: 30 };
        if (keyword) {
          params.keyword = keyword;
        }
        const { data } = await eventsApi.getAll(params, { skipAuth: true });
        setEvents(data?.data?.items || []);
      } catch (err) {
        setError(err.response?.data?.message || "Không thể tải sự kiện");
      } finally {
        setLoading(false);
      }
    };
    void loadEvents();
  }, [keyword]);

  const onRegister = async (eventId) => {
    try {
      await eventsApi.register(eventId);
      alert("Đăng ký thành công");
    } catch (err) {
      alert(err.response?.data?.message || "Đăng ký thất bại");
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <div className="mb-8 flex items-baseline justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-primary font-headline">Khám phá Sự kiện</h1>
          <p className="mt-2 text-on-surface-variant">Tìm các hoạt động ý nghĩa bạn có thể tham gia ngay hôm nay.</p>
        </div>
        <span className="text-sm font-bold text-on-surface-variant">Sắp xếp: Mới nhất</span>
      </div>

      {keyword && (
        <div className="mb-4 flex items-center gap-2">
          <span className="text-sm text-on-surface-variant">
            Kết quả tìm kiếm cho: <strong className="text-primary">"{keyword}"</strong>
          </span>
          <button 
            onClick={() => navigate('/events')} 
            className="text-xs text-accent hover:underline"
          >
            Xóa tìm kiếm
          </button>
        </div>
      )}

      {loading && <p className="text-on-surface-variant">Đang tải sự kiện...</p>}
      {error && <p className="text-error">{error}</p>}
      {!loading && events.length === 0 && keyword && (
        <p className="text-on-surface-variant">Không tìm thấy sự kiện nào phù hợp.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {events.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            onRegister={onRegister}
            onDetail={(id) => navigate(`/events/${id}`)}
          />
        ))}
      </div>
    </div>
  );
};

export default EventList;