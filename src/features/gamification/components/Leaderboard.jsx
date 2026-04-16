import { useEffect, useState } from 'react';
import { pointsApi } from '../../../api';
import { LeaderboardItem } from '../../../components/eco';

export const Leaderboard = () => {
  const [timeframe, setTimeframe] = useState('weekly');
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    const load = async () => {
      const { data } = await pointsApi.getLeaderboard({ limit: 20, timeframe });
      setEntries(data?.users || []);
    };
    void load();
  }, [timeframe]);

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
        <div className="lg:col-span-4 space-y-4">
          <h2 className="text-5xl font-extrabold font-display leading-tight tracking-tighter text-primary">
            The Living
            <br />
            Journal
          </h2>
          <p className="text-lg text-ink/60 max-w-xs leading-relaxed">
            Celebrating those leading the way to a greener campus. Every action ripples into lasting impact.
          </p>
        </div>

        <div className="lg:col-span-8 flex flex-col md:flex-row items-end justify-end gap-6 md:gap-4">
          {entries.slice(0, 3).map((u) => (
            <div
              key={u.userId}
              className={`rounded-3xl p-6 text-center space-y-4 shadow-[0_20px_60px_rgba(33,26,20,0.08)] ${
                u.rank === 1 ? 'bg-primary text-white md:w-64 -translate-y-5' : 'bg-surface-low text-ink md:w-56'
              }`}
            >
              <div className="relative inline-block">
                <div className={`mx-auto flex h-20 w-20 items-center justify-center rounded-full ${u.rank === 1 ? 'bg-white/15' : 'bg-surface-high'}`}>
                  <span className={`text-2xl font-black ${u.rank === 1 ? 'text-white' : 'text-secondary'}`}>{(u.fullName?.[0] || 'U').toUpperCase()}</span>
                </div>
                <span className={`absolute -bottom-2 -right-2 flex h-9 w-9 items-center justify-center rounded-full text-sm font-extrabold ${
                  u.rank === 1 ? 'bg-accent text-white' : 'bg-secondary text-white'
                }`}>
                  {u.rank}
                </span>
              </div>
              <div>
                <h3 className={`font-extrabold ${u.rank === 1 ? 'text-white text-xl' : 'text-ink'}`}>{u.fullName}</h3>
                <p className={`text-xs font-bold uppercase tracking-widest ${u.rank === 1 ? 'text-white/80' : 'text-ink/50'}`}>Streak {u.currentStreak}</p>
              </div>
              <p className={`font-black ${u.rank === 1 ? 'text-3xl text-white' : 'text-2xl text-primary'}`}>
                {u.totalPoints.toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-8">
          <div className="rounded-3xl bg-surface-highest p-8 shadow-[0_24px_70px_rgba(33,26,20,0.08)] space-y-6">
            <div className="flex items-center justify-between">
              <h4 className="text-xl font-bold font-display text-primary">Campus Progress</h4>
              <select value={timeframe} onChange={(e) => setTimeframe(e.target.value)} className="rounded-xl bg-surface-high px-3 py-2 text-sm text-ink outline-none focus:ring-2 focus:ring-primary/30">
                <option value="all">All</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>

            <div className="space-y-5">
              <div className="space-y-2">
                <div className="flex justify-between text-sm font-bold uppercase tracking-tight">
                  <span>Reforestation Goal</span>
                  <span className="text-secondary">82%</span>
                </div>
                <div className="h-12 w-full rounded-2xl bg-surface-low p-1 overflow-hidden">
                  <div className="h-full w-[82%] rounded-xl bg-gradient-to-r from-primary to-secondary" />
                </div>
                <p className="text-sm text-ink/60">We&apos;ve planted 4,100 of 5,000 trees this semester.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-8 rounded-3xl bg-surface-low p-8 shadow-[0_24px_70px_rgba(33,26,20,0.08)]">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <h4 className="text-3xl font-bold font-display text-primary">Contributors</h4>
              <p className="text-ink/60">Real-time ranking of our active members</p>
            </div>
          </div>

          <div className="space-y-4">
            {entries.slice(3).map((u) => (
              <LeaderboardItem
                key={u.userId}
                rank={u.rank}
                name={u.fullName}
                subtitle={`Streak ${u.currentStreak}`}
                points={u.totalPoints}
                progressLabel="Active"
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Leaderboard;
