import type { NavigatorScreenParams } from '@react-navigation/native';

export type TeamsStackParamList = {
  TeamsList: undefined;
  TeamDetail: { teamId: string };
};

export type MatchesStackParamList = {
  MatchesList: undefined;
  MatchSetup: { homeTeamId: string };
  MatchLive: undefined;
  MatchDetail: { matchId: string };
};

export type RootTabParamList = {
  Teams: NavigatorScreenParams<TeamsStackParamList>;
  Matches: NavigatorScreenParams<MatchesStackParamList>;
};

export type PlayerPosition = 'GK' | 'DEF' | 'MID' | 'FWD';

export type Player = {
  id: string;
  name: string;
  jerseyNumber?: number;
  position?: PlayerPosition;
};

export type Team = {
  id: string;
  name: string;
  colour: string;
  players: Player[];
};

export type MatchActivityType = 'goal' | 'substitution' | 'remark';

export type GoalActivity = {
  id: string;
  type: 'goal';
  elapsedSeconds: number;
  side: 'home' | 'away';
  playerId: string | null;
};

export type SubstitutionActivity = {
  id: string;
  type: 'substitution';
  elapsedSeconds: number;
  side: 'home' | 'away';
  playerOutId: string;
  playerInId: string;
};

export type RemarkActivity = {
  id: string;
  type: 'remark';
  elapsedSeconds: number;
  text: string;
};

export type MatchActivity = GoalActivity | SubstitutionActivity | RemarkActivity;

export type MatchStatus = 'setup' | 'live' | 'paused' | 'finished';

export type Match = {
  id: string;
  homeTeamId: string;
  opponentName: string;
  periodCount: number;
  periodDurationMinutes: number;
  breakDurationMinutes: number;
  status: MatchStatus;
  startedAt: number | null;
  elapsedSeconds: number;
  segmentActualSeconds: number[];
  homeScore: number;
  awayScore: number;
  activities: MatchActivity[];
};
