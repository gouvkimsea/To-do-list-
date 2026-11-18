import React, { useEffect, useRef } from 'react';
import {
  X,
  LayoutDashboard,
  Calendar,
  ListTodo,
  BarChart3,
  Palette,
  Layers,
  Table,
  HelpCircle,
  ArrowDown,
  Archive,
  Keyboard,
  Download,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  Maximize2,
} from 'lucide-react';
import { PagePath, PAGE_ROUTES } from '../utils/todoLogic';
import { ColorScheme } from '../utils/colorScheme';

interface MobileNavDrawerProps {
  isOpen: boolean;
  currentPath: PagePath;
  colorScheme: ColorScheme;
  soundEnabled: boolean;
  archivedCount: number;
  onClose: () => void;
  onNavigate: (path: PagePath) => void;
  onToggleColorScheme: () => void;
  onToggleSound: () => void;
  onOpenArchiveModal: () => void;
  onOpenShortcutsModal: () => void;
  onOpenDownloadModal: () => void;
  onEnterFullscreen: () => void;
}

const ROUTE_ICONS: Record<PagePath, React.FC<{ className?: string }>> = {
  '/': LayoutDashboard,
  '/daily-columns': Calendar,
  '/monthly-yearly': ListTodo,
  '/one-click': Layers,
  '/live-progress': BarChart3,
  '/color-themes': Palette,
  '/built-to-reuse': Layers,
  '/spreadsheet': Table,
  '/how-it-works': HelpCircle,
  '/everything-you-get': ArrowDown,
};

