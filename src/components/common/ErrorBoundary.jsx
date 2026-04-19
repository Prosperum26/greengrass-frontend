// Error Boundary Component with reset functionality
import { Component } from 'react';

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    // Log to error reporting service in production
    if (import.meta.env.PROD) {
      console.error('Error caught by boundary:', error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      const { error, errorInfo } = this.state;
      const isDev = import.meta.env.DEV;
      
      return (
        <div className="min-h-[300px] flex flex-col items-center justify-center p-6 bg-surface">
          <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-error" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-ink mb-2">Đã xảy ra lỗi</h3>
          <p className="text-ink/60 text-center mb-6 max-w-md">
            {error?.message || 'Có lỗi không xác định xảy ra. Vui lòng thử lại.'}
          </p>
          
          {/* Show stack trace in development */}
          {isDev && errorInfo && (
            <details className="mb-6 text-left max-w-2xl w-full">
              <summary className="cursor-pointer text-sm text-ink/70 mb-2">Chi tiết lỗi (Development)</summary>
              <pre className="bg-surface-highest p-4 rounded-lg text-xs text-ink/80 overflow-auto max-h-48">
                {error?.stack}
                {'\n\nComponent Stack:\n'}
                {errorInfo.componentStack}
              </pre>
            </details>
          )}
          
          <div className="flex gap-3">
            <button
              onClick={this.handleReset}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium"
            >
              Thử lại
            </button>
            <button
              onClick={this.handleReload}
              className="px-4 py-2 bg-surface-highest text-ink border border-outline rounded-lg hover:bg-surface-high transition-colors font-medium"
            >
              Tải lại trang
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
