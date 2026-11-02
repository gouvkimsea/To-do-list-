/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle2 } from 'lucide-react';
import {
  DayColumn,
  DetailedTask,
  PagePath,
  PAGE_ROUTES,
  ThemeId,
  THEMES,
  ViewMode,
  cyclePriority,
  cycleStatus,
  cycleCategory,
  cycleTheme,
  toggleTaskCompletion,
  updateTaskStatus,
  calculateDashboardMetrics,
  createInitialWeekColumns,
  clearWeekTasks,
  clearCompletedWeekTasks,
  clearPendingWeekTasks,
  clearDetailedTasksByCompletion,
  formatWeekRangeFromDate,
  shouldTriggerDayCompleteConfetti,
  isKnownRoutePath,
  resolveRoutePath,
  getAdjacentRoutes,
  reorderOrMoveDailyTask,
  updateDailyTaskNotes,
  sanitizeTaskText,
  sanitizeTaskNotes,
  generateCsvExport,
  parsePersistedDashboardState,
  resolveKeyboardShortcutAction,
  syncDetailedTaskToggle,
  syncDailyTaskToggle,
  syncDetailedTaskStatus,
  syncDetailedTaskPriority,
  syncDetailedTaskCategory,
  syncDetailedTaskText,
  syncDailyTaskPriority,
  syncDailyTaskCategory,
  syncDailyTaskText,
  DETAILED_DAILY_TASK_LINKS,
} from './utils/todoLogic';
import { useUndoRedo } from './hooks/useUndoRedo';
import { Navbar } from './components/Navbar';
import { DownloadModal } from './components/DownloadModal';
import { KeyboardShortcutsModal } from './components/KeyboardShortcutsModal';
import { DashboardPage } from './pages/DashboardPage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { DailyColumnsPage } from './pages/DailyColumnsPage';
import { OneClickPage } from './pages/OneClickPage';
import { LiveProgressPage } from './pages/LiveProgressPage';
import { ColorThemesPage } from './pages/ColorThemesPage';
import { MonthlyYearlyPage } from './pages/MonthlyYearlyPage';
import { BuiltToReusePage } from './pages/BuiltToReusePage';
import { SpreadsheetPage } from './pages/SpreadsheetPage';
import { EverythingYouGetPage } from './pages/EverythingYouGetPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { SharedDashboardPageProps } from './pages/types';

const STORAGE_KEY = 'interactive_todo_dashboard_state_v1';
const BASE_PRODUCTION_URL =
  'https://ais-pre-qgvyqbwajtw4t5pxppy7eo-715011109838.asia-east1.run.app';

function loadInitialPersistedState() {
  if (typeof window === 'undefined') {
    return parsePersistedDashboardState(null);
  }
  try {
    return parsePersistedDashboardState(localStorage.getItem(STORAGE_KEY));
  } catch {
    return parsePersistedDashboardState(null);
  }
}

