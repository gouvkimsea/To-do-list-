import test from 'node:test';
import assert from 'node:assert/strict';
import {
  cyclePriority,
  cycleStatus,
  cycleCategory,
  TASK_CATEGORIES,
  CATEGORY_BADGE_STYLES,
  isValidCategory,
  toggleTaskCompletion,
  updateTaskStatus,
  calculateDayProgress,
  calculateDashboardMetrics,
  createInitialWeekColumns,
  createInitialDetailedTasks,
  createInitialMonthlyGoals,
  createInitialYearlyGoals,
  clearWeekTasks,
  formatWeekRangeFromDate,
  filterDayColumnsByKeyword,
  filterDetailedTasksByKeyword,
  countMatchingTasks,
  formatVoiceTranscript,
  isDayAllDone,
  shouldTriggerDayCompleteConfetti,
  PAGE_ROUTES,
  resolveRoutePath,
  getAdjacentRoutes,
  reorderOrMoveDailyTask,
  buildWeeklyProgressTrends,
  countWeekTasksByCompletion,
  clearCompletedWeekTasks,
  clearPendingWeekTasks,
  updateDailyTaskNotes,
  isKnownRoutePath,
  sanitizeTaskText,
  sanitizeTaskNotes,
  escapeHtml,
  sanitizeCsvCell,
  generateCsvExport,
  generateStandaloneHtmlExport,
  parsePersistedDashboardState,
  cycleTheme,
  KEYBOARD_SHORTCUTS,
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
} from './todoLogic';

test('cyclePriority cycles High -> Med -> Low -> High', () => {
  assert.equal(cyclePriority('High'), 'Med');
  assert.equal(cyclePriority('Med'), 'Low');
  assert.equal(cyclePriority('Low'), 'High');
});

test('cycleStatus cycles To Do -> In Progress -> Done -> To Do', () => {
  assert.equal(cycleStatus('To Do'), 'In Progress');
  assert.equal(cycleStatus('In Progress'), 'Done');
  assert.equal(cycleStatus('Done'), 'To Do');
});

test('cycleCategory cycles through all TASK_CATEGORIES and defines badge styles for each', () => {
  assert.deepEqual(TASK_CATEGORIES, [
    'Work',
    'Personal',
    'Health',
    'Finance',
    'Home',
    'Growth',
  ]);
  assert.equal(cycleCategory('Work'), 'Personal');
  assert.equal(cycleCategory('Personal'), 'Health');
  assert.equal(cycleCategory('Health'), 'Finance');
  assert.equal(cycleCategory('Finance'), 'Home');
  assert.equal(cycleCategory('Home'), 'Growth');
  assert.equal(cycleCategory('Growth'), 'Work');

  for (const cat of TASK_CATEGORIES) {
    assert.equal(isValidCategory(cat), true);
    assert.equal(Boolean(CATEGORY_BADGE_STYLES[cat]?.bg), true);
    assert.equal(Boolean(CATEGORY_BADGE_STYLES[cat]?.text), true);
    assert.equal(Boolean(CATEGORY_BADGE_STYLES[cat]?.border), true);
  }
  assert.equal(isValidCategory('UnknownCategory'), false);
});

test('toggleTaskCompletion syncs status with completed boolean', () => {
  const initial = {
    id: '1',
    text: 'Write Q2 report',
    completed: false,
    priority: 'High' as const,
    status: 'In Progress' as const,
    category: 'Work' as const,
  };
  const checked = toggleTaskCompletion(initial);
  assert.equal(checked.completed, true);
  assert.equal(checked.status, 'Done');
  assert.equal(checked.category, 'Work');

  const unchecked = toggleTaskCompletion(checked);
  assert.equal(unchecked.completed, false);
  assert.equal(unchecked.status, 'To Do');
});

test('updateTaskStatus cycles status and updates completed flag', () => {
  const initial = {
    id: '1',
    text: 'Plan social media posts',
    completed: false,
    priority: 'Low' as const,
    status: 'To Do' as const,
    category: 'Work' as const,
  };
  const inProgress = updateTaskStatus(initial);
  assert.equal(inProgress.status, 'In Progress');
  assert.equal(inProgress.completed, false);

  const done = updateTaskStatus(inProgress);
  assert.equal(done.status, 'Done');
  assert.equal(done.completed, true);
});

