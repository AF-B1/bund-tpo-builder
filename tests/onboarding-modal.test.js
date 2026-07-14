import { describe, it, expect } from 'vitest';
import { renderOnboardingModal } from '../src/render/onboarding-modal.js';

function renderInto(options) {
  const container = { hidden: false, innerHTML: '' };
  renderOnboardingModal(container, options);
  return { html: container.innerHTML, hidden: container.hidden };
}

describe('renderOnboardingModal', () => {
  it('welcome mode shows welcome copy and input', () => {
    const { html, hidden } = renderInto({
      mode: 'welcome',
      startPrice: 125.5,
      marketId: 'bund',
      error: null,
    });

    expect(hidden).toBe(false);
    expect(html).toContain('Welcome to Bund TPO Builder');
    expect(html).toContain('start-price-input');
    expect(html).toContain('125.50');
    expect(html).toContain('kinesthetic');
  });

  it('open mode shows decimal hint without welcome', () => {
    const { html } = renderInto({
      mode: 'open',
      startPrice: 125.5,
      marketId: 'bund',
      error: null,
    });

    expect(html).toContain('Set session open price');
    expect(html).toContain('decimal');
    expect(html).not.toContain('Welcome to Bund TPO Builder');
  });

  it('reset mode is minimal', () => {
    const { html } = renderInto({
      mode: 'reset',
      startPrice: 126.25,
      marketId: 'bund',
      error: null,
    });

    expect(html).toContain('Set open price');
    expect(html).toContain('Press Enter to start period A');
    expect(html).not.toContain('Welcome to Bund TPO Builder');
    expect(html).not.toMatch(/<kbd>↑<\/kbd>/);
  });

  it('renders inline error', () => {
    const { html } = renderInto({
      mode: 'open',
      startPrice: 125.5,
      marketId: 'bund',
      error: 'Enter a price with a decimal point (e.g. 125.50)',
    });

    expect(html).toContain('onboarding-error');
    expect(html).toContain('decimal point');
  });

  it('open mode shows integer hint for eurostoxx', () => {
    const { html } = renderInto({
      mode: 'open',
      startPrice: 5012,
      marketId: 'eurostoxx',
      error: null,
    });

    expect(html).toContain('5012');
    expect(html).toContain('whole index point');
    expect(html).not.toContain('decimal');
  });

  it('hides container when mode is null', () => {
    const container = { hidden: false, innerHTML: 'old' };
    renderOnboardingModal(container, { mode: null, startPrice: 125.5, marketId: 'bund', error: null });

    expect(container.hidden).toBe(true);
    expect(container.innerHTML).toBe('');
  });
});