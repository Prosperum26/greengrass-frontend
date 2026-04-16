// QR Scanner Component — with modal overlay + camera logic
import { useState, useRef } from 'react';
import './QRScanner.css';

export const QRScanner = ({ onClose, onScan, onError }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [hasCamera, setHasCamera] = useState(true);
  const videoRef = useRef(null);

  // ── Camera helpers ───────────────────────────────────────────
  const startScanning = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsScanning(true);
    } catch (err) {
      setHasCamera(false);
      onError?.('Không thể truy cập camera');
    }
  };

  const stopScanning = () => {
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
    }
    setIsScanning(false);
  };

  // Placeholder for QR detection — integrate with jsQR or similar library
  const handleScan = (data) => {
    if (data) {
      onScan?.(data);
      stopScanning();
    }
  };

  // Close & stop camera at the same time
  const handleClose = () => {
    stopScanning();
    onClose?.();
  };

  // ── Backdrop click ───────────────────────────────────────────
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) handleClose();
  };

  // ── Render ───────────────────────────────────────────────────
  return (
    <div className="qr-overlay" onClick={handleBackdropClick}>
      <div
        className="qr-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="qr-modal-title"
      >
        {/* Close button */}
        <button className="qr-modal-close" onClick={handleClose} aria-label="Đóng">
          ✕
        </button>

        <h2 className="qr-modal-title" id="qr-modal-title">
          📷 QR Check-in
        </h2>

        {/* Camera / error area */}
        {!hasCamera ? (
          <div className="qr-error-box">
            <p className="qr-error-title">Không thể truy cập camera</p>
            <p className="qr-error-sub">Vui lòng cấp quyền camera và thử lại</p>
          </div>
        ) : (
          <div className="qr-video-container">
            {isScanning ? (
              <video ref={videoRef} autoPlay playsInline muted />
            ) : (
              <div className="qr-idle-placeholder">
                <svg
                  width="64"
                  height="64"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm7-16v1m0 14v1M4 12h1m14 0h1m-8-4h.01M12 12h4.01"
                  />
                </svg>
                <p>Quét mã QR</p>
                <small>Đưa mã QR vào khung hình</small>
              </div>
            )}
          </div>
        )}

        {/* Action buttons */}
        {hasCamera && (
          <div className="qr-modal-actions">
            {isScanning ? (
              <button className="qr-btn qr-btn-secondary" onClick={stopScanning}>
                Dừng quét
              </button>
            ) : (
              <button className="qr-btn qr-btn-primary" onClick={startScanning}>
                Bắt đầu quét
              </button>
            )}
          </div>
        )}

        <p className="qr-modal-subtitle">
          Quét mã QR này để xác nhận<br />tham gia sự kiện của bạn.
        </p>
      </div>
    </div>
  );
};

export default QRScanner;
