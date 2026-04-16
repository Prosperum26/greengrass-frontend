import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { pointsApi, usersApi } from '../../../api';
import { ImpactPill } from '../../../components/eco';

const UserProfilePage = () => {
  const [user, setUser] = useState(null);
  const [events, setEvents] = useState([]);
  const [points, setPoints] = useState(null);
  const [rank, setRank] = useState(null);
  const [loading, setLoading] = useState(true);

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

  const monthlyGoal = 85;
  const ecoLevel = Math.max(1, Math.floor(user.totalPoints / 100) + 1);

  return (
    <div className="min-h-screen bg-surface">
      <div className="mx-auto max-w-7xl p-6 lg:p-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-4 space-y-8">
            <div className="relative">
              <div className="aspect-square rounded-[2rem] overflow-hidden bg-surface-highest shadow-[0_24px_70px_rgba(33,26,20,0.10)]">
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt="avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                    <span className="text-6xl font-black text-secondary">{(user.fullName?.[0] || 'U').toUpperCase()}</span>
                  </div>
                )}
              </div>

              <div className="absolute -bottom-4 -right-4 rounded-2xl bg-primary px-6 py-3 text-white shadow-[0_24px_70px_rgba(33,26,20,0.12)]">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold font-display">Eco-Level {ecoLevel}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <h1 className="text-4xl font-extrabold tracking-tight font-display">{user.fullName}</h1>
              <p className="text-ink/60 font-medium leading-relaxed">
                {user.bio || 'Dedicated eco-hero. Transforming the campus one action at a time.'}
              </p>
            </div>

            <div className="rounded-[2rem] bg-surface-low p-6 space-y-4 shadow-[0_18px_48px_rgba(33,26,20,0.06)]">
              <div className="flex justify-between items-end">
                <div>
                  <span className="uppercase text-xs tracking-widest text-ink/60 font-bold">Monthly Goal</span>
                  <h3 className="text-2xl font-display font-bold text-primary">{monthlyGoal}% Growing</h3>
                </div>
                <span className="text-secondary text-4xl">✳</span>
              </div>
              <div className="relative h-4 w-full bg-surface-highest rounded-full overflow-hidden">
                <div className="absolute inset-y-0 left-0 bg-gradient-to-br from-primary to-primary-light rounded-full" style={{ width: `${monthlyGoal}%` }} />
              </div>
              <p className="text-sm text-ink/60 italic">Keep going—your streak is compounding.</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-3xl bg-surface-highest p-5 shadow-[0_16px_44px_rgba(33,26,20,0.06)]">
                <span className="text-3xl font-black text-primary">{user.totalPoints.toLocaleString()}</span>
                <p className="text-[10px] font-bold uppercase tracking-wider text-ink/50">Impact Points</p>
              </div>
              <div className="rounded-3xl bg-surface-highest p-5 shadow-[0_16px_44px_rgba(33,26,20,0.06)]">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🔥</span>
                  <span className="text-3xl font-black text-ink">{user.currentStreak}</span>
                </div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-ink/50">Day Streak</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-8 space-y-12">
            <section>
              <h2 className="mb-6 text-2xl font-extrabold font-display">Green Streak Activity</h2>
              <div className="grid grid-cols-7 gap-2 md:gap-4">
                {Array.from({ length: 7 }).map((_, idx) => {
                  const active = idx < Math.min(user.currentStreak, 6);
                  const today = idx === 6;
                  return (
                    <div
                      key={idx}
                      className={`aspect-square rounded-xl flex items-center justify-center ${
                        today
                          ? 'bg-surface-highest text-ink/40'
                          : active
                            ? 'bg-secondary/20 text-secondary'
                            : 'bg-surface-highest text-ink/30'
                      }`}
                    >
                      {today ? <span className="text-xs font-bold">Today</span> : active ? '✓' : ''}
                    </div>
                  );
                })}
              </div>
            </section>

            <section>
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-extrabold font-display">Earned Badges</h2>
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
                    <span className="text-[10px] font-bold uppercase tracking-widest text-ink/50">Unlocked</span>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="mb-8 text-2xl font-extrabold font-display">Environmental Journey</h2>
              <div className="relative space-y-0">
                <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-surface-highest" />
                {events.slice(0, 6).map((item) => (
                  <div key={item.registrationId} className="relative flex gap-8 pb-10">
                    <div className="z-10 flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary text-white shadow-[0_20px_50px_rgba(33,26,20,0.10)]">
                      <span className="text-xl font-black">♻</span>
                    </div>
                    <div className="pt-2 min-w-0">
                      <p className="text-xs font-bold uppercase tracking-widest text-ink/50 mb-1">
                        {new Date(item.registeredAt).toLocaleDateString()}
                      </p>
                      <Link to={`/events/${item.event.id}`} className="block">
                        <h4 className="text-lg font-display font-bold text-ink hover:text-primary transition-colors line-clamp-2">
                          {item.event.title}
                        </h4>
                      </Link>
                      <p className="mt-1 text-sm text-ink/60 leading-relaxed line-clamp-2">
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
