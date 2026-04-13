// GreenGrass App - Entry point
import { AppRoutes } from './routes';
import { ErrorBoundary } from './components/common';
import { ChatWidget } from './features/chatbot';

//test dummy
import EventDetail from './features/events/components/EventDetail';

function App() {
  return (
    <ErrorBoundary>
      <EventDetail />
      <ChatWidget />
    </ErrorBoundary>
  );
}

export default App
