export type Priority = 'High' | 'Med' | 'Low';
export type TaskStatus = 'To Do' | 'In Progress' | 'Done';
export type ThemeId = 'terracotta' | 'candy' | 'lavender' | 'neutral';
export type ViewMode = 'week' | 'month' | 'year';

export type TaskCategory =
  | 'Work'
  | 'Personal'
  | 'Health'
  | 'Finance'
  | 'Home'
  | 'Growth';

export const TASK_CATEGORIES: TaskCategory[] = [
  'Work',
  'Personal',
  'Health',
  'Finance',
  'Home',
  'Growth',
];

export const CATEGORY_BADGE_STYLES: Record<
  TaskCategory,
  { bg: string; text: string; border: string }
> = {
  Work: { bg: '#FCEADE', text: '#9A4E28', border: '#F0CFB8' },
  Personal: { bg: '#EAE4F7', text: '#564385', border: '#D5C9EE' },
  Health: { bg: '#DEF0E5', text: '#2D6A46', border: '#BFE0CC' },
  Finance: { bg: '#FBF0D4', text: '#876015', border: '#EFE0B3' },
  Home: { bg: '#E3EFF8', text: '#2B5B80', border: '#C7DFEF' },
  Growth: { bg: '#F7E3EC', text: '#8C3B61', border: '#EBC5D6' },
};

export interface DailyTask {
  id: string;
  text: string;
  completed: boolean;
  priority: Priority;
  status: TaskStatus;
  category: TaskCategory;
  notes?: string;
}

export interface DayColumn {
  id: string;
  dayName: string;
  dateLabel: string;
  isToday?: boolean;
  tasks: DailyTask[];
}

export interface DetailedTask {
  id: string;
  text: string;
  completed: boolean;
  priority: Priority;
  status: TaskStatus;
  category: TaskCategory;
}

export interface ThemePalette {
  id: ThemeId;
  name: string;
  labelColor: string;
  checkboxBg: string;
  progressFill: string;
  quadrantColors: [string, string, string, string];
  dayHeaders: [string, string, string, string, string, string, string];
}

export const THEMES: Record<ThemeId, ThemePalette> = {
  terracotta: {
    id: 'terracotta',
    name: 'Terracotta',
    labelColor: '#B86B43',
    checkboxBg: '#C87D55',
    progressFill: '#C87D55',
    quadrantColors: ['#E2A88C', '#E9D49B', '#A9C5A0', '#94B4C8'],
    dayHeaders: [
      '#E3AA8E', // Mon
      '#E8BE96', // Tue
      '#E9D39E', // Wed
      '#A8C39F', // Thu
      '#95B3C6', // Fri
      '#C7A2B1', // Sat
      '#D6B597', // Sun
    ],
  },
  candy: {
    id: 'candy',
    name: 'Candy Pastel',
    labelColor: '#D67A98',
    checkboxBg: '#68B694',
    progressFill: '#68B694',
    quadrantColors: ['#F2B5C4', '#F7E39C', '#ACE0C4', '#A3D2F2'],
    dayHeaders: [
      '#F2B8C6',
      '#F6C8A6',
      '#F6E09D',
      '#A8DEC2',
      '#A2CFF0',
      '#C3B6EE',
      '#DBAEEF',
    ],
  },
  lavender: {
    id: 'lavender',
    name: 'Lavender Mist',
    labelColor: '#7D74B8',
    checkboxBg: '#7E8CE0',
    progressFill: '#7E8CE0',
    quadrantColors: ['#C8B6E2', '#B0D4E3', '#A7D7C5', '#E3C4C9'],
    dayHeaders: [
      '#C7B6E2',
      '#B7C4E8',
      '#B0D3E3',
      '#A7D5C4',
      '#C6DEB2',
      '#E1C3C8',
      '#D8B8C4',
    ],
  },
  neutral: {
    id: 'neutral',
    name: 'Soft Neutral',
    labelColor: '#8C7662',
    checkboxBg: '#8C7A6B',
    progressFill: '#8C7A6B',
    quadrantColors: ['#D2C2B2', '#E2DACB', '#BAC6B8', '#CFC3C6'],
    dayHeaders: [
      '#D2C1B0',
      '#DCD0C0',
      '#E2DACB',
      '#BAC6B8',
      '#BDC7CC',
      '#CFC2C5',
      '#D7C7B7',
    ],
  },
};

export function cyclePriority(current: Priority): Priority {
  if (current === 'High') return 'Med';
  if (current === 'Med') return 'Low';
  return 'High';
}

export function cycleStatus(current: TaskStatus): TaskStatus {
  if (current === 'To Do') return 'In Progress';
  if (current === 'In Progress') return 'Done';
  return 'To Do';
}

export function cycleCategory(current: TaskCategory): TaskCategory {
  const idx = TASK_CATEGORIES.indexOf(current);
  if (idx === -1) return 'Work';
  return TASK_CATEGORIES[(idx + 1) % TASK_CATEGORIES.length];
}

export function toggleTaskCompletion<
  T extends { completed: boolean; status: TaskStatus }
>(task: T): T {
  const completed = !task.completed;
  return {
    ...task,
    completed,
    status: completed ? 'Done' : task.status === 'Done' ? 'To Do' : task.status,
  };
}

export function updateTaskStatus<
  T extends { completed: boolean; status: TaskStatus }
>(task: T, nextStatus?: TaskStatus): T {
  const status = nextStatus ?? cycleStatus(task.status);
  return {
    ...task,
    status,
    completed: status === 'Done',
  };
}

export function calculateDayProgress(tasks: DailyTask[]): {
  completed: number;
  total: number;
  percentage: number;
  fractionLabel: string;
} {
  const activeTasks = tasks.filter((t) => t.text.trim().length > 0 && t.text.trim() !== '—');
  const total = activeTasks.length;
  const completed = activeTasks.filter((t) => t.completed).length;
  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);
  return {
    completed,
    total,
    percentage,
    fractionLabel: `${completed}/${total}`,
  };
}

export interface DashboardMetrics {
  totalTasks: number;
  completedTasks: number;
  completionPercentage: number;
  dailyProgress: Array<{
    dayId: string;
    shortName: string;
    completed: number;
    total: number;
    percentage: number;
  }>;
  byPriority: {
    High: number;
    Med: number;
    Low: number;
  };
  byStatus: {
    'To Do': number;
    'In Progress': number;
    Done: number;
  };
}

export function calculateDashboardMetrics(
  columns: DayColumn[],
  extraTasks: DetailedTask[] = []
): DashboardMetrics {
  const dailyProgress = columns.map((col) => {
    const stats = calculateDayProgress(col.tasks);
    return {
      dayId: col.id,
      shortName: col.dayName.slice(0, 3),
      completed: stats.completed,
      total: stats.total,
      percentage: stats.percentage,
    };
  });

  const activeDailyTasks = columns.flatMap((col) =>
    col.tasks.filter((t) => t.text.trim().length > 0 && t.text.trim() !== '—')
  );

  const allTasks: Array<{ completed: boolean; priority: Priority; status: TaskStatus }> = [
    ...activeDailyTasks,
    ...extraTasks.filter((t) => t.text.trim().length > 0),
  ];

  const totalTasks = activeDailyTasks.length;
  const completedTasks = activeDailyTasks.filter((t) => t.completed).length;
  const completionPercentage =
    totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  const byPriority: Record<Priority, number> = {
    High: 0,
    Med: 0,
    Low: 0,
  };

  const byStatus: Record<TaskStatus, number> = {
    'To Do': 0,
    'In Progress': 0,
    Done: 0,
  };

  for (const t of allTasks) {
    byPriority[t.priority] = (byPriority[t.priority] || 0) + 1;
    byStatus[t.status] = (byStatus[t.status] || 0) + 1;
  }

  return {
    totalTasks,
    completedTasks,
    completionPercentage,
    dailyProgress,
    byPriority,
    byStatus,
  };
}

export function formatWeekRangeFromDate(dateStr: string): {
  rangeLabel: string;
  dayDates: string[];
} {
  const parsed = new Date(`${dateStr}T12:00:00`);
  if (Number.isNaN(parsed.getTime())) {
    return {
      rangeLabel: 'Week of Jun 8 – Jun 14',
      dayDates: ['Jun 8', 'Jun 9', 'Jun 10', 'Jun 11', 'Jun 12', 'Jun 13', 'Jun 14'],
    };
  }
  const dayOfWeek = parsed.getDay(); // 0 = Sun, 1 = Mon, ...
  const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const monday = new Date(parsed);
  monday.setDate(parsed.getDate() + diffToMonday);

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const dayDates: string[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    dayDates.push(`${months[d.getMonth()]} ${d.getDate()}`);
  }
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  const rangeLabel = `Week of ${months[monday.getMonth()]} ${monday.getDate()} – ${months[sunday.getMonth()]} ${sunday.getDate()}`;
  return { rangeLabel, dayDates };
}

