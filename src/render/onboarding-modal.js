import { getMarket, formatPriceForInput } from '../markets.js';

function openPriceHint(marketId) {
  const market = getMarket(marketId);
  if (market.priceFormat === 'integer') {
    return `Type a whole index point (e.g. ${market.openHint}), then press Enter to start period A.`;
  }
  return `Type a price with a decimal (e.g. ${market.openHint}), then press Enter to start period A.`;
}

export function renderOnboardingModal(container, { mode, startPrice, marketId, error }) {
  if (!mode) {
    container.hidden = true;
    container.innerHTML = '';
    return;
  }

  const price = formatPriceForInput(startPrice, marketId);
  const hint = openPriceHint(marketId);
  const errorBlock = error
    ? `<p class="onboarding-error" role="alert">${error}</p>`
    : '';

  let title = 'Set open price';
  let body = '';

  if (mode === 'welcome') {
    title = 'Welcome to Bund TPO Builder';
    body = `
      <p class="onboarding-welcome">
        This teaching tool helps you see how a session develops as you build it letter by letter.
        Entering each print yourself gives you a kinesthetic feel for how the day unfolds —
        sharper questions and better expectations follow.
      </p>`;
  } else if (mode === 'open') {
    title = 'Set session open price';
    body = `
      <div class="onboarding-hints">
        <p><kbd>Enter</kbd> set open price</p>
        <p class="onboarding-teach">${hint}</p>
      </div>`;
  } else {
    body = `
      <p class="onboarding-teach">Press Enter to start period A at this price.</p>`;
  }

  const hintsAfterInput = mode === 'welcome'
    ? `
      <div class="onboarding-hints">
        <p><kbd>Enter</kbd> set open price</p>
        <p class="onboarding-teach">${hint}</p>
      </div>`
    : '';

  const inputMode = getMarket(marketId).priceFormat === 'integer' ? 'numeric' : 'decimal';

  container.hidden = false;
  container.innerHTML = `
    <div class="onboarding-backdrop">
      <div
        class="onboarding-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="onboarding-title"
      >
        <h2 id="onboarding-title" class="onboarding-title">${title}</h2>
        ${body}
        <label class="onboarding-field">
          <span class="onboarding-label">Open price</span>
          <input
            type="text"
            class="start-price-input"
            value="${price}"
            inputmode="${inputMode}"
            aria-label="Session open price"
          />
        </label>
        ${errorBlock}
        ${hintsAfterInput}
      </div>
    </div>
  `;
}
