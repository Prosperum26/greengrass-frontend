import React, { useCallback, useEffect, useMemo, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { pointsApi, usersApi } from '../../../api';
import { ImpactPill } from '../../../components/eco';

const EVENT_MILESTONES = [1, 5, 10, 20, 35, 50];
const POINT_MILESTONES = [50, 100, 200, 300, 400, 500];
const MAX_POINT_MILESTONE = POINT_MILESTONES[POINT_MILESTONES.length - 1];

const UserProfilePage = () => {
  const [user, setUser] = useState(null);
  const [events, setEvents] = useState([]);
  const [points, setPoints] = useState(null);
  const [_rank, setRank] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [newFullName, setNewFullName] = useState('');
  const [savingName, setSavingName] = useState(false);
  const fileInputRef = useRef(null);

  const handleEditNameClick = () => {
    setNewFullName(user?.fullName || '');
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
      setUser(prev => ({ ...prev, fullName: newFullName.trim() }));
      setIsEditingName(false);
    } catch (err) {
      alert(err.response?.data?.message || 'Không thể cập nhật tên');
    } finally {
      setSavingName(false);
    }
  };

  const handleCheckBadges = async () => {
    try {
      await pointsApi.checkBadges();
      // Reload data to get updated badges
      await loadData();
      alert('Huy hiệu First Green Step đã được kiểm tra và cập nhật!');
    } catch (err) {
      alert(err.response?.data?.message || 'Không thể kiểm tra huy hiệu');
    }
  };

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
      setUser(prev => ({ ...prev, avatarUrl: res.data.avatarUrl || res.data }));
    } catch (err) {
      alert(err.response?.data?.message || 'Lỗi khi upload avatar');
    } finally {
      setUploadingAvatar(false);
      if (fileInputRef.current) fileInputRef.current.value = ''; // Reset input
    }
  };

  const loadData = useCallback(async () => {
    try {
      const [userRes, eventsRes, pointsRes, _rankRes] = await Promise.all([
        usersApi.getMe(),
        usersApi.getMyEvents(),
        pointsApi.getMe(),
        pointsApi.getMyRank(),
      ]);
      setUser(userRes.data);
      setEvents(eventsRes.data || []);
      setPoints(pointsRes.data);
      setRank(_rankRes?.data); // rank data stored but not displayed currently
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  // Refresh data when page becomes visible (e.g., after check-in)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        void loadData();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [loadData]);

  // Event categorization for future display enhancements
  const _joinedEvents = useMemo(() => events.filter((item) => item.status !== 'COMPLETED'), [events]);
  const _completedEvents = useMemo(() => events.filter((item) => item.status === 'COMPLETED'), [events]);

  if (loading) return <div className="min-h-screen bg-surface p-6 text-ink">Đang tải hồ sơ...</div>;
  if (!user) return <div className="min-h-screen bg-surface p-6 text-ink">Không có hồ sơ người dùng</div>;

  const totalPoints = user.totalPoints ?? 0;
  const ecoLevel = Math.max(1, Math.floor(user.totalPoints / 100) + 1);
  const totalEventsJoined = events.length;
  const currentMilestone =
    EVENT_MILESTONES.filter((m) => totalEventsJoined >= m).at(-1) ?? 0;
  const nextMilestone = EVENT_MILESTONES.find((m) => totalEventsJoined < m) ?? null;
  const milestoneProgress = nextMilestone
    ? ((totalEventsJoined - currentMilestone) / (nextMilestone - currentMilestone)) * 100
    : 100;
  const nextPointMilestone =
    POINT_MILESTONES.find((m) => totalPoints < m) ?? null;
  const totalPointProgress = Math.max(
    0,
    Math.min(100, (totalPoints / MAX_POINT_MILESTONE) * 100),
  );

  return (
    <div className="min-h-screen bg-surface text-ink">
      <div className="mx-auto max-w-7xl p-6 lg:p-12 text-ink">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-4 space-y-8">
            <div className="relative">
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleAvatarSelect} 
                accept="image/jpeg,image/png,image/webp" 
                className="hidden" 
              />
              <div 
                className="aspect-square rounded-[2rem] overflow-hidden bg-surface-highest shadow-[0_24px_70px_rgba(33,26,20,0.10)] relative group cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt="avatar" className="w-full h-full object-cover transition-opacity group-hover:opacity-75" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center transition-opacity group-hover:opacity-75">
                    <span className="text-6xl font-black text-secondary">{(user.fullName?.[0] || 'U').toUpperCase()}</span>
                  </div>
                )}
                <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 bg-black/40 transition-opacity">
                  <span className="text-white font-bold tracking-wide">Thay đổi</span>
                </div>
                {uploadingAvatar && (
                  <div className="absolute inset-0 flex items-center justify-center bg-surface/80">
                    <span className="text-primary font-bold animate-pulse">Đang tải...</span>
                  </div>
                )}
              </div>

              <div className="absolute -bottom-4 -right-4 rounded-2xl bg-primary px-6 py-3 text-white shadow-[0_24px_70px_rgba(33,26,20,0.12)] z-10 pointer-events-none">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold font-display">Eco-Level {ecoLevel}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              {isEditingName ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={newFullName}
                    onChange={(e) => setNewFullName(e.target.value)}
                    className="w-full text-2xl font-extrabold tracking-tight font-display text-primary bg-white border border-primary/30 rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary/30 outline-none shadow-sm"
                    placeholder="Nhập tên của bạn"
                    onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveName}
                      disabled={savingName}
                      className="px-4 py-1.5 bg-primary text-white text-sm font-bold rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                    >
                      {savingName ? 'Đang lưu...' : 'Lưu'}
                    </button>
                    <button
                      onClick={handleCancelEditName}
                      className="px-4 py-1.5 bg-surface-high text-ink text-sm font-bold rounded-lg hover:bg-surface-highest transition-colors"
                    >
                      Hủy
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <h1 className="text-4xl font-extrabold tracking-tight font-display text-primary">{user.fullName}</h1>
                  <button
                    onClick={handleEditNameClick}
                    className="p-2 rounded-full hover:bg-surface-highest transition-colors text-ink/60 hover:text-primary"
                    title="Sửa tên"
                  >
                    <span className="material-symbols-outlined text-xl">edit</span>
                  </button>
                </div>
              )}
              <p className="text-ink font-medium leading-relaxed">
                {user.bio || 'Chiến binh xanh tận tâm. Biến đổi cộng đồng từng hành động một.'}
              </p>
            </div>

            <div className="rounded-[2rem] bg-surface-highest p-6 space-y-4 shadow-[0_18px_48px_rgba(33,26,20,0.06)]">
              <div className="flex justify-between items-end">
                <div>
                  <span className="uppercase text-xs tracking-widest text-ink/90 font-bold">Cột mốc Điểm</span>
                  <h3 className="text-2xl font-display font-bold text-primary">
                    {nextPointMilestone
                      ? `Tiếp theo: ${nextPointMilestone} điểm`
                      : 'Đã đạt cột mốc cao nhất'}
                  </h3>
                </div>
                <span className="text-secondary text-3xl">🏁</span>
              </div>
              <div className="relative pt-8">
                <div className="relative h-3 w-full bg-surface-low rounded-full overflow-hidden">
                  <div
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-secondary rounded-full"
                    style={{
                      width: `${totalPointProgress}%`,
                    }}
                  />
                </div>
                {POINT_MILESTONES.map((milestone) => {
                  const unlocked = totalPoints >= milestone;
                  const isMax = milestone === MAX_POINT_MILESTONE;
                  const position = (milestone / MAX_POINT_MILESTONE) * 100;
                  return (
                    <div
                      key={milestone}
                      className="absolute top-0 -translate-x-1/2"
                      style={{ left: `${position}%` }}
                    >
                      <p
                        className={`mb-1 text-center text-[10px] font-bold ${
                          unlocked ? 'text-secondary' : 'text-ink/65'
                        }`}
                      >
                        {milestone}
                      </p>
                      <div
                        className={`mx-auto rounded-full border-2 ${
                          unlocked
                            ? 'bg-secondary border-secondary'
                            : 'bg-surface border-ink/30'
                        } ${isMax ? 'h-5 w-5' : 'h-3.5 w-3.5'}`}
                      />
                    </div>
                  );
                })}
              </div>
              <p className="text-sm text-ink/90">
                {nextPointMilestone
                  ? `Còn ${Math.max(nextPointMilestone - totalPoints, 0)} điểm để mở khóa cột mốc tiếp theo`
                  : 'Bạn đã mở khóa tất cả các cột mốc điểm.'}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-3xl bg-surface-highest p-5 shadow-[0_16px_44px_rgba(33,26,20,0.06)]">
                <span className="text-3xl font-black text-primary">{user.totalPoints.toLocaleString()}</span>
                <p className="text-[10px] font-bold uppercase tracking-wider text-ink/90">Điểm tác động</p>
              </div>
              <div className="rounded-3xl bg-surface-highest p-5 shadow-[0_16px_44px_rgba(33,26,20,0.06)]">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🎯</span>
                  <span className="text-3xl font-black text-ink">{totalEventsJoined}</span>
                </div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-ink/90">Sự kiện đã tham gia</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-8 space-y-12">
            <section>
              <h2 className="mb-6 text-2xl font-extrabold font-display text-primary">Cột mốc Sự kiện</h2>
              <div className="rounded-[2rem] bg-surface-highest p-6 shadow-[0_18px_48px_rgba(33,26,20,0.06)]">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-ink/90">
                    {nextMilestone
                      ? `Cột mốc tiếp theo: ${nextMilestone} sự kiện (còn ${Math.max(nextMilestone - totalEventsJoined, 0)})`
                      : 'Bạn đã đạt cột mốc cao nhất (50 sự kiện)!'}
                  </p>
                  <p className="text-xs font-bold uppercase tracking-wider text-ink/75">
                    {totalEventsJoined} sự kiện tổng cộng
                  </p>
                </div>
                <div className="mt-4 h-3 w-full overflow-hidden rounded-full bg-surface-low">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary to-secondary transition-all"
                    style={{ width: `${Math.max(0, Math.min(100, milestoneProgress))}%` }}
                  />
                </div>
                <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                  {EVENT_MILESTONES.map((milestone) => {
                    const unlocked = totalEventsJoined >= milestone;
                    return (
                      <div
                        key={milestone}
                        className={`rounded-xl px-3 py-3 text-center ${
                          unlocked ? 'bg-secondary/20 text-secondary' : 'bg-surface-low text-ink/70'
                        }`}
                      >
                        <p className="text-base font-black">{milestone}</p>
                        <p className="text-[10px] font-bold uppercase tracking-wider">
                          {unlocked ? 'Đã mở khóa' : 'Đã khóa'}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>

            <section>
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-extrabold font-display text-primary">Huy hiệu đã nhận</h2>
                {(points?.badges?.length || 0) > 4 && (
                  <button type="button" className="text-primary font-bold text-sm hover:underline">Xem tất cả ({points.badges.length})</button>
                )}
              </div>
              {(points?.badges || []).length === 0 ? (
                <div className="rounded-3xl bg-surface-low p-8 text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-surface-high text-ink/40">
                    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                  </div>
                  <p className="text-ink/60 font-medium">Chưa có huy hiệu nào</p>
                  <p className="mt-1 text-sm text-ink/40">Tham gia sự kiện và tích điểm để nhận huy hiệu!</p>
                  {events.some(e => e.status === 'CHECKED_IN' || e.status === 'COMPLETED') && (
                    <button
                      onClick={handleCheckBadges}
                      className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm"
                    >
                      Kiểm tra huy hiệu First Green Step
                    </button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {(points?.badges || []).slice(0, 4).map((badge, index) => {
                    const badgeId = badge.id || badge.badge?.id || index;
                    const badgeName = badge.badge?.name || badge.name;
                    const badgeDesc = badge.badge?.description || badge.description;
                    const isFirstStep = badgeName === 'First Green Step';

                    return (
                      <div
                        key={badgeId}
                        title={badgeDesc}
                        className={`group relative rounded-2xl p-5 text-center transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-pointer ${
                          isFirstStep
                            ? 'bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200'
                            : 'bg-surface-low border border-surface-high'
                        }`}
                      >
                        {isFirstStep && (
                          <div className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-amber-400 text-white text-xs shadow-md">
                            1st
                          </div>
                        )}
                        <div className={`mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full shadow-md transition-transform group-hover:scale-110 ${
                          isFirstStep
                            ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white'
                            : 'bg-primary/10 text-primary'
                        }`}>
                          {isFirstStep ? (
                            <svg className="h-7 w-7" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
                            </svg>
                          ) : badgeName === 'Green Beginner' ? (
                            <svg className="h-7 w-7" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
                            </svg>
                          ) : badgeName === 'Eco Enthusiast' ? (
                            <svg className="h-7 w-7" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                            </svg>
                          ) : badgeName === 'Green Champion' ? (
                            <svg className="h-7 w-7" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                            </svg>
                          ) : (
                            <svg className="h-7 w-7" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
                            </svg>
                          )}
                        </div>
                        <p className={`font-display font-bold text-sm mb-1 ${isFirstStep ? 'text-amber-800' : 'text-ink'}`}>
                          {badgeName}
                        </p>
                        <span className={`text-[10px] font-bold uppercase tracking-wider ${isFirstStep ? 'text-amber-600' : 'text-primary'}`}>
                          {isFirstStep ? '⭐ Đặc biệt' : 'Đã mở khóa'}
                        </span>
                        {badgeDesc && (
                          <p className="mt-2 text-xs text-ink/50 line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            {badgeDesc}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

            <section>
              <h2 className="mb-8 text-2xl font-extrabold font-display text-primary">Hành trình Xanh</h2>
              <div className="relative space-y-0">
                <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-surface-highest" />
                {events.slice(0, 6).map((item) => (
                  <div key={item.registrationId} className="relative flex gap-8 pb-10">
                    <div className="z-10 flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary text-white shadow-[0_20px_50px_rgba(33,26,20,0.10)]">
                      <span className="text-xl font-black">♻</span>
                    </div>
                    <div className="pt-2 min-w-0">
                      <p className="text-xs font-bold uppercase tracking-widest text-ink/90 mb-1">
                        {new Date(item.registeredAt).toLocaleDateString()}
                      </p>
                      <Link to={`/events/${item.event.id}`} className="block">
                        <h4 className="text-lg font-display font-bold text-ink hover:text-primary transition-colors line-clamp-2">
                          {item.event.title}
                        </h4>
                      </Link>
                      <p className="mt-1 text-sm text-ink/90 leading-relaxed line-clamp-2">
                        {item.event.description}
                      </p>
                      <div className="mt-4 flex gap-2 flex-wrap">
                        <ImpactPill tone="primary">+{item.event.points} pts</ImpactPill>
                        <ImpactPill tone="neutral">{item.status}</ImpactPill>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