test('calculateDayProgress ignores blank slots and computes exact fraction', () => {
  const columns = createInitialWeekColumns();
  const mondayProgress = calculateDayProgress(columns[0].tasks);
  assert.equal(mondayProgress.completed, 4);
  assert.equal(mondayProgress.total, 4);
  assert.equal(mondayProgress.percentage, 100);
  assert.equal(mondayProgress.fractionLabel, '4/4');
});

test('calculateDashboardMetrics matches reference 45% (10 of 22 tasks) and daily breakdown', () => {
  const columns = createInitialWeekColumns();
  const detailed = createInitialDetailedTasks();
  const metrics = calculateDashboardMetrics(columns, detailed);
  assert.equal(metrics.totalTasks, 22);
  assert.equal(metrics.completedTasks, 10);
  assert.equal(metrics.completionPercentage, 45);
  assert.equal(metrics.dailyProgress[0].percentage, 100); // Mon
  assert.equal(metrics.dailyProgress[1].percentage, 33);  // Tue
  assert.equal(metrics.dailyProgress[2].percentage, 25);  // Wed
  assert.equal(metrics.dailyProgress[3].percentage, 33);  // Thu
  assert.equal(metrics.dailyProgress[4].percentage, 33);  // Fri
  assert.equal(metrics.dailyProgress[5].percentage, 50);  // Sat
  assert.equal(metrics.dailyProgress[6].percentage, 33);  // Sun
  assert.equal(metrics.byPriority.High, 8);
  assert.equal(metrics.byPriority.Med, 10);
  assert.equal(metrics.byPriority.Low, 14);
  assert.equal(metrics.byStatus['To Do'], 12);
  assert.equal(metrics.byStatus['In Progress'], 5);
  assert.equal(metrics.byStatus.Done, 15);
});

test('clearWeekTasks resets all tasks to empty while preserving 7 columns', () => {
  const columns = createInitialWeekColumns();
  const cleared = clearWeekTasks(columns);
  assert.equal(cleared.length, 7);
  const metrics = calculateDashboardMetrics(cleared, []);
  assert.equal(metrics.totalTasks, 0);
  assert.equal(metrics.completedTasks, 0);
  assert.equal(metrics.completionPercentage, 0);
});

test('formatWeekRangeFromDate computes Monday-Sunday range for 2026-06-11', () => {
  const { rangeLabel, dayDates } = formatWeekRangeFromDate('2026-06-11');
  assert.equal(rangeLabel, 'Week of Jun 8 – Jun 14');
  assert.equal(dayDates[0], 'Jun 8');
  assert.equal(dayDates[3], 'Jun 11');
  assert.equal(dayDates[6], 'Jun 14');
});

test('filterDayColumnsByKeyword filters daily tasks in real-time by keyword or category', () => {
  const columns = createInitialWeekColumns();
  const filtered = filterDayColumnsByKeyword(columns, 'report');
  assert.equal(filtered[0].tasks.length, 0); // Monday has no "report"
  assert.equal(filtered[1].tasks.length, 1); // Tuesday: "Write Q2 report"
  assert.equal(filtered[1].tasks[0].text, 'Write Q2 report');
  assert.equal(filtered[3].tasks.length, 1); // Thursday: "Submit expense report"
  assert.equal(filtered[3].tasks[0].text, 'Submit expense report');

  // Filtering by category name ("Finance") matches Thursday's expense report task
  const byCategory = filterDayColumnsByKeyword(columns, 'finance');
  assert.equal(byCategory[3].tasks.length, 1);
  assert.equal(byCategory[3].tasks[0].id, 'thu-2');
  assert.equal(byCategory[3].tasks[0].category, 'Finance');
});

test('filterDetailedTasksByKeyword filters monthly and yearly tasks by keyword', () => {
  const monthly = createInitialMonthlyGoals();
  const yearly = createInitialYearlyGoals();

  const filteredMonthly = filterDetailedTasksByKeyword(monthly, 'budget');
  assert.equal(filteredMonthly.length, 1);
  assert.equal(filteredMonthly[0].text, 'Quarterly budget review');

  const filteredYearly = filterDetailedTasksByKeyword(yearly, 'marathon');
  assert.equal(filteredYearly.length, 1);
  assert.equal(filteredYearly[0].text, 'Run a half marathon');
});

