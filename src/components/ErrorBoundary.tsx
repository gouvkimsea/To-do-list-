import React from 'react';
import { RotateCcw, RefreshCw, Download } from 'lucide-react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

const STORAGE_KEY = 'interactive_todo_dashboard_state_v1';

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    if (import.meta.env.DEV) {
      console.error('Application ErrorBoundary caught an error:', error, errorInfo);
    }
  }

  handleEmergencyExport = (): void => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        alert('No saved task data found in browser storage.');
        return;
      }
      const blob = new Blob([raw], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `todo-emergency-backup-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      alert('Unable to export backup: ' + (err instanceof Error ? err.message : String(err)));
    }
  };

  handleReload = (): void => {
    this.setState({ hasError: false });
    window.location.href = '/';
  };

  handleResetAndReload = (): void => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore storage access issues
    }
    this.setState({ hasError: false });
    window.location.href = '/';
  };

  render(): React.ReactNode {
    if (this.state.hasError) {
      return (
        <div
          role="alert"
          className="min-h-screen flex items-center justify-center bg-[#FAF6F0] dark:bg-[#151210] text-[#2F2B28] dark:text-[#EDE8E1] px-4 py-12"
        >
          <div className="max-w-md w-full bg-white dark:bg-[#1E1B18] rounded-2xl border border-[#E5DEC9] dark:border-[#38332E] shadow-[0_18px_45px_-12px_rgba(68,53,39,0.12)] p-6 sm:p-8 text-center space-y-4">
            <span className="inline-block text-[10px] font-bold tracking-[0.2em] uppercase text-[#B07B54]">
              UNEXPECTED ISSUE
            </span>
            <h1 className="font-serif-display font-extrabold text-2xl sm:text-3xl text-[#2F2C2A] dark:text-[#EDE8E1]">
              Something went wrong
            </h1>
            <p className="text-xs sm:text-sm text-[#7A7269] dark:text-[#9E968D] leading-relaxed">
              We encountered an unexpected problem while rendering your dashboard.
              You can download an emergency backup of your saved tasks, reload the
              page, or reset saved data to restore default tasks.
            </p>
            <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-2.5 pt-2">
              <button
                type="button"
                onClick={this.handleReload}
                className="w-full sm:w-auto bg-[#C26D43] hover:bg-[#AE5D35] text-white text-xs font-bold px-4 py-2.5 rounded-full inline-flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reload Dashboard</span>
              </button>
              <button
                type="button"
                onClick={this.handleEmergencyExport}
                className="w-full sm:w-auto bg-[#FAF4EC] dark:bg-[#28231E] hover:bg-[#F2E8DC] dark:hover:bg-[#38332E] text-[#8C623E] dark:text-[#D4A373] border border-[#E5DEC9] dark:border-[#4A423A] text-xs font-bold px-4 py-2.5 rounded-full inline-flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Backup</span>
              </button>
              <button
                type="button"
                onClick={this.handleResetAndReload}
                className="w-full sm:w-auto bg-[#F4EFE6] dark:bg-[#231F1C] hover:bg-[#EAE2D6] dark:hover:bg-[#322C27] text-[#4A433C] dark:text-[#B5ADA3] border border-[#E0D9CE] dark:border-[#38332E] text-xs font-bold px-4 py-2.5 rounded-full inline-flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Saved Data</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
