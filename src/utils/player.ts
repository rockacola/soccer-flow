export function parseJerseyNumber(input: string): number | undefined {
  return input.trim() === '' ? undefined : parseInt(input, 10);
}

export function formatPlayerLabel(player: { name: string; jerseyNumber?: number }): string {
  return player.jerseyNumber !== undefined ? `#${player.jerseyNumber} ${player.name}` : player.name;
}