test('countMatchingTasks returns accurate match counts across weekly, monthly, and yearly views', () => {
  const columns = createInitialWeekColumns();
  const monthly = createInitialMonthlyGoals();
  const yearly = createInitialYearlyGoals();

  const counts = countMatchingTasks(columns, monthly, yearly, 'book');
  // Weekly has "Read new design book" (1), Monthly has "Read 2 books this month" (1), Yearly has "Read 24 books" (1)
  assert.equal(counts.weeklyMatches, 1);
  assert.equal(counts.monthlyMatches, 1);
  assert.equal(counts.yearlyMatches, 1);
  assert.equal(counts.totalMatches, 3);
});

test('formatVoiceTranscript capitalizes dictated task for empty slot and appends for existing text', () => {
  assert.equal(
    formatVoiceTranscript('', 'book flight to Tokyo.'),
    'Book flight to Tokyo'
  );
  assert.equal(
    formatVoiceTranscript('Write Q2 report', 'by Friday.'),
    'Write Q2 report by Friday'
  );
});

test('shouldTriggerDayCompleteConfetti triggers only when day transitions from incomplete to all Done', () => {
  const columns = createInitialWeekColumns();
  // Saturday has 2 active tasks: sat-1 (completed: true), sat-2 (completed: false)
  const satBefore = columns[5].tasks;
  assert.equal(isDayAllDone(satBefore), false);

  const satAfter = satBefore.map((t) =>
    t.id === 'sat-2' ? toggleTaskCompletion(t) : t
  );
  assert.equal(isDayAllDone(satAfter), true);
  assert.equal(shouldTriggerDayCompleteConfetti(satBefore, satAfter), true);

  // Toggling when already all done or unchecking does not trigger confetti
  assert.equal(shouldTriggerDayCompleteConfetti(satAfter, satAfter), false);
  assert.equal(shouldTriggerDayCompleteConfetti(satAfter, satBefore), false);

  // Empty day column does not count as all done
  const emptyDay = clearWeekTasks(columns)[0].tasks;
  assert.equal(isDayAllDone(emptyDay), false);
});

test('resolveRoutePath and getAdjacentRoutes map all 10 section pages accurately', () => {
  assert.equal(PAGE_ROUTES.length, 10);
  assert.equal(resolveRoutePath('/'), '/');
  assert.equal(resolveRoutePath('/dashboard'), '/');
  assert.equal(resolveRoutePath('/how-it-works/'), '/how-it-works');
  assert.equal(resolveRoutePath('/daily-columns'), '/daily-columns');
  assert.equal(resolveRoutePath('/one-click'), '/one-click');
  assert.equal(resolveRoutePath('/live-progress'), '/live-progress');
  assert.equal(resolveRoutePath('/color-themes'), '/color-themes');
  assert.equal(resolveRoutePath('/monthly-yearly'), '/monthly-yearly');
  assert.equal(resolveRoutePath('/built-to-reuse'), '/built-to-reuse');
  assert.equal(resolveRoutePath('/spreadsheet'), '/spreadsheet');
  assert.equal(resolveRoutePath('/everything-you-get'), '/everything-you-get');
  assert.equal(resolveRoutePath('/non-existent-route'), '/');

  const firstAdj = getAdjacentRoutes('/');
  assert.equal(firstAdj.prev, null);
  assert.equal(firstAdj.next?.path, '/how-it-works');

  const lastAdj = getAdjacentRoutes('/everything-you-get');
  assert.equal(lastAdj.prev?.path, '/spreadsheet');
  assert.equal(lastAdj.next, null);
});

