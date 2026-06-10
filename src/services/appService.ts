import { useAppStore } from '../stores/appStore';
import { useMatchStore } from '../stores/matchStore';
import { useTeamsStore } from '../stores/teamsStore';

export function resetAllData(): void {
  useTeamsStore.getState().reset();
  useMatchStore.getState().reset();
  useAppStore.getState().reset();
}
