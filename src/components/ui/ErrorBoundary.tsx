import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught React Error caught by ErrorBoundary:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-[var(--background)] text-[var(--text-primary)]">
          <div className="max-w-md w-full bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-8 text-center space-y-5 shadow-lg">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-[var(--accent)] border border-[var(--accent)]/20 flex items-center justify-center mx-auto">
              <AlertTriangle size={32} />
            </div>

            <div className="space-y-1">
              <h2 className="text-xl font-serif font-bold text-[var(--text-primary)]">
                Something went wrong
              </h2>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                HoneyChain encountered an unexpected rendering error.
              </p>
            </div>

            {this.state.error?.message && (
              <div className="p-3 bg-[var(--surface-secondary)] border border-[var(--border)] rounded-xl text-[11px] font-mono text-[var(--text-secondary)] break-words text-left">
                {this.state.error.message}
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => window.location.reload()}
                className="flex-1 py-3 px-4 rounded-xl bg-[var(--accent)] text-white text-xs font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <RefreshCw size={14} />
                <span>Reload Page</span>
              </button>
              <button
                onClick={() => {
                  this.setState({ hasError: false, error: null });
                  window.location.href = '/';
                }}
                className="py-3 px-4 rounded-xl border border-[var(--border)] text-[var(--text-primary)] text-xs font-semibold hover:bg-[var(--surface-secondary)] transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Home size={14} />
                <span>Home</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