test('reorderOrMoveDailyTask reorders tasks within the same day and moves tasks across different days', () => {
  const columns = createInitialWeekColumns();

  // 1. Reorder within Thursday: move thu-1 ("Prepare presentation") to thu-3 ("Exercise - walk dog")
  const reorderedSameDay = reorderOrMoveDailyTask(columns, 'thu-1', 'thu-3');
  assert.equal(reorderedSameDay[3].tasks[0].id, 'thu-2');
  assert.equal(reorderedSameDay[3].tasks[1].id, 'thu-3');
  assert.equal(reorderedSameDay[3].tasks[2].id, 'thu-1');

  // 2. Move across days: move thu-1 ("Prepare presentation") to Friday before fri-1 ("Clean bathroom")
  const movedCrossDay = reorderOrMoveDailyTask(columns, 'thu-1', 'fri-1');
  const thursdayTasks = movedCrossDay[3].tasks;
  const fridayTasks = movedCrossDay[4].tasks;

  assert.equal(thursdayTasks.some((t) => t.id === 'thu-1'), false);
  assert.equal(thursdayTasks.length, 6);
  assert.equal(fridayTasks[0].id, 'thu-1');
  assert.equal(fridayTasks[0].text, 'Prepare presentation');
  assert.equal(fridayTasks[1].id, 'fri-1');
  assert.equal(fridayTasks.length, 6);
});

test('buildWeeklyProgressTrends returns 4 weeks of completed vs pending ratios with live current week stats', () => {
  const columns = createInitialWeekColumns();
  const trends = buildWeeklyProgressTrends(columns, '2026-06-11');
  assert.equal(trends.length, 4);
  assert.equal(trends[0].weekLabel, '3 Wks Ago');
  assert.equal(trends[0].dateRange, 'May 18 – May 24');
  assert.equal(trends[3].weekLabel, 'This Week');
  assert.equal(trends[3].dateRange, 'Jun 8 – Jun 14');
  assert.equal(trends[3].completed, 10);
  assert.equal(trends[3].pending, 12);
  assert.equal(trends[3].total, 22);
  assert.equal(trends[3].completionRate, 45);
  assert.equal(trends[3].isCurrentWeek, true);
});

test('clearCompletedWeekTasks removes all completed tasks and compacts pending tasks', () => {
  const columns = createInitialWeekColumns();
  const initialCounts = countWeekTasksByCompletion(columns);
  assert.equal(initialCounts.completedCount, 10);
  assert.equal(initialCounts.pendingCount, 12);

  const afterClearCompleted = clearCompletedWeekTasks(columns);
  const nextCounts = countWeekTasksByCompletion(afterClearCompleted);
  assert.equal(nextCounts.completedCount, 0);
  assert.equal(nextCounts.pendingCount, 12);
  assert.equal(nextCounts.totalCount, 12);

  // Tuesday had 1 completed ("Grocery shopping") + 2 pending ("Write Q2 report", "Review pull requests")
  assert.equal(afterClearCompleted[1].tasks[0].text, 'Write Q2 report');
  assert.equal(afterClearCompleted[1].tasks[1].text, 'Review pull requests');
  assert.equal(afterClearCompleted[1].tasks[2].text, '');
  assert.equal(afterClearCompleted[1].tasks.length, 6);

  // Every task ID across all 7 columns must remain strictly unique
  const allIds = afterClearCompleted.flatMap((c) => c.tasks.map((t) => t.id));
  assert.equal(new Set(allIds).size, 42);
});

test('clearPendingWeekTasks removes all pending tasks and compacts completed tasks', () => {
  const columns = createInitialWeekColumns();
  const afterClearPending = clearPendingWeekTasks(columns);
  const nextCounts = countWeekTasksByCompletion(afterClearPending);

  assert.equal(nextCounts.pendingCount, 0);
  assert.equal(nextCounts.completedCount, 10);
  assert.equal(nextCounts.totalCount, 10);

  // Monday originally had 4 completed tasks
  assert.equal(afterClearPending[0].tasks[0].text, 'Check emails');
  assert.equal(afterClearPending[0].tasks[0].completed, true);
  assert.equal(afterClearPending[0].tasks[1].text, 'Team standup');
  assert.equal(afterClearPending[0].tasks[1].completed, true);
  assert.equal(afterClearPending[0].tasks[2].text, 'Client follow-up');
  assert.equal(afterClearPending[0].tasks[2].completed, true);
  assert.equal(afterClearPending[0].tasks[3].text, 'Review inbox');
  assert.equal(afterClearPending[0].tasks[3].completed, true);
  assert.equal(afterClearPending[0].tasks.length, 6);

  const allIds = afterClearPending.flatMap((c) => c.tasks.map((t) => t.id));
  assert.equal(new Set(allIds).size, 42);
});

