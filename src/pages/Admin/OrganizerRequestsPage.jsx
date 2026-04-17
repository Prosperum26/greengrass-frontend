import React, { useEffect, useState } from 'react';
import { useAdmin } from '../../hooks/useAdmin';
import RequestDetailModal from '../../components/Admin/RequestDetailModal';

const OrganizerRequestsPage = () => {
  const { requests, pagination, isLoading, fetchRequests, approveRequest, rejectRequest } = useAdmin();
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    loadData(1, statusFilter);
  }, [statusFilter]);

  const loadData = (page, status) => {
    const params = { page, limit: 10 };
    if (status !== 'ALL') params.status = status;
    fetchRequests(params);
  };

  const handleApprove = async (id) => {
    setIsProcessing(true);
    const res = await approveRequest(id);
    if (res.success) {
      alert('Duyệt thành công!');
      setSelectedRequest(null);
      loadData(pagination.page, statusFilter);
    } else {
      alert(res.message);
    }
    setIsProcessing(false);
  };

  const handleReject = async (id, reason) => {
    setIsProcessing(true);
    const res = await rejectRequest(id, reason);
    if (res.success) {
      alert('Đã từ chối thành công!');
      setSelectedRequest(null);
      loadData(pagination.page, statusFilter);
    } else {
      alert(res.message);
    }
    setIsProcessing(false);
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'PENDING': return <span className="px-2 py-1 bg-yellow-500/20 text-yellow-500 rounded-md text-xs font-semibold">PENDING</span>;
      case 'APPROVED': return <span className="px-2 py-1 bg-green-500/20 text-[#859448] rounded-md text-xs font-semibold">APPROVED</span>;
      case 'REJECTED': return <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded-md text-xs font-semibold">REJECTED</span>;
      default: return null;
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-white tracking-tight">Quản lý Đơn Đăng Ký</h1>
          <p className="text-white/60 mt-1">Duyệt hoặc từ chối đơn đăng ký tài khoản Organizer</p>
        </div>
        
        <select 
          value={statusFilter} 
          onChange={e => setStatusFilter(e.target.value)}
          className="bg-[#3D362B] border border-white/10 text-white rounded-xl px-4 py-2 focus:outline-none focus:border-[#859448] appearance-none cursor-pointer"
        >
          <option value="ALL">Tất cả (All)</option>
          <option value="PENDING">Chờ duyệt (Pending)</option>
          <option value="APPROVED">Đã duyệt (Approved)</option>
          <option value="REJECTED">Đã từ chối (Rejected)</option>
        </select>
      </div>

      <div className="bg-[#2A241C] border border-white/5 rounded-2xl overflow-hidden shadow-xl">
        {isLoading ? (
          <div className="p-12 text-center text-white/50 flex flex-col items-center">
             <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#859448] mb-4"></div>
             Đang tải dữ liệu...
          </div>
        ) : requests.length === 0 ? (
          <div className="p-12 text-center text-white/50">Không có dữ liệu!</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#3D362B]/50 border-b border-white/10">
                  <th className="px-6 py-4 text-sm font-semibold text-white/70">Người đăng ký</th>
                  <th className="px-6 py-4 text-sm font-semibold text-white/70">Tổ chức</th>
                  <th className="px-6 py-4 text-sm font-semibold text-white/70">Trạng thái</th>
                  <th className="px-6 py-4 text-sm font-semibold text-white/70 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {requests.map(req => (
                  <tr key={req.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-white">{req.fullName}</div>
                      <div className="text-sm text-white/50">{req.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-white">{req.organizationName}</div>
                      <div className="text-sm text-white/50 truncate max-w-xs">{req.description}</div>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(req.status)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => setSelectedRequest(req)}
                        className="px-3 py-1.5 text-sm font-medium text-[#859448] bg-[#859448]/10 hover:bg-[#859448]/20 rounded-lg transition-colors border border-[#859448]/20"
                      >
                        Xem chi tiết
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {pagination.total > 0 && !isLoading && (
        <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
          <p className="text-sm text-white/50">
            Trang <span className="font-semibold text-white">{pagination.page}</span> trên <span className="font-semibold text-white">{Math.ceil(pagination.total / pagination.limit) || 1}</span>
          </p>
          <div className="flex gap-2">
            <button 
              disabled={pagination.page <= 1}
              onClick={() => loadData(pagination.page - 1, statusFilter)}
              className="px-4 py-2 rounded-lg bg-[#3D362B] text-white disabled:opacity-30 hover:bg-white/10 transition-colors"
            >
              Trang trước
            </button>
            <button 
              disabled={pagination.page >= Math.ceil(pagination.total / pagination.limit)}
              onClick={() => loadData(pagination.page + 1, statusFilter)}
              className="px-4 py-2 rounded-lg bg-[#3D362B] text-white disabled:opacity-30 hover:bg-white/10 transition-colors"
            >
              Trang sau
            </button>
          </div>
        </div>
      )}

      {selectedRequest && (
        <RequestDetailModal 
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
          onApprove={handleApprove}
          onReject={handleReject}
          isProcessing={isProcessing}
        />
      )}
    </div>
  );
};

export default OrganizerRequestsPage;
