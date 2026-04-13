// GreenGrass App - Entry point
import { AppRoutes } from './routes';
import { ErrorBoundary } from './components/common';
import { ChatWidget } from './features/chatbot';


function App() {
  return (
    <ErrorBoundary>
      <AppRoutes />
      <ChatWidget />
    </ErrorBoundary>
  );
}

export default App
