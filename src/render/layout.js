export function applyLayout(shell, state) {
  const revealed = state.fullProfileRevealed;
  shell.classList.toggle('side-by-side', revealed);
  shell.classList.toggle('split-only', !revealed);

  const fullPanel = shell.querySelector('.full-panel');
  if (fullPanel) {
    fullPanel.hidden = !revealed;
  }
}