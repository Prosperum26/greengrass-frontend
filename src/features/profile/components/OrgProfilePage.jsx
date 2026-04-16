import React, { useEffect, useMemo, useState } from 'react';
import { eventsApi, usersApi } from '../../../api';

const OrgProfilePage = () => {
  const [organizer, setOrganizer] = useState(null);
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
        <section className="rounded-2xl bg-[#3D362B] p-6 shadow-xl">
          <h1 className="text-2xl font-semibold">{organizer?.fullName || 'Organizer profile'}</h1>
          <p className="mt-2 text-white/70">Organizer management dashboard for events and community operation.</p>
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
