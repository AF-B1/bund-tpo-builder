import { describe, it, expect } from 'vitest';
import { createInitialState, applyStartPrice } from '../src/state.js';
import { renderSessionStatus } from '../src/render/session-status.js';

function renderInto(state) {
  const container = { innerHTML: '' };
  renderSessionStatus(container, state);
  return container.innerHTML;
}

describe('renderSessionStatus tutorial hints', () => {
  it('shows progress only when grid is empty (modal owns open price)', () => {
    const html = renderInto(createInitialState());

    expect(html).toContain('session-progress');
    expect(html).not.toContain('start-price-input');
    expect(html).not.toContain('set open price');
    expect(html).not.toContain('show full profile');
    expect(html).not.toMatch(/<kbd>↑<\/kbd>/);
  });

  it('shows build shortcuts after session starts', () => {
    const state = createInitialState();
    applyStartPrice(state, '125.50');
    const html = renderInto(state);

    expect(html).toContain('show full profile');
    expect(html).toContain('price + print');
    expect(html).toContain('clear current period');
    expect(html).toContain('<kbd>X</kbd>');
    expect(html).not.toContain('start-price-input');
    expect(html).not.toContain('set open price');
    expect(html).toContain('v1.2.1');
  });
});