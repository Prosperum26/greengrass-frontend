import React from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { ErrorProvider } from './contexts/ErrorContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { Toast } from './components/common';
import AppRoutes from './routes/AppRoutes';

const App = () => {
  return (
    <ThemeProvider>
      <ErrorProvider>
        <AuthProvider>
          <Toast />
          <AppRoutes />
        </AuthProvider>
      </ErrorProvider>
    </ThemeProvider>
  );
};

export default App;