export function createInitialWeekColumns(): DayColumn[] {
  return [
    {
      id: 'mon',
      dayName: 'Monday',
      dateLabel: 'Jun 8',
      tasks: [
        { id: 'mon-1', text: 'Check emails', completed: true, priority: 'High', status: 'Done', category: 'Work', notes: '' },
        { id: 'mon-2', text: 'Team standup', completed: true, priority: 'Med', status: 'Done', category: 'Work', notes: '' },
        { id: 'mon-3', text: 'Client follow-up', completed: true, priority: 'Med', status: 'Done', category: 'Work', notes: '' },
        { id: 'mon-4', text: 'Review inbox', completed: true, priority: 'Low', status: 'Done', category: 'Work', notes: '' },
        { id: 'mon-5', text: '', completed: false, priority: 'Med', status: 'To Do', category: 'Personal', notes: '' },
        { id: 'mon-6', text: '', completed: false, priority: 'Med', status: 'To Do', category: 'Personal', notes: '' },
      ],
    },
    {
      id: 'tue',
      dayName: 'Tuesday',
      dateLabel: 'Jun 9',
      tasks: [
        { id: 'tue-1', text: 'Write Q2 report', completed: false, priority: 'High', status: 'In Progress', category: 'Work', notes: 'Include revenue breakdown and retention metrics' },
        { id: 'tue-2', text: 'Review pull requests', completed: false, priority: 'Med', status: 'To Do', category: 'Work', notes: '' },
        { id: 'tue-3', text: 'Grocery shopping', completed: true, priority: 'Low', status: 'Done', category: 'Home', notes: '' },
        { id: 'tue-4', text: '', completed: false, priority: 'Med', status: 'To Do', category: 'Personal', notes: '' },
        { id: 'tue-5', text: '', completed: false, priority: 'Med', status: 'To Do', category: 'Personal', notes: '' },
        { id: 'tue-6', text: '', completed: false, priority: 'Med', status: 'To Do', category: 'Personal', notes: '' },
      ],
    },
    {
      id: 'wed',
      dayName: 'Wednesday',
      dateLabel: 'Jun 10',
      tasks: [
        { id: 'wed-1', text: 'Plan social media posts', completed: false, priority: 'Low', status: 'To Do', category: 'Work', notes: '' },
        { id: 'wed-2', text: 'Edit blog post', completed: false, priority: 'Med', status: 'In Progress', category: 'Growth', notes: '' },
        { id: 'wed-3', text: 'Doctor appointment', completed: false, priority: 'High', status: 'To Do', category: 'Health', notes: '' },
        { id: 'wed-4', text: 'Vacuum living room', completed: true, priority: 'Low', status: 'Done', category: 'Home', notes: '' },
        { id: 'wed-5', text: '', completed: false, priority: 'Med', status: 'To Do', category: 'Personal', notes: '' },
        { id: 'wed-6', text: '', completed: false, priority: 'Med', status: 'To Do', category: 'Personal', notes: '' },
      ],
    },
    {
      id: 'thu',
      dayName: 'Thursday',
      dateLabel: 'Jun 11',
      isToday: true,
      tasks: [
        { id: 'thu-1', text: 'Prepare presentation', completed: false, priority: 'High', status: 'In Progress', category: 'Work', notes: 'Include Q2 metrics slide and product roadmap timeline' },
        { id: 'thu-2', text: 'Submit expense report', completed: true, priority: 'Med', status: 'Done', category: 'Finance', notes: '' },
        { id: 'thu-3', text: 'Exercise - walk dog', completed: false, priority: 'Low', status: 'To Do', category: 'Health', notes: '' },
        { id: 'thu-4', text: '', completed: false, priority: 'Med', status: 'To Do', category: 'Personal', notes: '' },
        { id: 'thu-5', text: '', completed: false, priority: 'Med', status: 'To Do', category: 'Personal', notes: '' },
        { id: 'thu-6', text: '', completed: false, priority: 'Med', status: 'To Do', category: 'Personal', notes: '' },
      ],
    },
    {
      id: 'fri',
      dayName: 'Friday',
      dateLabel: 'Jun 12',
      tasks: [
        { id: 'fri-1', text: 'Clean bathroom', completed: false, priority: 'Low', status: 'To Do', category: 'Home', notes: '' },
        { id: 'fri-2', text: 'Read for 30 minutes', completed: true, priority: 'Med', status: 'Done', category: 'Growth', notes: '' },
        { id: 'fri-3', text: 'Q3 planning session', completed: false, priority: 'High', status: 'In Progress', category: 'Work', notes: 'Review OKRs with design and engineering leads' },
        { id: 'fri-4', text: '', completed: false, priority: 'Med', status: 'To Do', category: 'Personal', notes: '' },
        { id: 'fri-5', text: '', completed: false, priority: 'Med', status: 'To Do', category: 'Personal', notes: '' },
        { id: 'fri-6', text: '', completed: false, priority: 'Med', status: 'To Do', category: 'Personal', notes: '' },
      ],
    },
    {
      id: 'sat',
      dayName: 'Saturday',
      dateLabel: 'Jun 13',
      tasks: [
        { id: 'sat-1', text: 'Laundry - fold & put away', completed: true, priority: 'Low', status: 'Done', category: 'Home', notes: '' },
        { id: 'sat-2', text: 'Call parents', completed: false, priority: 'Low', status: 'To Do', category: 'Personal', notes: '' },
        { id: 'sat-3', text: '', completed: false, priority: 'Med', status: 'To Do', category: 'Personal', notes: '' },
        { id: 'sat-4', text: '', completed: false, priority: 'Med', status: 'To Do', category: 'Personal', notes: '' },
        { id: 'sat-5', text: '', completed: false, priority: 'Med', status: 'To Do', category: 'Personal', notes: '' },
        { id: 'sat-6', text: '', completed: false, priority: 'Med', status: 'To Do', category: 'Personal', notes: '' },
      ],
    },
    {
      id: 'sun',
      dayName: 'Sunday',
      dateLabel: 'Jun 14',
      tasks: [
        { id: 'sun-1', text: 'Meal prep for the week', completed: false, priority: 'Med', status: 'To Do', category: 'Health', notes: '' },
        { id: 'sun-2', text: 'Water indoor plants', completed: true, priority: 'Low', status: 'Done', category: 'Home', notes: '' },
        { id: 'sun-3', text: 'Read new design book', completed: false, priority: 'Low', status: 'To Do', category: 'Growth', notes: '' },
        { id: 'sun-4', text: '', completed: false, priority: 'Med', status: 'To Do', category: 'Personal', notes: '' },
        { id: 'sun-5', text: '', completed: false, priority: 'Med', status: 'To Do', category: 'Personal', notes: '' },
        { id: 'sun-6', text: '', completed: false, priority: 'Med', status: 'To Do', category: 'Personal', notes: '' },
      ],
    },
  ];
}

export function createInitialDetailedTasks(): DetailedTask[] {
  return [
    { id: 'dt-1', text: 'Call dentist', completed: true, priority: 'High', status: 'Done', category: 'Finance' },
    { id: 'dt-2', text: 'Renew insurance', completed: false, priority: 'Med', status: 'To Do', category: 'Finance' },
    { id: 'dt-3', text: 'Book dentist appointment', completed: true, priority: 'Low', status: 'Done', category: 'Health' },
    { id: 'dt-4', text: 'Birthday card for friend', completed: false, priority: 'Low', status: 'To Do', category: 'Personal' },
    { id: 'dt-5', text: 'Q3 planning session', completed: false, priority: 'High', status: 'In Progress', category: 'Work' },
    { id: 'dt-6', text: 'Pay utility bills', completed: true, priority: 'High', status: 'Done', category: 'Finance' },
    { id: 'dt-7', text: 'Order groceries', completed: true, priority: 'Low', status: 'Done', category: 'Home' },
    { id: 'dt-8', text: 'Schedule team standup', completed: true, priority: 'Med', status: 'Done', category: 'Work' },
    { id: 'dt-9', text: 'what is that thing', completed: false, priority: 'Med', status: 'To Do', category: 'Work' },
    { id: 'dt-10', text: 'Read new design book', completed: false, priority: 'Low', status: 'To Do', category: 'Growth' },
  ];
}

export interface DetailedDailyTaskLink {
  detailedTaskId: string;
  dayId: string;
  dailyTaskId: string;
}

