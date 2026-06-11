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

export type SettingsStackParamList = {
  SettingsList: undefined;
};

export type RootTabParamList = {
  Teams: NavigatorScreenParams<TeamsStackParamList>;
  Matches: NavigatorScreenParams<MatchesStackParamList>;
  Settings: NavigatorScreenParams<SettingsStackParamList>;
};

export type RootStackParamList = {
  Onboarding: undefined;
  Main: NavigatorScreenParams<RootTabParamList>;
};

export type DataSource = 'user' | 'sample';

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
  source?: DataSource;
};

export type MatchActivityType = 'goal' | 'substitution' | 'remark';

export type GoalActivity = {
  id: string;
  type: 'goal';
  createdAt: number;
  side: 'home' | 'away';
  playerId: string | null;
};

export type SubstitutionActivity = {
  id: string;
  type: 'substitution';
  createdAt: number;
  side: 'home' | 'away';
  playerOutId: string;
  playerInId: string;
};

export type RemarkActivity = {
  id: string;
  type: 'remark';
  createdAt: number;
  text: string;
};

export type MatchActivity = GoalActivity | SubstitutionActivity | RemarkActivity;

export type MatchStatus = 'live' | 'finished';

export type MatchSegment = {
  segmentType: 'period' | 'break';
  startedAt: number;
};

export type Match = {
  id: string;
  homeTeamId: string;
  opponentName: string;
  periodDurationMinutes: number;
  breakDurationMinutes: number;
  status: MatchStatus;
  segments: MatchSegment[];
  endedAt: number | null;
  homeScore: number;
  awayScore: number;
  activities: MatchActivity[];
  source?: DataSource;
};
