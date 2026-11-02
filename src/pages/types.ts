import {
  DashboardMetrics,
  DayColumn,
  DetailedTask,
  PagePath,
  ThemeId,
  ViewMode,
} from '../utils/todoLogic';

export interface SharedDashboardPageProps {
  columns: DayColumn[];
  detailedTasks: DetailedTask[];
  monthlyGoals: DetailedTask[];
  yearlyGoals: DetailedTask[];
  activeTheme: ThemeId;
  activeView: ViewMode;
  selectedDate: string;
  weekRangeLabel: string;
  searchQuery: string;
  metrics: DashboardMetrics;
  onSearchQueryChange: (query: string) => void;
  onSelectTheme: (theme: ThemeId) => void;
  onSelectView: (view: ViewMode) => void;
  onDateChange: (date: string) => void;
  onToggleDailyTask: (
    dayId: string,
    taskId: string,
    origin?: { x: number; y: number }
  ) => void;
  onCycleDailyPriority: (dayId: string, taskId: string) => void;
  onCycleDailyCategory: (dayId: string, taskId: string) => void;
  onUpdateDailyTaskText: (dayId: string, taskId: string, text: string) => void;
  onUpdateDailyTaskNotes: (dayId: string, taskId: string, notes: string) => void;
  onReorderOrMoveDailyTask: (activeTaskId: string, overId: string) => void;
  onResetWeek: () => void;
  onClearCompletedTasks: () => void;
  onClearPendingTasks: () => void;
  onToggleDetailedTask: (taskId: string) => void;
  onCycleDetailedPriority: (taskId: string) => void;
  onCycleDetailedStatus: (taskId: string) => void;
  onCycleDetailedCategory: (taskId: string) => void;
  onUpdateDetailedText: (taskId: string, text: string) => void;
  onToggleGoalTask: (mode: 'month' | 'year', taskId: string) => void;
  onCycleGoalPriority: (mode: 'month' | 'year', taskId: string) => void;
  onCycleGoalStatus: (mode: 'month' | 'year', taskId: string) => void;
  onCycleGoalCategory: (mode: 'month' | 'year', taskId: string) => void;
  onUpdateGoalText: (mode: 'month' | 'year', taskId: string, text: string) => void;
  onExportCsv: () => void;
  onOpenModal: (tab: 'download' | 'demo') => void;
  onOpenShortcutsModal?: () => void;
  onQuickSave?: () => void;
  onNavigate: (path: PagePath) => void;
}