export const DETAILED_DAILY_TASK_LINKS: DetailedDailyTaskLink[] = [
  { detailedTaskId: 'dt-1', dayId: 'mon', dailyTaskId: 'mon-3' }, // Call dentist <-> Client follow-up / Mon
  { detailedTaskId: 'dt-2', dayId: 'tue', dailyTaskId: 'tue-2' }, // Renew insurance <-> Review pull requests / Tue
  { detailedTaskId: 'dt-3', dayId: 'wed', dailyTaskId: 'wed-4' }, // Book dentist appointment <-> Vacuum living room / Wed
  { detailedTaskId: 'dt-4', dayId: 'sat', dailyTaskId: 'sat-2' }, // Birthday card for friend <-> Call parents / Sat
  { detailedTaskId: 'dt-5', dayId: 'fri', dailyTaskId: 'fri-3' }, // Q3 planning session <-> Q3 planning session / Fri
  { detailedTaskId: 'dt-6', dayId: 'thu', dailyTaskId: 'thu-2' }, // Pay utility bills <-> Submit expense report / Thu
  { detailedTaskId: 'dt-7', dayId: 'tue', dailyTaskId: 'tue-3' }, // Order groceries <-> Grocery shopping / Tue
  { detailedTaskId: 'dt-8', dayId: 'mon', dailyTaskId: 'mon-2' }, // Schedule team standup <-> Team standup / Mon
  { detailedTaskId: 'dt-9', dayId: 'wed', dailyTaskId: 'wed-1' }, // what is that thing <-> Plan social media posts / Wed
  { detailedTaskId: 'dt-10', dayId: 'sun', dailyTaskId: 'sun-3' }, // Read new design book <-> Read new design book / Sun
];

export function syncDetailedTaskToggle(
  detailedTasks: DetailedTask[],
  columns: DayColumn[],
  targetDetailedTaskId: string
): { nextDetailedTasks: DetailedTask[]; nextColumns: DayColumn[] } {
  let nextCompleted = false;
  let nextStatus: TaskStatus = 'Done';

  const nextDetailedTasks = detailedTasks.map((t) => {
    if (t.id !== targetDetailedTaskId) return t;
    const toggled = toggleTaskCompletion(t);
    nextCompleted = toggled.completed;
    nextStatus = toggled.status;
    return toggled;
  });

  const link = DETAILED_DAILY_TASK_LINKS.find(
    (l) => l.detailedTaskId === targetDetailedTaskId
  );

  let nextColumns = columns;
  if (link) {
    nextColumns = columns.map((col) => {
      if (col.id !== link.dayId) return col;
      return {
        ...col,
        tasks: col.tasks.map((task) => {
          if (task.id !== link.dailyTaskId) return task;
          return {
            ...task,
            completed: nextCompleted,
            status: nextStatus,
          };
        }),
      };
    });
  }

  return { nextDetailedTasks, nextColumns };
}

export function syncDailyTaskToggle(
  columns: DayColumn[],
  detailedTasks: DetailedTask[],
  dayId: string,
  targetDailyTaskId: string
): { nextColumns: DayColumn[]; nextDetailedTasks: DetailedTask[] } {
  let nextCompleted = false;
  let nextStatus: TaskStatus = 'Done';

  const nextColumns = columns.map((col) => {
    if (col.id !== dayId) return col;
    return {
      ...col,
      tasks: col.tasks.map((task) => {
        if (task.id !== targetDailyTaskId) return task;
        const toggled = toggleTaskCompletion(task);
        nextCompleted = toggled.completed;
        nextStatus = toggled.status;
        return toggled;
      }),
    };
  });

  const link = DETAILED_DAILY_TASK_LINKS.find(
    (l) => l.dayId === dayId && l.dailyTaskId === targetDailyTaskId
  );

  let nextDetailedTasks = detailedTasks;
  if (link) {
    nextDetailedTasks = detailedTasks.map((task) => {
      if (task.id !== link.detailedTaskId) return task;
      return {
        ...task,
        completed: nextCompleted,
        status: nextStatus,
      };
    });
  }

  return { nextColumns, nextDetailedTasks };
}

export function syncDetailedTaskStatus(
  detailedTasks: DetailedTask[],
  columns: DayColumn[],
  targetDetailedTaskId: string,
  newStatus?: TaskStatus
): { nextDetailedTasks: DetailedTask[]; nextColumns: DayColumn[] } {
  let updatedStatus: TaskStatus = 'Done';
  let updatedCompleted = false;

  const nextDetailedTasks = detailedTasks.map((t) => {
    if (t.id !== targetDetailedTaskId) return t;
    const updated = updateTaskStatus(t, newStatus);
    updatedStatus = updated.status;
    updatedCompleted = updated.completed;
    return updated;
  });

  const link = DETAILED_DAILY_TASK_LINKS.find(
    (l) => l.detailedTaskId === targetDetailedTaskId
  );

  let nextColumns = columns;
  if (link) {
    nextColumns = columns.map((col) => {
      if (col.id !== link.dayId) return col;
      return {
        ...col,
        tasks: col.tasks.map((task) => {
          if (task.id !== link.dailyTaskId) return task;
          return {
            ...task,
            status: updatedStatus,
            completed: updatedCompleted,
          };
        }),
      };
    });
  }

  return { nextDetailedTasks, nextColumns };
}

export function syncDetailedTaskPriority(
  detailedTasks: DetailedTask[],
  columns: DayColumn[],
  targetDetailedTaskId: string
): { nextDetailedTasks: DetailedTask[]; nextColumns: DayColumn[] } {
  let updatedPriority: Priority = 'High';

  const nextDetailedTasks = detailedTasks.map((t) => {
    if (t.id !== targetDetailedTaskId) return t;
    const nextP = cyclePriority(t.priority);
    updatedPriority = nextP;
    return { ...t, priority: nextP };
  });

  const link = DETAILED_DAILY_TASK_LINKS.find(
    (l) => l.detailedTaskId === targetDetailedTaskId
  );

  let nextColumns = columns;
  if (link) {
    nextColumns = columns.map((col) => {
      if (col.id !== link.dayId) return col;
      return {
        ...col,
        tasks: col.tasks.map((task) => {
          if (task.id !== link.dailyTaskId) return task;
          return { ...task, priority: updatedPriority };
        }),
      };
    });
  }

  return { nextDetailedTasks, nextColumns };
}

export function syncDetailedTaskText(
  detailedTasks: DetailedTask[],
  columns: DayColumn[],
  targetDetailedTaskId: string,
  newText: string
): { nextDetailedTasks: DetailedTask[]; nextColumns: DayColumn[] } {
  const clean = sanitizeTaskText(newText);
  const nextDetailedTasks = detailedTasks.map((t) =>
    t.id === targetDetailedTaskId ? { ...t, text: clean } : t
  );

  const link = DETAILED_DAILY_TASK_LINKS.find(
    (l) => l.detailedTaskId === targetDetailedTaskId
  );

  let nextColumns = columns;
  if (link) {
    nextColumns = columns.map((col) => {
      if (col.id !== link.dayId) return col;
      return {
        ...col,
        tasks: col.tasks.map((task) =>
          task.id === link.dailyTaskId ? { ...task, text: clean } : task
        ),
      };
    });
  }

  return { nextDetailedTasks, nextColumns };
}

export function syncDetailedTaskCategory(
  detailedTasks: DetailedTask[],
  columns: DayColumn[],
  targetDetailedTaskId: string
): { nextDetailedTasks: DetailedTask[]; nextColumns: DayColumn[] } {
  let updatedCategory: TaskCategory = 'Work';

  const nextDetailedTasks = detailedTasks.map((t) => {
    if (t.id !== targetDetailedTaskId) return t;
    const nextCat = cycleCategory(t.category);
    updatedCategory = nextCat;
    return { ...t, category: nextCat };
  });

  const link = DETAILED_DAILY_TASK_LINKS.find(
    (l) => l.detailedTaskId === targetDetailedTaskId
  );

  let nextColumns = columns;
  if (link) {
    nextColumns = columns.map((col) => {
      if (col.id !== link.dayId) return col;
      return {
        ...col,
        tasks: col.tasks.map((task) => {
          if (task.id !== link.dailyTaskId) return task;
          return { ...task, category: updatedCategory };
        }),
      };
    });
  }

  return { nextDetailedTasks, nextColumns };
}

export function syncDailyTaskPriority(
  columns: DayColumn[],
  detailedTasks: DetailedTask[],
  dayId: string,
  targetDailyTaskId: string
): { nextColumns: DayColumn[]; nextDetailedTasks: DetailedTask[] } {
  let updatedPriority: Priority = 'High';

  const nextColumns = columns.map((col) => {
    if (col.id !== dayId) return col;
    return {
      ...col,
      tasks: col.tasks.map((task) => {
        if (task.id !== targetDailyTaskId) return task;
        const nextP = cyclePriority(task.priority);
        updatedPriority = nextP;
        return { ...task, priority: nextP };
      }),
    };
  });

  const link = DETAILED_DAILY_TASK_LINKS.find(
    (l) => l.dayId === dayId && l.dailyTaskId === targetDailyTaskId
  );

  let nextDetailedTasks = detailedTasks;
  if (link) {
    nextDetailedTasks = detailedTasks.map((task) => {
      if (task.id !== link.detailedTaskId) return task;
      return { ...task, priority: updatedPriority };
    });
  }

  return { nextColumns, nextDetailedTasks };
}

