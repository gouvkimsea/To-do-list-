import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const cssPath = path.resolve(process.cwd(), 'src/index.css');
const cssContent = fs.readFileSync(cssPath, 'utf8');

test('index.css defines dark mode CSS variables for charts and rings', () => {
  assert.ok(cssContent.includes('html.dark {'), 'html.dark root block must exist');
  assert.ok(cssContent.includes('--chart-grid-stroke: #2C2722;'), 'dark grid stroke must be defined');
  assert.ok(cssContent.includes('--chart-axis-stroke: #3A342E;'), 'dark axis stroke must be defined');
  assert.ok(cssContent.includes('--chart-tick-primary: #D8CFC4;'), 'dark tick primary must be defined');
  assert.ok(cssContent.includes('--chart-tooltip-bg: #1E1B18;'), 'dark tooltip bg must be defined');
  assert.ok(cssContent.includes('--donut-track-stroke: #2E2924;'), 'dark donut track stroke must be defined');
  assert.ok(cssContent.includes('--donut-progress-stroke: #E28E64;'), 'dark donut progress stroke must be defined');
});

test('index.css adapts surfaces for dark mode without bright light-mode white', () => {
  assert.ok(cssContent.includes('html.dark .bg-white'), 'bg-white dark override must exist');
  assert.ok(cssContent.includes('html.dark .bg-white\\/70'), 'bg-white/70 dark override must exist');
  assert.ok(cssContent.includes('html.dark .bg-\\[\\#FAF8F5\\]'), 'bg-[#FAF8F5] dark override must exist');
  assert.ok(cssContent.includes('html.dark .bg-\\[\\#FAF7F2\\]'), 'bg-[#FAF7F2] dark override must exist');
  assert.ok(cssContent.includes('html.dark .bg-\\[\\#FAF6F0\\]'), 'bg-[#FAF6F0] dark override must exist');
  assert.ok(cssContent.includes('html.dark .bg-\\[\\#EFEBE4\\]'), 'bg-[#EFEBE4] dark override must exist');
  assert.ok(cssContent.includes('html.dark .bg-\\[\\#EFECE6\\]'), 'bg-[#EFECE6] dark override must exist');
});

test('index.css inverts solid primary dark buttons in light mode to warm ivory in dark mode', () => {
  assert.ok(cssContent.includes('html.dark .bg-\\[\\#2F2B28\\]'), 'solid dark button override must exist');
  assert.ok(cssContent.includes('background-color: #FAF6F0 !important;'), 'dark button must invert to warm ivory');
  assert.ok(cssContent.includes('color: #141210 !important;'), 'inverted button text must be dark obsidian');
});

test('index.css styles unchecked checkboxes and blank priority dots appropriately for dark mode', () => {
  assert.ok(
    cssContent.includes('html.dark [role="checkbox"][aria-checked="false"]'),
    'unchecked checkbox dark styling must be defined'
  );
  assert.ok(
    cssContent.includes('html.dark [data-demo-checkbox="false"]'),
    'demo unchecked checkbox dark styling must be defined'
  );
  assert.ok(
    cssContent.includes('html.dark [data-blank-task="true"]'),
    'blank priority dot dark styling must be defined'
  );
});

test('index.css styles all 6 task categories in dark mode with cohesive tones', () => {
  const categories = ['Work', 'Personal', 'Health', 'Finance', 'Home', 'Growth'];
  for (const cat of categories) {
    assert.ok(
      cssContent.includes(`html.dark [data-category-badge="${cat}"]`),
      `Category badge ${cat} must have dark mode rules`
    );
  }
});

test('index.css styles all priority and status pills in dark mode', () => {
  const priorities = ['High', 'Med', 'Low'];
  for (const p of priorities) {
    assert.ok(
      cssContent.includes(`html.dark [data-priority-pill="${p}"]`),
      `Priority pill ${p} must have dark mode rules`
    );
  }

  const statuses = ['To Do', 'In Progress', 'Done'];
  for (const s of statuses) {
    assert.ok(
      cssContent.includes(`html.dark [data-status-pill="${s}"]`),
      `Status pill "${s}" must have dark mode rules`
    );
  }
});

test('index.css styles recurring interval badges and buttons for dark mode', () => {
  const intervals = ['daily', 'weekly', 'monthly', 'none'];
  for (const interval of intervals) {
    assert.ok(
      cssContent.includes(`[data-recurring-badge="${interval}"]`),
      `Recurring badge ${interval} must have dark mode rules`
    );
    assert.ok(
      cssContent.includes(`[data-recurring-interval="${interval}"]`),
      `Recurring interval button ${interval} must have dark mode rules`
    );
  }
});

test('index.css styles task notes collapsible drawer and textareas for dark mode', () => {
  assert.ok(
    cssContent.includes('html.dark [data-notes-drawer="true"]'),
    'Task notes drawer must have dedicated dark mode surface styling'
  );
  assert.ok(
    cssContent.includes('html.dark [data-notes-drawer="true"] textarea'),
    'Task notes textarea must have dedicated dark mode styling'
  );
});

test('index.css styles kbd, code, and spreadsheet pills for dark mode', () => {
  assert.ok(cssContent.includes('html.dark kbd'), 'kbd elements must have dark mode styling');
  assert.ok(cssContent.includes('html.dark code'), 'code elements must have dark mode styling');
  assert.ok(
    cssContent.includes('html.dark [data-spreadsheet-pill="done"]'),
    'spreadsheet done pill must have dark mode styling'
  );
  assert.ok(
    cssContent.includes('html.dark [data-spreadsheet-pill="progress"]'),
    'spreadsheet progress pill must have dark mode styling'
  );
  assert.ok(
    cssContent.includes('html.dark [data-spreadsheet-pill="high"]'),
    'spreadsheet high priority pill must have dark mode styling'
  );
});

test('index.css softens elevated card and window drop-shadows in dark mode', () => {
  assert.ok(
    cssContent.includes('html.dark .shadow-2xl'),
    'dark mode must soften deep drop shadows'
  );
  assert.ok(
    cssContent.includes('box-shadow: 0 16px 36px -8px rgba(0, 0, 0, 0.45) !important;'),
    'dark mode drop shadow must use subtle dark shadow'
  );
});