test('updateDailyTaskNotes updates task notes and preserves notes across search and bulk clear', () => {
  const columns = createInitialWeekColumns();
  assert.equal(
    columns[3].tasks[0].notes,
    'Include Q2 metrics slide and product roadmap timeline'
  );

  const updated = updateDailyTaskNotes(
    columns,
    'thu',
    'thu-3',
    'Take the scenic park trail for 45 mins'
  );
  assert.equal(
    updated[3].tasks[2].notes,
    'Take the scenic park trail for 45 mins'
  );

  // Searching by note content matches the task
  const matchedByNote = filterDayColumnsByKeyword(updated, 'scenic park');
  assert.equal(matchedByNote[3].tasks.length, 1);
  assert.equal(matchedByNote[3].tasks[0].id, 'thu-3');

  // Clearing completed tasks preserves notes on pending tasks
  const afterClearCompleted = clearCompletedWeekTasks(updated);
  assert.equal(
    afterClearCompleted[3].tasks[0].notes,
    'Include Q2 metrics slide and product roadmap timeline'
  );
  assert.equal(
    afterClearCompleted[3].tasks[1].notes,
    'Take the scenic park trail for 45 mins'
  );
  assert.equal(afterClearCompleted[3].tasks[2].notes, '');
});

test('isKnownRoutePath and PAGE_ROUTES validate known routes vs 404 and include unique SEO descriptions', () => {
  assert.equal(isKnownRoutePath('/'), true);
  assert.equal(isKnownRoutePath('/how-it-works'), true);
  assert.equal(isKnownRoutePath('/daily-columns'), true);
  assert.equal(isKnownRoutePath('/everything-you-get/'), true);
  assert.equal(isKnownRoutePath('/unknown-404-route'), false);
  assert.equal(isKnownRoutePath('/settings/profile'), false);

  const descriptions = PAGE_ROUTES.map((r) => r.description.trim());
  assert.equal(descriptions.every((d) => d.length >= 40), true);
  assert.equal(new Set(descriptions).size, PAGE_ROUTES.length);
});

test('sanitizeTaskText, sanitizeTaskNotes, and escapeHtml strip control chars and prevent XSS', () => {
  assert.equal(
    sanitizeTaskText('Hello\u0000World\u0007', 20),
    'HelloWorld'
  );
  assert.equal(sanitizeTaskText('a'.repeat(300), 240).length, 240);
  assert.equal(sanitizeTaskNotes('b'.repeat(1200), 1000).length, 1000);

  const xssPayload = '<script>alert("xss")</script>&\'';
  const escaped = escapeHtml(xssPayload);
  assert.equal(
    escaped,
    '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;&amp;&#39;'
  );

  const columns = createInitialWeekColumns();
  columns[0].tasks[0].text = '<img src=x onerror="alert(1)">';
  columns[0].tasks[0].notes = '<script>evil()</script>';
  const html = generateStandaloneHtmlExport(
    columns,
    'terracotta',
    'Week of Jun 8 – Jun 14'
  );
  assert.equal(html.includes('<script>evil()</script>'), false);
  assert.equal(html.includes('<img src=x onerror="alert(1)">'), false);
  assert.equal(
    html.includes('&lt;img src=x onerror=&quot;alert(1)&quot;&gt;'),
    true
  );
});

test('sanitizeCsvCell and generateCsvExport guard against CSV formula injection and escape quotes', () => {
  assert.equal(sanitizeCsvCell('=SUM(A1:A5)'), `"'=SUM(A1:A5)"`);
  assert.equal(sanitizeCsvCell('+cmd|\' /C calc\'!A0'), `"'+cmd|' /C calc'!A0"`);
  assert.equal(sanitizeCsvCell('Review "Q2" deck'), `"Review ""Q2"" deck"`);

  const columns = createInitialWeekColumns();
  const csv = generateCsvExport(columns);
  assert.equal(csv.includes('"Monday (Jun 8)"'), true);
  assert.equal(csv.includes('[DONE] Check emails (High)'), true);
});

