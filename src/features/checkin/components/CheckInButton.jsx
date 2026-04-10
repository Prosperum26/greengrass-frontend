// Check-in Button Component
import { useState } from 'react';
import { Button, Modal } from '../../../components/ui';
import { QRScanner } from './QRScanner';

export const CheckInButton = ({ eventId, onCheckIn, gpsLocation }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [step, setStep] = useState('qr'); // qr | gps | proof | success
  const [isProcessing, setIsProcessing] = useState(false);

  const handleQRScan = async (qrData) => {
    setStep('gps');
  };

  const handleGPSValidate = async () => {
    setStep('proof');
  };

  const handleProofUpload = async (file) => {
    setIsProcessing(true);
    try {
      await onCheckIn?.({ eventId, qrData: null, gpsLocation, proof: file });
      setStep('success');
    } finally {
      setIsProcessing(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setStep('qr');
  };

  return (
    <>
      <Button onClick={() => setIsModalOpen(true)} className="w-full">
        Check-in sự kiện
      </Button>

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title="Check-in sự kiện"
        size="md"
      >
        <div className="space-y-4">
          {/* Progress steps */}
          <div className="flex items-center justify-center gap-2 mb-6">
            {['qr', 'gps', 'proof', 'success'].map((s, i) => (
              <div key={s} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step === s ? 'bg-green-600 text-white' :
                  ['qr', 'gps', 'proof', 'success'].indexOf(step) > i ? 'bg-green-100 text-green-700' :
                  'bg-gray-100 text-gray-400'
                }`}>
                  {['qr', 'gps', 'proof', 'success'].indexOf(step) > i ? '✓' : i + 1}
                </div>
                {i < 3 && <div className="w-8 h-0.5 bg-gray-200 mx-1" />}
              </div>
            ))}
          </div>

          {step === 'qr' && (
            <QRScanner 
              onScan={handleQRScan} 
              onError={(err) => console.error(err)}
            />
          )}
          
          {step === 'gps' && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <p className="text-gray-900 font-medium">Xác thực vị trí GPS</p>
              <p className="text-sm text-gray-500 mt-1">
                Vị trí: {gpsLocation?.lat?.toFixed(4)}, {gpsLocation?.lng?.toFixed(4)}
              </p>
              <Button onClick={handleGPSValidate} className="mt-4">Xác nhận vị trí</Button>
            </div>
          )}

          {step === 'proof' && (
            <div className="text-center py-8">
              <p className="text-gray-900 font-medium mb-4">Tải lên ảnh minh chứng</p>
              <input
                type="file"
                accept="image/*"
                capture="environment"
                onChange={(e) => handleProofUpload(e.target.files[0])}
                className="hidden"
                id="proof-upload"
              />
              <label htmlFor="proof-upload">
                <Button disabled={isProcessing}>
                  {isProcessing ? 'Đang xử lý...' : 'Chụp ảnh / Chọn file'}
                </Button>
              </label>
            </div>
          )}

          {step === 'success' && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-gray-900 font-medium">Check-in thành công!</p>
              <p className="text-sm text-gray-500 mt-1">Điểm sẽ được cập nhật sau khi xác minh</p>
              <Button onClick={closeModal} className="mt-4">Đóng</Button>
            </div>
          )}
        </div>
      </Modal>
    </>
  );
};

export default CheckInButton;