export function syncDailyTaskCategory(
  columns: DayColumn[],
  detailedTasks: DetailedTask[],
  dayId: string,
  targetDailyTaskId: string
): { nextColumns: DayColumn[]; nextDetailedTasks: DetailedTask[] } {
  let updatedCategory: TaskCategory = 'Work';

  const nextColumns = columns.map((col) => {
    if (col.id !== dayId) return col;
    return {
      ...col,
      tasks: col.tasks.map((task) => {
        if (task.id !== targetDailyTaskId) return task;
        const nextCat = cycleCategory(task.category);
        updatedCategory = nextCat;
        return { ...task, category: nextCat };
      }),
    };
  });

  const link = DETAILED_DAILY_TASK_LINKS.find(
    (l) => l.dayId === dayId && l.dailyTaskId === targetDailyTaskId
  );

  let nextDetailedTasks = detailedTasks;
  if (link) {
    nextDetailedTasks = detailedTasks.map((task) => {
      if (task.id !== link.detailedTaskId) return task;
      return { ...task, category: updatedCategory };
    });
  }

  return { nextColumns, nextDetailedTasks };
}

export function syncDailyTaskText(
  columns: DayColumn[],
  detailedTasks: DetailedTask[],
  dayId: string,
  targetDailyTaskId: string,
  text: string
): { nextColumns: DayColumn[]; nextDetailedTasks: DetailedTask[] } {
  const clean = sanitizeTaskText(text);

  const nextColumns = columns.map((col) => {
    if (col.id !== dayId) return col;
    return {
      ...col,
      tasks: col.tasks.map((task) => {
        if (task.id !== targetDailyTaskId) return task;
        return { ...task, text: clean };
      }),
    };
  });

  const link = DETAILED_DAILY_TASK_LINKS.find(
    (l) => l.dayId === dayId && l.dailyTaskId === targetDailyTaskId
  );

  let nextDetailedTasks = detailedTasks;
  if (link) {
    nextDetailedTasks = detailedTasks.map((task) => {
      if (task.id !== link.detailedTaskId) return task;
      return { ...task, text: clean };
    });
  }

  return { nextColumns, nextDetailedTasks };
}


export function createInitialMonthlyGoals(): DetailedTask[] {
  return [
    { id: 'm-1', text: 'Launch new landing page', completed: true, priority: 'High', status: 'Done', category: 'Work' },
    { id: 'm-2', text: 'Quarterly budget review', completed: false, priority: 'High', status: 'In Progress', category: 'Finance' },
    { id: 'm-3', text: 'Plan team offsite', completed: false, priority: 'Med', status: 'To Do', category: 'Work' },
    { id: 'm-4', text: 'Finish online design course', completed: true, priority: 'Med', status: 'Done', category: 'Growth' },
    { id: 'm-5', text: 'Declutter home office', completed: true, priority: 'Low', status: 'Done', category: 'Home' },
    { id: 'm-6', text: 'Car service appointment', completed: false, priority: 'Low', status: 'To Do', category: 'Home' },
    { id: 'm-7', text: 'Tax documents prep', completed: false, priority: 'High', status: 'In Progress', category: 'Finance' },
    { id: 'm-8', text: 'Read 2 books this month', completed: true, priority: 'Low', status: 'Done', category: 'Growth' },
    { id: 'm-9', text: 'Update resume & portfolio', completed: false, priority: 'Med', status: 'To Do', category: 'Growth' },
    { id: 'm-10', text: ' Annual health checkup', completed: true, priority: 'High', status: 'Done', category: 'Health' },
  ];
}

export function createInitialYearlyGoals(): DetailedTask[] {
  return [
    { id: 'y-1', text: 'Run a half marathon', completed: true, priority: 'High', status: 'Done', category: 'Health' },
    { id: 'y-2', text: 'Read 24 books', completed: false, priority: 'Med', status: 'In Progress', category: 'Growth' },
    { id: 'y-3', text: 'Build 6-month emergency fund', completed: true, priority: 'High', status: 'Done', category: 'Finance' },
    { id: 'y-4', text: 'Take a 2-week unplugged vacation', completed: false, priority: 'Med', status: 'To Do', category: 'Personal' },
    { id: 'y-5', text: 'Pay off car loan early', completed: false, priority: 'High', status: 'In Progress', category: 'Finance' },
    { id: 'y-6', text: 'Launch a side project', completed: true, priority: 'High', status: 'Done', category: 'Work' },
    { id: 'y-7', text: 'Learn conversational Spanish', completed: false, priority: 'Low', status: 'In Progress', category: 'Growth' },
    { id: 'y-8', text: 'Redecorate living room', completed: true, priority: 'Low', status: 'Done', category: 'Home' },
    { id: 'y-9', text: 'Get a promotion', completed: false, priority: 'High', status: 'In Progress', category: 'Work' },
    { id: 'y-10', text: 'Volunteer at local shelter', completed: true, priority: 'Low', status: 'Done', category: 'Personal' },
  ];
}

export function updateDailyTaskNotes(
  columns: DayColumn[],
  dayId: string,
  taskId: string,
  notes: string
): DayColumn[] {
  return columns.map((col) =>
    col.id !== dayId
      ? col
      : {
          ...col,
          tasks: col.tasks.map((task) =>
            task.id === taskId ? { ...task, notes } : task
          ),
        }
  );
}

export function clearWeekTasks(columns: DayColumn[]): DayColumn[] {
  return columns.map((col) => ({
    ...col,
    tasks: col.tasks.map((task) => ({
      ...task,
      text: '',
      completed: false,
      priority: 'Med',
      status: 'To Do',
      category: task.category || 'Personal',
      notes: '',
    })),
  }));
}

export function countWeekTasksByCompletion(columns: DayColumn[]): {
  completedCount: number;
  pendingCount: number;
  totalCount: number;
} {
  let completedCount = 0;
  let pendingCount = 0;
  for (const col of columns) {
    for (const task of col.tasks) {
      const hasText = task.text.trim().length > 0 && task.text.trim() !== '—';
      if (!hasText) continue;
      if (task.completed) {
        completedCount += 1;
      } else {
        pendingCount += 1;
      }
    }
  }
  return {
    completedCount,
    pendingCount,
    totalCount: completedCount + pendingCount,
  };
}

export function clearCompletedWeekTasks(columns: DayColumn[]): DayColumn[] {
  return columns.map((col) => {
    const keptTasks = col.tasks.filter((task) => {
      const hasText = task.text.trim().length > 0 && task.text.trim() !== '—';
      return hasText && !task.completed;
    });
    const nextTasks: DailyTask[] = col.tasks.map((originalTask, idx) => {
      const kept = keptTasks[idx];
      if (kept) {
        return {
          ...kept,
          id: originalTask.id,
          notes: kept.notes ?? '',
        };
      }
      return {
        id: originalTask.id,
        text: '',
        completed: false,
        priority: 'Med',
        status: 'To Do',
        category: 'Personal',
        notes: '',
      };
    });
    return {
      ...col,
      tasks: nextTasks,
    };
  });
}

export function clearPendingWeekTasks(columns: DayColumn[]): DayColumn[] {
  return columns.map((col) => {
    const keptTasks = col.tasks.filter((task) => {
      const hasText = task.text.trim().length > 0 && task.text.trim() !== '—';
      return hasText && task.completed;
    });
    const nextTasks: DailyTask[] = col.tasks.map((originalTask, idx) => {
      const kept = keptTasks[idx];
      if (kept) {
        return {
          ...kept,
          id: originalTask.id,
          notes: kept.notes ?? '',
        };
      }
      return {
        id: originalTask.id,
        text: '',
        completed: false,
        priority: 'Med',
        status: 'To Do',
        category: 'Personal',
        notes: '',
      };
    });
    return {
      ...col,
      tasks: nextTasks,
    };
  });
}

export function clearDetailedTasksByCompletion(
  tasks: DetailedTask[],
  mode: 'completed' | 'pending'
): DetailedTask[] {
  const keptTasks = tasks.filter((task) => {
    const hasText = task.text.trim().length > 0 && task.text.trim() !== '—';
    if (!hasText) return false;
    return mode === 'completed' ? !task.completed : task.completed;
  });

  return tasks.map((originalTask, idx) => {
    const kept = keptTasks[idx];
    if (kept) {
      return {
        ...kept,
        id: originalTask.id,
      };
    }
    return {
      ...originalTask,
      text: '',
      completed: false,
      priority: 'Med',
      status: 'To Do',
    };
  });
}

