import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { eventsApi } from '../../../api';
import { QRScanner } from '../components/QRScanner';
import { useCheckIn } from '../hooks/useCheckIn';

export const CheckInPage = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [qrToken, setQrToken] = useState('');
  const [status, setStatus] = useState('idle'); // idle | submitting | success
  const { checkIn, isLoading, error } = useCheckIn();

  useEffect(() => {
    const load = async () => {
      const { data } = await eventsApi.getById(eventId);
      setEvent(data?.data || data);
    };
    void load();
  }, [eventId]);

  const submit = async (token) => {
    if (!token) return;
    setStatus('submitting');
    try {
      await checkIn(eventId, token);
      setStatus('success');
    } catch {
      setStatus('idle');
    }
  };

  return (
    <div className="mx-auto max-w-md px-6 py-8 md:py-12 min-h-[calc(100vh-64px)] flex flex-col gap-8">
      <header className="flex flex-col gap-2">
        <h1 className="font-display font-extrabold text-primary tracking-tight text-3xl leading-tight">
          Event Check-in
        </h1>
        <p className="text-ink/60 font-medium leading-relaxed">
          Verify your attendance at{' '}
          <span className="text-primary font-bold">{event?.title || 'this event'}</span> to unlock your impact rewards.
        </p>
      </header>

      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-3xl bg-surface-low p-4 flex flex-col gap-3">
          <div className="text-3xl text-primary">📍</div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-ink/50">Status</p>
            <p className="text-sm font-bold text-primary">{status === 'success' ? 'Verified' : 'Ready'}</p>
          </div>
        </div>
        <div className="rounded-3xl bg-secondary/15 p-4 flex flex-col gap-3">
          <div className="text-3xl text-secondary">🌿</div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-ink/50">Event ID</p>
            <p className="text-sm font-bold text-ink">#{eventId}</p>
          </div>
        </div>
      </div>

      <section className="relative rounded-[2.5rem] bg-surface-highest p-1 overflow-hidden">
        <div className="rounded-[2.25rem] bg-surface/80 backdrop-blur-xl p-8 flex flex-col items-center gap-6 shadow-[0_18px_48px_rgba(33,26,20,0.06)]">
          <div className="w-full space-y-3">
            <label className="block text-[10px] font-bold uppercase tracking-widest text-ink/50">
              QR Token (auto-fill when scanned)
            </label>
            <input
              value={qrToken}
              onChange={(e) => setQrToken(e.target.value)}
              placeholder="Scan or paste token…"
              className="w-full rounded-2xl bg-surface-highest px-4 py-4 text-sm text-ink outline-none focus:ring-2 focus:ring-primary/25"
            />
          </div>

          {status !== 'success' && (
            <>
              <QRScanner
                onScan={(token) => {
                  setQrToken(token);
                  void submit(token);
                }}
                onError={() => {}}
              />

              {error && <p className="text-sm text-accent-hover">{error}</p>}

              <button
                type="button"
                disabled={isLoading || !qrToken}
                onClick={() => submit(qrToken)}
                className="w-full rounded-3xl bg-accent py-5 text-lg font-extrabold text-white shadow-[0_20px_40px_rgba(247,90,13,0.18)] transition disabled:opacity-50"
              >
                {isLoading ? 'Submitting…' : 'Complete Check-in'}
              </button>
            </>
          )}

          {status === 'success' && (
            <div className="w-full rounded-3xl bg-secondary/15 p-6 text-center">
              <p className="font-extrabold text-primary text-lg">Check-in successful</p>
              <p className="mt-1 text-sm text-ink/60">Your rewards will be updated shortly.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default CheckInPage;

