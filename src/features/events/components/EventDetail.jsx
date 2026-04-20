import React, { useEffect, useMemo, useState, useRef, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { eventsApi, usersApi } from '../../../api';
import { useAuthContext } from '../../../hooks/useAuthContext';
import { useError } from '../../../hooks/useError';
import { BrowserQRCodeSvgWriter } from '@zxing/browser';

export const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getUserId, getRole } = useAuthContext();
  const { addError } = useError();
  
  const [event, setEvent] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [checkedIn, setCheckedIn] = useState([]);
  const [qrToken, setQrToken] = useState('');
  const [activeTab, setActiveTab] = useState('participants');
  const [error, setError] = useState('');
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [qrCountdown, setQrCountdown] = useState(30);
  const fileInputRef = useRef(null);
  const qrWriterRef = useRef(null);

  const userId = useMemo(() => getUserId(), [getUserId]);
  const role = useMemo(() => getRole(), [getRole]);
  const isAdmin = role === 'ADMIN';
  const isOrganizer = role === 'ORGANIZER';
  
  // Check if current user is the event owner (organizer who created the event)
  const isEventOwner = isOrganizer && event?.organizerId === userId;
  
  // Can view participants if: admin, or organizer who owns the event
  const canViewParticipants = isAdmin || isEventOwner;
  
  // Can register if: student, or organizer viewing someone else's event
  const canRegister = role === 'STUDENT' || (isOrganizer && !isEventOwner);
  const statusTone = useMemo(() => {
    const status = event?.status;
    if (status === 'ONGOING') return 'bg-secondary/20 text-secondary';
    if (status === 'COMPLETED') return 'bg-ink/10 text-ink/70';
    return 'bg-accent/20 text-accent-hover';
  }, [event?.status]);

  // Cleanup QR URL on unmount or when QR changes
  useEffect(() => {
    return () => {
      if (qrDataUrl) {
        URL.revokeObjectURL(qrDataUrl);
      }
    };
  }, [qrDataUrl]);

  useEffect(() => {
    const load = async () => {
      try {
        const eventRes = await eventsApi.getById(id);
        const eventData = eventRes.data?.data || null;
        setEvent(eventData);

        // After getting event data, check if we should load organizer data
        const currentUserId = getUserId();
        const currentRole = getRole();
        const isCurrentAdmin = currentRole === 'ADMIN';
        const isCurrentOrganizer = currentRole === 'ORGANIZER';
        const isCurrentOwner = isCurrentOrganizer && eventData?.organizerId === currentUserId;
        
        if (isCurrentAdmin || isCurrentOwner) {
          try {
            const participantsRes = await eventsApi.getParticipants(id);
            setParticipants(participantsRes?.data?.data?.participants || []);
          } catch {
            // Silently fail if can't load participants
          }
        }
        
        if (canRegister) {
          try {
            const myEventsRes = await usersApi.getMyEvents();
            const rawMyEvents = myEventsRes?.data?.data || myEventsRes?.data || [];
            const myEvents = Array.isArray(rawMyEvents) ? rawMyEvents : [];
            setIsRegistered(
              myEvents.some((item) => String(item?.id) === id || String(item?.eventId) === id),
            );
          } catch {
            // Silently fail
          }
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Không thể tải sự kiện');
        addError(err.response?.data?.message || 'Không thể tải sự kiện');
      }
    };
    load();
  }, [id, canRegister, getUserId, getRole, addError]);

  // Initialize QR writer
  useEffect(() => {
    qrWriterRef.current = new BrowserQRCodeSvgWriter();
  }, []);

  // Generate QR code with check-in URL
  const generateQrCode = useCallback(() => {
    if (!qrToken || !qrWriterRef.current || !id) return;
    
    try {
      // Create check-in URL that users can scan and visit
      const checkInUrl = `${window.location.origin}/checkin/${id}?token=${encodeURIComponent(qrToken)}`;
      const svgElement = qrWriterRef.current.write(checkInUrl, 300, 300);
      const svgData = new XMLSerializer().serializeToString(svgElement);
      const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      setQrDataUrl(url);
    } catch {
      // Failed to generate QR
    }
  }, [qrToken, id]);

  // Load organizer data
  useEffect(() => {
    // Only load organizer data if: admin, or organizer who owns the event
    if (!isAdmin && !isEventOwner) return;
    
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
  }, [id, isAdmin, isEventOwner]);

  // Refresh QR code when token changes
  useEffect(() => {
    if (qrToken) {
      generateQrCode();
      setQrCountdown(30);
    }
  }, [qrToken, generateQrCode]);

  // Countdown timer for QR refresh
  useEffect(() => {
    if (!showQrModal) return;
    
    const timer = setInterval(() => {
      setQrCountdown((prev) => {
        if (prev <= 1) {
          // Refresh QR data from API
          eventsApi.getQrCode(id).then((res) => {
            setQrToken(res.data?.qrToken || '');
          }).catch(() => {});
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [showQrModal, id]);

  const onRegister = async () => {
    try {
      await eventsApi.register(id);
      setIsRegistered(true);
      if (canViewParticipants) {
        const participantsRes = await eventsApi.getParticipants(id);
        setParticipants(participantsRes.data?.data?.participants || []);
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed';
      addError(msg);
    }
  };

  const onUnregister = async () => {
    if (!window.confirm('Bạn có chắc muốn hủy đăng ký?')) return;
    try {
      await eventsApi.cancelRegister(id);
      setIsRegistered(false);
      if (canViewParticipants) {
        const participantsRes = await eventsApi.getParticipants(id);
        setParticipants(participantsRes.data?.data?.participants || []);
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Hủy đăng ký thất bại';
      addError(msg);
    }
  };

  const handleGalleryUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      addError('File quá lớn. Vui lòng chọn ảnh < 5MB');
      return;
    }
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      addError('Định dạng ảnh không hợp lệ. Chỉ chấp nhận JPG, PNG, WEBP');
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
      const msg = err.response?.data?.message || 'Lỗi tải ảnh lên';
      addError(msg);
    } finally {
      setUploadingGallery(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDeleteEvent = async () => {
    if (!window.confirm('Bạn có chắc muốn xóa sự kiện này? Hành động này không thể hoàn tác.')) return;
    
    setIsDeleting(true);
    try {
      await eventsApi.delete(id);
      navigate('/events');
    } catch (err) {
      const msg = err.response?.data?.message || 'Không thể xóa sự kiện';
      addError(msg);
      setIsDeleting(false);
    }
  };

  if (!event && !error) return <div className="min-h-screen bg-surface p-8 text-ink">Đang tải...</div>;

  return (
    <div className="min-h-screen bg-surface p-4 md:p-10">
      <div className="mx-auto max-w-6xl rounded-3xl bg-surface-high p-6 text-ink shadow-[0_24px_70px_rgba(33,26,20,0.10)] md:p-8">
        <button onClick={() => navigate('/events')} className="mb-5 inline-flex items-center gap-2 rounded-xl bg-surface-highest px-4 py-2 text-sm font-medium hover:bg-surface-high">
          <span className="material-symbols-outlined text-base">arrow_back</span>
          Quay lại sự kiện
        </button>
        {error && <p className="mb-4 rounded-xl bg-accent/10 px-4 py-3 text-accent-hover">{error}</p>}
        {event && (
          <>
            <div className="overflow-hidden rounded-2xl border border-surface-highest bg-surface-highest">
              {event.coverImageUrl ? (
                <img src={event.coverImageUrl} alt={event.title} loading="lazy" className="h-72 w-full object-cover md:h-80" />
              ) : (
                <div className="h-56 w-full bg-gradient-to-br from-primary/15 to-secondary/15 md:h-72" />
              )}
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <span className={`rounded-full px-3 py-1 text-xs font-bold tracking-wide ${statusTone}`}>{event.status}</span>
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold tracking-wide text-primary">
                {event.points} điểm
              </span>
            </div>

            <h1 className="mt-4 text-3xl font-semibold font-display tracking-tight text-primary md:text-4xl">{event.title}</h1>
            <p className="mt-3 max-w-3xl text-ink/75 leading-relaxed">{event.description}</p>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl bg-surface-highest p-4 shadow-[0_12px_32px_rgba(33,26,20,0.06)]">
                <p className="text-xs font-semibold uppercase tracking-wide text-ink/45">Địa điểm</p>
                <p className="mt-2 font-medium text-ink">{event.location}</p>
              </div>
              <div className="rounded-2xl bg-surface-highest p-4 shadow-[0_12px_32px_rgba(33,26,20,0.06)]">
                <p className="text-xs font-semibold uppercase tracking-wide text-ink/45">Thời gian bắt đầu</p>
                <p className="mt-2 font-medium text-ink">{new Date(event.startTime).toLocaleString()}</p>
              </div>
              <div className="rounded-2xl bg-surface-highest p-4 shadow-[0_12px_32px_rgba(33,26,20,0.06)]">
                <p className="text-xs font-semibold uppercase tracking-wide text-ink/45">Thời gian kết thúc</p>
                <p className="mt-2 font-medium text-ink">{new Date(event.endTime).toLocaleString()}</p>
              </div>
            </div>

            {canRegister && !isRegistered && (
              <button onClick={onRegister} className="mt-6 rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-white hover:bg-accent-hover shadow-[0_20px_50px_rgba(33,26,20,0.10)]">
                Đăng ký sự kiện
              </button>
            )}
            {canRegister && isRegistered && (
              <button onClick={onUnregister} className="mt-6 rounded-xl bg-secondary px-6 py-3 text-sm font-semibold text-white hover:bg-secondary/90 shadow-[0_20px_50px_rgba(33,26,20,0.10)]">
                Hủy đăng ký
              </button>
            )}
          </>
        )}

        {canViewParticipants && (
          <section className="mt-10">
            <h2 className="mb-4 text-xl font-semibold font-display text-black">Người tham gia</h2>
            <div className="space-y-2">
              {participants.length === 0 && <p className="text-sm text-ink/60">Chưa có người tham gia.</p>}
              {participants.map((item, idx) => (
                <div key={`participant-${item.userId || idx}-${idx}`} className="rounded-xl bg-surface-highest p-4 text-sm shadow-[0_16px_44px_rgba(33,26,20,0.06)]">
                  {item.fullName || item.email || item.userId} - {item.status}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Admin Delete Button */}
        {isAdmin && (
          <div className="mt-6">
            <button 
              onClick={handleDeleteEvent} 
              disabled={isDeleting}
              className="rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-white hover:bg-accent-hover shadow-[0_20px_50px_rgba(33,26,20,0.10)] disabled:opacity-50"
            >
              {isDeleting ? 'Đang xóa...' : 'Xóa sự kiện'}
            </button>
          </div>
        )}

        {/* Organizer Features - Only show for admin or event owner */}
        {(isAdmin || isEventOwner) && (
          <section className="mt-10">
            <div className="mb-4 flex flex-wrap gap-2">
              {['participants', 'checkin', 'qr', 'gallery'].map((tab) => (
                <button key={tab} onClick={() => setActiveTab(tab)} className={`rounded-xl px-3 py-2 text-sm font-medium ${activeTab === tab ? 'bg-primary text-white' : 'bg-surface-highest text-ink hover:bg-surface-high'}`}>
                  {tab.toUpperCase()}
                </button>
              ))}
            </div>

            {activeTab === 'checkin' && checkedIn.length === 0 && (
              <p className="text-sm text-ink/60">No check-ins yet.</p>
            )}
            {activeTab === 'checkin' && checkedIn.map((item, idx) => (
              <div key={`checkin-${item.userId || idx}-${idx}`} className="mb-3 rounded-xl bg-surface-highest p-4 text-sm shadow-[0_16px_44px_rgba(33,26,20,0.06)]">
                {item.userId} - {item.status} - {item.checkInTime ? new Date(item.checkInTime).toLocaleString() : '-'}
              </div>
            ))}
            {activeTab === 'qr' && (
              <div className="rounded-xl bg-surface-highest p-4">
                <p className="mb-4 text-sm text-ink/60">Quét mã QR để check-in (Tự động làm mới sau 30s)</p>
                
                {!qrToken ? (
                  <p className="text-sm text-accent">No QR token available</p>
                ) : (
                  <div className="space-y-4">
                    <button
                      onClick={() => setShowQrModal(true)}
                      className="w-full rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white hover:bg-primary/90 transition-colors"
                    >
                      Hiển thị mã QR check-in
                    </button>
                    <p className="text-xs text-ink/50">Mã QR sẽ tự động làm mới mỗi 30 giây</p>
                  </div>
                )}
              </div>
            )}

            {/* QR Code Modal */}
            {showQrModal && qrDataUrl && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                <div className="relative bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full">
                  {/* Close button */}
                  <button
                    onClick={() => setShowQrModal(false)}
                    className="absolute top-3 right-3 p-2 rounded-full bg-surface-highest hover:bg-surface text-ink transition-colors"
                    aria-label="Close"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-black mb-2">Mã QR Check-in</h3>
                    <p className="text-sm text-ink/60 mb-4">Quét mã để check-in sự kiện</p>
                    
                    {/* QR Image */}
                    <div className="bg-white p-4 rounded-xl border-2 border-primary/20">
                      <img 
                        src={qrDataUrl} 
                        alt="Check-in QR Code" 
                        className="w-full max-w-[250px] mx-auto"
                      />
                    </div>
                    
                    {/* Countdown */}
                    <div className="mt-4 flex items-center justify-center gap-2">
                      <div className="w-32 h-2 bg-surface-highest rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary transition-all duration-1000 ease-linear"
                          style={{ width: `${(qrCountdown / 30) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-primary">{qrCountdown}s</span>
                    </div>
                    <p className="text-xs text-ink/50 mt-2">Mã sẽ tự động làm mới sau {qrCountdown} giây</p>
                  </div>
                </div>
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
