import React, { useEffect, useState, useCallback } from "react";
import { useParams, useSearchParams, Link, useNavigate } from "react-router-dom";
import { eventsApi, usersApi, pointsApi } from "../../../api";
import { QRScanner } from "../components/QRScanner";
import { useCheckIn } from "../hooks/useCheckIn";

export const CheckInPage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const urlToken = searchParams.get("token");
  const [event, setEvent] = useState(null);
  const [qrToken, setQrToken] = useState(urlToken || "");
  const [status, setStatus] = useState("idle"); // idle | submitting | success | error | not_registered
  const [isRegistered, setIsRegistered] = useState(false);
  const [checkingRegistration, setCheckingRegistration] = useState(true);
  const [isRegistering, setIsRegistering] = useState(false);
  const [newBadges, setNewBadges] = useState([]);
  const { checkIn, isLoading, error } = useCheckIn();

  const submit = useCallback(
    async (token) => {
      if (!token) return;
      setStatus("submitting");
      try {
        // Get current badges before check-in
        const { data: beforeData } = await pointsApi.getMyBadges();
        const beforeBadgeIds = new Set((beforeData || []).map(b => b.badgeId || b.id));

        await checkIn(eventId, token);

        // Get updated badges after check-in
        const { data: afterData } = await pointsApi.getMyBadges();
        const afterBadges = afterData || [];

        // Find newly earned badges
        const newlyEarned = afterBadges.filter(b => {
          const id = b.badgeId || b.id;
          return !beforeBadgeIds.has(id);
        });

        setNewBadges(newlyEarned);
        setStatus("success");
      } catch {
        setStatus("error");
      }
    },
    [checkIn, eventId],
  );

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await eventsApi.getById(eventId);
        setEvent(data?.data || data);

        // Check if user is registered for this event
        const myEventsRes = await usersApi.getMyEvents();
        const rawMyEvents = myEventsRes?.data?.data || myEventsRes?.data || [];
        const myEvents = Array.isArray(rawMyEvents) ? rawMyEvents : [];
        const registered = myEvents.some(
          (item) =>
            String(item?.id) === eventId || String(item?.eventId) === eventId,
        );
        setIsRegistered(registered);

        // If registered and has token from URL, auto-submit
        if (registered && urlToken) {
          void submit(urlToken);
        }
      } catch {
        // Silent fail
      } finally {
        setCheckingRegistration(false);
      }
    };
    void load();
  }, [eventId, urlToken, submit]);

  const handleRegister = async () => {
    setIsRegistering(true);
    try {
      await eventsApi.register(eventId);
      setIsRegistered(true);
      // Re-check registration to ensure state is synced
      const myEventsRes = await usersApi.getMyEvents();
      const rawMyEvents = myEventsRes?.data?.data || myEventsRes?.data || [];
      const myEvents = Array.isArray(rawMyEvents) ? rawMyEvents : [];
      const registered = myEvents.some(
        (item) =>
          String(item?.id) === eventId || String(item?.eventId) === eventId,
      );
      setIsRegistered(registered);
      alert("Đăng ký thành công! Vui lòng quét lại mã QR để check-in.");
    } catch (err) {
      if (err.response?.status === 409) {
        // Already registered, update state
        setIsRegistered(true);
        alert("Bạn đã đăng ký sự kiện này rồi!");
      } else {
        alert(err.response?.data?.message || "Đăng ký thất bại");
      }
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-6 py-8 md:py-12 min-h-[calc(100vh-64px)] flex flex-col gap-8">
      <header className="flex flex-col gap-2">
        <h1 className="font-display font-extrabold text-primary tracking-tight text-3xl leading-tight">
          Check-in Sự kiện
        </h1>
        <p className="text-ink/60 font-medium leading-relaxed">
          Xác nhận sự tham gia của bạn tại{" "}
          <span className="text-primary font-bold">
            {event?.title || "sự kiện này"}
          </span>{" "}
          để nhận điểm thưởng.
        </p>
      </header>

      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-3xl bg-surface-low p-4 flex flex-col gap-3">
          <div className="text-3xl text-primary">📍</div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-ink/50">
              Trạng thái
            </p>
            <p className="text-sm font-bold text-primary">
              {!checkingRegistration && !isRegistered
                ? "Chưa đăng ký"
                : status === "success"
                  ? "Đã xác thực"
                  : "Sẵn sàng"}
            </p>
          </div>
        </div>
        <div className="rounded-3xl bg-secondary/15 p-4 flex flex-col gap-3">
          <div className="text-3xl text-secondary">🌿</div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-ink/50">
              Đăng ký
            </p>
            <p className="text-sm font-bold text-ink">
              {checkingRegistration
                ? "..."
                : isRegistered
                  ? "✓ Đã đăng ký"
                  : "✗ Chưa đăng ký"}
            </p>
          </div>
        </div>
      </div>

      <section className="relative rounded-[2.5rem] bg-surface-highest p-1 overflow-hidden">
        <div className="rounded-[2.25rem] bg-surface/80 backdrop-blur-xl p-8 flex flex-col items-center gap-6 shadow-[0_18px_48px_rgba(33,26,20,0.06)]">
          <div className="w-full space-y-3">
            <label className="block text-[10px] font-bold uppercase tracking-widest text-ink/50">
              Mã QR (tự động điền khi quét)
            </label>
            <input
              value={qrToken}
              onChange={(e) => setQrToken(e.target.value)}
              placeholder="Quét hoặc dán mã..."
              className="w-full rounded-2xl bg-surface-highest px-4 py-4 text-sm text-ink outline-none focus:ring-2 focus:ring-primary/25"
            />
          </div>

          {checkingRegistration && (
            <div className="w-full text-center py-8">
              <div className="w-10 h-10 border-4 border-primary border-t-accent rounded-full animate-spin mx-auto"></div>
              <p className="mt-4 text-sm text-ink/60">
                Đang kiểm tra đăng ký...
              </p>
            </div>
          )}

          {!checkingRegistration && !isRegistered && !isRegistering && (
            <div className="w-full rounded-3xl bg-accent/10 p-6 text-center">
              <p className="font-extrabold text-accent text-lg">
                Chưa đăng ký sự kiện
              </p>
              <p className="mt-2 text-sm text-ink/70">
                Bạn cần đăng ký sự kiện trước khi check-in.
              </p>
              <button
                onClick={handleRegister}
                disabled={isRegistering}
                className="mt-4 w-full rounded-2xl bg-accent py-3 text-sm font-bold text-white hover:bg-accent-hover transition disabled:opacity-50"
              >
                {isRegistering ? "Đang đăng ký..." : "Đăng ký ngay"}
              </button>
              <p className="mt-3 text-xs text-ink/50">
                Sau khi đăng ký, vui lòng quét lại mã QR để check-in.
              </p>
            </div>
          )}

          {isRegistering && (
            <div className="w-full text-center py-8">
              <div className="w-10 h-10 border-4 border-primary border-t-accent rounded-full animate-spin mx-auto"></div>
              <p className="mt-4 text-sm text-ink/60">Đang đăng ký...</p>
            </div>
          )}

          {!checkingRegistration &&
            isRegistered &&
            status !== "success" &&
            status !== "error" && (
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
                  {isLoading ? "Đang gửi..." : "Hoàn tất Check-in"}
                </button>
              </>
            )}

          {status === "error" && (
            <div className="w-full rounded-3xl bg-accent/10 p-6 text-center">
              <p className="font-extrabold text-accent text-lg">
                Check-in thất bại
              </p>
              <p className="mt-2 text-sm text-ink/70">
                {error || "Mã QR không hợp lệ hoặc đã hết hạn."}
              </p>
              <button
                onClick={() => setStatus("idle")}
                className="mt-4 w-full rounded-2xl bg-accent px-4 py-3 text-sm font-bold text-white hover:bg-accent-hover transition"
              >
                Thử lại
              </button>
            </div>
          )}

          {status === "success" && (
            <div className="w-full rounded-3xl bg-secondary/15 p-6 text-center space-y-4">
              <p className="font-extrabold text-primary text-lg">
                Check-in thành công
              </p>
              <p className="text-sm text-ink/60">
                Điểm thưởng của bạn sẽ được cập nhật sớm.
              </p>

              {newBadges.length > 0 && (
                <div className="rounded-2xl bg-amber-50 border-2 border-amber-200 p-4">
                  <p className="text-amber-800 font-bold text-sm mb-3">
                    Huy hiệu mới đã nhận được!
                  </p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {newBadges.map((badge, idx) => {
                      const name = badge.badge?.name || badge.name;
                      const icon = badge.badge?.iconUrl || badge.iconUrl;
                      const isFirstStep = name === 'First Green Step';
                      return (
                        <div key={idx} className={`flex items-center gap-2 px-3 py-2 rounded-xl ${isFirstStep ? 'bg-amber-100' : 'bg-white'}`}>
                          {icon ? (
                            <img src={icon} alt={name} className="w-6 h-6 object-contain" />
                          ) : (
                            <span className="text-lg">{isFirstStep ? '⚡' : '★'}</span>
                          )}
                          <span className={`text-xs font-bold ${isFirstStep ? 'text-amber-800' : 'text-primary'}`}>
                            {name}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <button
                onClick={() => navigate('/profile')}
                className="w-full rounded-2xl bg-primary py-3 text-sm font-bold text-white hover:bg-primary/90 transition"
              >
                Xem hồ sơ & huy hiệu
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default CheckInPage;