test('parsePersistedDashboardState recovers gracefully from corrupted localStorage and preserves valid state including category', () => {
  const recoveredNull = parsePersistedDashboardState(null);
  assert.equal(recoveredNull.columns.length, 7);
  assert.equal(recoveredNull.activeTheme, 'terracotta');

  const recoveredCorrupt = parsePersistedDashboardState('{broken json');
  assert.equal(recoveredCorrupt.columns.length, 7);
  assert.equal(recoveredCorrupt.activeTheme, 'terracotta');

  const recoveredInvalidShape = parsePersistedDashboardState(
    JSON.stringify({ columns: 'not-an-array', activeTheme: 'invalid-theme' })
  );
  assert.equal(recoveredInvalidShape.columns.length, 7);
  assert.equal(recoveredInvalidShape.activeTheme, 'terracotta');

  const validColumns = createInitialWeekColumns();
  validColumns[0].tasks[0].text = 'Custom persisted task';
  validColumns[0].tasks[0].category = 'Finance';
  const savedValid = parsePersistedDashboardState(
    JSON.stringify({
      columns: validColumns,
      activeTheme: 'lavender',
    })
  );
  assert.equal(savedValid.columns[0].tasks[0].text, 'Custom persisted task');
  assert.equal(savedValid.columns[0].tasks[0].category, 'Finance');
  assert.equal(savedValid.activeTheme, 'lavender');
});

test('cycleTheme cycles through all 4 dashboard color themes in order', () => {
  assert.equal(cycleTheme('terracotta'), 'candy');
  assert.equal(cycleTheme('candy'), 'lavender');
  assert.equal(cycleTheme('lavender'), 'neutral');
  assert.equal(cycleTheme('neutral'), 'terracotta');
});

