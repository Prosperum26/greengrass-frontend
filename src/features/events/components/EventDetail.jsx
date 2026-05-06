import React, { useEffect, useMemo, useState, useRef, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { eventsApi } from '../../../api';
import { useAuthContext } from '../../../hooks/useAuthContext';
import { useError } from '../../../hooks/useError';
import { useCheckIn } from '../../checkin/hooks/useCheckIn';
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
  const [registrationStatus, setRegistrationStatus] = useState(null); // REGISTERED, CHECKED_IN, etc.
  const [isDeleting, setIsDeleting] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [qrCountdown, setQrCountdown] = useState(30);
  const [manualToken, setManualToken] = useState('');
  const [checkingIn, setCheckingIn] = useState(false);
  const [checkInSuccess, setCheckInSuccess] = useState(false);
  const { checkIn } = useCheckIn();
  const [updatingCover, setUpdatingCover] = useState(false);
  const [coverPreview, setCoverPreview] = useState(null);
  const fileInputRef = useRef(null);
  const coverInputRef = useRef(null);
  const qrWriterRef = useRef(null);
  
  // Edit form states
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    location: '',
    latitude: '',
    longitude: '',
    checkinRadius: '',
    startTime: '',
    endTime: ''
  });
  const [saving, setSaving] = useState(false);

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
        
      } catch (err) {
        setError(err.response?.data?.message || 'Không thể tải sự kiện');
        addError(err.response?.data?.message || 'Không thể tải sự kiện');
      }
    };
    load();
  }, [id, getUserId, getRole, addError, isAdmin]);

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

  // Check registration status when event data is loaded and user is logged in
  useEffect(() => {
    // Only check if we have both event data and user is logged in
    if (!event?.id || !userId) {
      setIsRegistered(false);
      return;
    }
    
    const checkRegistration = async () => {
      try {
        const res = await eventsApi.checkRegistration(id);
        const data = res.data?.data;
        setIsRegistered(data?.registered || false);
        setRegistrationStatus(data?.status || null);
        // If already checked in, set checkInSuccess to true to hide form
        if (data?.status === 'CHECKED_IN') {
          setCheckInSuccess(true);
        }
      } catch (err) {
        // If 404, user is not registered
        if (err.response?.status === 404) {
          setIsRegistered(false);
          setRegistrationStatus(null);
        }
        // Other errors: keep current state
      }
    };
    void checkRegistration();
  }, [event?.id, id, userId]);

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

  // Export participants to CSV
  const exportParticipantsCSV = () => {
    if (participants.length === 0) {
      alert('Không có người đăng ký để xuất');
      return;
    }

    const headers = ['Họ tên', 'Email', 'Trạng thái', 'Thời gian đăng ký'];
    const rows = participants.map((p) => [
      p.user?.fullName || '-',
      p.user?.email || '-',
      'Đã đăng ký',
      p.registeredAt ? new Date(p.registeredAt).toLocaleString('vi-VN') : '-',
    ]);

    const csvContent = [headers.join(','), ...rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))].join('\n');

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `dang-ky-su-kien-${event?.title?.replace(/[^a-zA-Z0-9\u00C0-\u1EF9]/g, '_') || 'event'}-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  };

  // Export checked-in participants to CSV
  const exportCheckInCSV = () => {
    if (checkedIn.length === 0) {
      alert('Chưa có người check-in để xuất');
      return;
    }

    const headers = ['Tên người dùng', 'Trạng thái', 'Thời gian check-in'];
    const rows = checkedIn.map((c) => [
      c.userName || '-',
      c.status || '-',
      c.checkInTime ? new Date(c.checkInTime).toLocaleString('vi-VN') : '-',
    ]);

    const csvContent = [headers.join(','), ...rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))].join('\n');

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `checkin-su-kien-${event?.title?.replace(/[^a-zA-Z0-9\u00C0-\u1EF9]/g, '_') || 'event'}-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
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

  
  const handleSaveEdit = async () => {
    if (!event) return;
    
    setSaving(true);
    try {
      const updateData = {
        title: editForm.title,
        description: editForm.description,
        location: editForm.location,
        startTime: new Date(editForm.startTime).toISOString(),
        endTime: new Date(editForm.endTime).toISOString()
      };
      
      // Only include location fields if they're provided
      if (editForm.latitude && editForm.longitude) {
        updateData.latitude = parseFloat(editForm.latitude);
        updateData.longitude = parseFloat(editForm.longitude);
      }
      
      if (editForm.checkinRadius) {
        updateData.checkinRadius = parseInt(editForm.checkinRadius);
      }
      
      await eventsApi.update(id, updateData);
      
      // Refresh event data
      const updatedEvent = await eventsApi.getById(id);
      setEvent(updatedEvent.data);
      
      alert('Cập nhật sự kiện thành công!');
    } catch (err) {
      const msg = err.response?.data?.message || 'Không thể cập nhật sự kiện';
      alert(msg);
    } finally {
      setSaving(false);
    }
  };

  // Initialize edit form when switching to edit tab
  const initializeEditForm = () => {
    if (!event) return;
    
    setEditForm({
      title: event.title || '',
      description: event.description || '',
      location: event.location || '',
      latitude: event.latitude || '',
      longitude: event.longitude || '',
      checkinRadius: event.checkinRadius || '',
      startTime: new Date(event.startTime).toISOString().slice(0, 16),
      endTime: new Date(event.endTime).toISOString().slice(0, 16)
    });
  };

  
  const handleCoverSelect = (e) => {
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
    setCoverPreview(URL.createObjectURL(file));
    void handleCoverUpdate(file);
  };

  const handleCoverUpdate = async (file) => {
    setUpdatingCover(true);
    try {
      const formData = new FormData();
      formData.append('coverImage', file);
      const res = await eventsApi.updateCoverImage(id, formData);
      setEvent(prev => ({
        ...prev,
        coverImageUrl: res.data?.data?.coverImageUrl || res.data?.coverImageUrl
      }));
      setCoverPreview(null);
      alert('Cập nhật ảnh đại diện thành công!');
    } catch (err) {
      const msg = err.response?.data?.message || 'Lỗi cập nhật ảnh đại diện';
      addError(msg);
    } finally {
      setUpdatingCover(false);
      if (coverInputRef.current) coverInputRef.current.value = '';
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
            {/* Cover Image with hover upload for owner */}
            <div className="overflow-hidden rounded-2xl border border-surface-highest bg-surface-highest relative group">
              <input
                type="file"
                ref={coverInputRef}
                className="hidden"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleCoverSelect}
              />
              
              {event.coverImageUrl ? (
                <img src={coverPreview || event.coverImageUrl} alt={event.title} loading="lazy" className="h-72 w-full object-cover md:h-80" />
              ) : (
                <div className="h-56 w-full bg-gradient-to-br from-primary/15 to-secondary/15 md:h-72 flex items-center justify-center">
                  {coverPreview ? (
                    <img src={coverPreview} alt="Preview" className="h-full w-full object-cover" />
                  ) : (
                    <span className="material-symbols-outlined text-6xl text-primary/30">image</span>
                  )}
                </div>
              )}
              
              {/* Hover overlay for event owner */}
              {isEventOwner && (
                <div 
                  onClick={() => coverInputRef.current?.click()}
                  className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer flex flex-col items-center justify-center text-white"
                >
                  <span className="material-symbols-outlined text-4xl mb-2">photo_camera</span>
                  <span className="text-sm font-medium">{updatingCover ? 'Đang cập nhật...' : 'Thay đổi ảnh đại diện'}</span>
                </div>
              )}
              
              {updatingCover && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <div className="w-10 h-10 border-4 border-white border-t-primary rounded-full animate-spin"></div>
                </div>
              )}
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <span className={`rounded-full px-3 py-1 text-xs font-bold tracking-wide ${statusTone}`}>{event.status}</span>
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold tracking-wide text-primary">
                {event.points} điểm
              </span>
              {/* User registration status badge */}
              {isRegistered && registrationStatus === 'CHECKED_IN' && (
                <span className="rounded-full bg-secondary/20 px-3 py-1 text-xs font-bold tracking-wide text-secondary">
                  ✓ Đã check-in
                </span>
              )}
              {isRegistered && registrationStatus === 'REGISTERED' && (
                <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-bold tracking-wide text-accent">
                  Đã đăng ký
                </span>
              )}
            </div>

            {/* Event completed notification */}
            {event?.status === 'COMPLETED' && (
              <div className="mt-6 rounded-2xl bg-ink/5 p-4 text-center">
                <p className="font-bold text-ink/70">Sự kiện đã kết thúc</p>
                <p className="text-sm text-ink/50 mt-1">Không thể đăng ký hoặc check-in cho sự kiện này nữa.</p>
              </div>
            )}

            <h1 className="mt-4 text-3xl font-semibold font-display tracking-tight text-primary md:text-4xl">{event.title}</h1>
            <p className="mt-3 max-w-3xl text-ink/75 leading-relaxed">{event.description}</p>

            <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
              <div className="rounded-2xl bg-surface-highest p-4 shadow-[0_12px_32px_rgba(33,26,20,0.06)]">
                <p className="text-xs font-semibold uppercase tracking-wide text-ink/45">Phạm vi check-in</p>
                <div className="mt-2 flex items-center gap-2">
                  <svg className="h-4 w-4 text-primary flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <p className="font-medium text-ink">
                    {event.checkinRadius ? `${event.checkinRadius}m` : 'Không giới hạn'}
                  </p>
                </div>
                {event.checkinRadius ? (
                  <p className="mt-1 text-xs text-ink/50">Bán kính từ địa điểm sự kiện</p>
                ) : (
                  <p className="mt-1 text-xs text-ink/50">Có thể check-in từ bất kỳ đâu</p>
                )}
              </div>
            </div>

            {/* Registration buttons - hidden when event is COMPLETED */}
            {canRegister && !isRegistered && event?.status !== 'COMPLETED' && (
              <button onClick={onRegister} className="mt-6 rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-white hover:bg-accent-hover shadow-[0_20px_50px_rgba(33,26,20,0.10)]">
                Đăng ký sự kiện
              </button>
            )}
            {canRegister && isRegistered && event?.status !== 'COMPLETED' && registrationStatus !== 'CHECKED_IN' && (
              <button onClick={onUnregister} className="mt-6 rounded-xl bg-secondary px-6 py-3 text-sm font-semibold text-white hover:bg-secondary/90 shadow-[0_20px_50px_rgba(33,26,20,0.10)]">
                Hủy đăng ký
              </button>
            )}

            {/* Manual Check-in for registered users - hidden when already checked in or event is COMPLETED */}
            {isRegistered && !checkInSuccess && registrationStatus !== 'CHECKED_IN' && event?.status !== 'COMPLETED' && (
              <div className="mt-6 rounded-2xl bg-surface-highest p-4 shadow-[0_12px_32px_rgba(33,26,20,0.06)]">
                <p className="text-sm font-semibold text-ink mb-3">Check-in bằng mã</p>
                <div className="flex gap-2">
                  <input
                    value={manualToken}
                    onChange={(e) => setManualToken(e.target.value)}
                    placeholder="Nhập mã check-in do ban tổ chức cung cấp"
                    className="flex-1 rounded-xl bg-white px-4 py-3 text-sm text-ink placeholder:text-ink/40 outline-none focus:ring-2 focus:ring-primary/25"
                  />
                  <button
                    onClick={async () => {
                      if (!manualToken.trim()) return;
                      setCheckingIn(true);
                      try {
                        await checkIn(id, manualToken.trim());
                        setCheckInSuccess(true);
                        setRegistrationStatus('CHECKED_IN');
                        setManualToken('');
                      } catch (err) {
                        alert(err.response?.data?.message || 'Check-in thất bại');
                      } finally {
                        setCheckingIn(false);
                      }
                    }}
                    disabled={checkingIn || !manualToken.trim()}
                    className="rounded-xl bg-accent px-4 py-3 text-sm font-semibold text-white hover:bg-accent-hover disabled:opacity-50 transition-colors"
                  >
                    {checkingIn ? 'Đang xử lý...' : 'Check-in'}
                  </button>
                </div>
                <p className="mt-2 text-xs text-ink/50">Hoặc quét mã QR tại sự kiện để check-in</p>
              </div>
            )}

            {checkInSuccess && (
              <div className="mt-6 rounded-2xl bg-secondary/15 p-4 text-center">
                <p className="font-bold text-primary">✓ Đã check-in thành công!</p>
                <p className="text-sm text-ink/60 mt-1">Bạn đã hoàn tất check-in. Điểm thưởng sẽ được cập nhật sớm.</p>
                <p className="text-xs text-ink/40 mt-2">Không thể hủy đăng ký sau khi đã check-in.</p>
              </div>
            )}
          </>
        )}

        {canViewParticipants && (
          <section className="mt-10">
            <h2 className="mb-4 text-xl font-semibold font-display text-black">Người tham gia</h2>
            <div className="space-y-2">
              <div className="flex justify-between items-center mb-4">
                <p className="text-sm text-ink/60">
                  Tổng số: {participants.length} người đăng ký
                </p>
                <button
                  onClick={exportParticipantsCSV}
                  disabled={participants.length === 0}
                  className="rounded-lg bg-primary/10 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-sm">download</span>
                  Xuất CSV
                </button>
              </div>
              {participants.length === 0 ? (
                <p className="text-sm text-ink/60">Chưa có người tham gia.</p>
              ) : (
                participants.map((item, idx) => (
                  <div key={`participant-${item.user?.id || item.registrationId || idx}-${idx}`} className="rounded-xl bg-surface-highest p-4 text-sm shadow-[0_16px_44px_rgba(33,26,20,0.06)]">
                    {item.user?.fullName || item.user?.email || item.user?.id || '-'} - Đã đăng ký lúc {item.registeredAt ? new Date(item.registeredAt).toLocaleString('vi-VN') : '-'}
                  </div>
                ))
              )}
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
              {['edit', 'participants', 'checkin', 'qr', 'gallery'].map((tab) => (
                <button 
                  key={tab} 
                  onClick={() => {
                    if (tab === 'edit') {
                      initializeEditForm();
                    }
                    setActiveTab(tab);
                  }} 
                  className={`rounded-xl px-3 py-2 text-sm font-medium ${activeTab === tab ? 'bg-primary text-white' : 'bg-surface-highest text-ink hover:bg-surface-high'}`}
                >
                  {tab === 'edit' ? 'CHỈNH SỬA' : tab.toUpperCase()}
                </button>
              ))}
            </div>

            {activeTab === 'edit' && (
              <div className="rounded-2xl bg-surface-highest p-6 shadow-[0_12px_32px_rgba(33,26,20,0.06)]">
                <h3 className="text-lg font-semibold text-ink mb-4">Chỉnh sửa thông tin sự kiện</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-ink mb-1">Tên sự kiện</label>
                    <input
                      type="text"
                      value={editForm.title}
                      onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full rounded-xl bg-white px-4 py-3 text-sm text-ink placeholder:text-ink/40 outline-none focus:ring-2 focus:ring-primary/25"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-ink mb-1">Mô tả</label>
                    <textarea
                      value={editForm.description}
                      onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                      rows={3}
                      className="w-full rounded-xl bg-white px-4 py-3 text-sm text-ink placeholder:text-ink/40 outline-none focus:ring-2 focus:ring-primary/25"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-ink mb-1">Địa điểm</label>
                    <input
                      type="text"
                      value={editForm.location}
                      onChange={(e) => setEditForm(prev => ({ ...prev, location: e.target.value }))}
                      className="w-full rounded-xl bg-white px-4 py-3 text-sm text-ink placeholder:text-ink/40 outline-none focus:ring-2 focus:ring-primary/25"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-ink mb-1">Vĩ độ (Latitude)</label>
                      <input
                        type="number"
                        step="any"
                        value={editForm.latitude}
                        onChange={(e) => setEditForm(prev => ({ ...prev, latitude: e.target.value }))}
                        placeholder="10.762622"
                        className="w-full rounded-xl bg-white px-4 py-3 text-sm text-ink placeholder:text-ink/40 outline-none focus:ring-2 focus:ring-primary/25"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-ink mb-1">Kinh độ (Longitude)</label>
                      <input
                        type="number"
                        step="any"
                        value={editForm.longitude}
                        onChange={(e) => setEditForm(prev => ({ ...prev, longitude: e.target.value }))}
                        placeholder="106.660172"
                        className="w-full rounded-xl bg-white px-4 py-3 text-sm text-ink placeholder:text-ink/40 outline-none focus:ring-2 focus:ring-primary/25"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-ink mb-1">Bán kính check-in (mét)</label>
                    <input
                      type="number"
                      value={editForm.checkinRadius}
                      onChange={(e) => setEditForm(prev => ({ ...prev, checkinRadius: e.target.value }))}
                      placeholder="50"
                      className="w-full rounded-xl bg-white px-4 py-3 text-sm text-ink placeholder:text-ink/40 outline-none focus:ring-2 focus:ring-primary/25"
                    />
                    <p className="mt-1 text-xs text-ink/50">Người dùng phải trong phạm vi này để check-in. Để trống nếu không giới hạn.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-ink mb-1">Thời gian bắt đầu</label>
                      <input
                        type="datetime-local"
                        value={editForm.startTime}
                        onChange={(e) => setEditForm(prev => ({ ...prev, startTime: e.target.value }))}
                        className="w-full rounded-xl bg-white px-4 py-3 text-sm text-ink placeholder:text-ink/40 outline-none focus:ring-2 focus:ring-primary/25"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-ink mb-1">Thời gian kết thúc</label>
                      <input
                        type="datetime-local"
                        value={editForm.endTime}
                        onChange={(e) => setEditForm(prev => ({ ...prev, endTime: e.target.value }))}
                        className="w-full rounded-xl bg-white px-4 py-3 text-sm text-ink placeholder:text-ink/40 outline-none focus:ring-2 focus:ring-primary/25"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={handleSaveEdit}
                      disabled={saving}
                      className="rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary/90 disabled:opacity-50 transition-colors"
                    >
                      {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
                    </button>
                    <button
                      onClick={() => setActiveTab('participants')}
                      className="rounded-xl bg-surface-high px-6 py-3 text-sm font-semibold text-ink hover:bg-surface-highest transition-colors"
                    >
                      Hủy
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'checkin' && (
              <>
                <div className="flex justify-between items-center mb-4">
                  <p className="text-sm text-ink/60">
                    Tổng số: {checkedIn.length} người đã check-in
                  </p>
                  <button
                    onClick={exportCheckInCSV}
                    disabled={checkedIn.length === 0}
                    className="rounded-lg bg-secondary/10 px-4 py-2 text-sm font-medium text-secondary hover:bg-secondary/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-sm">download</span>
                    Xuất CSV
                  </button>
                </div>
                {checkedIn.length === 0 ? (
                  <p className="text-sm text-ink/60">Chưa có người check-in.</p>
                ) : (
                  checkedIn.map((item, idx) => (
                    <div key={`checkin-${item.userId || idx}-${idx}`} className="mb-3 rounded-xl bg-surface-highest p-4 text-sm shadow-[0_16px_44px_rgba(33,26,20,0.06)]">
                      Tên người dùng: {item.userName} - Trạng thái: {item.status} - Check-in: {item.checkInTime ? new Date(item.checkInTime).toLocaleString('vi-VN') : '-'}
                    </div>
                  ))
                )}
              </>
            )}
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
                    <div className="rounded-xl bg-surface-low p-3">
                      <p className="text-xs text-ink/60 mb-2">Mã check-in (copy cho người tham gia):</p>
                      <div className="flex gap-2">
                        <input
                          readOnly
                          value={qrToken}
                          className="flex-1 rounded-lg bg-white px-3 py-2 text-xs font-mono text-ink/80 outline-none"
                        />
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(qrToken);
                            alert('Đã copy mã check-in!');
                          }}
                          className="rounded-lg bg-secondary px-3 py-2 text-xs font-semibold text-white hover:bg-secondary/90 transition-colors"
                        >
                          Copy
                        </button>
                      </div>
                    </div>
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
