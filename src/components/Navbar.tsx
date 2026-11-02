import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Keyboard, Undo2, Redo2, Volume2, VolumeX } from 'lucide-react';
import { PAGE_ROUTES, PagePath } from '../utils/todoLogic';
import { RouterLink } from './RouterLink';

interface NavbarProps {
  currentPath: PagePath;
  onNavigate: (path: PagePath) => void;
  onOpenDownloadModal: () => void;
  onOpenShortcutsModal?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
  soundEnabled?: boolean;
  onToggleSound?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPath,
  onNavigate,
  onOpenDownloadModal,
  onOpenShortcutsModal,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  soundEnabled = true,
  onToggleSound,
}) => {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const primaryRoutes = PAGE_ROUTES.filter((r) => r.inPrimaryNav);
  const secondaryRoutes = PAGE_ROUTES.filter((r) => !r.inPrimaryNav);
  const isSecondaryActive = secondaryRoutes.some((r) => r.path === currentPath);

  useEffect(() => {
    if (!moreDropdownOpen && !mobileNavOpen) return;
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        moreDropdownOpen &&
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setMoreDropdownOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMoreDropdownOpen(false);
        setMobileNavOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [moreDropdownOpen, mobileNavOpen]);

  const handleSelectPage = (path: PagePath) => {
    setMobileNavOpen(false);
    setMoreDropdownOpen(false);
    onNavigate(path);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF6F0]/90 backdrop-blur-md border-b border-[#E8E0D4] px-3 sm:px-8 py-2.5 sm:py-3">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-2 sm:gap-4 lg:gap-8">
        {/* Zone 1: Brand Title */}
        <RouterLink
          to="/"
          currentPath={currentPath}
          onNavigate={handleSelectPage}
          className="font-serif-display text-base sm:text-lg font-extrabold tracking-tight text-[#2F2B28] whitespace-nowrap shrink-0"
        >
          my-tasks.html
        </RouterLink>

        {/* Zone 2: Primary Navigation Links + More Pages Dropdown */}
        <nav
          aria-label="Primary Navigation"
          className="hidden lg:flex items-center gap-3 xl:gap-5 text-xs font-semibold text-[#6E665E]"
        >
          {primaryRoutes.map((route) => {
            const isActive = currentPath === route.path;
            return (
              <RouterLink
                key={route.path}
                to={route.path}
                currentPath={currentPath}
                onNavigate={handleSelectPage}
                className={`transition-colors whitespace-nowrap shrink-0 px-2.5 py-1 rounded-full ${
                  isActive
                    ? 'bg-[#EFE7DC] text-[#2F2B28] font-bold underline decoration-[#C26D43] decoration-2 underline-offset-4'
                    : 'hover:text-[#2F2B28] hover:underline underline-offset-4'
                }`}
              >
                {route.label}
              </RouterLink>
            );
          })}

          {/* Dropdown for Additional Section Pages */}
          <div ref={dropdownRef} className="relative">
            <button
              type="button"
              aria-haspopup="menu"
              aria-expanded={moreDropdownOpen}
              onClick={() => setMoreDropdownOpen((prev) => !prev)}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                isSecondaryActive
                  ? 'bg-[#EFE7DC] text-[#2F2B28] font-bold underline decoration-[#C26D43] decoration-2 underline-offset-4'
                  : 'hover:text-[#2F2B28]'
              }`}
            >
              <span>More Pages</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform ${
                  moreDropdownOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {moreDropdownOpen && (
              <div
                role="menu"
                aria-label="More Section Pages"
                className="absolute right-0 mt-2 w-52 bg-[#FDFBF7] border border-[#E5DEC9] rounded-xl shadow-[0_14px_32px_-8px_rgba(47,43,40,0.16)] py-1.5 z-50"
              >
                {secondaryRoutes.map((route) => {
                  const isActive = currentPath === route.path;
                  return (
                    <RouterLink
                      key={route.path}
                      to={route.path}
                      currentPath={currentPath}
                      onNavigate={handleSelectPage}
                      role="menuitem"
                      className={`block px-3.5 py-2 text-xs transition-colors ${
                        isActive
                          ? 'bg-[#F5DFD0] text-[#B05C37] font-bold'
                          : 'text-[#4A433C] hover:bg-[#F4EFE6] font-semibold'
                      }`}
                    >
                      {route.label}
                    </RouterLink>
                  );
                })}
              </div>
            )}
          </div>
        </nav>

        {/* Zone 3: Undo/Redo + Shortcuts Button + Primary Action + Mobile Menu Button */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {onUndo && onRedo && (
            <div
              className="flex items-center border border-[#DED6CA] bg-white rounded-full p-0.5 shadow-2xs shrink-0"
              role="group"
              aria-label="Undo and Redo actions"
            >
              <button
                type="button"
                onClick={onUndo}
                disabled={!canUndo}
                aria-label="Undo task action (Ctrl+Z)"
                data-testid="navbar-undo-btn"
                title="Undo task action (Ctrl+Z)"
                className={`p-1 sm:px-2 sm:py-1 rounded-full text-[11px] font-bold inline-flex items-center gap-1 transition-colors ${
                  canUndo
                    ? 'text-[#4A433C] hover:bg-[#F4EFE6] cursor-pointer'
                    : 'text-[#C5BCB0] cursor-not-allowed opacity-45'
                }`}
              >
                <Undo2 className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Undo</span>
              </button>
              <div className="w-px h-3.5 bg-[#E8E0D4]" />
              <button
                type="button"
                onClick={onRedo}
                disabled={!canRedo}
                aria-label="Redo task action (Ctrl+Y or Ctrl+Shift+Z)"
                data-testid="navbar-redo-btn"
                title="Redo task action (Ctrl+Y or Ctrl+Shift+Z)"
                className={`p-1 sm:px-2 sm:py-1 rounded-full text-[11px] font-bold inline-flex items-center gap-1 transition-colors ${
                  canRedo
                    ? 'text-[#4A433C] hover:bg-[#F4EFE6] cursor-pointer'
                    : 'text-[#C5BCB0] cursor-not-allowed opacity-45'
                }`}
              >
                <Redo2 className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Redo</span>
              </button>
            </div>
          )}

          {onToggleSound && (
            <button
              type="button"
              onClick={onToggleSound}
              aria-label={
                soundEnabled
                  ? 'Mute task completion sound effect (Press M)'
                  : 'Enable task completion sound effect (Press M)'
              }
              data-testid="navbar-sound-toggle-btn"
              title={
                soundEnabled
                  ? 'Completion chime: ON (Click or press M to mute)'
                  : 'Completion chime: MUTED (Click or press M to enable)'
              }
              className={`inline-flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-full text-[11px] font-bold border transition-colors cursor-pointer shrink-0 ${
                soundEnabled
                  ? 'bg-white hover:bg-[#F4EFE6] border-[#DED6CA] text-[#4A433C]'
                  : 'bg-[#F0EBE1] hover:bg-[#EAE3D6] border-[#D8CFC2] text-[#8C8379]'
              }`}
            >
              {soundEnabled ? (
                <Volume2 className="w-3.5 h-3.5 text-[#C26D43]" />
              ) : (
                <VolumeX className="w-3.5 h-3.5 text-[#8C8379]" />
              )}
              <span className="hidden sm:inline">
                {soundEnabled ? 'Sound ON' : 'Muted'}
              </span>
            </button>
          )}

          {onOpenShortcutsModal && (
            <button
              type="button"
              onClick={onOpenShortcutsModal}
              aria-label="Keyboard shortcuts guide (Press ?)"
              data-testid="open-shortcuts-modal-btn"
              title="Keyboard Shortcuts (? or Ctrl+/)"
              className="inline-flex items-center gap-1 bg-white hover:bg-[#F4EFE6] border border-[#DED6CA] text-[#4A433C] text-[11px] font-bold px-2.5 py-1.5 rounded-full transition-colors cursor-pointer shrink-0"
            >
              <Keyboard className="w-3.5 h-3.5 text-[#B05C37]" />
              <span className="hidden xl:inline">Shortcuts</span>
              <kbd className="px-1 py-0.2 text-[9px] font-extrabold bg-[#FAF6F0] border border-[#D8CFC2] rounded text-[#7A7269]">
                ?
              </kbd>
            </button>
          )}

          <button
            type="button"
            onClick={onOpenDownloadModal}
            className="bg-[#C26D43] hover:bg-[#AD5D35] text-white text-[11px] sm:text-xs font-bold px-3 sm:px-4 py-1.5 sm:py-2 rounded-full transition-colors cursor-pointer whitespace-nowrap shrink-0 shadow-xs"
          >
            Instant Download
          </button>

          <button
            type="button"
            aria-label="Toggle mobile navigation"
            aria-expanded={mobileNavOpen}
            onClick={() => setMobileNavOpen((prev) => !prev)}
            className="lg:hidden px-2.5 py-1.5 rounded-lg border border-[#DED6CA] text-[11px] sm:text-xs font-bold text-[#4A433C] bg-white cursor-pointer"
          >
            {mobileNavOpen ? 'Close' : 'Menu'}
          </button>
        </div>
      </div>

      {mobileNavOpen && (
        <nav
          aria-label="Mobile Navigation"
          className="lg:hidden pt-3 pb-2 mt-3 border-t border-[#E8E0D4] flex flex-col items-center gap-2 text-xs font-semibold text-[#5A534C]"
        >
          <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
            {PAGE_ROUTES.map((route) => {
              const isActive = currentPath === route.path;
              return (
                <RouterLink
                  key={route.path}
                  to={route.path}
                  currentPath={currentPath}
                  onNavigate={handleSelectPage}
                  className={`px-3 py-1.5 rounded-full transition-colors ${
                    isActive
                      ? 'bg-[#C26D43] text-white font-bold'
                      : 'bg-[#F4EFE6] text-[#4A433C] hover:text-[#2F2B28]'
                  }`}
                >
                  {route.label}
                </RouterLink>
              );
            })}
          </div>

          {onToggleSound && (
            <div className="pt-1">
              <button
                type="button"
                onClick={onToggleSound}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                  soundEnabled
                    ? 'bg-white border-[#DED6CA] text-[#4A433C]'
                    : 'bg-[#F0EBE1] border-[#D8CFC2] text-[#8C8379]'
                }`}
              >
                {soundEnabled ? (
                  <Volume2 className="w-3.5 h-3.5 text-[#C26D43]" />
                ) : (
                  <VolumeX className="w-3.5 h-3.5 text-[#8C8379]" />
                )}
                <span>Completion Sound: {soundEnabled ? 'ON' : 'MUTED'}</span>
              </button>
            </div>
          )}
        </nav>
      )}
    </header>
  );
};
