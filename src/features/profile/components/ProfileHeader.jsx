// Profile Header Component
import { Button } from '../../../components/ui';

export const ProfileHeader = ({ user, onEdit }) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="h-32 bg-gradient-to-r from-green-500 to-green-600" />
      <div className="px-6 pb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-end -mt-12 mb-4 gap-4">
          <div className="w-24 h-24 bg-white rounded-full p-1 shadow-lg">
            {user?.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
            ) : (
              <div className="w-full h-full bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-2xl text-green-700 font-bold">{user?.name?.charAt(0) || 'U'}</span>
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold text-gray-900 truncate">{user?.name || 'Người dùng'}</h1>
            <p className="text-gray-500">{user?.school} • MSSV: {user?.studentId}</p>
          </div>
          <Button variant="outline" onClick={onEdit}>Chỉnh sửa</Button>
        </div>
        
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-1 text-gray-600">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            {user?.email}
          </div>
          <div className="flex items-center gap-1 text-gray-600">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Tham gia từ {new Date(user?.createdAt).toLocaleDateString('vi-VN')}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
