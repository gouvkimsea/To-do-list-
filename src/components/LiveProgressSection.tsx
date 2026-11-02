import React from 'react';
import { Check } from 'lucide-react';
import {
  CATEGORY_BADGE_STYLES,
  DashboardMetrics,
  DetailedTask,
  ThemeId,
  THEMES,
  filterDetailedTasksByKeyword,
} from '../utils/todoLogic';
import {
  PRIORITY_PILL_STYLES,
  STATUS_PILL_STYLES,
} from './InteractiveDashboard';
import { VoiceMicButton } from './VoiceMicButton';

interface LiveProgressBoardProps {
  detailedTasks: DetailedTask[];
  metrics: DashboardMetrics;
  activeTheme: ThemeId;
  searchQuery?: string;
  onToggleDetailedTask: (taskId: string) => void;
  onCycleDetailedPriority: (taskId: string) => void;
  onCycleDetailedStatus: (taskId: string) => void;
  onCycleDetailedCategory?: (taskId: string) => void;
  onUpdateDetailedText: (taskId: string, text: string) => void;
}

export const LiveProgressBoard: React.FC<LiveProgressBoardProps> = ({
  detailedTasks,
  metrics,
  activeTheme,
  searchQuery = '',
  onToggleDetailedTask,
  onCycleDetailedPriority,
  onCycleDetailedStatus,
  onCycleDetailedCategory,
  onUpdateDetailedText,
}) => {
  const theme = THEMES[activeTheme];
  const visibleDetailedTasks = searchQuery.trim()
    ? filterDetailedTasksByKeyword(detailedTasks, searchQuery)
    : detailedTasks;
  const leftColumnTasks = visibleDetailedTasks.filter((_, idx) => idx % 2 === 0);
  const rightColumnTasks = visibleDetailedTasks.filter((_, idx) => idx % 2 === 1);

  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset =
    circumference - (metrics.completionPercentage / 100) * circumference;

  const totalPriorityCount =
    metrics.byPriority.High + metrics.byPriority.Med + metrics.byPriority.Low || 1;
  const totalStatusCount =
    metrics.byStatus['To Do'] +
      metrics.byStatus['In Progress'] +
      metrics.byStatus.Done || 1;

  return (
    <div className="p-2.5 sm:p-3.5 lg:p-4 bg-[#FAF7F2] select-none">
      {/* Upper 2-Column Detailed Tasks Card */}
      <div className="bg-white rounded-2xl border border-[#ECE7DF] p-2.5 sm:p-3 mb-2.5 sm:mb-3 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-0.5">
          {[leftColumnTasks, rightColumnTasks].map((colTasks, colIdx) => (
            <div key={colIdx} className="divide-y divide-[#F4F0E8]">
              {colTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center gap-1.5 sm:gap-2 py-1 sm:py-1.5 px-1 hover:bg-[#FAF8F5] rounded-lg transition-colors"
                >
                  <button
                    type="button"
                    role="checkbox"
                    aria-checked={task.completed}
                    aria-label={`Detailed task "${task.text}"`}
                    onClick={() => onToggleDetailedTask(task.id)}
                    className="w-4 h-4 rounded-[4px] flex items-center justify-center shrink-0 transition-colors cursor-pointer"
                    style={{
                      backgroundColor: task.completed
                        ? theme.checkboxBg
                        : '#FAF8F5',
                      border: task.completed ? 'none' : '1.5px solid #D7D0C6',
                    }}
                  >
                    {task.completed && (
                      <Check className="w-3 h-3 text-white stroke-[3]" />
                    )}
                  </button>

                  <input
                    type="text"
                    value={task.text}
                    aria-label={`Edit task ${task.text}`}
                    onChange={(e) =>
                      onUpdateDetailedText(task.id, e.target.value)
                    }
                    className={`flex-1 min-w-0 bg-transparent text-xs font-medium focus:outline-none ${
                      task.completed
                        ? 'line-through text-[#A59E95]'
                        : 'text-[#3B3632]'
                    }`}
                  />

                  <VoiceMicButton
                    currentText={task.text}
                    onUpdateText={(newText) =>
                      onUpdateDetailedText(task.id, newText)
                    }
                    ariaLabel={`Dictate task for ${task.text || task.id}`}
                    accentColor={theme.checkboxBg}
                  />

                  {/* Small Colored Category Badge */}
                  {task.text.trim().length > 0 && (
                    <button
                      type="button"
                      onClick={() => onCycleDetailedCategory?.(task.id)}
                      aria-label={`Category ${task.category} for ${task.text}. Click to cycle.`}
                      data-testid={`detailed-category-badge-${task.id}`}
                      title={`Category: ${task.category} (click to cycle)`}
                      className="px-2 py-0.5 rounded text-[9px] font-bold shrink-0 border cursor-pointer transition-transform active:scale-95 leading-none"
                      style={{
                        backgroundColor:
                          CATEGORY_BADGE_STYLES[task.category]?.bg ?? '#FCEADE',
                        color:
                          CATEGORY_BADGE_STYLES[task.category]?.text ??
                          '#9A4E28',
                        borderColor:
                          CATEGORY_BADGE_STYLES[task.category]?.border ??
                          '#F0CFB8',
                      }}
                    >
                      {task.category}
                    </button>
                  )}

                  {/* Priority Pill */}
                  <button
                    type="button"
                    onClick={() => onCycleDetailedPriority(task.id)}
                    aria-label={`Priority ${task.priority} for ${task.text}. Click to cycle.`}
                    className="px-2 sm:px-2.5 py-0.5 rounded-full text-[10px] font-bold shrink-0 cursor-pointer transition-transform active:scale-95 min-w-[38px] sm:min-w-[44px] text-center"
                    style={{
                      backgroundColor: PRIORITY_PILL_STYLES[task.priority].bg,
                      color: PRIORITY_PILL_STYLES[task.priority].text,
                    }}
                  >
                    {task.priority}
                  </button>

                  {/* Status Pill */}
                  <button
                    type="button"
                    onClick={() => onCycleDetailedStatus(task.id)}
                    aria-label={`Status ${task.status} for ${task.text}. Click to cycle.`}
                    className="px-2 sm:px-3 py-0.5 rounded-full text-[10px] font-bold shrink-0 cursor-pointer transition-transform active:scale-95 min-w-[56px] sm:min-w-[68px] text-center"
                    style={{
                      backgroundColor: STATUS_PILL_STYLES[task.status].bg,
                      color: STATUS_PILL_STYLES[task.status].text,
                    }}
                  >
                    {task.status}
                  </button>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Live Dashboard Section */}
      <div>
        <h4 className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#7A6E63] mb-3 px-1">
          DASHBOARD
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.05fr_1.45fr_1fr_1.05fr] gap-2.5 sm:gap-3 lg:gap-3.5">
          {/* Card 1: Week Completion Donut */}
          <div className="bg-white rounded-2xl border border-[#ECE7DF] p-3 sm:p-3.5 lg:p-4 flex flex-col justify-between shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
            <span className="text-[10px] font-bold tracking-wider uppercase text-[#8A8279]">
              WEEK COMPLETION
            </span>

            <div className="my-1.5 sm:my-2 flex items-center justify-center relative">
              <svg className="w-24 h-24 sm:w-28 sm:h-28 -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  fill="transparent"
                  stroke="#EFECE6"
                  strokeWidth="10"
                />
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  fill="transparent"
                  stroke="#604E3D"
                  strokeWidth="10"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className="transition-all duration-300"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span
                  data-testid="week-completion-pct"
                  className="text-2xl font-black text-[#2F2B28] tabular-nums"
                >
                  {metrics.completionPercentage}%
                </span>
              </div>
            </div>

            <div
              data-testid="week-completion-count"
              className="text-center text-[11px] font-semibold text-[#8A8279] tabular-nums"
            >
              {metrics.completedTasks} of {metrics.totalTasks} tasks
            </div>
          </div>

          {/* Card 2: Daily Progress Vertical Bars */}
          <div className="bg-white rounded-2xl border border-[#ECE7DF] p-3 sm:p-3.5 lg:p-4 flex flex-col justify-between shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
            <span className="text-[10px] font-bold tracking-wider uppercase text-[#8A8279] mb-1.5 sm:mb-2">
              DAILY PROGRESS
            </span>

            <div className="grid grid-cols-7 gap-1 sm:gap-1.5 items-end pt-1 sm:pt-2">
              {metrics.dailyProgress.map((day, i) => (
                <div
                  key={day.dayId}
                  className="flex flex-col items-center gap-1 sm:gap-1.5"
                >
                  <span className="text-[9.5px] font-bold text-[#8A8279] tabular-nums">
                    {day.percentage}%
                  </span>
                  <div className="w-4.5 sm:w-5.5 lg:w-6 h-16 sm:h-20 bg-[#F2EFE9] rounded-full overflow-hidden flex items-end">
                    <div
                      className="w-full rounded-full transition-all duration-300"
                      style={{
                        height: `${Math.max(day.percentage, 8)}%`,
                        backgroundColor: theme.dayHeaders[i] || theme.progressFill,
                      }}
                    />
                  </div>
                  <span className="text-[10px] sm:text-[10.5px] font-bold text-[#6E675F]">
                    {day.shortName}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Card 3: By Priority */}
          <div className="bg-white rounded-2xl border border-[#ECE7DF] p-3 sm:p-3.5 lg:p-4 flex flex-col justify-between shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
            <span className="text-[10px] font-bold tracking-wider uppercase text-[#8A8279] mb-1.5 sm:mb-2">
              BY PRIORITY
            </span>

            <div className="space-y-3 my-auto py-2">
              {(
                [
                  { label: 'High', count: metrics.byPriority.High, color: '#E68A82' },
                  { label: 'Med', count: metrics.byPriority.Med, color: '#EFC776' },
                  { label: 'Low', count: metrics.byPriority.Low, color: '#86C79F' },
                ] as const
              ).map((item) => {
                const widthPct = Math.round(
                  (item.count / totalPriorityCount) * 100
                );
                return (
                  <div key={item.label} className="flex items-center gap-2">
                    <span className="text-[11px] font-semibold text-[#5A534C] w-9 shrink-0">
                      {item.label}
                    </span>
                    <div className="flex-1 h-2.5 bg-[#F2EFE9] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{
                          width: `${Math.max(widthPct, 12)}%`,
                          backgroundColor: item.color,
                        }}
                      />
                    </div>
                    <span className="text-[11px] font-bold text-[#3B3632] w-5 text-right tabular-nums">
                      {item.count}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="h-2" />
          </div>

          {/* Card 4: By Status */}
          <div className="bg-white rounded-2xl border border-[#ECE7DF] p-3 sm:p-3.5 lg:p-4 flex flex-col justify-between shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
            <span className="text-[10px] font-bold tracking-wider uppercase text-[#8A8279] mb-1.5 sm:mb-2">
              BY STATUS
            </span>

            <div className="space-y-2.5 sm:space-y-3 my-auto py-1 sm:py-2">
              {(
                [
                  {
                    label: 'To Do',
                    count: metrics.byStatus['To Do'],
                    color: '#CFD5DC',
                  },
                  {
                    label: 'In Progress',
                    count: metrics.byStatus['In Progress'],
                    color: '#9CC4E8',
                  },
                  {
                    label: 'Done',
                    count: metrics.byStatus.Done,
                    color: '#7EC699',
                  },
                ] as const
              ).map((item) => {
                const widthPct = Math.round(
                  (item.count / totalStatusCount) * 100
                );
                return (
                  <div key={item.label} className="flex items-center gap-2">
                    <span className="text-[11px] font-semibold text-[#5A534C] w-16 shrink-0 truncate">
                      {item.label}
                    </span>
                    <div className="flex-1 h-2.5 bg-[#F2EFE9] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{
                          width: `${Math.max(widthPct, 12)}%`,
                          backgroundColor: item.color,
                        }}
                      />
                    </div>
                    <span className="text-[11px] font-bold text-[#3B3632] w-5 text-right tabular-nums">
                      {item.count}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="h-2" />
          </div>
        </div>
      </div>
    </div>
  );
};
