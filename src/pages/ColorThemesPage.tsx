import React from 'react';
import { ThemeId, THEMES } from '../utils/todoLogic';
import { SectionHeader } from '../components/SectionHeader';
import { BrowserFrame } from '../components/BrowserFrame';
import { InteractiveDashboard } from '../components/InteractiveDashboard';
import { SharedDashboardPageProps } from './types';

export const ColorThemesPage: React.FC<SharedDashboardPageProps> = ({
  columns,
  monthlyGoals,
  yearlyGoals,
  activeTheme,
  selectedDate,
  weekRangeLabel,
  onSelectTheme,
  onSelectView,
  onDateChange,
  onToggleDailyTask,
  onCycleDailyPriority,
  onCycleDailyCategory,
  onUpdateDailyTaskText,
  onResetWeek,
}) => {
  return (
    <section
      id="color-themes"
      className="radial-stage-bg full-screen-hero py-8 sm:py-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-6xl mx-auto w-full my-auto">
        <SectionHeader
          eyebrow="FOUR COLOR THEMES"
          italicSubtitle="find the palette"
          title="THAT'S YOU"
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-7 mt-5 sm:mt-6">
          {(Object.keys(THEMES) as ThemeId[]).map((themeKey) => {
            const t = THEMES[themeKey];
            const isCurrent = activeTheme === themeKey;
            return (
              <div key={themeKey} className="flex flex-col items-center">
                <div
                  onClick={() => onSelectTheme(themeKey)}
                  className={`w-full rounded-2xl transition-all cursor-pointer ${
                    isCurrent
                      ? 'ring-3 ring-[#C26D43]/60 shadow-xl'
                      : 'opacity-95 hover:opacity-100'
                  }`}
                >
                  <BrowserFrame urlText="my-tasks.html" compact>
                    <InteractiveDashboard
                      columns={columns}
                      monthlyGoals={monthlyGoals}
                      yearlyGoals={yearlyGoals}
                      activeTheme={themeKey}
                      activeView="week"
                      selectedDate={selectedDate}
                      weekRangeLabel={weekRangeLabel}
                      onSelectTheme={onSelectTheme}
                      onSelectView={onSelectView}
                      onDateChange={onDateChange}
                      onToggleDailyTask={onToggleDailyTask}
                      onCycleDailyPriority={onCycleDailyPriority}
                      onCycleDailyCategory={onCycleDailyCategory}
                      onUpdateDailyTaskText={onUpdateDailyTaskText}
                      onResetWeek={onResetWeek}
                      compact
                      instancePrefix={`theme-${themeKey}`}
                    />
                  </BrowserFrame>
                </div>

                <button
                  type="button"
                  aria-pressed={isCurrent}
                  onClick={() => onSelectTheme(themeKey)}
                  className="mt-2.5 text-base sm:text-lg font-extrabold tracking-tight cursor-pointer transition-transform hover:scale-105"
                  style={{ color: t.labelColor }}
                >
                  {t.name} {isCurrent ? '✓' : ''}
                </button>
              </div>
            );
          })}
        </div>

        <p className="text-center text-xs sm:text-sm font-semibold text-[#8A8279] mt-6">
          Switch any time with one click — your tasks stay exactly where they
          are
        </p>
      </div>
    </section>
  );
};