export const MobileNavDrawer: React.FC<MobileNavDrawerProps> = ({
  isOpen,
  currentPath,
  colorScheme,
  soundEnabled,
  archivedCount,
  onClose,
  onNavigate,
  onToggleColorScheme,
  onToggleSound,
  onOpenArchiveModal,
  onOpenShortcutsModal,
  onOpenDownloadModal,
  onEnterFullscreen,
}) => {
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="mobile-nav-title"
      data-testid="mobile-nav-drawer"
      className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs md:hidden"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        ref={drawerRef}
        className="w-[85vw] max-w-sm h-full bg-[#FAF7F2] border-l border-[#E2D9CC] flex flex-col shadow-2xl overflow-y-auto safe-bottom"
      >
        {/* Drawer Header */}
        <div className="bg-[#EFEBE4] px-4 py-3.5 border-b border-[#E2D9CC] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ED6A5E] shrink-0" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#F4BF4F] shrink-0" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#61C554] shrink-0" />
            <h2
              id="mobile-nav-title"
              className="ml-1 text-xs font-bold text-[#2F2B28] uppercase tracking-wider truncate"
            >
              Navigation &amp; Views
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close mobile navigation"
            data-testid="mobile-nav-close-btn"
            className="w-10 h-10 -mr-2 rounded-lg flex items-center justify-center text-[#7A7269] hover:text-[#2F2B28] transition-colors cursor-pointer touch-manipulation"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* View Links List */}
        <div className="p-3 flex-1 overflow-y-auto space-y-1">
          <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-[#9C948B]">
            Dashboard Views
          </div>
          {PAGE_ROUTES.map((route) => {
            const Icon = ROUTE_ICONS[route.path] || LayoutDashboard;
            const isActive = currentPath === route.path;

            return (
              <button
                key={route.path}
                type="button"
                data-testid={`mobile-nav-link-${route.path === '/' ? 'home' : route.path.replace('/', '')}`}
                onClick={() => {
                  onNavigate(route.path);
                  onClose();
                }}
                className={`w-full min-h-[44px] px-3 py-2 rounded-xl flex items-center justify-between text-left transition-all touch-manipulation cursor-pointer ${
                  isActive
                    ? 'bg-[#2F2B28] text-white shadow-xs font-bold'
                    : 'bg-white hover:bg-[#F3EFE9] text-[#2F2B28] border border-[#ECE7DF] font-semibold'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      isActive ? 'text-[#E28E64]' : 'text-[#8C7A6B]'
                    }`}
                  />
                  <div className="min-w-0">
                    <span className="text-xs truncate block">{route.label}</span>
                    <span
                      className={`text-[10px] truncate block ${
                        isActive ? 'text-white/70' : 'text-[#8A8279]'
                      }`}
                    >
                      {route.description}
                    </span>
                  </div>
                </div>

                {isActive && (
                  <span className="w-2 h-2 rounded-full bg-[#E28E64] shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Quick Tools & Settings Footer */}
        <div className="bg-[#EFEBE4] p-3 border-t border-[#E2D9CC] space-y-2 shrink-0">
          <div className="px-1 text-[10px] font-bold uppercase tracking-wider text-[#8C7A6B]">
            Tools &amp; Actions
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenArchiveModal();
              }}
              data-testid="mobile-nav-archive-btn"
              className="min-h-[44px] bg-white border border-[#DED8CE] rounded-xl px-2.5 py-1.5 flex items-center gap-2 text-xs font-bold text-[#3B3530] transition-colors cursor-pointer touch-manipulation"
            >
              <Archive className="w-4 h-4 text-[#B05C37] shrink-0" />
              <div className="min-w-0 text-left">
                <span className="block truncate">Archive</span>
                <span className="text-[10px] text-[#8A8279] block">
                  {archivedCount} saved
                </span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenDownloadModal();
              }}
              data-testid="mobile-nav-download-btn"
              className="min-h-[44px] bg-white border border-[#DED8CE] rounded-xl px-2.5 py-1.5 flex items-center gap-2 text-xs font-bold text-[#3B3530] transition-colors cursor-pointer touch-manipulation"
            >
              <Download className="w-4 h-4 text-[#238854] shrink-0" />
              <div className="min-w-0 text-left">
                <span className="block truncate">Download</span>
                <span className="text-[10px] text-[#8A8279] block">
                  Export / Sync
                </span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenShortcutsModal();
              }}
              data-testid="mobile-nav-shortcuts-btn"
              className="min-h-[44px] bg-white border border-[#DED8CE] rounded-xl px-2.5 py-1.5 flex items-center gap-2 text-xs font-bold text-[#3B3530] transition-colors cursor-pointer touch-manipulation"
            >
              <Keyboard className="w-4 h-4 text-[#6D5B98] shrink-0" />
              <div className="min-w-0 text-left">
                <span className="block truncate">Shortcuts</span>
                <span className="text-[10px] text-[#8A8279] block">
                  Key guide (?)
                </span>
              </div>
            </button>

            <button
              type="button"
              onClick={onEnterFullscreen}
              data-testid="mobile-nav-fullscreen-btn"
              className="min-h-[44px] bg-white border border-[#DED8CE] rounded-xl px-2.5 py-1.5 flex items-center gap-2 text-xs font-bold text-[#3B3530] transition-colors cursor-pointer touch-manipulation"
            >
              <Maximize2 className="w-4 h-4 text-[#8C623E] shrink-0" />
              <div className="min-w-0 text-left">
                <span className="block truncate">Fullscreen</span>
                <span className="text-[10px] text-[#8A8279] block">
                  Present mode
                </span>
              </div>
            </button>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={onToggleColorScheme}
              data-testid="mobile-nav-theme-toggle"
              className="flex-1 min-h-[42px] bg-white border border-[#DED8CE] rounded-xl px-3 py-1.5 flex items-center justify-center gap-2 text-xs font-bold text-[#3B3530] cursor-pointer touch-manipulation"
            >
              {colorScheme === 'dark' ? (
                <>
                  <Sun className="w-4 h-4 text-[#F4BF4F]" />
                  <span>Light Mode</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-[#5D508C]" />
                  <span>Dark Mode</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onToggleSound}
              data-testid="mobile-nav-sound-toggle"
              className="min-h-[42px] px-3 bg-white border border-[#DED8CE] rounded-xl flex items-center justify-center gap-1.5 text-xs font-bold text-[#3B3530] cursor-pointer touch-manipulation"
            >
              {soundEnabled ? (
                <>
                  <Volume2 className="w-4 h-4 text-[#4A8B63]" />
                  <span>Sound</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-4 h-4 text-[#9C948B]" />
                  <span>Muted</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
