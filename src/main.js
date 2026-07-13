import { createInitialState, applyStartPrice, hasPrints } from './state.js';
import { computeAnalytics } from './profile/analytics.js';
import { renderSplitView } from './render/split-view.js';
import { renderFullProfile } from './render/full-profile.js';
import { applyLayout } from './render/layout.js';
import { renderSessionStatus } from './render/session-status.js';
import { handleKeyDown } from './keyboard.js';

const state = createInitialState();
const shell = document.getElementById('app-shell');
const splitRoot = document.getElementById('split-view');
const fullRoot = document.getElementById('full-profile');
const statusRoot = document.getElementById('session-status');

function bindStartPriceInput() {
  const input = statusRoot.querySelector('.start-price-input');
  if (!input || input.dataset.bound === 'true') return;

  input.dataset.bound = 'true';
  input.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter') return;

    event.preventDefault();
    event.stopPropagation();

    const result = applyStartPrice(state, input.value);
    if (!result.ok) {
      alert(result.error);
      return;
    }

    render();
  });

  input.focus();
  input.select();
}

function render() {
  applyLayout(shell, state);
  renderSplitView(splitRoot, state);
  renderSessionStatus(statusRoot, state);

  if (!hasPrints(state)) {
    bindStartPriceInput();
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