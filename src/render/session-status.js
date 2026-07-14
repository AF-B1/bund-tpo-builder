import { formatPrice, listMarkets } from '../markets.js';
import { priceAtTickIndex, hasPrints } from '../state.js';

export function renderMarketOptions(marketId) {
  return listMarkets()
    .map((market) => {
      const selected = market.id === marketId ? ' selected' : '';
      return `<option value="${market.id}"${selected}>${market.label}</option>`;
    })
    .join('');
}

export function renderSessionStatus(container, state) {
  const period = state.periods[state.cursor.periodIndex];
  const total = state.periods.length;
  const progressPct = total <= 1 ? 0 : (state.cursor.periodIndex / (total - 1)) * 100;

  const segments = state.periods.map((p, i) => {
    let cls = 'progress-segment';
    if (i < state.cursor.periodIndex) cls += ' done';
    else if (i === state.cursor.periodIndex) cls += ' current';
    return `<span class="${cls}" title="${p.label}">${p.letter}</span>`;
  }).join('');

  const sessionStarted = hasPrints(state);

  const guideBlock = sessionStarted
    ? `
      <p><kbd>↑</kbd> <kbd>↓</kbd> price + print</p>
      <p><kbd>→</kbd> next period</p>
      <p><kbd>←</kbd> previous</p>
      <p><kbd>Enter</kbd> show full profile</p>
      <p><kbd>Delete</kbd> erase cell</p>
      <p><kbd>X</kbd> clear current period</p>
      <p><kbd>R</kbd> reset session</p>
      <p class="status-teach">Build one period at a time. <kbd>X</kbd> redoes this bracket without resetting the whole session.</p>`
    : '';

  const cursorPrice = formatPrice(
    priceAtTickIndex(state.cursor.tickIndex, state.startPrice, state.marketId),
    state.marketId,
  );

  const statusBlock = sessionStarted
    ? `
    <div class="status-current">
      <div class="status-print"><span class="status-letter">${period.letter}</span> print</div>
      <div class="status-time">${period.timeRange}</div>
      <div class="status-price">@ ${cursorPrice}</div>
    </div>`
    : '';

  const guideSection = sessionStarted
    ? `
    <div class="status-guide">
      ${guideBlock}
      <p class="changelog-link"><a href="changelog.html">Changelog</a> · v1.2.4</p>
    </div>`
    : '';

  container.innerHTML = `
    <div class="market-picker">
      <label class="market-picker-label" for="market-select">Market</label>
      <select id="market-select" class="market-select" aria-label="Select market">
        ${renderMarketOptions(state.marketId)}
      </select>
    </div>
    <div class="session-progress">
      <div class="progress-title">07:00 – 16:30</div>
      <div class="progress-v-layout">
        <div class="progress-v" role="progressbar" aria-valuenow="${Math.round(progressPct)}" aria-valuemin="0" aria-valuemax="100" aria-label="Session from 07:00 to 16:30">
          <span class="progress-start">07:00</span>
          <div class="progress-track-v">
            <div class="progress-fill-v" style="height: ${progressPct}%"></div>
          </div>
          <span class="progress-end">16:30</span>
        </div>
        <div class="progress-segments-v" aria-hidden="true">${segments}</div>
      </div>
    </div>
    ${statusBlock}
    ${guideSection}
  `;
}
