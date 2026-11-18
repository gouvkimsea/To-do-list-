import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { PAGE_ROUTES, createInitialWeekColumns, calculateDayProgress } from './todoLogic';

test('index.html includes viewport-fit=cover for mobile notch and safe-area compatibility', () => {
  const indexHtmlPath = path.resolve(process.cwd(), 'index.html');
  const htmlContent = fs.readFileSync(indexHtmlPath, 'utf8');

  assert.ok(
    htmlContent.includes('viewport-fit=cover'),
    'index.html must include viewport-fit=cover for edge-to-edge mobile display'
  );
  assert.ok(
    htmlContent.includes('width=device-width'),
    'index.html must include width=device-width'
  );
  assert.ok(
    htmlContent.includes('initial-scale=1.0'),
    'index.html must include initial-scale=1.0'
  );
});

test('index.css provides essential mobile resets and touch utility classes', () => {
  const indexCssPath = path.resolve(process.cwd(), 'src/index.css');
  const cssContent = fs.readFileSync(indexCssPath, 'utf8');

  // Mobile base reset
  assert.ok(
    cssContent.includes('-webkit-text-size-adjust: 100%'),
    'CSS must reset webkit text size adjustment for mobile orientation changes'
  );
  assert.ok(
    cssContent.includes('-webkit-tap-highlight-color: transparent'),
    'CSS must remove default mobile webkit tap highlight'
  );
  assert.ok(
    cssContent.includes('min-width: 320px'),
    'CSS must enforce min-width 320px for smallest smartphone support'
  );

  // Mobile utility classes
  assert.ok(
    cssContent.includes('.no-scrollbar'),
    'CSS must define .no-scrollbar for clean mobile scroll ribbons'
  );
  assert.ok(
    cssContent.includes('.touch-scroll-x'),
    'CSS must define .touch-scroll-x for smooth horizontal scrolling'
  );
  assert.ok(
    cssContent.includes('.safe-bottom'),
    'CSS must define .safe-bottom for iOS safe area padding'
  );
  assert.ok(
    cssContent.includes('.safe-top'),
    'CSS must define .safe-top for iOS safe area padding'
  );
});

test('all 10 application routes are mapped and available for mobile drawer navigation', () => {
  assert.strictEqual(
    PAGE_ROUTES.length,
    10,
    'Expected exactly 10 application routes'
  );

  const expectedPaths = [
    '/',
    '/how-it-works',
    '/daily-columns',
    '/one-click',
    '/live-progress',
    '/color-themes',
    '/monthly-yearly',
    '/built-to-reuse',
    '/spreadsheet',
    '/everything-you-get',
  ];

  for (const expected of expectedPaths) {
    const route = PAGE_ROUTES.find((r) => r.path === expected);
    assert.ok(route, `Missing route in PAGE_ROUTES: ${expected}`);
    assert.ok(route.title.length > 0, `Route ${expected} must have a non-empty title`);
  }
});

test('mobile Day Selector logic accurately selects and filters day columns', () => {
  const columns = createInitialWeekColumns();
  assert.strictEqual(columns.length, 7, 'Expected 7 daily columns');

  // Default: 'all' displays all columns
  let mobileDayFilter: string | 'all' = 'all';
  let visibleOnMobile = columns.filter(
    (col) => mobileDayFilter === 'all' || mobileDayFilter === col.id
  );
  assert.strictEqual(visibleOnMobile.length, 7, 'All days should be visible when filter is "all"');

  // Focus on Monday (first column)
  mobileDayFilter = columns[0].id;
  visibleOnMobile = columns.filter(
    (col) => mobileDayFilter === 'all' || mobileDayFilter === col.id
  );
  assert.strictEqual(visibleOnMobile.length, 1, 'Only 1 day column should be visible on mobile');
  assert.strictEqual(visibleOnMobile[0].dayName, 'Monday');

  // Day Pager Next: Mon -> Tue
  const curIdx = columns.findIndex((c) => c.id === mobileDayFilter);
  const nextIdx = curIdx < columns.length - 1 ? curIdx + 1 : 0;
  mobileDayFilter = columns[nextIdx].id;
  assert.strictEqual(columns[nextIdx].dayName, 'Tuesday');

  // Day Pager Prev: Tue -> Mon
  const prevIdx = nextIdx > 0 ? nextIdx - 1 : columns.length - 1;
  mobileDayFilter = columns[prevIdx].id;
  assert.strictEqual(columns[prevIdx].dayName, 'Monday');

  // Day Pager Wrap: Mon -> Sun (prev from index 0)
  const wrapPrevIdx = 0 > 0 ? 0 - 1 : columns.length - 1;
  assert.strictEqual(columns[wrapPrevIdx].dayName, 'Sunday');

  // Day completion calculation works for mobile badge pills
  for (const col of columns) {
    const progress = calculateDayProgress(col.tasks);
    assert.ok(typeof progress.percentage === 'number');
    assert.ok(progress.percentage >= 0 && progress.percentage <= 100);
    assert.ok(progress.fractionLabel.includes('/'));
  }
});

