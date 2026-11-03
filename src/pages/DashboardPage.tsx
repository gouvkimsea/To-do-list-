import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { motion } from 'motion/react';
import { BrowserFrame } from '../components/BrowserFrame';
import { LiveProgressBoard } from '../components/LiveProgressSection';
import { WeeklyProgressTrendsChart } from '../components/WeeklyProgressTrendsChart';
import { RouterLink } from '../components/RouterLink';
import { PomodoroTimer } from '../components/PomodoroTimer';
import { SharedDashboardPageProps } from './types';

export const DashboardPage: React.FC<SharedDashboardPageProps> = ({
  columns,
  detailedTasks,
  metrics,
  activeTheme,
  selectedDate,
  searchQuery,
  archivedCount,
  onToggleDetailedTask,
  onCycleDetailedPriority,
  onCycleDetailedStatus,
  onCycleDetailedCategory,
  onUpdateDetailedText,
  onArchiveCompletedTasks,
  onArchiveSingleDetailedTask,
  onOpenArchiveModal,
  onNavigate,
}) => {
  const [chartTab, setChartTab] = useState<'breakdown' | 'trends'>('breakdown');

  return (
    <section
      id="dashboard"
      aria-label="Live Breakdown Dashboard Hero"
      className="radial-stage-bg full-screen-hero w-full flex-1 min-h-[calc(100dvh-var(--navbar-height,57px))] flex flex-col px-1.5 sm:px-3 py-1.5 sm:py-2 box-border"
    >
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.5,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="w-full flex-1 flex flex-col min-h-0"
      >
        {/* Grand Hero Browser Dashboard Window — Full Screen by Default */}
        <BrowserFrame
          urlText="auto-calculated — no formulas to touch"
          className="w-full"
          defaultFullscreen
          chromeRightSlot={
            <div className="inline-flex items-center bg-[#E5DED4] p-0.5 rounded-full">
              <button
                type="button"
                onClick={() => setChartTab('breakdown')}
                className={`text-[10px] sm:text-[11px] font-bold px-3 py-1 rounded-full transition-all cursor-pointer whitespace-nowrap ${
                  chartTab === 'breakdown'
                    ? 'bg-white text-[#2F2B28] shadow-xs'
                    : 'text-[#6E665E] hover:text-[#2F2B28]'
                }`}
              >
                Live Breakdown
              </button>
              <button
                type="button"
                onClick={() => setChartTab('trends')}
                className={`text-[10px] sm:text-[11px] font-bold px-3 py-1 rounded-full transition-all cursor-pointer whitespace-nowrap ${
                  chartTab === 'trends'
                    ? 'bg-white text-[#2F2B28] shadow-xs'
                    : 'text-[#6E665E] hover:text-[#2F2B28]'
                }`}
              >
                4-Week Trends
              </button>
            </div>
          }
        >
          {chartTab === 'breakdown' ? (
            <LiveProgressBoard
              detailedTasks={detailedTasks}
              metrics={metrics}
              activeTheme={activeTheme}
              searchQuery={searchQuery}
              archivedCount={archivedCount}
              onToggleDetailedTask={onToggleDetailedTask}
              onCycleDetailedPriority={onCycleDetailedPriority}
              onCycleDetailedStatus={onCycleDetailedStatus}
              onCycleDetailedCategory={onCycleDetailedCategory}
              onUpdateDetailedText={onUpdateDetailedText}
              onArchiveCompletedTasks={onArchiveCompletedTasks}
              onArchiveSingleDetailedTask={onArchiveSingleDetailedTask}
              onOpenArchiveModal={onOpenArchiveModal}
            />
          ) : (
            <div className="p-4 sm:p-6 bg-[#FAF7F2] flex-1 flex flex-col gap-3">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-[#ECE7DF]">
                <span className="text-[10px] font-bold tracking-[0.16em] uppercase text-[#8A8279]">
                  4-WEEK PRODUCTIVITY TRENDS
                </span>
                <PomodoroTimer instanceId="dashboard" />
              </div>
              <WeeklyProgressTrendsChart
                columns={columns}
                selectedDate={selectedDate}
                activeTheme={activeTheme}
              />
            </div>
          )}

          {/* Quick-navigation footer bar inside the Mac tab */}
          <div
            data-presentation-hide="true"
            data-testid="dashboard-quick-nav-footer"
            className="px-3 sm:px-4 pb-2.5 sm:pb-3 pt-1 border-t border-[#ECE7DF] bg-[#FAF7F2] flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-center"
          >
            <RouterLink
              to="/spreadsheet"
              onNavigate={onNavigate}
              className="inline-flex items-center gap-1.5 bg-white hover:bg-[#FAF7F2] border border-[#E5DEC9] shadow-xs rounded-full px-3.5 py-1 text-xs font-bold text-[#2F2B28] transition-colors whitespace-nowrap"
            >
              <span className="w-3.5 h-3.5 rounded-full bg-[#4A8B63] text-white flex items-center justify-center shrink-0">
                <Plus className="w-2.5 h-2.5 stroke-[3]" />
              </span>
              <span>Google Sheets &amp; Excel version included</span>
            </RouterLink>

            <RouterLink
              to="/daily-columns"
              onNavigate={onNavigate}
              className="bg-[#F5DFD0] hover:bg-[#EED2BF] text-[#B05C37] font-bold text-xs px-3.5 py-1 rounded-full transition-colors whitespace-nowrap"
            >
              Weekly Columns List →
            </RouterLink>

            <RouterLink
              to="/how-it-works"
              onNavigate={onNavigate}
              className="bg-[#DFECE0] hover:bg-[#D1E3D3] text-[#3F6F4A] font-bold text-xs px-3.5 py-1 rounded-full transition-colors whitespace-nowrap"
            >
              Works in Any Browser
            </RouterLink>

            <RouterLink
              to="/color-themes"
              onNavigate={onNavigate}
              className="bg-[#E6E2F3] hover:bg-[#DAD4EC] text-[#5D508C] font-bold text-xs px-3.5 py-1 rounded-full transition-colors whitespace-nowrap"
            >
              4 Color Themes
            </RouterLink>
          </div>
        </BrowserFrame>
      </motion.div>
    </section>
  );
};
