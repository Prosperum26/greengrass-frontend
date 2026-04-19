import React from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { ErrorProvider } from './contexts/ErrorContext';
import { Toast } from './components/common';
import AppRoutes from './routes/AppRoutes';

const App = () => {
  return (
    <ErrorProvider>
      <AuthProvider>
        <Toast />
        <AppRoutes />
      </AuthProvider>
    </ErrorProvider>
  );
};

export default App;