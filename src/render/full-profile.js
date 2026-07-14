import { ROW_HEIGHT } from '../config.js';
import { getCell } from '../state.js';

export function mergedLetterParts(tick, letters, hasOpenPrintAtTick) {
  if (!letters) return [];
  if (tick === 0 && hasOpenPrintAtTick) {
    return [...letters].map((ch, index) => ({ ch, open: index === 0 }));
  }
  return [{ ch: letters, open: false }];
}

export function renderFullProfile(container, state, analytics) {
  container.innerHTML = '';

  if (!Object.keys(analytics.merged).length) {
    container.classList.add('empty');
    return;
  }

  container.classList.remove('empty');

  const ticks = Object.keys(analytics.merged).map(Number).sort((a, b) => b - a);
  const maxTick = ticks[0];
  const columnHeight = ticks.length * ROW_HEIGHT;
  const hasOpenPrintAtTick = getCell(state.grid, 0, 0) === 'A';

  const wrap = document.createElement('div');
  wrap.className = 'full-profile-wrap';

  const leftLane = document.createElement('div');
  leftLane.className = 'full-profile-lane full-profile-lane-left';
  leftLane.style.height = `${columnHeight}px`;

  if (analytics.ibr) {
    const ibr = document.createElement('div');
    ibr.className = 'ibr-bar';
    ibr.title = 'Initial Balance (A + B)';
    ibr.style.top = `${tickOffset(maxTick, analytics.ibr.max)}px`;
    ibr.style.height = `${(analytics.ibr.max - analytics.ibr.min + 1) * ROW_HEIGHT}px`;
    leftLane.appendChild(ibr);
  }

  const column = document.createElement('div');
  column.className = 'full-column';

  for (const tick of ticks) {
    const row = document.createElement('div');
    row.className = 'full-row';
    const isPoc = analytics.pocIndex === tick;
    const inVA = analytics.valueArea.includes(tick);

    if (isPoc) row.classList.add('is-poc');

    const cell = document.createElement('span');
    cell.className = 'full-letter' + (inVA && !isPoc ? ' in-va' : '');

    const parts = mergedLetterParts(tick, analytics.merged[tick], hasOpenPrintAtTick);
    if (parts.length === 1 && !parts[0].open) {
      cell.textContent = parts[0].ch;
    } else {
      for (const part of parts) {
        const span = document.createElement('span');
        span.className = 'full-letter-char' + (part.open ? ' open-print' : '');
        if (inVA && !isPoc && !part.open) span.classList.add('in-va');
        span.textContent = part.ch;
        cell.appendChild(span);
      }
    }

    row.appendChild(cell);
    column.appendChild(row);
  }

  const rightLane = document.createElement('div');
  rightLane.className = 'full-profile-lane full-profile-lane-right';
  rightLane.style.height = `${columnHeight}px`;

  if (analytics.closeTick != null) {
    const close = document.createElement('div');
    close.className = 'close-marker';
    close.style.top = `${tickOffset(maxTick, analytics.closeTick) + 4}px`;
    rightLane.appendChild(close);
  }

  wrap.appendChild(leftLane);
  wrap.appendChild(column);
  wrap.appendChild(rightLane);
  container.appendChild(wrap);
}

function tickOffset(maxTick, tick) {
  return (maxTick - tick) * ROW_HEIGHT;
}