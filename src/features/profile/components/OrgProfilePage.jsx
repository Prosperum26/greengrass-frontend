import React, { useEffect, useMemo, useState } from 'react';
import { eventsApi, usersApi } from '../../../api';
import { useNavigate } from 'react-router-dom';

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
    <div className="min-h-screen bg-[#251E18] p-6 text-white md:p-10">
      <div className="mx-auto max-w-6xl space-y-8">

        <section className="rounded-2xl bg-[#3D362B] p-6 shadow-xl flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold">{organizer?.fullName || 'Organizer profile'}</h1>
            <p className="mt-2 text-white/70">Organizer management dashboard for events and community operation.</p>
          </div>
          <button 
            onClick={() => navigate('/organizer/events/create')}
            className="flex items-center gap-2 rounded-xl bg-[#3A5E27] px-4 py-2.5 font-medium text-white hover:bg-[#4E7F35] transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Tạo sự kiện
          </button>
        </section>

        <section className="rounded-2xl bg-[#3D362B] p-6">
          <div className="mb-4 flex gap-2">
            {['UPCOMING', 'ONGOING', 'COMPLETED'].map((status) => (
              <button key={status} onClick={() => setTab(status)} className={`rounded-xl px-4 py-2 text-sm ${tab === status ? 'bg-[#3A5E27]' : 'bg-[#251E18]'}`}>
                {status}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {filteredEvents.map((event) => (
              <div key={event.id} className="rounded-xl bg-[#251E18] p-4">
                <h3 className="font-semibold">{event.title}</h3>
                <p className="mt-1 text-sm text-white/70">{event.description}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default OrgProfilePage;
