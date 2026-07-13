import {
  SESSION_START_HOUR,
  SESSION_START_MINUTE,
  PERIOD_MINUTES,
  INITIAL_PERIOD_COUNT,
  LETTERS,
} from '../config.js';

function pad2(n) {
  return String(n).padStart(2, '0');
}

function formatTime(totalMinutes) {
  const h = Math.floor(totalMinutes / 60) % 24;
  const m = totalMinutes % 60;
  return `${pad2(h)}:${pad2(m)}`;
}

export function generatePeriods(count = INITIAL_PERIOD_COUNT) {
  const startMinutes = SESSION_START_HOUR * 60 + SESSION_START_MINUTE;
  const periods = [];

  for (let i = 0; i < count; i++) {
    const periodStart = startMinutes + i * PERIOD_MINUTES;
    const periodEnd = periodStart + PERIOD_MINUTES;
    periods.push({
      index: i,
      letter: LETTERS[i],
      timeRange: `${formatTime(periodStart)}–${formatTime(periodEnd)}`,
      label: `${LETTERS[i]} ${formatTime(periodStart)}–${formatTime(periodEnd)}`,
    });
  }

  return periods;
}