export function matchesSearchKeyword(
  task: {
    text: string;
    priority: Priority;
    status: TaskStatus;
    category?: TaskCategory;
    notes?: string;
  },
  query: string
): boolean {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return true;
  const textMatch = task.text.toLowerCase().includes(normalized);
  const notesMatch = Boolean(
    task.notes && task.notes.toLowerCase().includes(normalized)
  );
  const priorityMatch = task.priority.toLowerCase().includes(normalized);
  const statusMatch = task.status.toLowerCase().includes(normalized);
  const categoryMatch = Boolean(
    task.category && task.category.toLowerCase().includes(normalized)
  );
  return (textMatch || notesMatch) && task.text.trim().length > 0
    ? true
    : task.text.trim().length > 0 &&
        (priorityMatch || statusMatch || categoryMatch);
}

export function filterDayColumnsByKeyword(
  columns: DayColumn[],
  query: string
): DayColumn[] {
  const normalized = query.trim();
  if (!normalized) return columns;
  return columns.map((col) => ({
    ...col,
    tasks: col.tasks.filter((task) => matchesSearchKeyword(task, normalized)),
  }));
}

export function filterDetailedTasksByKeyword(
  tasks: DetailedTask[],
  query: string
): DetailedTask[] {
  const normalized = query.trim();
  if (!normalized) return tasks;
  return tasks.filter((task) => matchesSearchKeyword(task, normalized));
}

export function countMatchingTasks(
  columns: DayColumn[],
  monthlyGoals: DetailedTask[],
  yearlyGoals: DetailedTask[],
  query: string
): {
  weeklyMatches: number;
  monthlyMatches: number;
  yearlyMatches: number;
  totalMatches: number;
} {
  const normalized = query.trim();
  const filteredCols = filterDayColumnsByKeyword(columns, normalized);
  const weeklyMatches = filteredCols.reduce(
    (sum, col) =>
      sum + col.tasks.filter((t) => t.text.trim().length > 0).length,
    0
  );
  const monthlyMatches = filterDetailedTasksByKeyword(
    monthlyGoals,
    normalized
  ).filter((t) => t.text.trim().length > 0).length;
  const yearlyMatches = filterDetailedTasksByKeyword(
    yearlyGoals,
    normalized
  ).filter((t) => t.text.trim().length > 0).length;

  return {
    weeklyMatches,
    monthlyMatches,
    yearlyMatches,
    totalMatches: weeklyMatches + monthlyMatches + yearlyMatches,
  };
}

export function formatVoiceTranscript(
  existingText: string,
  transcript: string
): string {
  const cleaned = transcript.trim().replace(/\.+$/, '').trim();
  if (!cleaned) return existingText;

  const base = existingText.trim() === '—' ? '' : existingText.trim();
  if (!base) {
    return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
  }
  return `${base} ${cleaned}`;
}

export function isDayAllDone(tasks: DailyTask[]): boolean {
  const { completed, total } = calculateDayProgress(tasks);
  return total > 0 && completed === total;
}

export function shouldTriggerDayCompleteConfetti(
  previousTasks: DailyTask[],
  nextTasks: DailyTask[]
): boolean {
  return !isDayAllDone(previousTasks) && isDayAllDone(nextTasks);
}

export type PagePath =
  | '/'
  | '/how-it-works'
  | '/daily-columns'
  | '/one-click'
  | '/live-progress'
  | '/color-themes'
  | '/monthly-yearly'
  | '/built-to-reuse'
  | '/spreadsheet'
  | '/everything-you-get';

export interface PageRouteMeta {
  path: PagePath;
  sectionId: string;
  label: string;
  eyebrow: string;
  title: string;
  description: string;
  inPrimaryNav: boolean;
}

export const PAGE_ROUTES: PageRouteMeta[] = [
  {
    path: '/',
    sectionId: 'dashboard',
    label: 'Dashboard',
    eyebrow: 'INTERACTIVE TO-DO DASHBOARD',
    title: 'TO-DO DASHBOARD',
    description:
      'A self-saving, interactive Weekly, Monthly, and Yearly To-Do List dashboard with 4 color themes, live progress charts, and spreadsheet tracker.',
    inPrimaryNav: true,
  },
  {
    path: '/how-it-works',
    sectionId: 'how-it-works',
    label: 'How It Works',
    eyebrow: 'WORKS ANYWHERE · SAVES ITSELF',
    title: 'IT REMEMBERS EVERYTHING',
    description:
      'Learn how my-tasks.html works in any browser, bookmarks in one click, and auto-saves your tasks locally without accounts or subscriptions.',
    inPrimaryNav: true,
  },
  {
    path: '/daily-columns',
    sectionId: 'daily-columns',
    label: 'Daily Columns',
    eyebrow: 'REALLY READABLE DAILY COLUMNS',
    title: 'SPACIOUS & CLEAR',
    description:
      'Explore spacious, readable daily task columns with drag-and-drop task reordering across days, expandable task notes, and bulk actions.',
    inPrimaryNav: false,
  },
  {
    path: '/one-click',
    sectionId: 'one-click',
    label: 'One Click Away',
    eyebrow: 'FULLY INTERACTIVE',
    title: 'ONE CLICK AWAY',
    description:
      'Update any task in a single click: check off completed items, cycle High, Med, and Low priority dots, and switch task status pills.',
    inPrimaryNav: false,
  },
  {
    path: '/live-progress',
    sectionId: 'live-progress',
    label: 'Live Progress',
    eyebrow: 'LIVE PROGRESS DASHBOARD',
    title: 'ADDS ITSELF UP',
    description:
      'Track real-time weekly completion percentages, daily progress bars, priority distributions, and status breakdowns automatically.',
    inPrimaryNav: true,
  },
  {
    path: '/color-themes',
    sectionId: 'color-themes',
    label: 'Color Themes',
    eyebrow: 'FOUR COLOR THEMES',
    title: "THAT'S YOU",
    description:
      'Preview and switch instantly between four curated color themes: Terracotta, Candy Pastel, Lavender Mist, and Soft Neutral.',
    inPrimaryNav: true,
  },
  {
    path: '/monthly-yearly',
    sectionId: 'monthly-yearly',
    label: 'Monthly & Yearly',
    eyebrow: 'MONTHLY & YEARLY',
    title: 'BIGGER PICTURE, TOO',
    description:
      'Plan the bigger picture alongside your weekly schedule with dedicated Monthly and Yearly goal trackers and completion rings.',
    inPrimaryNav: false,
  },
  {
    path: '/built-to-reuse',
    sectionId: 'built-to-reuse',
    label: 'Built to Reuse',
    eyebrow: 'BUILT TO REUSE',
    title: 'USE IT FOREVER',
    description:
      'Reset any week to blank in one click and reuse your interactive Weekly, Monthly, and Yearly planner forever with no dated pages.',
    inPrimaryNav: false,
  },
  {
    path: '/spreadsheet',
    sectionId: 'spreadsheet',
    label: 'Spreadsheet',
    eyebrow: 'ALSO INCLUDED — FREE',
    title: 'SPREADSHEET?',
    description:
      'Use the built-in horizontal 7-day spreadsheet tracker or export your weekly tasks directly to Google Sheets and Microsoft Excel (.csv).',
    inPrimaryNav: true,
  },
  {
    path: '/everything-you-get',
    sectionId: 'everything-you-get',
    label: 'Everything You Get',
    eyebrow: 'INSTANT DIGITAL DOWNLOAD',
    title: 'EVERYTHING YOU GET',
    description:
      'Download the complete Interactive Weekly To-Do Dashboard bundle including standalone HTML, Google Sheets, Excel tracker, and quick-start guide.',
    inPrimaryNav: false,
  },
];

export function isKnownRoutePath(rawPathname: string): boolean {
  const cleaned = (rawPathname || '/')
    .trim()
    .toLowerCase()
    .replace(/\/+$/, '');

  if (
    !cleaned ||
    cleaned === '/' ||
    cleaned === '/index.html' ||
    cleaned === '/dashboard' ||
    cleaned === '#dashboard' ||
    cleaned === '#top'
  ) {
    return true;
  }

  const normalized = cleaned.startsWith('#')
    ? `/${cleaned.slice(1)}`
    : cleaned.startsWith('/')
    ? cleaned
    : `/${cleaned}`;

  return PAGE_ROUTES.some((r) => r.path === normalized);
}

export function resolveRoutePath(rawPathname: string): PagePath {
  const cleaned = (rawPathname || '/')
    .trim()
    .toLowerCase()
    .replace(/\/+$/, '');

  if (
    !cleaned ||
    cleaned === '/' ||
    cleaned === '/index.html' ||
    cleaned === '/dashboard' ||
    cleaned === '#dashboard' ||
    cleaned === '#top'
  ) {
    return '/';
  }

  const normalized = cleaned.startsWith('#')
    ? `/${cleaned.slice(1)}`
    : cleaned.startsWith('/')
    ? cleaned
    : `/${cleaned}`;

  const matched = PAGE_ROUTES.find((r) => r.path === normalized);
  return matched ? matched.path : '/';
}

