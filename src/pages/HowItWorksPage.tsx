import React, { useState } from 'react';
import { Check, Star } from 'lucide-react';
import { SectionHeader } from '../components/SectionHeader';
import { BrowserFrame } from '../components/BrowserFrame';
import { InteractiveDashboard } from '../components/InteractiveDashboard';
import { SharedDashboardPageProps } from './types';

export const HowItWorksPage: React.FC<SharedDashboardPageProps> = ({
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
  onUpdateDailyTaskText,
  onResetWeek,
  onToggleGoalTask,
  onCycleGoalPriority,
  onCycleGoalStatus,
  onUpdateGoalText,
}) => {
  const [bookmarked, setBookmarked] = useState<boolean>(false);

  return (
    <section
      id="how-it-works"
      className="radial-stage-bg full-screen-hero py-4 sm:py-6 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-5xl mx-auto w-full my-auto">
        <SectionHeader
          eyebrow="WORKS ANYWHERE · SAVES ITSELF"
          italicSubtitle="open it once,"
          title="IT REMEMBERS EVERYTHING"
        />

        <BrowserFrame
          urlText="my-tasks.html"
          className="max-w-4xl"
          topRightBadge={
            <button
              type="button"
              onClick={() => setBookmarked((b) => !b)}
              aria-label="Bookmark this dashboard"
              className="inline-flex items-center gap-2.5 group cursor-pointer"
            >
              <span
                className={`w-12 h-12 rounded-full bg-white shadow-md border border-[#E8E0D5] flex items-center justify-center transition-transform group-hover:scale-110 ${
                  bookmarked ? 'ring-2 ring-[#E4B34C]' : ''
                }`}
              >
                <Star className="w-6 h-6 text-[#E4B34C] fill-[#E4B34C]" />
              </span>
              <span className="text-sm font-bold text-[#9C7B49] hidden xl:inline">
                {bookmarked ? 'bookmarked!' : 'bookmark it'}
              </span>
            </button>
          }
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
            onUpdateDailyTaskText={onUpdateDailyTaskText}
            onResetWeek={onResetWeek}
            onToggleGoalTask={onToggleGoalTask}
            onCycleGoalPriority={onCycleGoalPriority}
            onCycleGoalStatus={onCycleGoalStatus}
            onUpdateGoalText={onUpdateGoalText}
            compact
            instancePrefix="fullweek"
          />
        </BrowserFrame>

        {/* 3 Numbered Step Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 max-w-4xl mx-auto mt-4 sm:mt-5">
          {[
            {
              step: '1',
              title: 'Open the file',
              subtitle: 'in any browser',
            },
            {
              step: '2',
              title: 'Add to bookmarks',
              subtitle: 'one star click',
            },
            {
              step: '3',
              title: 'Reopen anytime',
              subtitle: 'tasks are saved',
            },
          ].map((card) => (
            <div
              key={card.step}
              className="bg-white rounded-2xl border border-[#EDE6DC] shadow-[0_10px_28px_-8px_rgba(68,53,39,0.08)] p-3.5 sm:p-4 text-center"
            >
              <div className="w-9 h-9 rounded-full bg-[#F5DFD0] text-[#B86741] font-extrabold text-sm sm:text-base flex items-center justify-center mx-auto mb-2 tabular-nums">
                {card.step}
              </div>
              <h3 className="font-bold text-sm sm:text-base text-[#2F2B28] mb-0.5">
                {card.title}
              </h3>
              <p className="text-xs font-medium text-[#8A8279]">
                {card.subtitle}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom Auto-Save Banner */}
        <div className="mt-4 flex justify-center">
          <div className="bg-[#EFF3EE] border border-[#DCE6DA] rounded-full px-5 py-2 inline-flex items-center gap-2.5 shadow-xs">
            <span className="w-5 h-5 rounded-full bg-[#4E7E59] text-white flex items-center justify-center shrink-0">
              <Check className="w-3.5 h-3.5 stroke-[3]" />
            </span>
            <span className="text-xs sm:text-sm font-bold text-[#446B4D]">
              Auto-saves to your device — no account, no cloud, no subscription
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
