import React from 'react';
import { SectionHeader } from '../components/SectionHeader';
import { BrowserFrame } from '../components/BrowserFrame';
import { InteractiveDashboard } from '../components/InteractiveDashboard';
import { SharedDashboardPageProps } from './types';

export const MonthlyYearlyPage: React.FC<SharedDashboardPageProps> = ({
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
  onResetWeek,
  onToggleGoalTask,
  onCycleGoalPriority,
  onCycleGoalStatus,
  onCycleGoalCategory,
  onUpdateGoalText,
}) => {
  return (
    <section
      id="monthly-yearly"
      className="radial-stage-bg full-screen-hero py-8 sm:py-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-6xl mx-auto w-full my-auto">
        <SectionHeader
          eyebrow="MONTHLY & YEARLY"
          italicSubtitle="plan the"
          title="BIGGER PICTURE, TOO"
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mt-5 sm:mt-6">
          {/* Monthly Goals Window */}
          <div className="flex flex-col items-center">
            <BrowserFrame
              urlText="my-tasks.html — This Month (June 2026)"
              compact
              className="w-full"
            >
              <InteractiveDashboard
                columns={columns}
                monthlyGoals={monthlyGoals}
                yearlyGoals={yearlyGoals}
                activeTheme={activeTheme}
                activeView="month"
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
                onResetWeek={onResetWeek}
                onToggleGoalTask={onToggleGoalTask}
                onCycleGoalPriority={onCycleGoalPriority}
                onCycleGoalStatus={onCycleGoalStatus}
                onCycleGoalCategory={onCycleGoalCategory}
                onUpdateGoalText={onUpdateGoalText}
                compact
                instancePrefix="monthly-preview"
              />
            </BrowserFrame>
            <span className="mt-2.5 text-base sm:text-lg font-extrabold text-[#B86B43]">
              Monthly goals
            </span>
          </div>

          {/* Yearly Goals Window */}
          <div className="flex flex-col items-center">
            <BrowserFrame
              urlText="my-tasks.html — This Year (2026)"
              compact
              className="w-full"
            >
              <InteractiveDashboard
                columns={columns}
                monthlyGoals={monthlyGoals}
                yearlyGoals={yearlyGoals}
                activeTheme={activeTheme}
                activeView="year"
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
                onResetWeek={onResetWeek}
                onToggleGoalTask={onToggleGoalTask}
                onCycleGoalPriority={onCycleGoalPriority}
                onCycleGoalStatus={onCycleGoalStatus}
                onCycleGoalCategory={onCycleGoalCategory}
                onUpdateGoalText={onUpdateGoalText}
                compact
                instancePrefix="yearly-preview"
              />
            </BrowserFrame>
            <span className="mt-2.5 text-base sm:text-lg font-extrabold text-[#6D5B98]">
              Yearly goals
            </span>
          </div>
        </div>

        <div className="mt-6 text-center space-y-3">
          <p className="text-xs sm:text-sm font-semibold text-[#8A8279]">
            A dedicated list and progress charts for the month and the year
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <span className="bg-[#F5DFD0] text-[#B05C37] font-bold text-xs sm:text-sm px-5 py-1.5 sm:py-2 rounded-full">
              Monthly completion %
            </span>
            <span className="bg-[#E6E2F3] text-[#5D508C] font-bold text-xs sm:text-sm px-5 py-1.5 sm:py-2 rounded-full">
              Yearly goal tracking
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