export function getAdjacentRoutes(currentPath: PagePath): {
  prev: PageRouteMeta | null;
  next: PageRouteMeta | null;
  current: PageRouteMeta;
} {
  const idx = PAGE_ROUTES.findIndex((r) => r.path === currentPath);
  const safeIdx = idx >= 0 ? idx : 0;
  return {
    prev: safeIdx > 0 ? PAGE_ROUTES[safeIdx - 1] : null,
    next: safeIdx < PAGE_ROUTES.length - 1 ? PAGE_ROUTES[safeIdx + 1] : null,
    current: PAGE_ROUTES[safeIdx],
  };
}

export function findTaskLocation(
  columns: DayColumn[],
  id: string
): { dayId: string; taskIndex: number } | null {
  const cleanedDayId = id.startsWith('day-col-')
    ? id.replace(/^day-col-/, '')
    : id;
  const directDay = columns.find((col) => col.id === cleanedDayId);
  if (directDay) {
    return { dayId: directDay.id, taskIndex: -1 };
  }

  for (const col of columns) {
    const idx = col.tasks.findIndex((t) => t.id === id);
    if (idx !== -1) {
      return { dayId: col.id, taskIndex: idx };
    }
  }
  return null;
}

export function reorderOrMoveDailyTask(
  columns: DayColumn[],
  activeTaskId: string,
  overId: string
): DayColumn[] {
  if (!activeTaskId || !overId || activeTaskId === overId) {
    return columns;
  }

  const sourceLoc = findTaskLocation(columns, activeTaskId);
  const targetLoc = findTaskLocation(columns, overId);

  if (!sourceLoc || sourceLoc.taskIndex === -1 || !targetLoc) {
    return columns;
  }

  // Case 1: Reordering within the same day column
  if (sourceLoc.dayId === targetLoc.dayId) {
    return columns.map((col) => {
      if (col.id !== sourceLoc.dayId) return col;
      const tasks = [...col.tasks];
      const fromIndex = sourceLoc.taskIndex;
      const toIndex =
        targetLoc.taskIndex === -1 ? tasks.length - 1 : targetLoc.taskIndex;
      if (fromIndex === toIndex) return col;

      const [moved] = tasks.splice(fromIndex, 1);
      tasks.splice(toIndex, 0, moved);
      return {
        ...col,
        tasks,
      };
    });
  }

  // Case 2: Moving a task to a different day column
  const sourceCol = columns.find((c) => c.id === sourceLoc.dayId);
  const targetCol = columns.find((c) => c.id === targetLoc.dayId);
  if (!sourceCol || !targetCol) return columns;

  const movedTask = sourceCol.tasks[sourceLoc.taskIndex];
  if (!movedTask) return columns;

  return columns.map((col) => {
    if (col.id === sourceLoc.dayId) {
      const remaining = col.tasks.filter((_, idx) => idx !== sourceLoc.taskIndex);
      while (remaining.length < 6) {
        remaining.push({
          id: `${col.id}-blank-${remaining.length + 1}-${movedTask.id}`,
          text: '',
          completed: false,
          priority: 'Med',
          status: 'To Do',
          category: 'Personal',
          notes: '',
        });
      }
      return {
        ...col,
        tasks: remaining,
      };
    }

    if (col.id === targetLoc.dayId) {
      const nextTasks = [...col.tasks];
      let insertIndex =
        targetLoc.taskIndex === -1 ? nextTasks.length : targetLoc.taskIndex;

      // If dropped onto the column container itself, place right after existing active tasks
      if (targetLoc.taskIndex === -1) {
        const firstBlankIdx = nextTasks.findIndex(
          (t) => t.text.trim().length === 0
        );
        insertIndex = firstBlankIdx !== -1 ? firstBlankIdx : nextTasks.length;
      }

      nextTasks.splice(insertIndex, 0, movedTask);

      // Keep column at 6 rows if there is a trailing blank placeholder slot
      if (nextTasks.length > 6) {
        for (let i = nextTasks.length - 1; i >= 0; i--) {
          if (
            nextTasks[i].id !== movedTask.id &&
            nextTasks[i].text.trim().length === 0 &&
            !nextTasks[i].completed
          ) {
            nextTasks.splice(i, 1);
            break;
          }
        }
      }

      return {
        ...col,
        tasks: nextTasks,
      };
    }

    return col;
  });
}

export interface WeeklyTrendPoint {
  weekKey: string;
  weekLabel: string;
  dateRange: string;
  completed: number;
  pending: number;
  total: number;
  completionRate: number;
  isCurrentWeek: boolean;
}

export function buildWeeklyProgressTrends(
  columns: DayColumn[],
  selectedDate: string
): WeeklyTrendPoint[] {
  const parsed = new Date(`${selectedDate}T12:00:00`);
  const baseDate = Number.isNaN(parsed.getTime())
    ? new Date('2026-06-11T12:00:00')
    : parsed;

  const dayOfWeek = baseDate.getDay();
  const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const currentMonday = new Date(baseDate);
  currentMonday.setDate(baseDate.getDate() + diffToMonday);

  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  const formatShortRange = (mondayDate: Date): string => {
    const sundayDate = new Date(mondayDate);
    sundayDate.setDate(mondayDate.getDate() + 6);
    return `${months[mondayDate.getMonth()]} ${mondayDate.getDate()} – ${
      months[sundayDate.getMonth()]
    } ${sundayDate.getDate()}`;
  };

  const historicalBaseline = [
    { offsetWeeks: -3, label: '3 Wks Ago', completed: 14, pending: 6 },
    { offsetWeeks: -2, label: '2 Wks Ago', completed: 16, pending: 5 },
    { offsetWeeks: -1, label: 'Last Week', completed: 18, pending: 4 },
  ];

  const historicalPoints: WeeklyTrendPoint[] = historicalBaseline.map((item) => {
    const monday = new Date(currentMonday);
    monday.setDate(currentMonday.getDate() + item.offsetWeeks * 7);
    const total = item.completed + item.pending;
    const completionRate =
      total === 0 ? 0 : Math.round((item.completed / total) * 100);
    return {
      weekKey: `week-${item.offsetWeeks}`,
      weekLabel: item.label,
      dateRange: formatShortRange(monday),
      completed: item.completed,
      pending: item.pending,
      total,
      completionRate,
      isCurrentWeek: false,
    };
  });

  const activeDailyTasks = columns.flatMap((col) =>
    col.tasks.filter((t) => t.text.trim().length > 0 && t.text.trim() !== '—')
  );
  const currentCompleted = activeDailyTasks.filter((t) => t.completed).length;
  const currentTotal = activeDailyTasks.length;
  const currentPending = Math.max(0, currentTotal - currentCompleted);
  const currentCompletionRate =
    currentTotal === 0
      ? 0
      : Math.round((currentCompleted / currentTotal) * 100);

  const currentPoint: WeeklyTrendPoint = {
    weekKey: 'week-0',
    weekLabel: 'This Week',
    dateRange: formatShortRange(currentMonday),
    completed: currentCompleted,
    pending: currentPending,
    total: currentTotal,
    completionRate: currentCompletionRate,
    isCurrentWeek: true,
  };

  return [...historicalPoints, currentPoint];
}

export function sanitizeTaskText(raw: string, maxLength = 240): string {
  if (typeof raw !== 'string') return '';
  return raw.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '').slice(0, maxLength);
}

export function sanitizeTaskNotes(raw: string, maxLength = 1000): string {
  if (typeof raw !== 'string') return '';
  return raw.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '').slice(0, maxLength);
}

