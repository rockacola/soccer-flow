export type PlayerPosition = 'GK' | 'DEF' | 'MID' | 'FWD';

export type Player = {
  id: string;
  name: string;
  jerseyNumber: number;
  position: PlayerPosition;
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
  minute: number;
  teamId: string;
  playerId: string;
};

export type SubstitutionActivity = {
  id: string;
  type: 'substitution';
  minute: number;
  teamId: string;
  playerOutId: string;
  playerInId: string;
};

export type RemarkActivity = {
  id: string;
  type: 'remark';
  minute: number;
  text: string;
};

export type MatchActivity = GoalActivity | SubstitutionActivity | RemarkActivity;

export type MatchStatus = 'setup' | 'live' | 'paused' | 'finished';

export type Match = {
  id: string;
  homeTeamId: string;
  awayTeamId: string;
  halfCount: number;
  halfDurationMinutes: number;
  breakDurationMinutes: number;
  status: MatchStatus;
  startedAt: number | null;
  elapsedSeconds: number;
  homeScore: number;
  awayScore: number;
  activities: MatchActivity[];
};
