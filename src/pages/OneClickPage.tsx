import React, { useState } from 'react';
import { Check } from 'lucide-react';
import {
  Priority,
  TaskStatus,
  cyclePriority,
  cycleStatus,
} from '../utils/todoLogic';
import { SectionHeader } from '../components/SectionHeader';
import { BrowserFrame } from '../components/BrowserFrame';
import {
  InteractiveDashboard,
  PRIORITY_DOT_COLORS,
  STATUS_PILL_STYLES,
} from '../components/InteractiveDashboard';
import { SharedDashboardPageProps } from './types';

export const OneClickPage: React.FC<SharedDashboardPageProps> = ({
  columns,
  monthlyGoals,
  yearlyGoals,
  activeTheme,
  activeView,
  selectedDate,
  weekRangeLabel,
  searchQuery,
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
  const [demoChecked, setDemoChecked] = useState<boolean>(true);
  const [demoPriority, setDemoPriority] = useState<Priority>('High');
  const [demoStatus, setDemoStatus] = useState<TaskStatus>('In Progress');

  return (
    <section
      id="one-click"
      className="radial-stage-bg full-screen-hero py-8 sm:py-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-5xl mx-auto w-full my-auto">
        <SectionHeader
          eyebrow="FULLY INTERACTIVE"
          italicSubtitle="every task is"
          title="ONE CLICK AWAY"
        />

        <BrowserFrame
          urlText="click anything — it updates instantly"
          className="max-w-4xl"
        >
          <InteractiveDashboard
            columns={columns}
            monthlyGoals={monthlyGoals}
            yearlyGoals={yearlyGoals}
            activeTheme={activeTheme}
            activeView={activeView}
            selectedDate={selectedDate}
            weekRangeLabel={weekRangeLabel}
            searchQuery={searchQuery}
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
            instancePrefix="oneclick"
          />
        </BrowserFrame>

        {/* 3 Interactive Action Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 max-w-4xl mx-auto mt-6 sm:mt-7">
          {/* Card 1: Check it off */}
          <button
            type="button"
            onClick={() => setDemoChecked((c) => !c)}
            className="bg-white hover:bg-[#FDFBF8] rounded-2xl border border-[#EDE6DC] shadow-[0_10px_28px_-8px_rgba(68,53,39,0.08)] p-4 sm:p-5 text-center transition-transform hover:-translate-y-0.5 cursor-pointer"
          >
            <div className="h-8 flex items-center justify-center mb-2.5">
              <span
                className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
                style={{
                  backgroundColor: demoChecked ? '#C87D55' : '#FAF8F5',
                  border: demoChecked ? 'none' : '2px solid #D5CEC4',
                }}
              >
                {demoChecked && (
                  <Check className="w-4 h-4 text-white stroke-[3]" />
                )}
              </span>
            </div>
            <h3 className="font-bold text-base sm:text-lg text-[#2F2B28] mb-0.5">
              Check it off
            </h3>
            <p className="text-xs sm:text-sm font-medium text-[#8A8279]">
              Strikes through &amp;
              <br />
              turns {demoChecked ? 'complete' : 'green'}
            </p>
          </button>

          {/* Card 2: Tap the dot */}
          <button
            type="button"
            onClick={() => setDemoPriority((p) => cyclePriority(p))}
            className="bg-white hover:bg-[#FDFBF8] rounded-2xl border border-[#EDE6DC] shadow-[0_10px_28px_-8px_rgba(68,53,39,0.08)] p-4 sm:p-5 text-center transition-transform hover:-translate-y-0.5 cursor-pointer"
          >
            <div className="h-8 flex items-center justify-center gap-2 mb-2.5">
              {(['High', 'Med', 'Low'] as const).map((p) => (
                <span
                  key={p}
                  className={`w-4 h-4 rounded-full transition-transform ${
                    demoPriority === p
                      ? 'scale-125 ring-2 ring-[#7D746B]'
                      : 'opacity-70'
                  }`}
                  style={{ backgroundColor: PRIORITY_DOT_COLORS[p] }}
                />
              ))}
            </div>
            <h3 className="font-bold text-base sm:text-lg text-[#2F2B28] mb-0.5">
              Tap the dot
            </h3>
            <p className="text-xs sm:text-sm font-medium text-[#8A8279]">
              Cycles High,
              <br />
              Med &amp; Low ({demoPriority})
            </p>
          </button>

          {/* Card 3: Tap the pill */}
          <button
            type="button"
            onClick={() => setDemoStatus((s) => cycleStatus(s))}
            className="bg-white hover:bg-[#FDFBF8] rounded-2xl border border-[#EDE6DC] shadow-[0_10px_28px_-8px_rgba(68,53,39,0.08)] p-4 sm:p-5 text-center transition-transform hover:-translate-y-0.5 cursor-pointer"
          >
            <div className="h-8 flex items-center justify-center mb-2.5">
              <span
                className="px-3.5 py-1 rounded-full text-xs font-bold transition-colors"
                style={{
                  backgroundColor: STATUS_PILL_STYLES[demoStatus].bg,
                  color: STATUS_PILL_STYLES[demoStatus].text,
                }}
              >
                {demoStatus}
              </span>
            </div>
            <h3 className="font-bold text-base sm:text-lg text-[#2F2B28] mb-0.5">
              Tap the pill
            </h3>
            <p className="text-xs sm:text-sm font-medium text-[#8A8279]">
              Sets To Do,
              <br />
              In Progress, Done
            </p>
          </button>
        </div>
      </div>
    </section>
  );
};
