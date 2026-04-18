import React, { useEffect, useMemo, useState, useRef } from 'react';
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
  const [rank, setRank] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const fileInputRef = useRef(null);

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

  useEffect(() => {
    const load = async () => {
      try {
        const [userRes, eventsRes, pointsRes, rankRes] = await Promise.all([
          usersApi.getMe(),
          usersApi.getMyEvents(),
          pointsApi.getMe(),
          pointsApi.getMyRank(),
        ]);
        setUser(userRes.data);
        setEvents(eventsRes.data || []);
        setPoints(pointsRes.data);
        setRank(rankRes.data);
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, []);

  const joinedEvents = useMemo(() => events.filter((item) => item.status !== 'COMPLETED'), [events]);
  const completedEvents = useMemo(() => events.filter((item) => item.status === 'COMPLETED'), [events]);

  if (loading) return <div className="min-h-screen bg-surface p-6 text-ink">Loading profile...</div>;
  if (!user) return <div className="min-h-screen bg-surface p-6 text-ink">No user profile</div>;

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
              <h1 className="text-4xl font-extrabold tracking-tight font-display text-primary">{user.fullName}</h1>
              <p className="text-ink font-medium leading-relaxed">
                {user.bio || 'Dedicated eco-hero. Transforming the campus one action at a time.'}
              </p>
            </div>

            <div className="rounded-[2rem] bg-surface-highest p-6 space-y-4 shadow-[0_18px_48px_rgba(33,26,20,0.06)]">
              <div className="flex justify-between items-end">
                <div>
                  <span className="uppercase text-xs tracking-widest text-ink/90 font-bold">Point Milestone</span>
                  <h3 className="text-2xl font-display font-bold text-primary">
                    {nextPointMilestone
                      ? `Next: ${nextPointMilestone} pts`
                      : 'Top milestone reached'}
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
                  ? `${Math.max(nextPointMilestone - totalPoints, 0)} points to unlock next milestone`
                  : 'You unlocked all configured point milestones.'}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-3xl bg-surface-highest p-5 shadow-[0_16px_44px_rgba(33,26,20,0.06)]">
                <span className="text-3xl font-black text-primary">{user.totalPoints.toLocaleString()}</span>
                <p className="text-[10px] font-bold uppercase tracking-wider text-ink/90">Impact Points</p>
              </div>
              <div className="rounded-3xl bg-surface-highest p-5 shadow-[0_16px_44px_rgba(33,26,20,0.06)]">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🎯</span>
                  <span className="text-3xl font-black text-ink">{totalEventsJoined}</span>
                </div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-ink/90">Events Joined</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-8 space-y-12">
            <section>
              <h2 className="mb-6 text-2xl font-extrabold font-display text-primary">Event Milestones</h2>
              <div className="rounded-[2rem] bg-surface-highest p-6 shadow-[0_18px_48px_rgba(33,26,20,0.06)]">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-ink/90">
                    {nextMilestone
                      ? `Next milestone: ${nextMilestone} events (${Math.max(nextMilestone - totalEventsJoined, 0)} to go)`
                      : 'You reached the top milestone (50 events)!'}
                  </p>
                  <p className="text-xs font-bold uppercase tracking-wider text-ink/75">
                    {totalEventsJoined} total events
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
                          {unlocked ? 'Unlocked' : 'Locked'}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>

            <section>
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-extrabold font-display text-primary">Earned Badges</h2>
                <button type="button" className="text-primary font-bold text-sm hover:underline">View All</button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                {(points?.badges || []).slice(0, 4).map((badge) => (
                  <div key={badge.name} className="rounded-[2rem] bg-surface-low p-6 text-center space-y-3 transition-transform hover:-translate-y-1 shadow-[0_18px_48px_rgba(33,26,20,0.06)]">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary shadow-[0_14px_32px_rgba(33,26,20,0.08)]">
                      {badge.iconUrl ? (
                        <img src={badge.iconUrl} alt={badge.name} className="h-10 w-10 object-contain" />
                      ) : (
                        <span className="text-2xl font-black">★</span>
                      )}
                    </div>
                    <p className="font-display font-bold text-sm">{badge.name}</p>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-ink/90">Unlocked</span>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="mb-8 text-2xl font-extrabold font-display text-primary">Environmental Journey</h2>
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
