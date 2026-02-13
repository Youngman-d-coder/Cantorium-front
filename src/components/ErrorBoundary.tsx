import { Component, type ReactNode, type ErrorInfo } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  override render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-50 flex items-center justify-center p-6">
          <div className="max-w-2xl w-full rounded-3xl border border-rose-400/20 bg-slate-900/70 p-8 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-rose-400/40 bg-rose-500/10 text-2xl">
                ⚠️
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-slate-50">Something went wrong</h1>
                <p className="text-sm text-slate-400">An unexpected error occurred</p>
              </div>
            </div>
            
            {this.state.error && (
              <div className="mb-6 rounded-2xl border border-slate-700 bg-slate-800/80 p-4">
                <p className="text-sm font-semibold text-rose-300 mb-2">Error Message:</p>
                <p className="text-sm text-slate-300 font-mono">{this.state.error.message}</p>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => window.location.reload()}
                className="rounded-2xl border border-cyan-400/40 bg-cyan-500/10 px-4 py-2 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-500/20"
              >
                Reload Page
              </button>
              <button
                onClick={() => window.location.href = '/'}
                className="rounded-2xl border border-slate-700 bg-slate-800/90 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-cyan-400/40"
              >
                Go to Home
              </button>
            </div>

            {import.meta.env.DEV && this.state.errorInfo && (
              <details className="mt-6">
                <summary className="cursor-pointer text-sm text-slate-400 hover:text-slate-300">
                  Show error details
                </summary>
                <pre className="mt-4 rounded-2xl border border-slate-700 bg-slate-800/80 p-4 text-xs text-slate-300 overflow-auto">
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