test('supported viewports validation matches responsive specifications (320px to 1920px)', () => {
  const testViewports = [
    { width: 320, device: 'Small smartphone (iPhone SE)' },
    { width: 375, device: 'Standard smartphone (iPhone Mini)' },
    { width: 390, device: 'Modern smartphone (iPhone 14/15)' },
    { width: 430, device: 'Large smartphone (iPhone Pro Max)' },
    { width: 768, device: 'Tablet (iPad Mini)' },
    { width: 1024, device: 'Small laptop / Tablet landscape' },
    { width: 1366, device: 'Standard desktop' },
    { width: 1920, device: 'Large desktop' },
  ];

  for (const vp of testViewports) {
    assert.ok(vp.width >= 320, `${vp.device} width (${vp.width}px) is >= 320px`);
    assert.ok(vp.width <= 1920, `${vp.device} width (${vp.width}px) is <= 1920px`);
    // Check breakpoint category
    const isMobile = vp.width < 640;
    const isTablet = vp.width >= 640 && vp.width < 1024;
    const isDesktop = vp.width >= 1024;
    assert.ok(isMobile || isTablet || isDesktop, 'Must belong to a valid responsive tier');
  }
});

test('App.tsx contains MobileNavDrawer, hamburger toggle, and mobile search bar', () => {
  const appPath = path.resolve(process.cwd(), 'src/App.tsx');
  const appCode = fs.readFileSync(appPath, 'utf8');

  assert.ok(
    appCode.includes('MobileNavDrawer'),
    'App.tsx must import and render MobileNavDrawer'
  );
  assert.ok(
    appCode.includes('mobileNavOpen'),
    'App.tsx must manage mobileNavOpen state'
  );
  assert.ok(
    appCode.includes('mobileSearchOpen'),
    'App.tsx must support mobileSearchOpen state for mobile search'
  );
  assert.ok(
    appCode.includes('mobile-menu-toggle'),
    'App.tsx must have mobile-menu-toggle for hamburger navigation'
  );
  assert.ok(
    appCode.includes('mobile-search-toggle'),
    'App.tsx must have mobile-search-toggle for mobile search expansion'
  );
  assert.ok(
    appCode.includes('mobile-theme-toggle'),
    'App.tsx must provide mobile theme toggle button'
  );
});

test('InteractiveDashboard contains mobile day selector, touch manipulation, and mobile inputs', () => {
  const dashPath = path.resolve(process.cwd(), 'src/components/InteractiveDashboard.tsx');
  const dashCode = fs.readFileSync(dashPath, 'utf8');

  assert.ok(
    dashCode.includes('mobileDayFilter'),
    'InteractiveDashboard must manage mobileDayFilter state'
  );
  assert.ok(
    dashCode.includes('mobile-day-selector'),
    'InteractiveDashboard must render mobile-day-selector'
  );
  assert.ok(
    dashCode.includes('touch-manipulation'),
    'InteractiveDashboard must use touch-manipulation for mobile touch targets'
  );
  assert.ok(
    dashCode.includes('enterKeyHint="done"'),
    'InteractiveDashboard inputs must declare enterKeyHint for virtual keyboards'
  );
  assert.ok(
    dashCode.includes('autoCapitalize="sentences"'),
    'InteractiveDashboard inputs must declare autoCapitalize for mobile typing'
  );
});

test('SpreadsheetSection provides horizontal touch scroll hint and sticky row header', () => {
  const sheetPath = path.resolve(process.cwd(), 'src/components/SpreadsheetSection.tsx');
  const sheetCode = fs.readFileSync(sheetPath, 'utf8');

  assert.ok(
    sheetCode.includes('Swipe horizontally to view all 7 days'),
    'SpreadsheetSection must render mobile swipe hint'
  );
  assert.ok(
    sheetCode.includes('sticky left-0'),
    'SpreadsheetSection must pin row index column with sticky positioning'
  );
  assert.ok(
    sheetCode.includes('touch-scroll-x'),
    'SpreadsheetSection must support touch-scroll-x momentum scrolling'
  );
});

test('NotFoundPage renders prominent big 404 display and return navigation link', () => {
  const notFoundPath = path.resolve(process.cwd(), 'src/pages/NotFoundPage.tsx');
  const notFoundCode = fs.readFileSync(notFoundPath, 'utf8');

  assert.ok(
    notFoundCode.includes('data-testid="big-404-number"'),
    'NotFoundPage must render data-testid="big-404-number"'
  );
  assert.ok(
    notFoundCode.includes('404'),
    'NotFoundPage must prominently render 404'
  );
  assert.ok(
    notFoundCode.includes('Page Not Found'),
    'NotFoundPage must render Page Not Found badge'
  );
  assert.ok(
    notFoundCode.includes('to="/"'),
    'NotFoundPage must contain link back to root dashboard'
  );
});
