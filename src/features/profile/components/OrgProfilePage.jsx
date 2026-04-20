import React, { useEffect, useMemo, useState } from 'react';
import { eventsApi, usersApi } from '../../../api';
import { Link, useNavigate } from 'react-router-dom';

const OrgProfilePage = () => {
  const [organizer, setOrganizer] = useState(null);
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [tab, setTab] = useState('UPCOMING');

  useEffect(() => {
    const load = async () => {
      const [userRes, eventsRes] = await Promise.all([usersApi.getMe(), eventsApi.getAll({ page: 1, limit: 100 })]);
      setOrganizer(userRes.data);
      setEvents(eventsRes.data?.data?.items || []);
    };
    void load();
  }, []);

  const filteredEvents = useMemo(() => events.filter((event) => event.status === tab), [events, tab]);

  return (
    <div className="min-h-screen bg-surface p-6 text-ink md:p-10">
      <div className="mx-auto max-w-6xl space-y-8">

        <section className="rounded-2xl bg-surface-highest p-6 shadow-[0_24px_70px_rgba(33,26,20,0.08)] flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-primary">{organizer?.fullName || 'Hồ sơ Ban tổ chức'}</h1>
            <p className="mt-2 text-ink/75">Bảng điều khiển quản lý sự kiện và hoạt động cộng đồng.</p>
          </div>
          <button 
            onClick={() => navigate('/organizer/events/create')}
            className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 font-medium text-white hover:bg-primary-light transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Tạo sự kiện
          </button>
        </section>

        <section className="rounded-2xl bg-surface-highest p-6 shadow-[0_24px_70px_rgba(33,26,20,0.08)]">
          <div className="mb-4 flex gap-2">
            {['UPCOMING', 'ONGOING', 'COMPLETED'].map((status) => (
              <button
                key={status}
                onClick={() => setTab(status)}
                className={`rounded-xl px-4 py-2 text-sm font-semibold transition-colors ${
                  tab === status
                    ? 'bg-primary text-white'
                    : 'bg-surface-low text-ink/80 hover:bg-surface-high'
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {filteredEvents.length === 0 && (
              <p className="rounded-xl bg-surface-low p-4 text-sm text-ink/65">
                Không có sự kiện ở trạng thái này.
              </p>
            )}
            {filteredEvents.map((event) => (
              <Link
                key={event.id}
                to={`/events/${event.id}`}
                className="group block rounded-xl border border-ink/5 bg-surface-low p-4 transition-all hover:bg-surface-high hover:border-primary/30 hover:shadow-[0_8px_24px_rgba(33,26,20,0.08)] focus:outline-none focus:ring-2 focus:ring-primary/35 active:scale-[0.995]"
              >
                <h3 className="font-semibold text-ink group-hover:text-primary transition-colors">
                  {event.title}
                </h3>
                <p className="mt-1 text-sm text-ink/70 line-clamp-2">{event.description}</p>
                <span className="mt-2 inline-block text-xs font-semibold text-primary/80 opacity-0 transition-opacity group-hover:opacity-100">
                  Xem chi tiết →
                </span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default OrgProfilePage;
