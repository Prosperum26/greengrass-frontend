import React from "react";
import { EventCard } from "./EventCard";
import { eventsApi } from "../../../api";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";

const sortOptions = [
  { value: 'startTime:asc', label: 'Thời gian bắt đầu (Cũ → Mới)' },
  { value: 'startTime:desc', label: 'Thời gian bắt đầu (Mới → Cũ)' },
  { value: 'createdAt:desc', label: 'Mới đăng gần đây' },
  { value: 'title:asc', label: 'Tên A → Z' },
  { value: 'title:desc', label: 'Tên Z → A' },
  { value: 'points:desc', label: 'Điểm thưởng cao nhất' },
  { value: 'points:asc', label: 'Điểm thưởng thấp nhất' },
];

export const EventList = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get('keyword') || '';
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sort, setSort] = useState('startTime:asc');

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const [sortBy, sortOrder] = sort.split(':');
        const params = { page: 1, limit: 30, sortBy, sortOrder };
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
  }, [keyword, sort]);

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
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-on-surface-variant">Sắp xếp:</label>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="rounded-lg border border-surface-variant bg-white px-3 py-2 text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary/40 hover:bg-surface-container-highest transition-colors"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
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