test('resolveKeyboardShortcutAction resolves global, modal, and editable-target shortcuts accurately', () => {
  assert.equal(KEYBOARD_SHORTCUTS.length >= 10, true);

  // Ctrl+Enter and Cmd+Enter trigger SAVE_DASHBOARD even inside editable inputs
  assert.equal(
    resolveKeyboardShortcutAction({
      key: 'Enter',
      ctrlKey: true,
      isEditableTarget: true,
    }),
    'SAVE_DASHBOARD'
  );
  assert.equal(
    resolveKeyboardShortcutAction({
      key: 'Enter',
      metaKey: true,
      isEditableTarget: false,
    }),
    'SAVE_DASHBOARD'
  );
  assert.equal(
    resolveKeyboardShortcutAction({
      key: 's',
      ctrlKey: true,
      isEditableTarget: true,
    }),
    'SAVE_DASHBOARD'
  );

  // Escape always resolves to ESCAPE
  assert.equal(
    resolveKeyboardShortcutAction({
      key: 'Escape',
      isEditableTarget: true,
    }),
    'ESCAPE'
  );

  // Single-key shortcuts work when not in editable input, and are ignored when typing in an input
  assert.equal(
    resolveKeyboardShortcutAction({ key: '?', isEditableTarget: false }),
    'OPEN_SHORTCUTS_MODAL'
  );
  assert.equal(
    resolveKeyboardShortcutAction({ key: '?', isEditableTarget: true }),
    null
  );
  assert.equal(
    resolveKeyboardShortcutAction({
      key: '/',
      ctrlKey: true,
      isEditableTarget: true,
    }),
    'OPEN_SHORTCUTS_MODAL'
  );

  assert.equal(
    resolveKeyboardShortcutAction({ key: '/', isEditableTarget: false }),
    'FOCUS_SEARCH'
  );
  assert.equal(
    resolveKeyboardShortcutAction({ key: '/', isEditableTarget: true }),
    null
  );
  assert.equal(
    resolveKeyboardShortcutAction({
      key: 'k',
      ctrlKey: true,
      isEditableTarget: true,
    }),
    'FOCUS_SEARCH'
  );

  // View switching 1, 2, 3 and theme cycling 't'
  assert.equal(
    resolveKeyboardShortcutAction({ key: '1', isEditableTarget: false }),
    'VIEW_WEEK'
  );
  assert.equal(
    resolveKeyboardShortcutAction({ key: '2', isEditableTarget: false }),
    'VIEW_MONTH'
  );
  assert.equal(
    resolveKeyboardShortcutAction({ key: '3', isEditableTarget: false }),
    'VIEW_YEAR'
  );
  assert.equal(
    resolveKeyboardShortcutAction({ key: '1', isEditableTarget: true }),
    null
  );
  assert.equal(
    resolveKeyboardShortcutAction({ key: 't', isEditableTarget: false }),
    'CYCLE_THEME'
  );
  assert.equal(
    resolveKeyboardShortcutAction({ key: 't', isEditableTarget: true }),
    null
  );
  assert.equal(
    resolveKeyboardShortcutAction({
      key: 't',
      altKey: true,
      isEditableTarget: true,
    }),
    'CYCLE_THEME'
  );

  // Sound toggle shortcut (M key)
  assert.equal(
    resolveKeyboardShortcutAction({ key: 'm', isEditableTarget: false }),
    'TOGGLE_SOUND'
  );
  assert.equal(
    resolveKeyboardShortcutAction({ key: 'M', isEditableTarget: false }),
    'TOGGLE_SOUND'
  );
  assert.equal(
    resolveKeyboardShortcutAction({ key: 'm', isEditableTarget: true }),
    null
  );

  // Page navigation via Alt+ArrowLeft / Alt+ArrowRight
  assert.equal(
    resolveKeyboardShortcutAction({
      key: 'ArrowLeft',
      altKey: true,
      isEditableTarget: false,
    }),
    'NAV_PREV_PAGE'
  );
  assert.equal(
    resolveKeyboardShortcutAction({
      key: 'ArrowRight',
      altKey: true,
      isEditableTarget: false,
    }),
    'NAV_NEXT_PAGE'
  );

  // Undo via Ctrl+Z / Cmd+Z when not typing in text inputs
  assert.equal(
    resolveKeyboardShortcutAction({
      key: 'z',
      ctrlKey: true,
      isEditableTarget: false,
    }),
    'UNDO'
  );
  assert.equal(
    resolveKeyboardShortcutAction({
      key: 'z',
      metaKey: true,
      isEditableTarget: false,
    }),
    'UNDO'
  );
  // Preserves native browser input undo when typing
  assert.equal(
    resolveKeyboardShortcutAction({
      key: 'z',
      ctrlKey: true,
      isEditableTarget: true,
    }),
    null
  );

  // Redo via Ctrl+Shift+Z / Cmd+Shift+Z or Ctrl+Y
  assert.equal(
    resolveKeyboardShortcutAction({
      key: 'z',
      ctrlKey: true,
      shiftKey: true,
      isEditableTarget: false,
    }),
    'REDO'
  );
  assert.equal(
    resolveKeyboardShortcutAction({
      key: 'y',
      ctrlKey: true,
      isEditableTarget: false,
    }),
    'REDO'
  );
});

