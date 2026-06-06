export function formatElapsed(elapsedSeconds: number): string {
  const m = Math.floor(elapsedSeconds / 60);
  const s = elapsedSeconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}
