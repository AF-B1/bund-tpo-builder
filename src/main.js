import { createInitialState, applyStartPrice, hasPrints, switchMarket } from './state.js';
import { computeAnalytics } from './profile/analytics.js';
import { renderSplitView } from './render/split-view.js';
import { renderFullProfile } from './render/full-profile.js';
import { applyLayout } from './render/layout.js';
import { renderSessionStatus } from './render/session-status.js';
import { renderOnboardingModal } from './render/onboarding-modal.js';
import {
  computeModalMode,
  markWelcomeSeen,
  setOpenPriceTrigger,
} from './onboarding.js';
import { handleKeyDown } from './keyboard.js';

const state = createInitialState();
const shell = document.getElementById('app-shell');
const splitRoot = document.getElementById('split-view');
const fullRoot = document.getElementById('full-profile');
const statusRoot = document.getElementById('session-status');
const modalRoot = document.getElementById('onboarding-modal');

let lastPriceError = null;

function bindStartPriceInput() {
  const input = modalRoot.querySelector('.start-price-input');
  if (!input || input.dataset.bound === 'true') return;

  input.dataset.bound = 'true';
  input.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter') return;

    event.preventDefault();
    event.stopPropagation();

    const result = applyStartPrice(state, input.value);
    if (!result.ok) {
      lastPriceError = result.error;
      render();
      return;
    }

    lastPriceError = null;
    markWelcomeSeen();
    setOpenPriceTrigger('load');
    render();
  });

  input.focus();
  input.select();
}

function bindMarketSelect() {
  const select = statusRoot.querySelector('.market-select');
  if (!select || select.dataset.bound === 'true') return;

  select.dataset.bound = 'true';
  select.addEventListener('change', () => {
    const result = switchMarket(state, select.value);
    if (!result.changed) return;

    lastPriceError = null;
    setOpenPriceTrigger('market-switch');
    render();
  });
}

function render() {
  applyLayout(shell, state);
  renderSplitView(splitRoot, state);
  renderSessionStatus(statusRoot, state);
  bindMarketSelect();

  const modalMode = computeModalMode(hasPrints(state));
  renderOnboardingModal(modalRoot, {
    mode: modalMode,
    startPrice: state.startPrice,
    marketId: state.marketId,
    error: lastPriceError,
  });

  if (!hasPrints(state)) {
    bindStartPriceInput();
  } else {
    lastPriceError = null;
  }

  if (state.fullProfileRevealed && hasPrints(state)) {
    const analytics = computeAnalytics(state);
    renderFullProfile(fullRoot, state, analytics);
  } else if (fullRoot) {
    fullRoot.innerHTML = '';
    fullRoot.classList.add('empty');
  }
}

window.addEventListener('keydown', (event) => {
  handleKeyDown(event, state, render);
});

render();
