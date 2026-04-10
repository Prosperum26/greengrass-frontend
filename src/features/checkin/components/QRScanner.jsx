// QR Scanner Component
import { useState, useRef } from 'react';
import { Button } from '../../../components/ui';

export const QRScanner = ({ onScan, onError }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [hasCamera, setHasCamera] = useState(true);
  const videoRef = useRef(null);

  const startScanning = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
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
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
    }
    setIsScanning(false);
  };

  // Placeholder for QR detection - integrate with jsQR or similar library
  const handleScan = (data) => {
    if (data) {
      onScan?.(data);
      stopScanning();
    }
  };

  if (!hasCamera) {
    return (
      <div className="p-6 bg-red-50 rounded-xl text-center">
        <p className="text-red-600 font-medium">Không thể truy cập camera</p>
        <p className="text-sm text-red-500 mt-1">Vui lòng cấp quyền camera và thử lại</p>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="aspect-square bg-black rounded-xl overflow-hidden">
        {isScanning ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center">
            <div className="w-20 h-20 border-4 border-green-500 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-10 h-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
              </svg>
            </div>
            <p className="text-white text-lg font-medium">Quét mã QR</p>
            <p className="text-gray-400 text-sm mt-1">Đưa mã QR vào khung hình</p>
          </div>
        )}
      </div>
      
      <div className="mt-4 flex justify-center gap-3">
        {isScanning ? (
          <Button variant="secondary" onClick={stopScanning}>Dừng quét</Button>
        ) : (
          <Button onClick={startScanning}>Bắt đầu quét</Button>
        )}
      </div>
    </div>
  );
};

export default QRScanner;
