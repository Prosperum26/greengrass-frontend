import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { eventsApi } from '../../../api';

export const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [checkedIn, setCheckedIn] = useState([]);
  const [qrToken, setQrToken] = useState('');
  const [activeTab, setActiveTab] = useState('participants');
  const [error, setError] = useState('');

  const role = localStorage.getItem('role');
  const isOrganizer = role === 'ORGANIZER';

  useEffect(() => {
    const load = async () => {
      try {
        const [eventRes, participantsRes] = await Promise.all([
          eventsApi.getById(id),
          eventsApi.getParticipants(id),
        ]);
        setEvent(eventRes.data);
        setParticipants(participantsRes.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load event');
      }
    };
    void load();
  }, [id]);

  useEffect(() => {
    if (!isOrganizer) return;
    const loadOrganizerData = async () => {
      try {
        const [checkedInRes, qrRes] = await Promise.all([
          eventsApi.getCheckedIn(id),
          eventsApi.getQrCode(id),
        ]);
        setCheckedIn(checkedInRes.data);
        setQrToken(qrRes.data?.qrToken || '');
      } catch {
        // optional organizer data
      }
    };
    void loadOrganizerData();
  }, [id, isOrganizer]);

  const canRegister = useMemo(() => role === 'STUDENT', [role]);

  const onRegister = async () => {
    try {
      await eventsApi.register(id);
      alert('Event registration completed');
    } catch (err) {
      alert(err.response?.data?.message || 'Registration failed');
    }
  };

  const onExportCsv = () => {
    window.open(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/events/${id}/export`, '_blank');
  };

  if (!event && !error) return <div className="min-h-screen bg-surface p-8 text-ink">Loading...</div>;

  return (
    <div className="min-h-screen bg-surface p-4 md:p-10">
      <div className="mx-auto max-w-5xl rounded-2xl bg-surface-high p-6 text-ink shadow-[0_24px_70px_rgba(33,26,20,0.10)]">
        <button onClick={() => navigate('/events')} className="mb-4 rounded-xl bg-surface-highest px-3 py-2 text-sm font-medium hover:bg-surface-high">
          Back
        </button>
        {error && <p className="mb-3 text-accent-hover">{error}</p>}
        {event && (
          <>
            <h1 className="text-3xl font-semibold font-display tracking-tight">{event.title}</h1>
            <p className="mt-3 text-ink/70">{event.description}</p>
            <div className="mt-4 grid gap-2 text-sm text-ink/60 md:grid-cols-2">
              <p>Status: {event.status}</p>
              <p>Location: {event.location}</p>
              <p>Start: {new Date(event.startTime).toLocaleString()}</p>
              <p>End: {new Date(event.endTime).toLocaleString()}</p>
            </div>

            {canRegister && (
              <button onClick={onRegister} className="mt-5 rounded-xl bg-accent px-5 py-2 text-white hover:bg-accent-hover shadow-[0_20px_50px_rgba(33,26,20,0.10)]">
                Register Event
              </button>
            )}
          </>
        )}

        <section className="mt-8">
          <h2 className="mb-3 text-xl font-semibold font-display">Participants</h2>
          <div className="space-y-2">
            {participants.map((item) => (
              <div key={item.userId} className="rounded-xl bg-surface-highest p-4 text-sm shadow-[0_16px_44px_rgba(33,26,20,0.06)]">
                {item.fullName} - {item.status}
              </div>
            ))}
          </div>
        </section>

        {isOrganizer && (
          <section className="mt-8">
            <div className="mb-3 flex gap-2">
              {['participants', 'checkin', 'qr', 'export'].map((tab) => (
                <button key={tab} onClick={() => setActiveTab(tab)} className={`rounded-xl px-3 py-2 text-sm font-medium ${activeTab === tab ? 'bg-primary text-white' : 'bg-surface-highest text-ink hover:bg-surface-high'}`}>
                  {tab.toUpperCase()}
                </button>
              ))}
            </div>

            {activeTab === 'checkin' && checkedIn.map((item) => (
              <div key={item.userId} className="mb-3 rounded-xl bg-surface-highest p-4 text-sm shadow-[0_16px_44px_rgba(33,26,20,0.06)]">
                {item.userId} - {item.status} - {item.checkInTime ? new Date(item.checkInTime).toLocaleString() : '-'}
              </div>
            ))}
            {activeTab === 'qr' && (
              <div className="rounded-xl bg-surface-highest p-4">
                <p className="mb-2 text-sm text-ink/60">Dynamic QR token</p>
                <code className="block overflow-x-auto text-secondary">{qrToken || 'No token available'}</code>
              </div>
            )}
            {activeTab === 'export' && (
              <button onClick={onExportCsv} className="rounded-xl bg-accent px-4 py-2 text-white hover:bg-accent-hover">
                Export CSV
              </button>
            )}
          </section>
        )}
      </div>
    </div>
  );
};

export default EventDetail;
