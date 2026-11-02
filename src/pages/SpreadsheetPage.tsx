import React from 'react';
import { SectionHeader } from '../components/SectionHeader';
import { SpreadsheetSection } from '../components/SpreadsheetSection';
import { SharedDashboardPageProps } from './types';

export const SpreadsheetPage: React.FC<SharedDashboardPageProps> = ({
  columns,
  activeTheme,
  onToggleDailyTask,
  onCycleDailyCategory,
  onUpdateDailyTaskText,
  onExportCsv,
}) => {
  return (
    <section
      id="spreadsheet"
      className="radial-stage-bg full-screen-hero py-8 sm:py-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-5xl mx-auto w-full my-auto">
        <SectionHeader
          eyebrow="ALSO INCLUDED — FREE"
          italicSubtitle="prefer a"
          title="SPREADSHEET?"
        />

        <SpreadsheetSection
          columns={columns}
          activeTheme={activeTheme}
          onToggleDailyTask={onToggleDailyTask}
          onCycleDailyCategory={onCycleDailyCategory}
          onUpdateDailyTaskText={onUpdateDailyTaskText}
          onExportCsv={onExportCsv}
        />

        <div className="mt-6 text-center space-y-1.5">
          <p className="text-xs sm:text-sm font-bold text-[#7A7269]">
            Same colour-coding, dropdowns &amp; auto-totals — import to Google
            Sheets or open in Excel
          </p>
          <p className="text-xs font-medium text-[#9C948B]">
            For anyone who would rather work in a spreadsheet
          </p>
        </div>
      </div>
    </section>
  );
};
