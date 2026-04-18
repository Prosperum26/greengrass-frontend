import React, { useEffect, useMemo, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { eventsApi } from '../../../api';
import { useAuthContext } from '../../../hooks/useAuthContext';

export const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getUserId, getRole } = useAuthContext();
  
  const [event, setEvent] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [checkedIn, setCheckedIn] = useState([]);
  const [qrToken, setQrToken] = useState('');
  const [activeTab, setActiveTab] = useState('participants');
  const [error, setError] = useState('');
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const fileInputRef = useRef(null);

  const role = getRole();
  const isOrganizer = role === 'ORGANIZER';

  useEffect(() => {
    const load = async () => {
      try {
        const [eventRes, participantsRes] = await Promise.all([
          eventsApi.getById(id),
          eventsApi.getParticipants(id),
        ]);
        setEvent(eventRes.data?.data || null);
        setParticipants(participantsRes.data?.data?.participants || []);
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
        setCheckedIn(checkedInRes.data || []);
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
      // Refetch participants
      const participantsRes = await eventsApi.getParticipants(id);
      setParticipants(participantsRes.data?.data?.participants || []);
    } catch (err) {
      alert(err.response?.data?.message || 'Registration failed');
    }
  };

  const onUnregister = async () => {
    if (!window.confirm('Are you sure you want to cancel your registration?')) return;
    try {
      await eventsApi.cancelRegister(id);
      alert('Registration cancelled successfully');
      // Refetch participants
      const participantsRes = await eventsApi.getParticipants(id);
      setParticipants(participantsRes.data?.data?.participants || []);
    } catch (err) {
      alert(err.response?.data?.message || 'Cancel registration failed');
    }
  };

  const currentUserId = getUserId();
  const isRegistered = useMemo(() => {
    return participants.some(p => p.userId === currentUserId || p.userId === parseInt(currentUserId, 10));
  }, [participants, currentUserId]);

  const handleGalleryUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('File quá lớn. Vui lòng chọn ảnh < 5MB');
      return;
    }
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      alert('Định dạng ảnh không hợp lệ.');
      return;
    }

    setUploadingGallery(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const res = await eventsApi.addGalleryImage(id, formData);
      setEvent(prev => ({
        ...prev,
        galleryImages: res.data?.data?.galleryImages || [...(prev.galleryImages || []), res.data.url]
      }));
    } catch (err) {
      alert(err.response?.data?.message || 'Lỗi tải ảnh lên');
    } finally {
      setUploadingGallery(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
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
            {event.coverImageUrl && (
              <img src={event.coverImageUrl} alt={event.title} loading="lazy" className="w-full h-64 object-cover rounded-2xl mb-6 shadow-md" />
            )}
            <h1 className="text-3xl font-semibold font-display tracking-tight">{event.title}</h1>
            <p className="mt-3 text-ink/70">{event.description}</p>
            <div className="mt-4 grid gap-2 text-sm text-ink/60 md:grid-cols-2">
              <p>Status: {event.status}</p>
              <p>Location: {event.location}</p>
              <p>Start: {new Date(event.startTime).toLocaleString()}</p>
              <p>End: {new Date(event.endTime).toLocaleString()}</p>
            </div>

            {canRegister && !isRegistered && (
              <button onClick={onRegister} className="mt-5 rounded-xl bg-accent px-5 py-2 text-white hover:bg-accent-hover shadow-[0_20px_50px_rgba(33,26,20,0.10)]">
                Register Event
              </button>
            )}
            {canRegister && isRegistered && (
              <button onClick={onUnregister} className="mt-5 rounded-xl bg-secondary px-5 py-2 text-white hover:bg-secondary/90 shadow-[0_20px_50px_rgba(33,26,20,0.10)]">
                Cancel Registration
              </button>
            )}
          </>
        )}

        <section className="mt-8">
          <h2 className="mb-3 text-xl font-semibold font-display">Participants</h2>
          <div className="space-y-2">
            {participants.length === 0 && <p className="text-sm text-ink/60">No participants yet.</p>}
            {participants.map((item) => (
              <div key={item.userId} className="rounded-xl bg-surface-highest p-4 text-sm shadow-[0_16px_44px_rgba(33,26,20,0.06)]">
                {item.fullName || item.email || item.userId} - {item.status}
              </div>
            ))}
          </div>
        </section>

        {isOrganizer && (
          <section className="mt-8">
            <div className="mb-3 flex gap-2">
              {['participants', 'checkin', 'qr', 'gallery'].map((tab) => (
                <button key={tab} onClick={() => setActiveTab(tab)} className={`rounded-xl px-3 py-2 text-sm font-medium ${activeTab === tab ? 'bg-primary text-white' : 'bg-surface-highest text-ink hover:bg-surface-high'}`}>
                  {tab.toUpperCase()}
                </button>
              ))}
            </div>

            {activeTab === 'checkin' && checkedIn.length === 0 && (
              <p className="text-sm text-ink/60">No check-ins yet.</p>
            )}
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
            {activeTab === 'gallery' && (
              <div className="rounded-xl bg-surface-highest p-4">
                <div className="flex justify-between items-center mb-4">
                  <p className="text-sm text-ink/60">Event Gallery</p>
                  <div>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      className="hidden" 
                      accept="image/jpeg,image/png,image/webp" 
                      onChange={handleGalleryUpload} 
                    />
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadingGallery}
                      className="rounded-lg bg-surface px-4 py-2 text-sm font-medium hover:bg-surface-high disabled:opacity-50"
                    >
                      {uploadingGallery ? 'Uploading...' : '+ Add Image'}
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {(!event.galleryImages || event.galleryImages.length === 0) && (
                    <p className="text-sm text-ink/40 col-span-full">No images in gallery yet.</p>
                  )}
                  {event.galleryImages?.map((url, idx) => (
                    <div key={idx} className="aspect-square rounded-xl overflow-hidden bg-surface-low border border-surface-highest">
                      <img src={url} alt={`gallery-${idx}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
};

export default EventDetail;
