import { setCell, resetState, hasPrints, clearPeriodColumn } from './state.js';
import { setOpenPriceTrigger } from './onboarding.js';

export function handleKeyDown(event, state, onChange) {
  if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
    return;
  }

  const key = event.key;

  if (key === 'r' || key === 'R') {
    event.preventDefault();
    if (confirm('Reset session? All TPO prints will be cleared.')) {
      resetState(state);
      setOpenPriceTrigger('reset');
      onChange();
    }
    return;
  }

  if (!hasPrints(state)) {
    return;
  }

  if (key === 'ArrowUp') {
    event.preventDefault();
    state.cursor.tickIndex += 1;
    printAtCursor(state);
    onChange();
    return;
  }

  if (key === 'ArrowDown') {
    event.preventDefault();
    state.cursor.tickIndex -= 1;
    printAtCursor(state);
    onChange();
    return;
  }

  if (key === 'ArrowRight') {
    event.preventDefault();
    if (state.cursor.periodIndex < state.periods.length - 1) {
      state.cursor.periodIndex += 1;
      printAtCursor(state);
      onChange();
    }
    return;
  }

  if (key === 'ArrowLeft') {
    event.preventDefault();
    if (state.cursor.periodIndex > 0) {
      state.cursor.periodIndex -= 1;
      onChange();
    }
    return;
  }

  if (key === 'x' || key === 'X') {
    event.preventDefault();
    clearPeriodColumn(state, state.cursor.periodIndex);
    if (!hasPrints(state)) {
      state.fullProfileRevealed = false;
      setOpenPriceTrigger('reset');
    }
    onChange();
    return;
  }

  if (key === 'Backspace' || key === 'Delete') {
    event.preventDefault();
    setCell(state.grid, state.cursor.tickIndex, state.cursor.periodIndex, null);
    if (!hasPrints(state)) {
      state.lastPrint = null;
      state.fullProfileRevealed = false;
      setOpenPriceTrigger('reset');
    }
    onChange();
    return;
  }

  if (key === 'Enter') {
    event.preventDefault();
    if (!state.fullProfileRevealed) {
      state.fullProfileRevealed = true;
      onChange();
    }
  }
}

function printAtCursor(state) {
  const letter = state.periods[state.cursor.periodIndex].letter;
  setCell(state.grid, state.cursor.tickIndex, state.cursor.periodIndex, letter);
  state.lastPrint = { ...state.cursor };
}