test('syncDetailedTaskToggle synchronizes task state to daily column and updates metrics in real time', () => {
  const initialColumns = createInitialWeekColumns();
  const initialDetailed = createInitialDetailedTasks();

  const metricsBefore = calculateDashboardMetrics(initialColumns, initialDetailed);
  assert.equal(metricsBefore.completionPercentage, 45);
  assert.equal(metricsBefore.completedTasks, 10);
  assert.equal(metricsBefore.totalTasks, 22);

  // Friday before: 1 of 3 tasks completed -> 33%
  const fridayBefore = metricsBefore.dailyProgress.find((d) => d.dayId === 'fri');
  assert.equal(fridayBefore?.percentage, 33);

  // Toggle dt-5 ("Q3 planning session") in detailedTasks -> linked to fri-3 on Friday
  const { nextDetailedTasks, nextColumns } = syncDetailedTaskToggle(
    initialDetailed,
    initialColumns,
    'dt-5'
  );

  const toggledDetailed = nextDetailedTasks.find((t) => t.id === 'dt-5');
  assert.equal(toggledDetailed?.completed, true);
  assert.equal(toggledDetailed?.status, 'Done');

  const friCol = nextColumns.find((c) => c.id === 'fri');
  const linkedDaily = friCol?.tasks.find((t) => t.id === 'fri-3');
  assert.equal(linkedDaily?.completed, true);
  assert.equal(linkedDaily?.status, 'Done');

  // Metrics should immediately update in real time
  const metricsAfter = calculateDashboardMetrics(nextColumns, nextDetailedTasks);
  // 11 of 22 tasks completed -> exactly 50%
  assert.equal(metricsAfter.completionPercentage, 50);
  assert.equal(metricsAfter.completedTasks, 11);
  assert.equal(metricsAfter.totalTasks, 22);

  // Friday after: 2 of 3 tasks completed -> 67%
  const fridayAfter = metricsAfter.dailyProgress.find((d) => d.dayId === 'fri');
  assert.equal(fridayAfter?.percentage, 67);

  // Status breakdown updates: Done increased from 15 to 17 (both detailed & daily item updated), In Progress decreased from 5 to 3
  assert.equal(metricsAfter.byStatus['Done'], 17);
  assert.equal(metricsAfter.byStatus['In Progress'], 3);

  // Toggling dt-5 again uncompletes it and restores 45% / 10 of 22
  const uncheckResult = syncDetailedTaskToggle(
    nextDetailedTasks,
    nextColumns,
    'dt-5'
  );
  const metricsRestored = calculateDashboardMetrics(
    uncheckResult.nextColumns,
    uncheckResult.nextDetailedTasks
  );
  assert.equal(metricsRestored.completionPercentage, 45);
  assert.equal(metricsRestored.completedTasks, 10);
  assert.equal(
    metricsRestored.dailyProgress.find((d) => d.dayId === 'fri')?.percentage,
    33
  );
});

test('syncDailyTaskToggle synchronizes task state to detailed tasks and updates metrics in real time', () => {
  const initialColumns = createInitialWeekColumns();
  const initialDetailed = createInitialDetailedTasks();

  // Toggle wed-4 ("Book dentist appointment") in Wednesday column -> linked to dt-3
  // Wednesday before: 1 of 4 completed (25%)
  const { nextColumns, nextDetailedTasks } = syncDailyTaskToggle(
    initialColumns,
    initialDetailed,
    'wed',
    'wed-4'
  );

  const wedCol = nextColumns.find((c) => c.id === 'wed');
  const linkedDaily = wedCol?.tasks.find((t) => t.id === 'wed-4');
  assert.equal(linkedDaily?.completed, false);
  assert.equal(linkedDaily?.status, 'To Do');

  const linkedDetailed = nextDetailedTasks.find((t) => t.id === 'dt-3');
  assert.equal(linkedDetailed?.completed, false);
  assert.equal(linkedDetailed?.status, 'To Do');

  // Metrics update: completed tasks drop from 10 to 9 -> 41%
  const metricsAfter = calculateDashboardMetrics(nextColumns, nextDetailedTasks);
  assert.equal(metricsAfter.completedTasks, 9);
  assert.equal(metricsAfter.completionPercentage, 41);
  assert.equal(
    metricsAfter.dailyProgress.find((d) => d.dayId === 'wed')?.percentage,
    0
  );
});

test('syncDetailedTaskPriority and syncDailyTaskPriority keep priorities in sync', () => {
  const initialColumns = createInitialWeekColumns();
  const initialDetailed = createInitialDetailedTasks();

  // dt-1 is 'High', linked to mon-3 ('High')
  const { nextDetailedTasks, nextColumns } = syncDetailedTaskPriority(
    initialDetailed,
    initialColumns,
    'dt-1'
  );

  assert.equal(
    nextDetailedTasks.find((t) => t.id === 'dt-1')?.priority,
    'Med'
  );
  assert.equal(
    nextColumns
      .find((c) => c.id === 'mon')
      ?.tasks.find((t) => t.id === 'mon-3')?.priority,
    'Med'
  );

  // Sync back from daily
  const syncedFromDaily = syncDailyTaskPriority(
    nextColumns,
    nextDetailedTasks,
    'mon',
    'mon-3'
  );
  assert.equal(
    syncedFromDaily.nextColumns
      .find((c) => c.id === 'mon')
      ?.tasks.find((t) => t.id === 'mon-3')?.priority,
    'Low'
  );
  assert.equal(
    syncedFromDaily.nextDetailedTasks.find((t) => t.id === 'dt-1')?.priority,
    'Low'
  );
});


