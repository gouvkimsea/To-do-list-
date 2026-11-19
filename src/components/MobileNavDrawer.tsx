import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion, type Variants } from 'framer-motion';
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
  const shouldReduceMotion = useReducedMotion();

  // Prevent background scrolling while the mobile sidebar is open
  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    const previousTouchAction = document.body.style.touchAction;

    document.body.style.overflow = 'hidden';
    document.body.style.touchAction = 'none';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.style.touchAction = previousTouchAction;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Animation variants
  const backdropVariants: Variants = {
    closed: {
      opacity: 0,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.25,
        ease: 'easeIn',
      },
    },
    open: {
      opacity: 1,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.3,
        ease: 'easeOut',
      },
    },
  };

  const sidebarVariants: Variants = {
    closed: {
      x: shouldReduceMotion ? 0 : '-100%',
      opacity: shouldReduceMotion ? 0 : 0.4,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.26,
        ease: [0.4, 0, 1, 1], // smooth ease-in when closing
      },
    },
    open: {
      x: 0,
      opacity: 1,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.3,
        ease: [0.16, 1, 0.3, 1], // smooth ease-out when opening
      },
    },
  };

  const navListVariants: Variants = {
    closed: {
      opacity: 0,
    },
    open: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.038, // 38ms stagger delay (between 30-50ms)
        delayChildren: shouldReduceMotion ? 0 : 0.06,
      },
    },
  };

  const navItemVariants: Variants = {
    closed: {
      opacity: 0,
      x: shouldReduceMotion ? 0 : -14,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.15,
        ease: [0.4, 0, 1, 1],
      },
    },
    open: {
      opacity: 1,
      x: 0,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.28,
        ease: [0.16, 1, 0.3, 1], // smooth ease-out
      },
    },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="mobile-nav-backdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby="mobile-nav-title"
          data-testid="mobile-nav-drawer"
          variants={backdropVariants}
          initial="closed"
          animate="open"
          exit="closed"
          className="fixed inset-0 z-50 flex justify-start bg-black/45 backdrop-blur-xs md:hidden"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              onClose();
            }
          }}
        >
          <motion.div
            ref={drawerRef}
            key="mobile-nav-sidebar"
            variants={sidebarVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="w-[85vw] max-w-sm h-full bg-[#FAF7F2] dark:bg-[#1E1B18] border-r border-[#E2D9CC] dark:border-[#38332E] flex flex-col shadow-2xl overflow-y-auto safe-bottom"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div className="bg-[#EFEBE4] dark:bg-[#2B2622] px-4 py-3.5 border-b border-[#E2D9CC] dark:border-[#38332E] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ED6A5E] shrink-0" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#F4BF4F] shrink-0" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#61C554] shrink-0" />
                <h2
                  id="mobile-nav-title"
                  className="ml-1 text-xs font-bold text-[#2F2B28] dark:text-[#EDE8E1] uppercase tracking-wider truncate"
                >
                  Navigation &amp; Views
                </h2>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close mobile navigation"
                data-testid="mobile-nav-close-btn"
                className="w-10 h-10 -mr-2 rounded-lg flex items-center justify-center text-[#7A7269] hover:text-[#2F2B28] dark:text-[#A7A097] dark:hover:text-[#EDE8E1] transition-colors cursor-pointer touch-manipulation"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* View Links List with Staggered Animation */}
            <motion.div
              variants={navListVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="p-3 flex-1 overflow-y-auto space-y-1"
            >
              <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-[#9C948B] dark:text-[#A7A097]">
                Dashboard Views
              </div>
              {PAGE_ROUTES.map((route) => {
                const Icon = ROUTE_ICONS[route.path] || LayoutDashboard;
                const isActive = currentPath === route.path;

                return (
                  <motion.div key={route.path} variants={navItemVariants}>
                    <button
                      type="button"
                      data-testid={`mobile-nav-link-${route.path === '/' ? 'home' : route.path.replace('/', '')}`}
                      onClick={() => {
                        onNavigate(route.path);
                        onClose();
                      }}
                      className={`w-full min-h-[44px] px-3 py-2 rounded-xl flex items-center justify-between text-left transition-all touch-manipulation cursor-pointer ${
                        isActive
                          ? 'bg-[#2F2B28] dark:bg-[#FAF6F0] text-white dark:text-[#141210] shadow-xs font-bold'
                          : 'bg-white dark:bg-[#28231E] hover:bg-[#F3EFE9] dark:hover:bg-[#332C25] text-[#2F2B28] dark:text-[#EDE8E1] border border-[#ECE7DF] dark:border-[#38332E] font-semibold'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Icon
                          className={`w-4 h-4 shrink-0 ${
                            isActive ? 'text-[#E28E64]' : 'text-[#8C7A6B] dark:text-[#B5ADA3]'
                          }`}
                        />
                        <div className="min-w-0">
                          <span className="text-xs truncate block">{route.label}</span>
                          <span
                            className={`text-[10px] truncate block ${
                              isActive ? 'text-white/70 dark:text-[#141210]/70' : 'text-[#8A8279] dark:text-[#9A9187]'
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
                  </motion.div>
                );
              })}
            </motion.div>

            {/* Quick Tools & Settings Footer */}
            <motion.div
              initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: shouldReduceMotion ? 0 : 0.25,
                delay: shouldReduceMotion ? 0 : 0.12,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="bg-[#EFEBE4] dark:bg-[#2B2622] p-3 border-t border-[#E2D9CC] dark:border-[#38332E] space-y-2 shrink-0"
            >
              <div className="px-1 text-[10px] font-bold uppercase tracking-wider text-[#8C7A6B] dark:text-[#B5ADA3]">
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
                  className="min-h-[44px] bg-white dark:bg-[#28231E] border border-[#DED8CE] dark:border-[#38332E] rounded-xl px-2.5 py-1.5 flex items-center gap-2 text-xs font-bold text-[#3B3530] dark:text-[#EDE8E1] transition-colors cursor-pointer touch-manipulation hover:bg-[#F3EFE9] dark:hover:bg-[#332C25]"
                >
                  <Archive className="w-4 h-4 text-[#B05C37] shrink-0" />
                  <div className="min-w-0 text-left">
                    <span className="block truncate">Archive</span>
                    <span className="text-[10px] text-[#8A8279] dark:text-[#9A9187] block">
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
                  className="min-h-[44px] bg-white dark:bg-[#28231E] border border-[#DED8CE] dark:border-[#38332E] rounded-xl px-2.5 py-1.5 flex items-center gap-2 text-xs font-bold text-[#3B3530] dark:text-[#EDE8E1] transition-colors cursor-pointer touch-manipulation hover:bg-[#F3EFE9] dark:hover:bg-[#332C25]"
                >
                  <Download className="w-4 h-4 text-[#238854] shrink-0" />
                  <div className="min-w-0 text-left">
                    <span className="block truncate">Download</span>
                    <span className="text-[10px] text-[#8A8279] dark:text-[#9A9187] block">
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
                  className="min-h-[44px] bg-white dark:bg-[#28231E] border border-[#DED8CE] dark:border-[#38332E] rounded-xl px-2.5 py-1.5 flex items-center gap-2 text-xs font-bold text-[#3B3530] dark:text-[#EDE8E1] transition-colors cursor-pointer touch-manipulation hover:bg-[#F3EFE9] dark:hover:bg-[#332C25]"
                >
                  <Keyboard className="w-4 h-4 text-[#6D5B98] shrink-0" />
                  <div className="min-w-0 text-left">
                    <span className="block truncate">Shortcuts</span>
                    <span className="text-[10px] text-[#8A8279] dark:text-[#9A9187] block">
                      Key guide (?)
                    </span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={onEnterFullscreen}
                  data-testid="mobile-nav-fullscreen-btn"
                  className="min-h-[44px] bg-white dark:bg-[#28231E] border border-[#DED8CE] dark:border-[#38332E] rounded-xl px-2.5 py-1.5 flex items-center gap-2 text-xs font-bold text-[#3B3530] dark:text-[#EDE8E1] transition-colors cursor-pointer touch-manipulation hover:bg-[#F3EFE9] dark:hover:bg-[#332C25]"
                >
                  <Maximize2 className="w-4 h-4 text-[#8C623E] shrink-0" />
                  <div className="min-w-0 text-left">
                    <span className="block truncate">Fullscreen</span>
                    <span className="text-[10px] text-[#8A8279] dark:text-[#9A9187] block">
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
                  className="flex-1 min-h-[42px] bg-white dark:bg-[#28231E] border border-[#DED8CE] dark:border-[#38332E] rounded-xl px-3 py-1.5 flex items-center justify-center gap-2 text-xs font-bold text-[#3B3530] dark:text-[#EDE8E1] cursor-pointer touch-manipulation hover:bg-[#F3EFE9] dark:hover:bg-[#332C25]"
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
                  className="min-h-[42px] px-3 bg-white dark:bg-[#28231E] border border-[#DED8CE] dark:border-[#38332E] rounded-xl flex items-center justify-center gap-1.5 text-xs font-bold text-[#3B3530] dark:text-[#EDE8E1] cursor-pointer touch-manipulation hover:bg-[#F3EFE9] dark:hover:bg-[#332C25]"
                >
                  {soundEnabled ? (
                    <>
                      <Volume2 className="w-4 h-4 text-[#4A8B63]" />
                      <span>Sound</span>
                    </>
                  ) : (
                    <>
                      <VolumeX className="w-4 h-4 text-[#9C948B] dark:text-[#80776D]" />
                      <span>Muted</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
