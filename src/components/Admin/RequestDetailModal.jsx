import React, { useState } from 'react';

const RequestDetailModal = ({ request, onClose, onApprove, onReject, onDelete, isProcessing }) => {
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectInput, setShowRejectInput] = useState(false);

  if (!request) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-brown-900 border border-[#859448]/20 rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="p-6">
          <h2 className="text-xl font-bold text-white mb-4">CHI TIẾT YÊU CẦU</h2>
          
          <div className="space-y-4 text-white/80">
            <div>
              <h3 className="text-sm font-semibold text-[#859448] uppercase tracking-wider mb-2">Thông tin cá nhân</h3>
              <p><span className="text-white/60">Họ tên:</span> {request.fullName}</p>
              <p><span className="text-white/60">Email:</span> {request.email}</p>
              <p><span className="text-white/60">Ngày đăng ký:</span> {new Date(request.createdAt).toLocaleDateString('vi-VN')}</p>
            </div>
            
            <div className="w-full h-px bg-white/10 my-4" />

            <div>
              <h3 className="text-sm font-semibold text-[#859448] uppercase tracking-wider mb-2">Thông tin tổ chức</h3>
              <p><span className="text-white/60">Tên:</span> {request.organizationName}</p>
              <p className="mt-1"><span className="text-white/60">Mô tả:</span> <br/>{request.description}</p>
            </div>
            
            {showRejectInput && (
              <div className="mt-4 animate-in slide-in-from-top-2">
                <label className="block text-sm font-medium text-white/60 mb-1">Lý do từ chối (tùy chọn)</label>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  className="w-full bg-[#3D362B] border border-white/10 rounded-xl p-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-red-500/50"
                  placeholder="Nhập lý do..."
                  rows={3}
                />
              </div>
            )}
          </div>
        </div>

        <div className="flex bg-[#3D362B]/50 p-4 gap-3 justify-end border-t border-white/5">
          <button 
            onClick={onClose} 
            disabled={isProcessing}
            className="px-4 py-2 rounded-xl text-white/70 hover:bg-white/10 hover:text-white transition-colors"
          >
            Đóng
          </button>
          
          {request.status === 'PENDING' && (
            <>
              {!showRejectInput ? (
                <button
                  onClick={() => setShowRejectInput(true)}
                  className="px-4 py-2 rounded-xl text-red-400 bg-red-400/10 hover:bg-red-400/20 transition-colors font-medium border border-red-400/20"
                >
                  TỪ CHỐI
                </button>
              ) : (
                <button
                  onClick={() => onReject(request.id, rejectReason)}
                  disabled={isProcessing}
                  className="px-4 py-2 rounded-xl text-white bg-red-500 hover:bg-red-600 transition-colors font-medium shadow-lg shadow-red-500/20 disabled:opacity-50"
                >
                  Xác nhận từ chối
                </button>
              )}
              
              <button
                onClick={() => {
                  if (window.confirm('Bạn có chắc chắn duyệt yêu cầu này?')) {
                    onApprove(request.id);
                  }
                }}
                disabled={isProcessing}
                className="px-4 py-2 rounded-xl text-white bg-[#859448] hover:bg-[#96a655] transition-colors font-medium shadow-lg shadow-[#859448]/20 disabled:opacity-50"
              >
                DUYỆT
              </button>
            </>
          )}
          
          {/* Delete button for APPROVED organizers */}
          {request.status === 'APPROVED' && (
            <button
              onClick={() => onDelete(request.id)}
              disabled={isProcessing}
              className="px-4 py-2 rounded-xl text-white bg-red-600 hover:bg-red-700 transition-colors font-medium shadow-lg shadow-red-600/20 disabled:opacity-50"
            >
              🗑️ XÓA ORGANIZER
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default RequestDetailModal;
