import { useEffect, useRef, useState } from 'react';
import { BrowserMultiFormatReader } from '@zxing/browser';
import { NotFoundException } from '@zxing/library';

export const QRScanner = ({ onScan, onError, className = '' }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [hasCamera, setHasCamera] = useState(true);
  const videoRef = useRef(null);
  const readerRef = useRef(null);

  useEffect(() => {
    readerRef.current = new BrowserMultiFormatReader();
    return () => {
      try {
        readerRef.current?.reset?.();
      } catch {
        // ignore
      }
    };
  }, []);

  const stopScanning = () => {
    try {
      readerRef.current?.reset?.();
    } catch {
      // ignore
    }
    setIsScanning(false);
  };

  const startScanning = async () => {
    try {
      const video = videoRef.current;
      if (!video) return;

      setIsScanning(true);
      const devices = await BrowserMultiFormatReader.listVideoInputDevices();
      if (!devices?.length) {
        setHasCamera(false);
        onError?.('Không tìm thấy camera');
        return;
      }

      const preferredDeviceId = devices[devices.length - 1].deviceId;
      await readerRef.current.decodeFromVideoDevice(preferredDeviceId, video, (result, err) => {
        if (result) {
          onScan?.(result.getText());
          stopScanning();
          return;
        }
        if (err && !(err instanceof NotFoundException)) {
          onError?.('Quét QR thất bại');
        }
      });
    } catch {
      setHasCamera(false);
      onError?.('Không thể truy cập camera');
    }
  };

  return (
    <section className={`w-full ${className}`}>
      <div className="rounded-3xl bg-ink overflow-hidden shadow-[0_20px_60px_rgba(33,26,20,0.16)]">
        <div className="relative aspect-square">
          {hasCamera ? (
            <>
              <video ref={videoRef} autoPlay playsInline muted className="h-full w-full object-cover opacity-80" />
              <div className="absolute inset-0 border-[40px] border-black/40" />
              <div className="absolute left-1/2 top-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-2xl border-2 border-dashed border-secondary/70">
                <div className="absolute inset-0 rounded-2xl border-2 border-primary/70 animate-pulse" />
              </div>
            </>
          ) : (
            <div className="h-full w-full flex items-center justify-center text-white/80">
              Camera unavailable
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 flex gap-3">
        {isScanning ? (
          <button
            type="button"
            onClick={stopScanning}
            className="flex-1 rounded-2xl bg-surface-highest px-4 py-3 text-sm font-bold text-primary hover:bg-surface-high"
          >
            Stop scanning
          </button>
        ) : (
          <button
            type="button"
            onClick={startScanning}
            className="flex-1 rounded-2xl bg-primary px-4 py-3 text-sm font-bold text-white shadow-[0_18px_48px_rgba(33,26,20,0.10)]"
          >
            Start scanning
          </button>
        )}
      </div>

      <p className="mt-3 text-center text-xs font-medium text-ink/60">
        Align the QR code within the frame.
      </p>
    </section>
  );
};

export default QRScanner;
