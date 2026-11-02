import React, { useState } from 'react';
import { SectionHeader } from '../components/SectionHeader';
import { BrowserFrame } from '../components/BrowserFrame';
import { LiveProgressBoard } from '../components/LiveProgressSection';
import { WeeklyProgressTrendsChart } from '../components/WeeklyProgressTrendsChart';
import { SharedDashboardPageProps } from './types';

export const LiveProgressPage: React.FC<SharedDashboardPageProps> = ({
  columns,
  detailedTasks,
  metrics,
  activeTheme,
  selectedDate,
  searchQuery,
  onToggleDetailedTask,
  onCycleDetailedPriority,
  onCycleDetailedStatus,
  onCycleDetailedCategory,
  onUpdateDetailedText,
}) => {
  const [chartTab, setChartTab] = useState<'breakdown' | 'trends'>('breakdown');

  return (
    <section
      id="live-progress"
      className="radial-stage-bg full-screen-hero flex-1 py-3 sm:py-4 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-5xl mx-auto w-full my-auto">
        <SectionHeader
          eyebrow="LIVE PROGRESS DASHBOARD"
          italicSubtitle="progress that"
          title="ADDS ITSELF UP"
        />

        <BrowserFrame
          urlText="auto-calculated — no formulas to touch"
          className="max-w-4xl w-full"
          chromeRightSlot={
            <div className="inline-flex items-center bg-[#E4DDD3] p-0.5 rounded-full">
              <button
                type="button"
                onClick={() => setChartTab('breakdown')}
                className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full transition-colors cursor-pointer whitespace-nowrap ${
                  chartTab === 'breakdown'
                    ? 'bg-white text-[#2F2B28] shadow-2xs'
                    : 'text-[#6E665E] hover:text-[#2F2B28]'
                }`}
              >
                Live Breakdown
              </button>
              <button
                type="button"
                onClick={() => setChartTab('trends')}
                className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full transition-colors cursor-pointer whitespace-nowrap ${
                  chartTab === 'trends'
                    ? 'bg-white text-[#2F2B28] shadow-2xs'
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
              onToggleDetailedTask={onToggleDetailedTask}
              onCycleDetailedPriority={onCycleDetailedPriority}
              onCycleDetailedStatus={onCycleDetailedStatus}
              onCycleDetailedCategory={onCycleDetailedCategory}
              onUpdateDetailedText={onUpdateDetailedText}
            />
          ) : (
            <div className="p-3 sm:p-4">
              <WeeklyProgressTrendsChart
                columns={columns}
                selectedDate={selectedDate}
                activeTheme={activeTheme}
              />
            </div>
          )}
        </BrowserFrame>

        <div className="mt-3.5 sm:mt-4 text-center space-y-2">
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            <span className="bg-[#F5DFD0] text-[#B05C37] font-bold text-xs sm:text-sm px-4 sm:px-5 py-1 rounded-full whitespace-nowrap">
              Completion ring
            </span>
            <span className="bg-[#DFECE0] text-[#3F6F4A] font-bold text-xs sm:text-sm px-4 sm:px-5 py-1 rounded-full whitespace-nowrap">
              Daily progress
            </span>
            <span className="bg-[#FAE8CE] text-[#9E6826] font-bold text-xs sm:text-sm px-4 sm:px-5 py-1 rounded-full whitespace-nowrap">
              By priority
            </span>
            <span className="bg-[#E6E2F3] text-[#5D508C] font-bold text-xs sm:text-sm px-4 sm:px-5 py-1 rounded-full whitespace-nowrap">
              By status
            </span>
          </div>
          <p className="text-xs sm:text-sm font-semibold text-[#8A8279]">
            Every number recalculates the moment you check a task off
          </p>
        </div>
      </div>
    </section>
  );
};
