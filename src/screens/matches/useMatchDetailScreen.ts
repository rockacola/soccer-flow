import { colors } from '../../constants/theme';
import { useMatchStore } from '../../stores/matchStore';
import { useTeamsStore } from '../../stores/teamsStore';
import type { Match, Team } from '../../types';
import type { SegmentGroup } from '../../utils/match';
import { buildSegmentGroups, resolveOpponent } from '../../utils/match';

export type MatchDetailScreenState =
  | { status: 'not-found' }
  | {
      status: 'ready';
      match: Match;
      homeTeam: Team;
      opponentName: string;
      groups: SegmentGroup[];
    };

export function useMatchDetailScreen(matchId: string): MatchDetailScreenState {
  const match = useMatchStore((s) => s.pastMatches.find((m) => m.id === matchId));
  const teams = useTeamsStore((s) => s.teams);

  if (!match) {
    return { status: 'not-found' };
  }

  const homeTeam = teams.find((t) => t.id === match.homeTeamId) ?? {
    id: '',
    name: 'Unknown',
    colour: colors.separator,
    players: [],
  };

  return {
    status: 'ready',
    match,
    homeTeam,
    opponentName: resolveOpponent(match.opponentName),
    groups: buildSegmentGroups(match),
  };
}
