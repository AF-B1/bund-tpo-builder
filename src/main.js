import { createInitialState } from './state.js';
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

function render() {
  applyLayout(shell, state);
  renderSplitView(splitRoot, state);
  renderSessionStatus(statusRoot, state);

  if (state.fullProfileRevealed) {
    const analytics = computeAnalytics(state);
    renderFullProfile(fullRoot, state, analytics);
  }
}

window.addEventListener('keydown', (event) => {
  handleKeyDown(event, state, render);
});

render();