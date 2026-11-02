import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Maximize2, Minimize2, X } from 'lucide-react';

interface BrowserFrameProps {
  urlText?: string;
  children: React.ReactNode;
  className?: string;
  compact?: boolean;
  chromeRightSlot?: React.ReactNode;
  topRightBadge?: React.ReactNode;
  bottomRightBadge?: React.ReactNode;
  allowFullscreen?: boolean;
}

export const BrowserFrame: React.FC<BrowserFrameProps> = ({
  urlText = 'my-tasks.html — opens in any browser, no install',
  children,
  className = '',
  compact = false,
  chromeRightSlot,
  topRightBadge,
  bottomRightBadge,
  allowFullscreen = true,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const toggleFullscreen = useCallback(() => {
    if (!allowFullscreen) return;
    setIsFullscreen((prev) => {
      const next = !prev;
      if (next) {
        if (typeof document !== 'undefined' && containerRef.current?.requestFullscreen) {
          containerRef.current.requestFullscreen().catch(() => {});
        }
      } else {
        if (typeof document !== 'undefined' && document.fullscreenElement) {
          document.exitFullscreen().catch(() => {});
        }
      }
      return next;
    });
  }, [allowFullscreen]);

  // Sync with native fullscreen changes (e.g. Esc key pressed by user)
  useEffect(() => {
    const handleFullscreenChange = () => {
      if (typeof document !== 'undefined') {
        const isNativeFs = Boolean(document.fullscreenElement);
        if (!isNativeFs && isFullscreen) {
          setIsFullscreen(false);
        }
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
        if (typeof document !== 'undefined' && document.fullscreenElement) {
          document.exitFullscreen().catch(() => {});
        }
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isFullscreen]);

  return (
    <div
      ref={containerRef}
      className={
        isFullscreen
          ? 'fixed inset-0 z-50 bg-[#FAF7F2] p-1 sm:p-3 overflow-y-auto flex flex-col w-screen h-screen'
          : `relative mx-auto ${className}`
      }
    >
      {topRightBadge && !isFullscreen && (
        <div className="absolute -top-5 right-2 xl:-right-24 z-20">
          {topRightBadge}
        </div>
      )}

      <div
        className={`bg-[#FAF8F5] border border-[#E5DEC9]/90 shadow-[0_20px_50px_-12px_rgba(68,53,39,0.16)] overflow-hidden flex flex-col ${
          isFullscreen ? 'flex-1 rounded-xl sm:rounded-2xl min-h-0' : 'rounded-2xl'
        }`}
      >
        {/* Browser Chrome Bar */}
        <div
          onDoubleClick={toggleFullscreen}
          title="Mac Window Header — Double-click or tap green button to toggle Full Screen"
          className={`bg-[#EFEBE4] border-b border-[#E4DDD3] flex items-center justify-between gap-2 px-3 md:px-4 select-none ${
            compact ? 'py-1.5' : 'py-2'
          }`}
        >
          {/* macOS Traffic Light Buttons */}
          <div className="group/traffic flex items-center gap-1.5 shrink-0">
            {/* Red button (Close/Exit fullscreen) */}
            <button
              type="button"
              onClick={() => {
                if (isFullscreen) {
                  toggleFullscreen();
                }
              }}
              title={isFullscreen ? 'Exit Full Screen' : 'Close window'}
              aria-label={isFullscreen ? 'Exit Full Screen' : 'Close window'}
              className={`${
                compact ? 'w-2.5 h-2.5' : 'w-3 h-3'
              } rounded-full bg-[#ED6A5E] hover:brightness-90 flex items-center justify-center transition-all cursor-pointer focus:outline-none`}
            >
              <span className="text-[#5A0A00] text-[7px] font-bold opacity-0 group-hover/traffic:opacity-100 transition-opacity leading-none">
                ✕
              </span>
            </button>

            {/* Yellow button (Minimize) */}
            <button
              type="button"
              onClick={() => {
                if (isFullscreen) toggleFullscreen();
              }}
              title="Minimize window"
              aria-label="Minimize window"
              className={`${
                compact ? 'w-2.5 h-2.5' : 'w-3 h-3'
              } rounded-full bg-[#F4BF4F] hover:brightness-90 flex items-center justify-center transition-all cursor-pointer focus:outline-none`}
            >
              <span className="text-[#593900] text-[8px] font-bold opacity-0 group-hover/traffic:opacity-100 transition-opacity leading-none">
                −
              </span>
            </button>

            {/* Green button (Full Screen Toggle - Tap to expand full screen!) */}
            <button
              type="button"
              data-testid="mac-fullscreen-btn"
              onClick={toggleFullscreen}
              title={
                isFullscreen
                  ? 'Exit Full Screen (Tap or Esc)'
                  : 'Enter Full Screen (Tap green button or double-click)'
              }
              aria-label={
                isFullscreen ? 'Exit Full Screen' : 'Make Mac window full screen'
              }
              className={`${
                compact ? 'w-2.5 h-2.5' : 'w-3 h-3'
              } rounded-full bg-[#61C554] hover:brightness-90 flex items-center justify-center transition-all cursor-pointer focus:outline-none ring-offset-1 focus:ring-1 focus:ring-[#61C554]`}
            >
              <svg
                className="w-1.5 h-1.5 text-[#0A4515] opacity-0 group-hover/traffic:opacity-100 transition-opacity"
                viewBox="0 0 10 10"
                fill="currentColor"
              >
                {isFullscreen ? (
                  <path d="M1 4h3V1L1 4zm8 2H6v3l3-3z" />
                ) : (
                  <path d="M0 3.5L3.5 0H0v3.5zm10 3L6.5 10H10V6.5z" />
                )}
              </svg>
            </button>
          </div>

          {/* Centered URL / Search Pill */}
          <div className="flex-1 min-w-0 flex justify-center px-1 sm:px-2">
            <div
              className={`bg-[#F9F7F3] border border-[#E6DFD5] rounded-full w-full max-w-md text-center truncate text-[#8E877F] font-medium ${
                compact
                  ? 'py-0.5 px-2.5 text-[10px]'
                  : 'py-0.5 px-3 sm:px-4 text-[11px] sm:text-xs'
              }`}
            >
              {urlText}
            </div>
          </div>

          {/* Right Slot & Full Screen Expand Button */}
          <div className="shrink-0 flex items-center gap-1.5">
            {chromeRightSlot}

            {allowFullscreen && !compact && (
              <button
                type="button"
                data-testid="mac-expand-toggle-btn"
                onClick={toggleFullscreen}
                title={
                  isFullscreen
                    ? 'Exit Full Screen (Esc)'
                    : 'Make Mac window full screen'
                }
                aria-label={
                  isFullscreen ? 'Exit Full Screen' : 'Make Mac window full screen'
                }
                className={`p-1 rounded-full text-[#7A6E63] hover:text-[#2F2B28] hover:bg-[#E4DDD3]/70 transition-colors cursor-pointer flex items-center justify-center ${
                  isFullscreen ? 'bg-[#E4DDD3] text-[#2F2B28]' : ''
                }`}
              >
                {isFullscreen ? (
                  <Minimize2 className="w-3.5 h-3.5" />
                ) : (
                  <Maximize2 className="w-3.5 h-3.5" />
                )}
              </button>
            )}
          </div>
        </div>

        {/* Browser Content Area */}
        <div className={`bg-[#FAF7F2] relative ${isFullscreen ? 'flex-1 overflow-y-auto' : ''}`}>
          {children}
        </div>
      </div>

      {/* Floating Exit Indicator when in Fullscreen */}
      {isFullscreen && (
        <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-50 bg-[#2F2B28]/90 text-white text-[11px] font-semibold px-4 py-1.5 rounded-full shadow-lg backdrop-blur-md flex items-center gap-2">
          <span>Full Screen Mode</span>
          <span className="text-[#D8C7B5]">·</span>
          <button
            type="button"
            onClick={toggleFullscreen}
            className="underline underline-offset-2 hover:text-[#E8BD9A] cursor-pointer flex items-center gap-1"
          >
            <span>Exit (Esc)</span>
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {bottomRightBadge && !isFullscreen && (
        <div className="mt-2.5 sm:mt-0 sm:absolute sm:-bottom-3 sm:right-4 z-20 flex justify-end">
          {bottomRightBadge}
        </div>
      )}
    </div>
  );
};
