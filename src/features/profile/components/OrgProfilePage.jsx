import React, { useEffect, useMemo, useState, useRef } from 'react';
import { eventsApi, usersApi } from '../../../api';
import { Link, useNavigate } from 'react-router-dom';

const OrgProfilePage = () => {
  const [organizer, setOrganizer] = useState(null);
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [tab, setTab] = useState('UPCOMING');
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [newFullName, setNewFullName] = useState('');
  const [savingName, setSavingName] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const load = async () => {
      const [userRes, eventsRes] = await Promise.all([usersApi.getMe(), eventsApi.getAll({ page: 1, limit: 100 })]);
      setOrganizer(userRes.data);
      setEvents(eventsRes.data?.data?.items || []);
    };
    void load();
  }, []);

  const avatarText = useMemo(() => {
    const name = organizer?.fullName || organizer?.name || organizer?.email || '';
    const first = String(name).trim()[0];
    return (first || 'O').toUpperCase();
  }, [organizer]);

  const handleAvatarSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('File quá lớn. Vui lòng chọn ảnh < 5MB');
      return;
    }
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      alert('Định dạng ảnh không hợp lệ. Vui lòng chọn JPG, PNG hoặc WEBP');
      return;
    }

    setUploadingAvatar(true);
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      
      const res = await usersApi.uploadAvatar(formData);
      setOrganizer(prev => ({ ...prev, avatarUrl: res.data.avatarUrl || res.data }));
    } catch (err) {
      alert(err.response?.data?.message || 'Lỗi khi upload avatar');
    } finally {
      setUploadingAvatar(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleEditNameClick = () => {
    setNewFullName(organizer?.fullName || '');
    setIsEditingName(true);
  };

  const handleCancelEditName = () => {
    setIsEditingName(false);
    setNewFullName('');
  };

  const handleSaveName = async () => {
    if (!newFullName.trim()) {
      alert('Vui lòng nhập tên');
      return;
    }
    setSavingName(true);
    try {
      await usersApi.updateMe({ fullName: newFullName.trim() });
      setOrganizer(prev => ({ ...prev, fullName: newFullName.trim() }));
      setIsEditingName(false);
    } catch (err) {
      alert(err.response?.data?.message || 'Không thể cập nhật tên');
    } finally {
      setSavingName(false);
    }
  };

  const filteredEvents = useMemo(() => events.filter((event) => event.status === tab), [events, tab]);

  return (
    <div className="min-h-screen bg-surface p-6 text-ink md:p-10">
      <div className="mx-auto max-w-6xl space-y-8">

        <section className="rounded-2xl bg-surface-highest p-6 shadow-[0_24px_70px_rgba(33,26,20,0.08)]">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex items-center gap-4">
              {/* Avatar */}
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleAvatarSelect} 
                accept="image/jpeg,image/png,image/webp" 
                className="hidden" 
              />
              <div 
                className="relative w-20 h-20 rounded-full overflow-hidden cursor-pointer group"
                onClick={() => fileInputRef.current?.click()}
              >
                {organizer?.avatarUrl ? (
                  <img src={organizer.avatarUrl} alt="avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                    <span className="text-3xl font-black text-secondary">{avatarText}</span>
                  </div>
                )}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/40 transition-opacity">
                  <span className="material-symbols-outlined text-white text-xl">edit</span>
                </div>
                {uploadingAvatar && (
                  <div className="absolute inset-0 flex items-center justify-center bg-surface/80">
                    <span className="text-primary font-bold animate-pulse text-xs">...</span>
                  </div>
                )}
              </div>

              {/* Name Section */}
              <div>
                {isEditingName ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={newFullName}
                      onChange={(e) => setNewFullName(e.target.value)}
                      className="text-2xl font-semibold text-primary bg-white border border-primary/30 rounded-xl px-3 py-1 focus:ring-2 focus:ring-primary/30 outline-none shadow-sm"
                      placeholder="Nhập tên"
                      onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handleSaveName}
                        disabled={savingName}
                        className="px-3 py-1 bg-primary text-white text-xs font-bold rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                      >
                        {savingName ? '...' : 'Lưu'}
                      </button>
                      <button
                        onClick={handleCancelEditName}
                        className="px-3 py-1 bg-surface-high text-ink text-xs font-bold rounded-lg hover:bg-surface-highest transition-colors"
                      >
                        Hủy
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-semibold text-primary">{organizer?.fullName || 'Ban tổ chức'}</h1>
                    <button
                      onClick={handleEditNameClick}
                      className="p-1.5 rounded-full hover:bg-surface-high transition-colors text-ink/50 hover:text-primary"
                      title="Sửa tên"
                    >
                      <span className="material-symbols-outlined text-lg">edit</span>
                    </button>
                  </div>
                )}
                <p className="mt-1 text-ink/75">Bảng điều khiển quản lý sự kiện</p>
              </div>
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
          </div>
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
