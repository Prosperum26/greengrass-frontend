// Event Card Component
import { Card, CardBody, Badge } from '../../../components/ui';

export const EventCard = ({ event, onRegister }) => {
  const { id, title, description, date, location, type, points, isVerified, imageUrl, participants, maxParticipants } = event;
  
  return (
    <Card hover className="h-full flex flex-col">
      <div className="relative h-48 bg-gray-200">
        {imageUrl ? (
          <img src={imageUrl} alt={title} className="w-full h-full object-cover rounded-t-xl" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-green-50">
            <span className="text-green-300 text-4xl">🌱</span>
          </div>
        )}
        {isVerified && (
          <div className="absolute top-3 left-3">
            <Badge variant="verified">Đã xác thực</Badge>
          </div>
        )}
        <div className="absolute top-3 right-3">
          <Badge variant="primary">+{points} điểm</Badge>
        </div>
      </div>
      <CardBody className="flex-1 flex flex-col">
        <div className="flex-1">
          <p className="text-sm text-green-600 font-medium mb-1">
            {new Date(date).toLocaleDateString('vi-VN')}
          </p>
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{title}</h3>
          <p className="text-sm text-gray-500 mb-2">
            <span className="inline-flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {location}
            </span>
          </p>
          <p className="text-sm text-gray-600 line-clamp-2 mb-3">{description}</p>
        </div>
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <span className="text-sm text-gray-500">
            {participants}/{maxParticipants} người tham gia
          </span>
          <button
            onClick={() => onRegister?.(id)}
            className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
          >
            Đăng ký
          </button>
        </div>
      </CardBody>
    </Card>
  );
};

export default EventCard;
