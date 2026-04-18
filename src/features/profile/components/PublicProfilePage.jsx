import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usersApi } from '../../../api';
import { ImpactPill } from '../../../components/eco';

const PublicProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const res = await usersApi.getPublicProfile(id);
        setUser(res.data?.data || res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load public profile');
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, [id]);

  if (loading) return <div className="min-h-screen bg-surface p-6 text-ink">Loading profile...</div>;
  if (error) return <div className="min-h-screen bg-surface p-6 text-accent-hover">{error}</div>;
  if (!user) return <div className="min-h-screen bg-surface p-6 text-ink">No user profile</div>;

  const ecoLevel = Math.max(1, Math.floor((user.totalPoints || 0) / 100) + 1);

  return (
    <div className="min-h-screen bg-surface">
      <div className="mx-auto max-w-5xl p-6 lg:p-12">
        <button onClick={() => navigate(-1)} className="mb-6 rounded-xl bg-surface-highest px-3 py-2 text-sm font-medium hover:bg-surface-high">
          Back
        </button>
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="shrink-0">
            <div className="h-48 w-48 rounded-[2rem] overflow-hidden bg-surface-highest shadow-xl relative">
              {user.avatarUrl ? (
                <img src={user.avatarUrl} alt="avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                  <span className="text-6xl font-black text-secondary">{(user.fullName?.[0] || 'U').toUpperCase()}</span>
                </div>
              )}
              <div className="absolute -bottom-2 -right-2 rounded-xl bg-primary px-4 py-2 text-white shadow-lg">
                <span className="text-sm font-bold font-display">Level {ecoLevel}</span>
              </div>
            </div>
          </div>
          <div className="space-y-4 pt-2 flex-1">
            <h1 className="text-4xl font-extrabold tracking-tight font-display">{user.fullName}</h1>
            <p className="text-ink/60 font-medium leading-relaxed max-w-lg">
              {user.bio || 'This user is contributing to the green environment!'}
            </p>
            <div className="flex gap-4 pt-4">
              <div className="rounded-2xl bg-surface-highest px-6 py-4 shadow-sm text-center">
                <span className="block text-3xl font-black text-primary">{(user.totalPoints || 0).toLocaleString()}</span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-ink/50">Impact Points</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicProfilePage;
