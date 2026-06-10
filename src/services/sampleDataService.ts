import { SAMPLE_PAST_MATCHES, SAMPLE_TEAMS } from '../data/sampleData';
import { useAppStore } from '../stores/appStore';
import { useMatchStore } from '../stores/matchStore';
import { useTeamsStore } from '../stores/teamsStore';

export function loadSampleData(): void {
  if (useAppStore.getState().hasSampleData) {return;}

  const teamsStore = useTeamsStore.getState();
  for (const team of SAMPLE_TEAMS) {
    teamsStore.addTeam(team);
  }

  const matchStore = useMatchStore.getState();
  for (const match of SAMPLE_PAST_MATCHES) {
    matchStore.addPastMatch(match);
  }

  useAppStore.getState().setHasSampleData(true);
}

export function removeSampleData(): void {
  if (!useAppStore.getState().hasSampleData) {return;}

  useTeamsStore.getState().removeTeamsByIds(SAMPLE_TEAMS.map((t) => t.id));
  useMatchStore.getState().removePastMatchesByIds(SAMPLE_PAST_MATCHES.map((m) => m.id));

  useAppStore.getState().setHasSampleData(false);
}
