// Leaderboard Component
import { Card } from '../../../components/ui';

export const Leaderboard = ({ entries = [], type = 'individual', timeRange = 'week' }) => {
  const getRankStyle = (rank) => {
    switch (rank) {
      case 1: return 'bg-yellow-400 text-yellow-900';
      case 2: return 'bg-gray-300 text-gray-800';
      case 3: return 'bg-orange-400 text-orange-900';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <Card>
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">Bảng xếp hạng</h3>
          <div className="flex gap-2">
            <select className="text-sm border rounded-lg px-2 py-1">
              <option value="individual">Cá nhân</option>
              <option value="faculty">Khoa</option>
              <option value="school">Trường</option>
            </select>
            <select className="text-sm border rounded-lg px-2 py-1">
              <option value="week">Tuần</option>
              <option value="month">Tháng</option>
              <option value="semester">Học kỳ</option>
            </select>
          </div>
        </div>
      </div>
      <div className="divide-y divide-gray-100">
        {entries.map((entry, index) => (
          <div key={entry.id} className="flex items-center gap-4 p-4 hover:bg-gray-50">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${getRankStyle(index + 1)}`}>
              {index + 1}
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-green-700 font-medium text-sm">
                {entry.name?.charAt(0) || 'U'}
              </span>
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900">{entry.name}</p>
              <p className="text-sm text-gray-500">{entry.school || entry.faculty}</p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-green-600">{entry.points.toLocaleString()}</p>
              <p className="text-xs text-gray-400">điểm</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default Leaderboard;