export function escapeHtml(raw: string): string {
  if (typeof raw !== 'string') return '';
  return raw
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function sanitizeCsvCell(raw: string): string {
  const trimmed = (raw || '').replace(/\r?\n/g, ' ').trim();
  if (!trimmed) return '""';
  const needsFormulaGuard = /^[=+\-@\t\r]/.test(trimmed);
  const safeContent = needsFormulaGuard ? `'${trimmed}` : trimmed;
  return `"${safeContent.replace(/"/g, '""')}"`;
}

export function generateCsvExport(columns: DayColumn[]): string {
  const headers = columns
    .map((c) => sanitizeCsvCell(`${c.dayName} (${c.dateLabel})`))
    .join(',');
  const maxRows = Math.max(6, ...columns.map((c) => c.tasks.length));
  const rows: string[] = [headers];

  for (let r = 0; r < maxRows; r++) {
    const rowCells = columns.map((col) => {
      const task = col.tasks[r];
      if (!task || !task.text.trim()) return '""';
      const statusMark = task.completed ? '[DONE] ' : `[${task.status}] `;
      const noteSuffix =
        task.notes && task.notes.trim().length > 0
          ? ` — Notes: ${task.notes.trim()}`
          : '';
      return sanitizeCsvCell(
        `${statusMark}${task.text.trim()} (${task.priority})${noteSuffix}`
      );
    });
    rows.push(rowCells.join(','));
  }

  return rows.join('\n');
}

export function generateStandaloneHtmlExport(
  columns: DayColumn[],
  activeTheme: ThemeId,
  weekRangeLabel: string
): string {
  const theme = THEMES[activeTheme] || THEMES.terracotta;
  const safeThemeName = escapeHtml(theme.name);
  const safeWeekRange = escapeHtml(weekRangeLabel);

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>my-tasks.html — Weekly To-Do List (${safeThemeName})</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #FAF7F2; color: #2F2B28; margin: 0; padding: 24px; }
    .container { max-width: 1200px; margin: 0 auto; background: #FFF; border-radius: 16px; border: 1px solid #E6DFD5; padding: 24px; box-shadow: 0 12px 32px rgba(0,0,0,0.06); }
    h1 { margin: 0 0 6px 0; font-size: 24px; }
    .sub { color: #8A8279; font-size: 13px; margin-bottom: 20px; }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(155px, 1fr)); gap: 12px; }
    .col { border: 1px solid #ECE7DF; border-radius: 12px; overflow: hidden; background: #FFF; }
    .col-head { padding: 10px 12px; font-weight: 700; font-size: 14px; }
    .col-date { font-size: 11px; font-weight: 500; opacity: 0.75; }
    .task { display: flex; flex-direction: column; gap: 4px; padding: 8px 10px; border-bottom: 1px solid #F5F2EC; font-size: 12px; }
    .task-row { display: flex; align-items: center; gap: 8px; }
    .task-note { font-size: 11px; color: #7A7269; padding-left: 22px; }
    .done .task-text { text-decoration: line-through; color: #A59E95; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Weekly To-Do List</h1>
    <div class="sub">${safeWeekRange} · Theme: ${safeThemeName} · Auto-saved snapshot</div>
    <div class="grid">
      ${columns
        .map((col, idx) => {
          const stats = calculateDayProgress(col.tasks);
          const safeDayName = escapeHtml(col.dayName);
          const safeDateLabel = escapeHtml(col.dateLabel);
          const headerBg = theme.dayHeaders[idx] || theme.progressFill;
          return `<div class="col">
            <div class="col-head" style="background:${headerBg}">
              <div>${safeDayName}</div>
              <div class="col-date">${safeDateLabel} (${stats.fractionLabel})</div>
            </div>
            ${col.tasks
              .filter((t) => t.text.trim().length > 0)
              .map((t) => {
                const safeText = escapeHtml(t.text);
                const safeNotes =
                  t.notes && t.notes.trim().length > 0
                    ? `<div class="task-note">${escapeHtml(t.notes.trim())}</div>`
                    : '';
                return `<div class="task ${t.completed ? 'done' : ''}">
                  <label class="task-row">
                    <input type="checkbox" ${t.completed ? 'checked' : ''} onchange="this.closest('.task').classList.toggle('done')" />
                    <span class="task-text">${safeText}</span>
                  </label>
                  ${safeNotes}
                </div>`;
              })
              .join('')}
          </div>`;
        })
        .join('')}
    </div>
  </div>
</body>
</html>`;
}

function isValidPriority(val: unknown): val is Priority {
  return val === 'High' || val === 'Med' || val === 'Low';
}

function isValidStatus(val: unknown): val is TaskStatus {
  return val === 'To Do' || val === 'In Progress' || val === 'Done';
}

export function isValidCategory(val: unknown): val is TaskCategory {
  return (
    typeof val === 'string' &&
    (TASK_CATEGORIES as string[]).includes(val)
  );
}

export function parsePersistedDashboardState(rawJson: string | null): {
  columns: DayColumn[];
  detailedTasks: DetailedTask[];
  monthlyGoals: DetailedTask[];
  yearlyGoals: DetailedTask[];
  activeTheme: ThemeId;
} {
  const defaultColumns = createInitialWeekColumns();
  const defaultDetailed = createInitialDetailedTasks();
  const defaultMonthly = createInitialMonthlyGoals();
  const defaultYearly = createInitialYearlyGoals();
  const defaultTheme: ThemeId = 'terracotta';

  if (!rawJson || typeof rawJson !== 'string') {
    return {
      columns: defaultColumns,
      detailedTasks: defaultDetailed,
      monthlyGoals: defaultMonthly,
      yearlyGoals: defaultYearly,
      activeTheme: defaultTheme,
    };
  }

  try {
    const parsed = JSON.parse(rawJson);
    if (!parsed || typeof parsed !== 'object') {
      throw new Error('Invalid root state');
    }

    const columns: DayColumn[] =
      Array.isArray(parsed.columns) && parsed.columns.length === 7
        ? parsed.columns.map((col: any, colIdx: number) => {
            const fallbackCol = defaultColumns[colIdx];
            const rawTasks = Array.isArray(col?.tasks)
              ? col.tasks
              : fallbackCol.tasks;
            return {
              id:
                typeof col?.id === 'string' && col.id.trim()
                  ? col.id
                  : fallbackCol.id,
              dayName:
                typeof col?.dayName === 'string' && col.dayName.trim()
                  ? col.dayName
                  : fallbackCol.dayName,
              dateLabel:
                typeof col?.dateLabel === 'string' && col.dateLabel.trim()
                  ? col.dateLabel
                  : fallbackCol.dateLabel,
              isToday:
                typeof col?.isToday === 'boolean'
                  ? col.isToday
                  : fallbackCol.isToday,
              tasks: rawTasks.slice(0, 12).map((task: any, taskIdx: number) => {
                const fallbackTask = fallbackCol.tasks[taskIdx];
                const completed = Boolean(task?.completed);
                const status: TaskStatus = isValidStatus(task?.status)
                  ? task.status
                  : completed
                  ? 'Done'
                  : 'To Do';
                return {
                  id:
                    typeof task?.id === 'string' && task.id.trim()
                      ? task.id
                      : fallbackTask?.id ?? `${fallbackCol.id}-${taskIdx + 1}`,
                  text:
                    typeof task?.text === 'string'
                      ? sanitizeTaskText(task.text)
                      : '',
                  completed,
                  priority: isValidPriority(task?.priority)
                    ? task.priority
                    : fallbackTask?.priority ?? 'Med',
                  status,
                  category: isValidCategory(task?.category)
                    ? task.category
                    : fallbackTask?.category ?? 'Work',
                  notes:
                    typeof task?.notes === 'string'
                      ? sanitizeTaskNotes(task.notes)
                      : fallbackTask?.notes ?? '',
                };
              }),
            };
          })
        : defaultColumns;

    const sanitizeDetailedList = (
      rawList: unknown,
      fallbackList: DetailedTask[]
    ): DetailedTask[] => {
      if (!Array.isArray(rawList) || rawList.length === 0) return fallbackList;
      return rawList.slice(0, 30).map((item: any, idx: number) => {
        const fb = fallbackList[idx];
        const completed = Boolean(item?.completed);
        const status: TaskStatus = isValidStatus(item?.status)
          ? item.status
          : completed
          ? 'Done'
          : 'To Do';
        return {
          id:
            typeof item?.id === 'string' && item.id.trim()
              ? item.id
              : fb?.id ?? `item-${idx + 1}`,
          text:
            typeof item?.text === 'string'
              ? sanitizeTaskText(item.text)
              : fb?.text ?? '',
          completed,
          priority: isValidPriority(item?.priority)
            ? item.priority
            : fb?.priority ?? 'Med',
          status,
          category: isValidCategory(item?.category)
            ? item.category
            : fb?.category ?? 'Work',
        };
      });
    };

    const activeTheme: ThemeId =
      typeof parsed.activeTheme === 'string' &&
      THEMES[parsed.activeTheme as ThemeId]
        ? (parsed.activeTheme as ThemeId)
        : defaultTheme;

    return {
      columns,
      detailedTasks: sanitizeDetailedList(
        parsed.detailedTasks,
        defaultDetailed
      ),
      monthlyGoals: sanitizeDetailedList(parsed.monthlyGoals, defaultMonthly),
      yearlyGoals: sanitizeDetailedList(parsed.yearlyGoals, defaultYearly),
      activeTheme,
    };
  } catch {
    return {
      columns: defaultColumns,
      detailedTasks: defaultDetailed,
      monthlyGoals: defaultMonthly,
      yearlyGoals: defaultYearly,
      activeTheme: defaultTheme,
    };
  }
}

export const THEME_ORDER: ThemeId[] = [
  'terracotta',
  'candy',
  'lavender',
  'neutral',
];

export function cycleTheme(current: ThemeId): ThemeId {
  const idx = THEME_ORDER.indexOf(current);
  if (idx === -1) return 'terracotta';
  return THEME_ORDER[(idx + 1) % THEME_ORDER.length];
}

export type KeyboardShortcutCategory =
  | 'Saving & Editing'
  | 'Views & Search'
  | 'Navigation & Modals';

export type KeyboardShortcutAction =
  | 'SAVE_DASHBOARD'
  | 'UNDO'
  | 'REDO'
  | 'TOGGLE_SOUND'
  | 'ESCAPE'
  | 'OPEN_SHORTCUTS_MODAL'
  | 'FOCUS_SEARCH'
  | 'VIEW_WEEK'
  | 'VIEW_MONTH'
  | 'VIEW_YEAR'
  | 'CYCLE_THEME'
  | 'OPEN_DOWNLOAD_MODAL'
  | 'NAV_PREV_PAGE'
  | 'NAV_NEXT_PAGE';

export interface KeyboardShortcutItem {
  id: string;
  action: KeyboardShortcutAction | 'ENTER_NEXT_TASK';
  category: KeyboardShortcutCategory;
  keys: string[];
  macKeys?: string[];
  label: string;
  description: string;
}

export const KEYBOARD_SHORTCUTS: KeyboardShortcutItem[] = [
  {
    id: 'save-dashboard',
    action: 'SAVE_DASHBOARD',
    category: 'Saving & Editing',
    keys: ['Ctrl', 'Enter'],
    macKeys: ['⌘', 'Enter'],
    label: 'Save Tasks & Notes',
    description:
      'Immediately syncs all tasks and notes to local storage and commits the active field.',
  },
  {
    id: 'undo-task-action',
    action: 'UNDO',
    category: 'Saving & Editing',
    keys: ['Ctrl', 'Z'],
    macKeys: ['⌘', 'Z'],
    label: 'Undo Task Action',
    description:
      'Reverts the most recent task addition, deletion, reorder, or completion change.',
  },
  {
    id: 'redo-task-action',
    action: 'REDO',
    category: 'Saving & Editing',
    keys: ['Ctrl', 'Shift', 'Z'],
    macKeys: ['⌘', 'Shift', 'Z'],
    label: 'Redo Task Action',
    description:
      'Re-applies the most recently undone task change (also works with Ctrl + Y).',
  },
  {
    id: 'toggle-sound-effect',
    action: 'TOGGLE_SOUND',
    category: 'Saving & Editing',
    keys: ['M'],
    label: 'Toggle Completion Sound',
    description:
      'Mutes or enables the subtle Web Audio API tactile chime when completing a task.',
  },
  {
    id: 'enter-next-task',
    action: 'ENTER_NEXT_TASK',
    category: 'Saving & Editing',
    keys: ['Enter'],
    label: 'Next Task Slot',
    description:
      'Commits the current task input and moves focus to the next task slot in that day column.',
  },
  {
    id: 'escape-close',
    action: 'ESCAPE',
    category: 'Navigation & Modals',
    keys: ['Esc'],
    label: 'Close Modal / Blur Field',
    description:
      'Closes any open modal, dropdown, or expanded notes drawer, or clears/blurs the active input.',
  },
  {
    id: 'focus-search',
    action: 'FOCUS_SEARCH',
    category: 'Views & Search',
    keys: ['/'],
    macKeys: ['⌘', 'K'],
    label: 'Focus Task Search',
    description:
      'Jumps directly to the real-time task search bar (also works with Ctrl + K).',
  },
  {
    id: 'view-week',
    action: 'VIEW_WEEK',
    category: 'Views & Search',
    keys: ['1'],
    label: 'Switch to This Week',
    description: 'Activates the 7-day Weekly To-Do List view.',
  },
  {
    id: 'view-month',
    action: 'VIEW_MONTH',
    category: 'Views & Search',
    keys: ['2'],
    label: 'Switch to This Month',
    description: 'Activates the Monthly Goals & Tasks tracker.',
  },
  {
    id: 'view-year',
    action: 'VIEW_YEAR',
    category: 'Views & Search',
    keys: ['3'],
    label: 'Switch to This Year',
    description: 'Activates the Yearly Goals overview.',
  },
  {
    id: 'cycle-theme',
    action: 'CYCLE_THEME',
    category: 'Views & Search',
    keys: ['T'],
    macKeys: ['Alt', 'T'],
    label: 'Cycle Color Theme',
    description:
      'Cycles through Terracotta, Candy Pastel, Lavender Mist, and Soft Neutral themes.',
  },
  {
    id: 'open-shortcuts',
    action: 'OPEN_SHORTCUTS_MODAL',
    category: 'Navigation & Modals',
    keys: ['?'],
    macKeys: ['Ctrl', '/'],
    label: 'Keyboard Shortcuts Guide',
    description: 'Opens or closes this keyboard shortcuts reference modal.',
  },
  {
    id: 'open-download',
    action: 'OPEN_DOWNLOAD_MODAL',
    category: 'Navigation & Modals',
    keys: ['Alt', 'D'],
    macKeys: ['⌘', 'Shift', 'E'],
    label: 'Open Download & Export',
    description:
      'Opens the Instant Digital Download & CSV Spreadsheet export modal.',
  },
  {
    id: 'nav-adjacent-page',
    action: 'NAV_NEXT_PAGE',
    category: 'Navigation & Modals',
    keys: ['Alt', '← / →'],
    label: 'Previous / Next Page',
    description: 'Navigates between adjacent dashboard showcase pages.',
  },
];

export interface ShortcutKeyEventInput {
  key: string;
  ctrlKey?: boolean;
  metaKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  isEditableTarget?: boolean;
}

export function resolveKeyboardShortcutAction(
  eventInput: ShortcutKeyEventInput
): KeyboardShortcutAction | null {
  const key = eventInput.key || '';
  const lowerKey = key.toLowerCase();
  const hasPrimaryMod = Boolean(eventInput.ctrlKey || eventInput.metaKey);
  const shiftKey = Boolean(eventInput.shiftKey);
  const altKey = Boolean(eventInput.altKey);
  const isEditable = Boolean(eventInput.isEditableTarget);

  if (key === 'Escape') {
    return 'ESCAPE';
  }

  // Ctrl+Enter / Cmd+Enter or Ctrl+S / Cmd+S saves immediately even inside inputs/textareas
  if (hasPrimaryMod && !altKey && key === 'Enter') {
    return 'SAVE_DASHBOARD';
  }
  if (hasPrimaryMod && !shiftKey && !altKey && lowerKey === 's') {
    return 'SAVE_DASHBOARD';
  }

  // Ctrl+K / Cmd+K focuses search from anywhere
  if (hasPrimaryMod && !shiftKey && !altKey && lowerKey === 'k') {
    return 'FOCUS_SEARCH';
  }

  // Ctrl+/ or Cmd+/ toggles keyboard shortcuts modal from anywhere
  if (hasPrimaryMod && !altKey && (key === '/' || key === '?')) {
    return 'OPEN_SHORTCUTS_MODAL';
  }

  // Ctrl+Shift+E / Cmd+Shift+E opens download/export modal
  if (hasPrimaryMod && shiftKey && !altKey && lowerKey === 'e') {
    return 'OPEN_DOWNLOAD_MODAL';
  }

  // Ctrl+Z / Cmd+Z (undo) and Ctrl+Shift+Z / Cmd+Shift+Z or Ctrl+Y / Cmd+Y (redo)
  // Fires when user is not typing in a text field, reverting task actions
  if (!isEditable && hasPrimaryMod && !altKey) {
    if (!shiftKey && lowerKey === 'z') {
      return 'UNDO';
    }
    if ((shiftKey && lowerKey === 'z') || (!shiftKey && lowerKey === 'y')) {
      return 'REDO';
    }
  }

  // Alt shortcuts
  if (altKey && !hasPrimaryMod && !shiftKey) {
    if (lowerKey === 't') return 'CYCLE_THEME';
    if (lowerKey === 'd') return 'OPEN_DOWNLOAD_MODAL';
    if (!isEditable && key === 'ArrowLeft') return 'NAV_PREV_PAGE';
    if (!isEditable && key === 'ArrowRight') return 'NAV_NEXT_PAGE';
  }

  // Single-key shortcuts only fire when user is not typing in an input, textarea, or select
  if (!isEditable && !hasPrimaryMod && !altKey) {
    if (key === '?' || (shiftKey && key === '/')) {
      return 'OPEN_SHORTCUTS_MODAL';
    }
    if (key === '/' && !shiftKey) {
      return 'FOCUS_SEARCH';
    }
    if (!shiftKey) {
      if (key === '1') return 'VIEW_WEEK';
      if (key === '2') return 'VIEW_MONTH';
      if (key === '3') return 'VIEW_YEAR';
      if (lowerKey === 't') return 'CYCLE_THEME';
      if (lowerKey === 'm') return 'TOGGLE_SOUND';
    }
  }

  return null;
}
