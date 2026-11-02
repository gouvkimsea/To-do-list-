import React, { useState } from 'react';
import { SectionHeader } from '../components/SectionHeader';
import { BrowserFrame } from '../components/BrowserFrame';
import { InteractiveDashboard } from '../components/InteractiveDashboard';
import { SharedDashboardPageProps } from './types';

export const DailyColumnsPage: React.FC<SharedDashboardPageProps> = ({
  columns,
  monthlyGoals,
  yearlyGoals,
  activeTheme,
  selectedDate,
  weekRangeLabel,
  searchQuery,
  onSearchQueryChange,
  onSelectTheme,
  onSelectView,
  onDateChange,
  onToggleDailyTask,
  onCycleDailyPriority,
  onCycleDailyCategory,
  onUpdateDailyTaskText,
  onUpdateDailyTaskNotes,
  onReorderOrMoveDailyTask,
  onResetWeek,
  onClearCompletedTasks,
  onClearPendingTasks,
  onQuickSave,
  onOpenShortcutsModal,
}) => {
  const [showAllDays, setShowAllDays] = useState<boolean>(false);

  return (
    <section
      id="daily-columns"
      className="radial-stage-bg full-screen-hero flex-1 py-3 sm:py-4 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-5xl mx-auto w-full my-auto">
        <SectionHeader
          eyebrow="REALLY READABLE DAILY COLUMNS"
          italicSubtitle="each day is"
          title="SPACIOUS & CLEAR"
        />

        <BrowserFrame
          urlText="plenty of room to type · drag to reorder · expand tasks for notes"
          className="max-w-5xl w-full"
          chromeRightSlot={
            <button
              type="button"
              onClick={() => setShowAllDays((prev) => !prev)}
              className="text-[10px] sm:text-[11px] font-bold text-[#7A624D] hover:text-[#2F2B28] bg-[#FAF7F2] hover:bg-white border border-[#E2D9CC] rounded-full px-2.5 py-0.5 transition-colors cursor-pointer whitespace-nowrap"
            >
              {showAllDays ? '4-Day Close-Up' : 'All 7 Days'}
            </button>
          }
        >
          <InteractiveDashboard
            columns={columns}
            monthlyGoals={monthlyGoals}
            yearlyGoals={yearlyGoals}
            activeTheme={activeTheme}
            activeView="week"
            selectedDate={selectedDate}
            weekRangeLabel={weekRangeLabel}
            searchQuery={searchQuery}
            onSearchQueryChange={onSearchQueryChange}
            onSelectTheme={onSelectTheme}
            onSelectView={onSelectView}
            onDateChange={onDateChange}
            onToggleDailyTask={onToggleDailyTask}
            onCycleDailyPriority={onCycleDailyPriority}
            onCycleDailyCategory={onCycleDailyCategory}
            onUpdateDailyTaskText={onUpdateDailyTaskText}
            onUpdateDailyTaskNotes={onUpdateDailyTaskNotes}
            enableTaskNotes
            onReorderOrMoveDailyTask={onReorderOrMoveDailyTask}
            enableDragAndDrop
            onResetWeek={onResetWeek}
            showBulkActions
            onClearCompletedTasks={onClearCompletedTasks}
            onClearPendingTasks={onClearPendingTasks}
            visibleColumnSlice={showAllDays ? undefined : [3, 7]}
            instancePrefix="spacious"
            onQuickSave={onQuickSave}
            onOpenShortcutsModal={onOpenShortcutsModal}
          />
        </BrowserFrame>

        <div className="mt-3.5 sm:mt-4 text-center space-y-2">
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            <span className="bg-[#F5DFD0] text-[#B05C37] font-bold text-xs sm:text-sm px-4 sm:px-5 py-1 rounded-full whitespace-nowrap">
              Easy to read
            </span>
            <span className="bg-[#DFECE0] text-[#3F6F4A] font-bold text-xs sm:text-sm px-4 sm:px-5 py-1 rounded-full whitespace-nowrap">
              Quick to click
            </span>
            <span className="bg-[#E6E2F3] text-[#5D508C] font-bold text-xs sm:text-sm px-4 sm:px-5 py-1 rounded-full whitespace-nowrap">
              Fits your flow
            </span>
          </div>
          <p className="text-xs sm:text-sm font-semibold text-[#8A8279]">
            No cramped cells or tiny text — drag tasks within a day or across
            days of the week
          </p>
        </div>
      </div>
    </section>
  );
};
