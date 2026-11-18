import React from 'react';
import { ArrowLeft, Compass } from 'lucide-react';
import { PAGE_ROUTES, PagePath } from '../utils/todoLogic';
import { SectionHeader } from '../components/SectionHeader';
import { BrowserFrame } from '../components/BrowserFrame';
import { RouterLink } from '../components/RouterLink';

interface NotFoundPageProps {
  onNavigate: (path: PagePath) => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ onNavigate }) => {
  return (
    <section
      id="not-found"
      className="radial-stage-bg full-screen-hero w-full flex-1 min-h-[calc(100dvh-var(--navbar-height,57px))] flex flex-col px-1.5 sm:px-3 py-1.5 sm:py-2 box-border"
    >
      <div className="w-full flex-1 flex flex-col min-h-0">
        <BrowserFrame
          urlText="my-tasks.html — 404 page not found"
          className="w-full"
          defaultFullscreen
        >
          <div className="p-4 sm:p-6 lg:p-8 flex-1 flex flex-col justify-center max-w-3xl mx-auto w-full text-center">
            <SectionHeader
              eyebrow="ERROR CODE 404"
              italicSubtitle="looks like this page moved,"
              title="404 · PAGE NOT FOUND"
            />

            <div className="bg-white dark:bg-[#1E1B18] rounded-2xl border border-[#EDE6DC] dark:border-[#38332E] shadow-[0_18px_45px_-12px_rgba(68,53,39,0.12)] p-6 sm:p-8 md:p-10 mt-4 space-y-6">
              {/* Prominent Big 404 Display */}
              <div className="flex flex-col items-center justify-center select-none relative my-2">
                <div
                  aria-hidden="true"
                  className="absolute w-48 sm:w-72 h-28 sm:h-36 rounded-full bg-[#F5DFD0]/50 dark:bg-[#C26D43]/15 blur-2xl pointer-events-none"
                />
                <h2
                  data-testid="big-404-number"
                  className="relative font-serif-display font-black text-8xl sm:text-9xl md:text-[150px] lg:text-[180px] tracking-tight leading-none text-[#C26D43] dark:text-[#E2A88C] drop-shadow-sm select-none"
                  aria-label="404 Error"
                >
                  404
                </h2>
                <div className="relative inline-flex items-center gap-2 mt-2 sm:mt-3 px-4 py-1.5 rounded-full bg-[#F5DFD0] dark:bg-[#3D2C24] text-[#B86741] dark:text-[#E2A88C] text-xs font-bold uppercase tracking-wider shadow-xs">
                  <Compass className="w-4 h-4 stroke-[2.2]" />
                  <span>Page Not Found</span>
                </div>
              </div>

              <p className="text-xs sm:text-sm font-medium text-[#6E675F] dark:text-[#A7A097] max-w-md mx-auto leading-relaxed">
                The URL you visited doesn&apos;t match any page in the Interactive
                Weekly To-Do Dashboard. Choose any section below or jump straight
                back to your live planner.
              </p>

              <div>
                <RouterLink
                  to="/"
                  onNavigate={onNavigate}
                  className="bg-[#C26D43] hover:bg-[#AE5D35] text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-full shadow-sm inline-flex items-center gap-2 transition-colors touch-manipulation cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Return to To-Do Dashboard</span>
                </RouterLink>
              </div>

              <div className="pt-4 border-t border-[#F2EFE9] dark:border-[#332E2A]">
                <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#9C948B] dark:text-[#A7A097] block mb-3">
                  ALL AVAILABLE PAGES
                </span>
                <div className="flex flex-wrap items-center justify-center gap-2">
                  {PAGE_ROUTES.map((route) => (
                    <RouterLink
                      key={route.path}
                      to={route.path}
                      onNavigate={onNavigate}
                      className="bg-[#F4EFE6] hover:bg-[#EAE2D6] text-[#4A433C] font-semibold text-xs px-3.5 py-1.5 rounded-full transition-colors"
                    >
                      {route.label}
                    </RouterLink>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </BrowserFrame>
      </div>
    </section>
  );
};
