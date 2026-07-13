import { setCell, resetState } from './state.js';

export function handleKeyDown(event, state, onChange) {
  const key = event.key;

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

  if (key === 'Backspace' || key === 'Delete') {
    event.preventDefault();
    setCell(state.grid, state.cursor.tickIndex, state.cursor.periodIndex, null);
    onChange();
    return;
  }

  if (key === 'Enter') {
    event.preventDefault();
    if (!state.fullProfileRevealed) {
      state.fullProfileRevealed = true;
      onChange();
    }
    return;
  }

  if (key === 'r' || key === 'R') {
    event.preventDefault();
    if (confirm('Reset session? All TPO prints will be cleared.')) {
      resetState(state);
      onChange();
    }
  }
}

function printAtCursor(state) {
  const letter = state.periods[state.cursor.periodIndex].letter;
  setCell(state.grid, state.cursor.tickIndex, state.cursor.periodIndex, letter);
  state.lastPrint = { ...state.cursor };
}