export default function App() {
  const initialPersisted = useMemo(() => loadInitialPersistedState(), []);

  const [isNotFoundRoute, setIsNotFoundRoute] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    if (window.location.hash && isKnownRoutePath(window.location.hash)) {
      return false;
    }
    return !isKnownRoutePath(window.location.pathname);
  });

  const [currentPath, setCurrentPath] = useState<PagePath>(() => {
    if (typeof window === 'undefined') return '/';
    const hashCandidate = window.location.hash
      ? resolveRoutePath(window.location.hash)
      : '/';
    if (window.location.hash && hashCandidate !== '/') {
      return hashCandidate;
    }
    return resolveRoutePath(window.location.pathname);
  });

  const {
    state: taskSnapshot,
    setState: setTaskSnapshot,
    undo: handleUndoRaw,
    redo: handleRedoRaw,
    canUndo,
    canRedo,
  } = useUndoRedo<{
    columns: DayColumn[];
    detailedTasks: DetailedTask[];
  }>({
    columns: initialPersisted.columns,
    detailedTasks: initialPersisted.detailedTasks,
  });

  const columns = taskSnapshot.columns;
  const detailedTasks = taskSnapshot.detailedTasks;

  const setColumns = useCallback(
    (action: DayColumn[] | ((prev: DayColumn[]) => DayColumn[])) => {
      setTaskSnapshot((prev) => {
        const nextCols = typeof action === 'function' ? action(prev.columns) : action;
        return {
          columns: nextCols,
          detailedTasks: prev.detailedTasks,
        };
      });
    },
    [setTaskSnapshot]
  );

  const setDetailedTasks = useCallback(
    (action: DetailedTask[] | ((prev: DetailedTask[]) => DetailedTask[])) => {
      setTaskSnapshot((prev) => {
        const nextDetailed =
          typeof action === 'function' ? action(prev.detailedTasks) : action;
        return {
          columns: prev.columns,
          detailedTasks: nextDetailed,
        };
      });
    },
    [setTaskSnapshot]
  );

  const setBothTaskStates = useCallback(
    (nextCols: DayColumn[], nextDetailed: DetailedTask[]) => {
      setTaskSnapshot({
        columns: nextCols,
        detailedTasks: nextDetailed,
      });
    },
    [setTaskSnapshot]
  );
  const [monthlyGoals, setMonthlyGoals] = useState<DetailedTask[]>(
    () => initialPersisted.monthlyGoals
  );
  const [yearlyGoals, setYearlyGoals] = useState<DetailedTask[]>(
    () => initialPersisted.yearlyGoals
  );
  const [activeTheme, setActiveTheme] = useState<ThemeId>(
    () => initialPersisted.activeTheme
  );

  const [activeView, setActiveView] = useState<ViewMode>('week');
  const [selectedDate, setSelectedDate] = useState<string>('2026-06-11');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [modalState, setModalState] = useState<{
    open: boolean;
    tab: 'download' | 'demo';
  }>({ open: false, tab: 'download' });
  const [shortcutsModalOpen, setShortcutsModalOpen] = useState<boolean>(false);
  const [saveToastMessage, setSaveToastMessage] = useState<string | null>(null);
  const saveToastTimerRef = useRef<number | null>(null);

  // Sync browser history popstate (Back / Forward navigation)
  useEffect(() => {
    const handlePopState = () => {
      const known = isKnownRoutePath(window.location.pathname);
      setIsNotFoundRoute(!known);
      setCurrentPath(resolveRoutePath(window.location.pathname));
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Dynamically sync document title, meta description, Open Graph, Twitter cards, and canonical URL per route
  useEffect(() => {
    const matchedRoute =
      PAGE_ROUTES.find((r) => r.path === currentPath) || PAGE_ROUTES[0];
    const pageTitle = isNotFoundRoute
      ? '404 Page Not Found — Interactive Weekly To-Do Dashboard'
      : matchedRoute.path === '/'
      ? 'Interactive Weekly To-Do Dashboard'
      : `${matchedRoute.label} — Interactive Weekly To-Do Dashboard`;
    const pageDescription = isNotFoundRoute
      ? 'The page you requested could not be found. Return to the Interactive Weekly To-Do Dashboard.'
      : matchedRoute.description;
    const canonicalUrl = `${BASE_PRODUCTION_URL}${
      isNotFoundRoute ? '/404' : matchedRoute.path
    }`;

    document.title = pageTitle;

    const setMetaContent = (selector: string, content: string) => {
      const el = document.querySelector<HTMLMetaElement>(selector);
      if (el) {
        el.setAttribute('content', content);
      }
    };

    setMetaContent('meta[name="description"]', pageDescription);
    setMetaContent('meta[property="og:title"]', pageTitle);
    setMetaContent('meta[property="og:description"]', pageDescription);
    setMetaContent('meta[property="og:url"]', canonicalUrl);
    setMetaContent('meta[name="twitter:title"]', pageTitle);
    setMetaContent('meta[name="twitter:description"]', pageDescription);

    const canonicalLink = document.querySelector<HTMLLinkElement>(
      'link[rel="canonical"]'
    );
    if (canonicalLink) {
      canonicalLink.setAttribute('href', canonicalUrl);
    }
  }, [currentPath, isNotFoundRoute]);

  const handleNavigate = useCallback((nextPath: PagePath) => {
    const resolved = resolveRoutePath(nextPath);
    if (typeof window !== 'undefined' && window.location.pathname !== resolved) {
      window.history.pushState({}, '', resolved);
    }
    setIsNotFoundRoute(false);
    setCurrentPath(resolved);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    }
  }, []);

  // Auto-save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          columns,
          detailedTasks,
          monthlyGoals,
          yearlyGoals,
          activeTheme,
        })
      );
    } catch {
      // ignore quota errors
    }
  }, [columns, detailedTasks, monthlyGoals, yearlyGoals, activeTheme]);

  const handleExplicitSave = useCallback(
    (customMessage?: string) => {
      try {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            columns,
            detailedTasks,
            monthlyGoals,
            yearlyGoals,
            activeTheme,
          })
        );
      } catch {
        // ignore quota errors
      }
      setSaveToastMessage(
        customMessage || 'Saved — all tasks & notes synced locally'
      );
      if (typeof window !== 'undefined') {
        if (saveToastTimerRef.current !== null) {
          window.clearTimeout(saveToastTimerRef.current);
        }
        saveToastTimerRef.current = window.setTimeout(() => {
          setSaveToastMessage(null);
          saveToastTimerRef.current = null;
        }, 2600);
      }
    },
    [columns, detailedTasks, monthlyGoals, yearlyGoals, activeTheme]
  );

  const handleUndo = useCallback(() => {
    if (handleUndoRaw()) {
      handleExplicitSave('Undid task change (Ctrl+Z)');
    }
  }, [handleUndoRaw, handleExplicitSave]);

  const handleRedo = useCallback(() => {
    if (handleRedoRaw()) {
      handleExplicitSave('Redid task change (Ctrl+Y)');
    }
  }, [handleRedoRaw, handleExplicitSave]);

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && saveToastTimerRef.current !== null) {
        window.clearTimeout(saveToastTimerRef.current);
      }
    };
  }, []);

  // Global keyboard shortcut listener
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      const target = (e.target as HTMLElement | null) ||
        (document.activeElement as HTMLElement | null);
      const tagName = target?.tagName ? target.tagName.toUpperCase() : '';
      const isEditableTarget = Boolean(
        target &&
          (tagName === 'INPUT' ||
            tagName === 'TEXTAREA' ||
            tagName === 'SELECT' ||
            target.isContentEditable)
      );

      const action = resolveKeyboardShortcutAction({
        key: e.key,
        ctrlKey: e.ctrlKey,
        metaKey: e.metaKey,
        shiftKey: e.shiftKey,
        altKey: e.altKey,
        isEditableTarget,
      });

      if (!action) return;

      switch (action) {
        case 'SAVE_DASHBOARD': {
          e.preventDefault();
          handleExplicitSave();
          if (
            isEditableTarget &&
            document.activeElement instanceof HTMLElement
          ) {
            document.activeElement.blur();
          }
          break;
        }
        case 'UNDO': {
          e.preventDefault();
          handleUndo();
          break;
        }
        case 'REDO': {
          e.preventDefault();
          handleRedo();
          break;
        }
        case 'ESCAPE': {
          if (shortcutsModalOpen) {
            e.preventDefault();
            setShortcutsModalOpen(false);
          } else if (modalState.open) {
            e.preventDefault();
            setModalState((prev) => ({ ...prev, open: false }));
          } else if (
            isEditableTarget &&
            document.activeElement instanceof HTMLElement
          ) {
            e.preventDefault();
            document.activeElement.blur();
          } else if (searchQuery.trim().length > 0) {
            e.preventDefault();
            setSearchQuery('');
          } else if (saveToastMessage) {
            setSaveToastMessage(null);
          }
          break;
        }
        case 'OPEN_SHORTCUTS_MODAL': {
          e.preventDefault();
          setShortcutsModalOpen((prev) => !prev);
          break;
        }
        case 'FOCUS_SEARCH': {
          e.preventDefault();
          const searchInput = document.querySelector<HTMLInputElement>(
            'input[data-shortcut-search]'
          );
          if (searchInput) {
            searchInput.focus();
            searchInput.select();
          }
          break;
        }
        case 'VIEW_WEEK': {
          e.preventDefault();
          setActiveView('week');
          break;
        }
        case 'VIEW_MONTH': {
          e.preventDefault();
          setActiveView('month');
          break;
        }
        case 'VIEW_YEAR': {
          e.preventDefault();
          setActiveView('year');
          break;
        }
        case 'CYCLE_THEME': {
          e.preventDefault();
          setActiveTheme((prev) => cycleTheme(prev));
          break;
        }
        case 'OPEN_DOWNLOAD_MODAL': {
          e.preventDefault();
          setShortcutsModalOpen(false);
          setModalState({ open: true, tab: 'download' });
          break;
        }
        case 'NAV_PREV_PAGE': {
          const { prev } = getAdjacentRoutes(currentPath);
          if (prev) {
            e.preventDefault();
            handleNavigate(prev.path);
          }
          break;
        }
        case 'NAV_NEXT_PAGE': {
          const { next } = getAdjacentRoutes(currentPath);
          if (next) {
            e.preventDefault();
            handleNavigate(next.path);
          }
          break;
        }
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [
    shortcutsModalOpen,
    modalState.open,
    searchQuery,
    saveToastMessage,
    currentPath,
    handleExplicitSave,
    handleUndo,
    handleRedo,
    handleNavigate,
  ]);

  const { rangeLabel: weekRangeLabel } = useMemo(
    () => formatWeekRangeFromDate(selectedDate),
    [selectedDate]
  );

  const metrics = useMemo(
    () => calculateDashboardMetrics(columns, detailedTasks),
    [columns, detailedTasks]
  );

  const handleDateChange = (newDate: string) => {
    setSelectedDate(newDate);
    const { dayDates } = formatWeekRangeFromDate(newDate);
    setColumns((prev) =>
      prev.map((col, idx) => ({
        ...col,
        dateLabel: dayDates[idx] || col.dateLabel,
      }))
    );
  };

  const triggerSubtleDayConfetti = (origin?: { x: number; y: number }) => {
    try {
      const palette = THEMES[activeTheme];
      void confetti({
        particleCount: 42,
        spread: 60,
        startVelocity: 24,
        gravity: 0.95,
        scalar: 0.85,
        ticks: 150,
        origin: origin ?? { x: 0.5, y: 0.55 },
        colors: [
          palette.checkboxBg,
          ...palette.quadrantColors,
          '#84CA9E',
          '#EFC776',
        ],
        disableForReducedMotion: true,
      });
    } catch {
      // ignore in non-canvas environments
    }
  };

  const handleToggleDailyTask = (
    dayId: string,
    taskId: string,
    origin?: { x: number; y: number }
  ) => {
    const currentDay = columns.find((col) => col.id === dayId);
    if (currentDay) {
      const nextTasks = currentDay.tasks.map((t) =>
        t.id === taskId ? toggleTaskCompletion(t) : t
      );
      if (shouldTriggerDayCompleteConfetti(currentDay.tasks, nextTasks)) {
        triggerSubtleDayConfetti(origin);
      }
    }

    const { nextColumns, nextDetailedTasks } = syncDailyTaskToggle(
      columns,
      detailedTasks,
      dayId,
      taskId
    );
    setBothTaskStates(nextColumns, nextDetailedTasks);
  };

  const handleCycleDailyPriority = (dayId: string, taskId: string) => {
    const { nextColumns, nextDetailedTasks } = syncDailyTaskPriority(
      columns,
      detailedTasks,
      dayId,
      taskId
    );
    setBothTaskStates(nextColumns, nextDetailedTasks);
  };

  const handleCycleDailyCategory = (dayId: string, taskId: string) => {
    const { nextColumns, nextDetailedTasks } = syncDailyTaskCategory(
      columns,
      detailedTasks,
      dayId,
      taskId
    );
    setBothTaskStates(nextColumns, nextDetailedTasks);
  };

  const handleUpdateDailyTaskText = (
    dayId: string,
    taskId: string,
    text: string
  ) => {
    const { nextColumns, nextDetailedTasks } = syncDailyTaskText(
      columns,
      detailedTasks,
      dayId,
      taskId,
      text
    );
    setBothTaskStates(nextColumns, nextDetailedTasks);
  };

  const handleUpdateDailyTaskNotes = (
    dayId: string,
    taskId: string,
    notes: string
  ) => {
    const cleanNotes = sanitizeTaskNotes(notes);
    setColumns((prev) => updateDailyTaskNotes(prev, dayId, taskId, cleanNotes));
  };

  const handleReorderOrMoveDailyTask = (
    activeTaskId: string,
    overId: string
  ) => {
    const nextColumns = reorderOrMoveDailyTask(columns, activeTaskId, overId);
    for (let i = 0; i < nextColumns.length; i++) {
      if (
        shouldTriggerDayCompleteConfetti(
          columns[i].tasks,
          nextColumns[i].tasks
        )
      ) {
        triggerSubtleDayConfetti();
        break;
      }
    }
    setColumns(nextColumns);
  };

  const handleResetWeek = () => {
    const hasAnyTasks = columns.some((col) =>
      col.tasks.some((t) => t.text.trim().length > 0)
    );
    if (hasAnyTasks) {
      setColumns(clearWeekTasks(columns));
    } else {
      setColumns(createInitialWeekColumns());
    }
  };

  const handleClearCompletedTasks = () => {
    setColumns((prev) => clearCompletedWeekTasks(prev));
    if (activeView === 'month') {
      setMonthlyGoals((prev) => clearDetailedTasksByCompletion(prev, 'completed'));
    } else if (activeView === 'year') {
      setYearlyGoals((prev) => clearDetailedTasksByCompletion(prev, 'completed'));
    }
  };

  const handleClearPendingTasks = () => {
    setColumns((prev) => clearPendingWeekTasks(prev));
    if (activeView === 'month') {
      setMonthlyGoals((prev) => clearDetailedTasksByCompletion(prev, 'pending'));
    } else if (activeView === 'year') {
      setYearlyGoals((prev) => clearDetailedTasksByCompletion(prev, 'pending'));
    }
  };

  const handleToggleDetailedTask = (taskId: string) => {
    const { nextDetailedTasks, nextColumns } = syncDetailedTaskToggle(
      detailedTasks,
      columns,
      taskId
    );

    const link = DETAILED_DAILY_TASK_LINKS.find(
      (l) => l.detailedTaskId === taskId
    );
    if (link) {
      const prevCol = columns.find((c) => c.id === link.dayId);
      const nextCol = nextColumns.find((c) => c.id === link.dayId);
      if (
        prevCol &&
        nextCol &&
        shouldTriggerDayCompleteConfetti(prevCol.tasks, nextCol.tasks)
      ) {
        triggerSubtleDayConfetti();
      }
    }

    setBothTaskStates(nextColumns, nextDetailedTasks);
  };

  const handleCycleDetailedPriority = (taskId: string) => {
    const { nextDetailedTasks, nextColumns } = syncDetailedTaskPriority(
      detailedTasks,
      columns,
      taskId
    );
    setBothTaskStates(nextColumns, nextDetailedTasks);
  };

  const handleCycleDetailedStatus = (taskId: string) => {
    const target = detailedTasks.find((t) => t.id === taskId);
    const nextStatus = target ? cycleStatus(target.status) : 'Done';
    const { nextDetailedTasks, nextColumns } = syncDetailedTaskStatus(
      detailedTasks,
      columns,
      taskId,
      nextStatus
    );

    const link = DETAILED_DAILY_TASK_LINKS.find(
      (l) => l.detailedTaskId === taskId
    );
    if (link) {
      const prevCol = columns.find((c) => c.id === link.dayId);
      const nextCol = nextColumns.find((c) => c.id === link.dayId);
      if (
        prevCol &&
        nextCol &&
        shouldTriggerDayCompleteConfetti(prevCol.tasks, nextCol.tasks)
      ) {
        triggerSubtleDayConfetti();
      }
    }

    setBothTaskStates(nextColumns, nextDetailedTasks);
  };

  const handleCycleDetailedCategory = (taskId: string) => {
    const { nextDetailedTasks, nextColumns } = syncDetailedTaskCategory(
      detailedTasks,
      columns,
      taskId
    );
    setBothTaskStates(nextColumns, nextDetailedTasks);
  };

  const handleUpdateDetailedText = (taskId: string, text: string) => {
    const { nextDetailedTasks, nextColumns } = syncDetailedTaskText(
      detailedTasks,
      columns,
      taskId,
      text
    );
    setBothTaskStates(nextColumns, nextDetailedTasks);
  };

  const handleToggleGoalTask = (mode: 'month' | 'year', taskId: string) => {
    const setter = mode === 'month' ? setMonthlyGoals : setYearlyGoals;
    setter((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        const completed = !t.completed;
        return {
          ...t,
          completed,
          status: completed ? 'Done' : t.status === 'Done' ? 'To Do' : t.status,
        };
      })
    );
  };

  const handleCycleGoalPriority = (mode: 'month' | 'year', taskId: string) => {
    const setter = mode === 'month' ? setMonthlyGoals : setYearlyGoals;
    setter((prev) =>
      prev.map((t) =>
        t.id === taskId ? { ...t, priority: cyclePriority(t.priority) } : t
      )
    );
  };

  const handleCycleGoalStatus = (mode: 'month' | 'year', taskId: string) => {
    const setter = mode === 'month' ? setMonthlyGoals : setYearlyGoals;
    setter((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        const nextStatus = updateTaskStatus(t);
        return {
          ...t,
          status: nextStatus.status,
          completed: nextStatus.completed,
        };
      })
    );
  };

  const handleCycleGoalCategory = (mode: 'month' | 'year', taskId: string) => {
    const setter = mode === 'month' ? setMonthlyGoals : setYearlyGoals;
    setter((prev) =>
      prev.map((t) =>
        t.id === taskId ? { ...t, category: cycleCategory(t.category) } : t
      )
    );
  };

  const handleUpdateGoalText = (
    mode: 'month' | 'year',
    taskId: string,
    text: string
  ) => {
    const cleanText = sanitizeTaskText(text);
    const setter = mode === 'month' ? setMonthlyGoals : setYearlyGoals;
    setter((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, text: cleanText } : t))
    );
  };

  const handleExportCsv = () => {
    const csvContent = generateCsvExport(columns);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'weekly-todo-tracker.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const sharedPageProps: SharedDashboardPageProps = {
    columns,
    detailedTasks,
    monthlyGoals,
    yearlyGoals,
    activeTheme,
    activeView,
    selectedDate,
    weekRangeLabel,
    searchQuery: sanitizeTaskText(searchQuery, 120),
    metrics,
    onSearchQueryChange: (q) => setSearchQuery(sanitizeTaskText(q, 120)),
    onSelectTheme: setActiveTheme,
    onSelectView: setActiveView,
    onDateChange: handleDateChange,
    onToggleDailyTask: handleToggleDailyTask,
    onCycleDailyPriority: handleCycleDailyPriority,
    onCycleDailyCategory: handleCycleDailyCategory,
    onUpdateDailyTaskText: handleUpdateDailyTaskText,
    onUpdateDailyTaskNotes: handleUpdateDailyTaskNotes,
    onReorderOrMoveDailyTask: handleReorderOrMoveDailyTask,
    onResetWeek: handleResetWeek,
    onClearCompletedTasks: handleClearCompletedTasks,
    onClearPendingTasks: handleClearPendingTasks,
    onToggleDetailedTask: handleToggleDetailedTask,
    onCycleDetailedPriority: handleCycleDetailedPriority,
    onCycleDetailedStatus: handleCycleDetailedStatus,
    onCycleDetailedCategory: handleCycleDetailedCategory,
    onUpdateDetailedText: handleUpdateDetailedText,
    onToggleGoalTask: handleToggleGoalTask,
    onCycleGoalPriority: handleCycleGoalPriority,
    onCycleGoalStatus: handleCycleGoalStatus,
    onCycleGoalCategory: handleCycleGoalCategory,
    onUpdateGoalText: handleUpdateGoalText,
    onExportCsv: handleExportCsv,
    onOpenModal: (tab) => setModalState({ open: true, tab }),
    onOpenShortcutsModal: () => setShortcutsModalOpen(true),
    onQuickSave: () => handleExplicitSave(),
    onNavigate: handleNavigate,
  };

  const renderActivePage = () => {
    if (isNotFoundRoute) {
      return <NotFoundPage onNavigate={handleNavigate} />;
    }
    switch (currentPath) {
      case '/':
        return <DashboardPage {...sharedPageProps} />;
      case '/how-it-works':
        return <HowItWorksPage {...sharedPageProps} />;
      case '/daily-columns':
        return <DailyColumnsPage {...sharedPageProps} />;
      case '/one-click':
        return <OneClickPage {...sharedPageProps} />;
      case '/live-progress':
        return <LiveProgressPage {...sharedPageProps} />;
      case '/color-themes':
        return <ColorThemesPage {...sharedPageProps} />;
      case '/monthly-yearly':
        return <MonthlyYearlyPage {...sharedPageProps} />;
      case '/built-to-reuse':
        return <BuiltToReusePage {...sharedPageProps} />;
      case '/spreadsheet':
        return <SpreadsheetPage {...sharedPageProps} />;
      case '/everything-you-get':
        return <EverythingYouGetPage {...sharedPageProps} />;
      default:
        return <DashboardPage {...sharedPageProps} />;
    }
  };

  return (
    <div className="min-h-dvh flex flex-col radial-stage-bg text-[#2F2B28]">
      <a href="#main-content" className="skip-to-content">
        Skip to main content
      </a>

      <Navbar
        currentPath={currentPath}
        onNavigate={handleNavigate}
        onOpenDownloadModal={() =>
          setModalState({ open: true, tab: 'download' })
        }
        onOpenShortcutsModal={() => setShortcutsModalOpen(true)}
        onUndo={handleUndo}
        onRedo={handleRedo}
        canUndo={canUndo}
        canRedo={canRedo}
      />

      <main
        id="main-content"
        tabIndex={-1}
        className={`flex-1 flex flex-col focus:outline-none ${
          currentPath === '/' ? 'overflow-hidden max-h-[calc(100dvh-var(--navbar-height,57px))]' : ''
        }`}
      >
        {renderActivePage()}
      </main>

      {saveToastMessage && (
        <div
          role="status"
          aria-live="polite"
          data-testid="shortcut-save-toast"
          className="fixed bottom-4 right-4 z-50 flex items-center gap-2 bg-[#2F2B28] text-[#FAF7F2] border border-[#4A433C] px-3.5 py-2 rounded-full shadow-lg text-xs font-bold pointer-events-none"
        >
          <CheckCircle2 className="w-4 h-4 text-[#84CA9E] shrink-0" />
          <span>{saveToastMessage}</span>
          <kbd className="ml-1 px-1.5 py-0.5 text-[10px] font-bold bg-[#433E3A] border border-[#5A534C] rounded text-[#E5DEC9]">
            Ctrl+Enter
          </kbd>
        </div>
      )}

      <KeyboardShortcutsModal
        isOpen={shortcutsModalOpen}
        onClose={() => setShortcutsModalOpen(false)}
        onTriggerSave={() => handleExplicitSave()}
      />

      <DownloadModal
        isOpen={modalState.open}
        initialTab={modalState.tab}
        onClose={() => setModalState((prev) => ({ ...prev, open: false }))}
        columns={columns}
        activeTheme={activeTheme}
        weekRangeLabel={weekRangeLabel}
        onExportCsv={handleExportCsv}
      />
    </div>
  );
}
