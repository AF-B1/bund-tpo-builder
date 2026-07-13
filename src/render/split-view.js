import { VISIBLE_ROWS, SCROLL_EDGE } from '../config.js';
import { priceAtTickIndex, getCell } from '../state.js';

export function ensureVisibleWindow(state) {
  const cursorOffset = state.cursor.tickIndex - state.visibleTickStart;

  if (cursorOffset < SCROLL_EDGE) {
    state.visibleTickStart = state.cursor.tickIndex - SCROLL_EDGE;
  } else if (cursorOffset >= VISIBLE_ROWS - SCROLL_EDGE) {
    state.visibleTickStart = state.cursor.tickIndex - (VISIBLE_ROWS - SCROLL_EDGE - 1);
  }
}

export function renderSplitView(container, state) {
  ensureVisibleWindow(state);
  container.innerHTML = '';

  const table = document.createElement('div');
  table.className = 'split-grid';
  table.style.setProperty('--periods', state.periods.length);

  const corner = document.createElement('div');
  corner.className = 'split-corner';
  corner.textContent = 'BUND';
  table.appendChild(corner);

  for (const period of state.periods) {
    const header = document.createElement('div');
    header.className = 'split-period-header';
    header.title = period.label;
    header.innerHTML = `<span class="period-letter">${period.letter}</span><span class="period-time">${period.timeRange}</span>`;
    table.appendChild(header);
  }

  for (let row = 0; row < VISIBLE_ROWS; row++) {
    const tickIndex = state.visibleTickStart + (VISIBLE_ROWS - 1 - row);

    const priceLabel = document.createElement('div');
    priceLabel.className = 'split-price' + (tickIndex === state.cursor.tickIndex ? ' cursor-price' : '');
    priceLabel.textContent = priceAtTickIndex(tickIndex).toFixed(2);
    table.appendChild(priceLabel);

    for (let p = 0; p < state.periods.length; p++) {
      const letter = getCell(state.grid, tickIndex, p);
      const cell = document.createElement('div');
      cell.className = 'split-cell';
      if (letter) {
        cell.textContent = letter;
        if (letter === 'A' || letter === 'B') cell.classList.add('early-letter');
      }
      if (tickIndex === state.cursor.tickIndex && p === state.cursor.periodIndex) {
        cell.classList.add('active-cursor');
      }
      table.appendChild(cell);
    }
  }

  container.appendChild(table);
}