// Event List Component
import { EventCard } from './EventCard';
import { Loading, EmptyState } from '../../../components/common';

export const EventList = ({ events, isLoading, onRegister, onLoadMore, hasMore }) => {
  if (isLoading && events.length === 0) {
    return (
      <div className="py-12">
        <Loading size="lg" text="Đang tải sự kiện..." />
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <EmptyState
        icon="calendar"
        title="Chưa có sự kiện"
        description="Hiện tại chưa có sự kiện nào. Hãy quay lại sau!"
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <EventCard key={event.id} event={event} onRegister={onRegister} />
        ))}
      </div>
      {hasMore && (
        <div className="flex justify-center pt-6">
          <button
            onClick={onLoadMore}
            disabled={isLoading}
            className="px-6 py-2 border-2 border-green-600 text-green-600 font-medium rounded-lg hover:bg-green-50 transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Đang tải...' : 'Xem thêm'}
          </button>
        </div>
      )}
    </div>
  );
};

export default EventList;
