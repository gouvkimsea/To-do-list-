import React, { useMemo, useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import {
  DayColumn,
  ThemeId,
  THEMES,
  buildWeeklyProgressTrends,
} from '../utils/todoLogic';

interface WeeklyProgressTrendsChartProps {
  columns: DayColumn[];
  selectedDate: string;
  activeTheme: ThemeId;
}

export const WeeklyProgressTrendsChart: React.FC<
  WeeklyProgressTrendsChartProps
> = ({ columns, selectedDate, activeTheme }) => {
  const [chartMode, setChartMode] = useState<'stacked' | 'grouped'>('stacked');
  const theme = THEMES[activeTheme];

  const trendData = useMemo(
    () => buildWeeklyProgressTrends(columns, selectedDate),
    [columns, selectedDate]
  );

  const currentWeek = trendData[trendData.length - 1];

  return (
    <div
      data-testid="weekly-progress-trends-card"
      className="mt-9 max-w-4xl mx-auto bg-[#FDFBF7] dark:bg-[#1E1B18] rounded-2xl border border-[#E5DEC9] dark:border-[#38332E] shadow-[0_14px_34px_-12px_rgba(68,53,39,0.09)] p-5 sm:p-6"
    >
      {/* Card Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-5">
        <div>
          <span className="text-[10px] font-bold tracking-[0.16em] uppercase text-[#9A8F82] dark:text-[#B5ADA3] block mb-0.5">
            4-WEEK TASK ANALYTICS
          </span>
          <h3 className="text-lg sm:text-xl font-bold text-[#2F2B28] dark:text-[#EDE8E1] tracking-tight">
            Weekly Progress Trends
          </h3>
          <p className="text-xs font-medium text-[#8A8279] dark:text-[#9A9187] mt-0.5">
            Completed vs. pending tasks over the last four weeks (live-synced
            with This Week)
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div
            data-testid="trends-current-ratio"
            className="bg-[#F4EFE6] dark:bg-[#28231E] border border-[#E5DEC9] dark:border-[#38332E] rounded-full px-3 py-1 text-[11px] font-bold text-[#4A433C] dark:text-[#EDE8E1] tabular-nums"
          >
            This Week: {currentWeek.completed} Done · {currentWeek.pending}{' '}
            Pending ({currentWeek.completionRate}%)
          </div>

          <div
            className="inline-flex items-center bg-[#EFECE6] dark:bg-[#2B2622] p-0.5 rounded-full border border-[#E4DDD3] dark:border-[#38332E]"
            role="group"
            aria-label="Chart layout mode"
          >
            <button
              type="button"
              onClick={() => setChartMode('stacked')}
              className={`px-2.5 py-1 text-[10px] font-bold rounded-full transition-colors cursor-pointer ${
                chartMode === 'stacked'
                  ? 'bg-white dark:bg-[#1E1B18] text-[#2F2B28] dark:text-[#EDE8E1] shadow-2xs'
                  : 'text-[#7A7269] dark:text-[#9A9187] hover:text-[#2F2B28] dark:hover:text-[#EDE8E1]'
              }`}
            >
              Stacked Ratio
            </button>
            <button
              type="button"
              onClick={() => setChartMode('grouped')}
              className={`px-2.5 py-1 text-[10px] font-bold rounded-full transition-colors cursor-pointer ${
                chartMode === 'grouped'
                  ? 'bg-white dark:bg-[#1E1B18] text-[#2F2B28] dark:text-[#EDE8E1] shadow-2xs'
                  : 'text-[#7A7269] dark:text-[#9A9187] hover:text-[#2F2B28] dark:hover:text-[#EDE8E1]'
              }`}
            >
              Side-by-Side
            </button>
          </div>
        </div>
      </div>

      {/* Recharts BarChart */}
      <div className="w-full h-64 bg-white dark:bg-[#171513] rounded-xl border border-[#ECE7DF] dark:border-[#38332E] p-2 sm:p-4 overflow-hidden min-w-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={trendData}
            margin={{ top: 8, right: 16, left: -12, bottom: 4 }}
            barCategoryGap="26%"
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="var(--chart-grid-stroke, #EFECE6)"
            />
            <XAxis
              dataKey="weekLabel"
              tick={{ fill: 'var(--chart-tick-primary, #5A534C)', fontSize: 11, fontWeight: 700 }}
              axisLine={{ stroke: 'var(--chart-axis-stroke, #E5DEC9)' }}
              tickLine={false}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fill: 'var(--chart-tick-secondary, #8A8279)', fontSize: 11, fontWeight: 600 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              cursor={{ fill: 'var(--chart-cursor-fill, #FAF6F0)' }}
              contentStyle={{
                backgroundColor: 'var(--chart-tooltip-bg, #FDFBF7)',
                borderColor: 'var(--chart-tooltip-border, #E5DEC9)',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: 600,
                color: 'var(--chart-tooltip-text, #2F2B28)',
                boxShadow: '0 10px 24px -6px rgba(0,0,0,0.22)',
              }}
              formatter={(value, name) => [
                `${value ?? 0} tasks`,
                name === 'completed' ? 'Completed Tasks' : 'Pending Tasks',
              ]}
              labelFormatter={(label, payload) => {
                const point = payload?.[0]?.payload;
                if (point) {
                  return `${String(label ?? '')} (${point.dateRange}) — ${point.completionRate}% Done`;
                }
                return String(label ?? '');
              }}
            />
            <Legend
              wrapperStyle={{ fontSize: '11px', fontWeight: 700, paddingTop: 6 }}
              formatter={(value) =>
                value === 'completed' ? 'Completed Tasks' : 'Pending Tasks'
              }
            />
            <Bar
              dataKey="completed"
              name="completed"
              stackId={chartMode === 'stacked' ? 'tasks' : undefined}
              fill={theme.progressFill}
              radius={
                chartMode === 'stacked' ? [0, 0, 6, 6] : [6, 6, 0, 0]
              }
            />
            <Bar
              dataKey="pending"
              name="pending"
              stackId={chartMode === 'stacked' ? 'tasks' : undefined}
              fill="var(--chart-pending-fill, #DFD8CE)"
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default WeeklyProgressTrendsChart;
