import React, { useEffect, useState, useCallback } from "react";
import {
  useParams,
  useSearchParams,
  Link,
  useNavigate,
} from "react-router-dom";
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
  const [status, setStatus] = useState("idle"); // idle | submitting | success | error | not_registered | out_of_range | location_denied | already_checked_in | event_completed | invalid_qr
  const [isRegistered, setIsRegistered] = useState(false);
  const [checkingRegistration, setCheckingRegistration] = useState(true);
  const [checkRegError, setCheckRegError] = useState(null); // Error when checking registration
  const [isRegistering, setIsRegistering] = useState(false);
  const [newBadges, setNewBadges] = useState([]);
  const [errorDetails, setErrorDetails] = useState(null); // { type, title, message, action }
  const { checkIn, isLoading, error } = useCheckIn();

  // Helper to extract token from URL if QR contains full URL
  const extractTokenFromUrl = useCallback((input) => {
    if (!input) return '';
    
    // Check if input is a URL
    if (input.includes('http://') || input.includes('https://') || input.includes('/checkin/')) {
      try {
        // Try to parse as full URL
        const url = new URL(input);
        const token = url.searchParams.get('token');
        if (token) return token;
      } catch {
        // If URL parsing fails, try regex extraction
        const match = input.match(/[?&]token=([^&]+)/);
        if (match) return match[1];
      }
    }
    
    // If not a URL, assume it's just the token
    return input;
  }, []);

  // Location states
  const [distanceToEvent, setDistanceToEvent] = useState(null);
  const [requiredRadius, setRequiredRadius] = useState(50);
  const [LOCATION_ERROR, setLocationError] = useState(null);

  // Get user's current location
  const getUserLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationError("Trình duyệt của bạn không hỗ trợ định vị GPS");
      return Promise.reject(new Error("Geolocation not supported"));
    }

    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          resolve(location);
        },
        (error) => {
          let errorMessage = "Không thể lấy vị trí của bạn";

          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage =
                "Bạn đã từ chối quyền truy cập vị trí. Vui lòng bật định vị và thử lại.";
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = "Thông tin vị trí không có sẵn.";
              break;
            case error.TIMEOUT:
              errorMessage = "Hết thời gian chờ lấy vị trí.";
              break;
          }

          setLocationError(errorMessage);
          reject(new Error(errorMessage));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000,
        },
      );
    });
  }, []);

  const submit = useCallback(
    async (token) => {
      if (!token) return;
      setStatus("submitting");
      try {
        // Get user location first
        let location = null;
        try {
          location = await getUserLocation();
        } catch {
          // If location is required but denied, show error
          if (event?.checkinRadius > 0) {
            setStatus("location_denied");
            return;
          }
          // Continue without location if not required
        }

        // Get current badges before check-in
        const { data: beforeData } = await pointsApi.getMyBadges();
        const beforeBadgeIds = new Set(
          (beforeData || []).map((b) => b.badgeId || b.id),
        );

        // Call checkIn API with location data
        const response = await checkIn(
          eventId,
          token,
          location?.latitude,
          location?.longitude,
        );

        // Check if check-in failed due to distance or other reason with success: false
        if (response && !response.success) {
          if (response.distanceToEvent) {
            setDistanceToEvent(response.distanceToEvent);
            setRequiredRadius(response.requiredRadius || 50);
            setStatus("out_of_range");
          } else {
            // Other failure with success: false from API
            setStatus("error");
          }
          return;
        }

        // Get updated badges after check-in
        const { data: afterData } = await pointsApi.getMyBadges();
        const afterBadges = afterData || [];

        // Find newly earned badges
        const newlyEarned = afterBadges.filter((b) => {
          const id = b.badgeId || b.id;
          return !beforeBadgeIds.has(id);
        });

        setNewBadges(newlyEarned);
        setStatus("success");
      } catch (err) {
        // Handle specific error cases from error response
        const errorMessage = err.response?.data?.message || err.message || '';
        const statusCode = err.response?.status;

        // Check for specific error types
        if (errorMessage.includes('vị trí') ||
            errorMessage.includes('location') ||
            errorMessage.includes('GPS') ||
            errorMessage.includes('coordinates')) {
          setErrorDetails({
            type: 'location',
            title: 'Cần quyền truy cập vị trí',
            message: errorMessage || 'Vui lòng bật định vị và cho phép truy cập vị trí để check-in.',
            action: 'retry'
          });
          setStatus("location_denied");
        } else if (errorMessage.includes('khoảng cách') ||
                   errorMessage.includes('xa') ||
                   errorMessage.includes('phạm vi') ||
                   errorMessage.includes('range') ||
                   errorMessage.includes('distance') ||
                   (statusCode === 400 && errorMessage.includes('m away'))) {
          setErrorDetails({
            type: 'out_of_range',
            title: 'Bạn đang quá xa sự kiện',
            message: errorMessage || 'Vui lòng di chuyển đến gần địa điểm sự kiện hơn để check-in.',
            action: 'map'
          });
          setStatus("out_of_range");
        } else if (errorMessage.includes('register') ||
                   errorMessage.includes('đăng ký') ||
                   errorMessage.includes('NOT_REGISTERED')) {
          setErrorDetails({
            type: 'not_registered',
            title: 'Chưa đăng ký sự kiện',
            message: 'Bạn cần đăng ký sự kiện trước khi check-in.',
            action: 'register'
          });
          // Trigger registration check refresh
          setIsRegistered(false);
        } else if (errorMessage.includes('already checked in') ||
                   errorMessage.includes('đã check-in') ||
                   errorMessage.includes('CHECKED_IN') ||
                   statusCode === 409) {
          setErrorDetails({
            type: 'already_checked_in',
            title: 'Đã check-in rồi',
            message: 'Bạn đã check-in cho sự kiện này rồi. Không cần check-in lại.',
            action: 'view_profile'
          });
          setStatus("already_checked_in");
        } else if (errorMessage.includes('expired') ||
                   errorMessage.includes('hết hạn') ||
                   errorMessage.includes('Invalid') ||
                   errorMessage.includes('invalid') ||
                   errorMessage.includes('QR')) {
          setErrorDetails({
            type: 'invalid_qr',
            title: 'Mã QR không hợp lệ',
            message: 'Mã QR đã hết hạn hoặc không đúng. Vui lòng quét lại mã QR mới từ ban tổ chức.',
            action: 'retry_scan'
          });
          setStatus("invalid_qr");
        } else if (errorMessage.includes('completed') ||
                   errorMessage.includes('kết thúc') ||
                   errorMessage.includes('COMPLETED')) {
          setErrorDetails({
            type: 'event_completed',
            title: 'Sự kiện đã kết thúc',
            message: 'Sự kiện này đã kết thúc, không thể check-in.',
            action: 'back'
          });
          setStatus("event_completed");
        } else if (statusCode === 404) {
          setErrorDetails({
            type: 'event_not_found',
            title: 'Không tìm thấy sự kiện',
            message: 'Sự kiện không tồn tại hoặc đã bị xóa.',
            action: 'back'
          });
          setStatus("error");
        } else {
          setErrorDetails({
            type: 'unknown',
            title: 'Check-in thất bại',
            message: errorMessage || 'Đã có lỗi xảy ra. Vui lòng thử lại.',
            action: 'retry'
          });
          setStatus("error");
        }
      }
    },
    [checkIn, eventId, getUserLocation, event?.checkinRadius],
  );

  // Check registration status
  const checkRegistrationStatus = useCallback(async () => {
    setCheckRegError(null);
    try {
      // Try to use dedicated registration check API first
      try {
        const checkRes = await eventsApi.checkRegistration(eventId);
        const isReg = checkRes?.data?.data?.registered || checkRes?.data?.registered || false;
        setIsRegistered(isReg);
        return isReg;
      } catch (checkErr) {
        // If 404, user is not registered - this is expected for new users
        if (checkErr.response?.status === 404) {
          setIsRegistered(false);
          return false;
        }
        // For other errors, fall back to myEvents method
      }

      // Fallback: Check from my events list
      const myEventsRes = await usersApi.getMyEvents();
      const rawMyEvents = myEventsRes?.data?.data || myEventsRes?.data || [];
      const myEvents = Array.isArray(rawMyEvents) ? rawMyEvents : [];
      const registered = myEvents.some(
        (item) =>
          String(item?.id) === eventId || String(item?.eventId) === eventId,
      );
      setIsRegistered(registered);
      return registered;
    } catch (err) {
      console.error('Error checking registration:', err);
      setCheckRegError('Không thể kiểm tra trạng thái đăng ký. Vui lòng tải lại trang.');
      // Keep current state on error, don't assume false
      return isRegistered;
    }
  }, [eventId, isRegistered]);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await eventsApi.getById(eventId);
        const eventData = data?.data || data;
        setEvent(eventData);

        // Set required radius from event data
        if (eventData?.checkinRadius) {
          setRequiredRadius(eventData.checkinRadius);
        }

        // Check registration status
        const registered = await checkRegistrationStatus();

        // If registered and has token from URL, auto-submit
        if (registered && urlToken) {
          void submit(urlToken);
        }
      } catch (err) {
        console.error('Error loading event:', err);
      } finally {
        setCheckingRegistration(false);
      }
    };
    void load();
  }, [eventId, urlToken, submit, checkRegistrationStatus]);

  const handleRegister = async () => {
    setIsRegistering(true);
    try {
      await eventsApi.register(eventId);
      // Re-check registration to ensure state is synced
      const registered = await checkRegistrationStatus();
      if (registered) {
        alert("Đăng ký thành công! Vui lòng quét lại mã QR để check-in.");
      } else {
        setIsRegistered(true); // Optimistic update
        alert("Đăng ký thành công! Vui lòng quét lại mã QR để check-in.");
      }
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

          {checkRegError && (
            <div className="w-full rounded-3xl bg-accent/10 p-6 text-center">
              <p className="font-extrabold text-accent text-lg">
                Không thể kiểm tra đăng ký
              </p>
              <p className="mt-2 text-sm text-ink/70">
                {checkRegError}
              </p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 w-full rounded-2xl bg-accent py-3 text-sm font-bold text-white hover:bg-accent-hover transition"
              >
                Tải lại trang
              </button>
            </div>
          )}

          {!checkingRegistration && !checkRegError && !isRegistered && !isRegistering && (
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
            !checkRegError &&
            isRegistered &&
            status !== "success" &&
            status !== "error" &&
            status !== "out_of_range" &&
            status !== "location_denied" &&
            status !== "already_checked_in" &&
            status !== "event_completed" &&
            status !== "invalid_qr" && (
              <>
                <QRScanner
                  onScan={(rawToken) => {
                    // Extract token from URL if QR contains full URL
                    const token = extractTokenFromUrl(rawToken);
                    setQrToken(token);
                    if (token) {
                      void submit(token);
                    } else {
                      setErrorDetails({
                        type: 'invalid_qr',
                        title: 'Mã QR không hợp lệ',
                        message: 'Không tìm thấy mã check-in trong QR code. Vui lòng quét lại mã QR từ ban tổ chức.',
                        action: 'retry_scan'
                      });
                      setStatus("invalid_qr");
                    }
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

          {status === "location_denied" && (
            <div className="w-full rounded-3xl bg-accent/10 p-6 text-center">
              <p className="font-extrabold text-accent text-lg">
                Cần quyền truy cập vị trí
              </p>
              <p className="mt-2 text-sm text-ink/70">
                {LOCATION_ERROR ||
                  "Bạn cần cấp quyền truy cập vị trí để check-in sự kiện này."}
              </p>
              <div className="mt-4 space-y-2">
                <button
                  onClick={() => {
                    setStatus("idle");
                    setLocationError(null);
                  }}
                  className="w-full rounded-2xl bg-accent px-4 py-3 text-sm font-bold text-white hover:bg-accent-hover transition"
                >
                  Thử lại
                </button>
                <button
                  onClick={() => setStatus("idle")}
                  className="w-full rounded-2xl bg-surface-highest px-4 py-3 text-sm font-bold text-ink hover:bg-surface-high transition"
                >
                  Bỏ qua
                </button>
              </div>
            </div>
          )}

          {status === "out_of_range" && (
            <div className="w-full rounded-3xl bg-accent/10 p-6 text-center">
              <p className="font-extrabold text-accent text-lg">
                Bạn đang quá xa sự kiện
              </p>
              <p className="mt-2 text-sm text-ink/70">
                Bạn đang cách sự kiện{" "}
                <span className="font-bold">
                  {Math.round(distanceToEvent || 0)}m
                </span>
                . Vui lòng di chuyển đến trong phạm vi{" "}
                <span className="font-bold">{requiredRadius}m</span> để
                check-in.
              </p>
              <div className="mt-4 space-y-2">
                <Link
                  to={`/map?eventId=${eventId}&showCheckinRadius=true`}
                  className="block w-full rounded-2xl bg-primary px-4 py-3 text-sm font-bold text-white hover:bg-primary/90 transition"
                >
                  Xem bản đồ chỉ đường
                </Link>
                <button
                  onClick={() => {
                    setStatus("idle");
                    setDistanceToEvent(null);
                  }}
                  className="w-full rounded-2xl bg-surface-highest px-4 py-3 text-sm font-bold text-ink hover:bg-surface-high transition"
                >
                  Thử lại sau
                </button>
              </div>
            </div>
          )}

          {/* Already Checked In State */}
          {status === "already_checked_in" && (
            <div className="w-full rounded-3xl bg-secondary/15 p-6 text-center">
              <div className="text-4xl mb-3">✓</div>
              <p className="font-extrabold text-primary text-lg">
                {errorDetails?.title || "Đã check-in rồi"}
              </p>
              <p className="mt-2 text-sm text-ink/70">
                {errorDetails?.message || "Bạn đã check-in cho sự kiện này rồi."}
              </p>
              <button
                onClick={() => navigate('/profile')}
                className="mt-4 w-full rounded-2xl bg-primary px-4 py-3 text-sm font-bold text-white hover:bg-primary/90 transition"
              >
                Xem hồ sơ
              </button>
            </div>
          )}

          {/* Event Completed State */}
          {status === "event_completed" && (
            <div className="w-full rounded-3xl bg-ink/10 p-6 text-center">
              <div className="text-4xl mb-3">🏁</div>
              <p className="font-extrabold text-ink text-lg">
                {errorDetails?.title || "Sự kiện đã kết thúc"}
              </p>
              <p className="mt-2 text-sm text-ink/70">
                {errorDetails?.message || "Sự kiện này đã kết thúc, không thể check-in."}
              </p>
              <button
                onClick={() => navigate('/events')}
                className="mt-4 w-full rounded-2xl bg-primary px-4 py-3 text-sm font-bold text-white hover:bg-primary/90 transition"
              >
                Xem sự kiện khác
              </button>
            </div>
          )}

          {/* Invalid QR State */}
          {status === "invalid_qr" && (
            <div className="w-full rounded-3xl bg-accent/10 p-6 text-center">
              <div className="text-4xl mb-3">📷</div>
              <p className="font-extrabold text-accent text-lg">
                {errorDetails?.title || "Mã QR không hợp lệ"}
              </p>
              <p className="mt-2 text-sm text-ink/70">
                {errorDetails?.message || "Mã QR đã hết hạn hoặc không đúng."}
              </p>
              <div className="mt-4 space-y-2">
                <button
                  onClick={() => {
                    setStatus("idle");
                    setQrToken("");
                    setErrorDetails(null);
                  }}
                  className="w-full rounded-2xl bg-accent px-4 py-3 text-sm font-bold text-white hover:bg-accent-hover transition"
                >
                  Quét lại mã QR
                </button>
                <button
                  onClick={() => setStatus("idle")}
                  className="w-full rounded-2xl bg-surface-highest px-4 py-3 text-sm font-bold text-ink hover:bg-surface-high transition"
                >
                  Nhập mã thủ công
                </button>
              </div>
            </div>
          )}

          {/* Generic Error State */}
          {status === "error" && (
            <div className="w-full rounded-3xl bg-accent/10 p-6 text-center">
              <div className="text-4xl mb-3">⚠️</div>
              <p className="font-extrabold text-accent text-lg">
                {errorDetails?.title || "Check-in thất bại"}
              </p>
              <p className="mt-2 text-sm text-ink/70">
                {errorDetails?.message || error || "Đã có lỗi xảy ra. Vui lòng thử lại."}
              </p>
              <div className="mt-4 space-y-2">
                <button
                  onClick={() => {
                    setStatus("idle");
                    setErrorDetails(null);
                  }}
                  className="w-full rounded-2xl bg-accent px-4 py-3 text-sm font-bold text-white hover:bg-accent-hover transition"
                >
                  Thử lại
                </button>
                <button
                  onClick={() => navigate('/help')}
                  className="w-full rounded-2xl bg-surface-highest px-4 py-3 text-sm font-bold text-ink hover:bg-surface-high transition"
                >
                  Liên hệ hỗ trợ
                </button>
              </div>
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
                      const isFirstStep = name === "First Green Step";
                      return (
                        <div
                          key={idx}
                          className={`flex items-center gap-2 px-3 py-2 rounded-xl ${isFirstStep ? "bg-amber-100" : "bg-white"}`}
                        >
                          {icon ? (
                            <img
                              src={icon}
                              alt={name}
                              className="w-6 h-6 object-contain"
                            />
                          ) : (
                            <span className="text-lg">
                              {isFirstStep ? "⚡" : "★"}
                            </span>
                          )}
                          <span
                            className={`text-xs font-bold ${isFirstStep ? "text-amber-800" : "text-primary"}`}
                          >
                            {name}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <button
                onClick={() => navigate("/profile")}
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
