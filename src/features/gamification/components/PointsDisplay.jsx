// Points Display Component
import { Card } from '../../../components/ui';

export const PointsDisplay = ({ points = 0, rank, nextLevel, streak }) => {
  return (
    <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-green-100 text-sm font-medium">Điểm rèn luyện</p>
            <p className="text-4xl font-bold mt-1">{points.toLocaleString()}</p>
            {rank && (
              <p className="text-green-100 text-sm mt-1">
                Xếp hạng: <span className="font-semibold text-white">#{rank}</span>
              </p>
            )}
          </div>
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          </div>
        </div>
        
        {(nextLevel || streak > 0) && (
          <div className="mt-4 pt-4 border-t border-white/20 flex items-center justify-between text-sm">
            {streak > 0 && (
              <span className="flex items-center gap-1">
                <span className="text-xl">🔥</span>
                Chuỗi {streak} ngày
              </span>
            )}
            {nextLevel && (
              <span className="text-green-100">
                Còn {nextLevel.pointsNeeded} điểm để lên {nextLevel.name}
              </span>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};

export default PointsDisplay;
