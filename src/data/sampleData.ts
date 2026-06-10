import palette from '../constants/palette';
import type { Match, Team } from '../types';

const PERIOD = 45 * 60 * 1000;
const BREAK = 15 * 60 * 1000;

const ko = (iso: string) => new Date(iso).getTime();

export const SAMPLE_TEAMS: Team[] = [
  {
    id: 'smp_t1',
    name: 'Phoenix FC',
    colour: palette.red[500],
    source: 'sample',
    players: [
      { id: 'smp_p1_01', name: 'Oliver Hayes', jerseyNumber: 1, position: 'GK' },
      { id: 'smp_p1_02', name: 'Marcus Reid', jerseyNumber: 2, position: 'DEF' },
      { id: 'smp_p1_03', name: 'Lucas Torres', jerseyNumber: 3, position: 'DEF' },
      { id: 'smp_p1_04', name: 'James Okonkwo', jerseyNumber: 5, position: 'DEF' },
      { id: 'smp_p1_05', name: 'Ben Archer', jerseyNumber: 6, position: 'DEF' },
      { id: 'smp_p1_06', name: 'Ryan Chen', jerseyNumber: 4, position: 'MID' },
      { id: 'smp_p1_07', name: 'Kai Santos', jerseyNumber: 8, position: 'MID' },
      { id: 'smp_p1_08', name: 'Noah Campbell', jerseyNumber: 10, position: 'MID' },
      { id: 'smp_p1_09', name: 'Ethan Walsh', jerseyNumber: 14, position: 'MID' },
      { id: 'smp_p1_10', name: 'Liam Diaz', jerseyNumber: 7, position: 'FWD' },
      { id: 'smp_p1_11', name: 'Carlos Rivera', jerseyNumber: 9, position: 'FWD' },
      { id: 'smp_p1_12', name: 'Sam Nguyen', jerseyNumber: 11, position: 'FWD' },
      { id: 'smp_p1_13', name: 'Finn McCarthy', jerseyNumber: 17, position: 'FWD' },
    ],
  },
  {
    id: 'smp_t2',
    name: 'Blue Waves',
    colour: palette.blue[500],
    source: 'sample',
    players: [
      { id: 'smp_p2_01', name: 'Tyler Brooks', jerseyNumber: 1, position: 'GK' },
      { id: 'smp_p2_02', name: 'Jordan Mills', jerseyNumber: 2, position: 'DEF' },
      { id: 'smp_p2_03', name: 'Alex Petrov', jerseyNumber: 3, position: 'DEF' },
      { id: 'smp_p2_04', name: 'Devon Clarke', jerseyNumber: 5, position: 'DEF' },
      { id: 'smp_p2_05', name: 'Mateo Garcia', jerseyNumber: 6, position: 'DEF' },
      { id: 'smp_p2_06', name: 'Seb Wright', jerseyNumber: 4, position: 'MID' },
      { id: 'smp_p2_07', name: 'Nico Fernandez', jerseyNumber: 8, position: 'MID' },
      { id: 'smp_p2_08', name: 'Will Osei', jerseyNumber: 10, position: 'MID' },
      { id: 'smp_p2_09', name: 'Cole Nkrumah', jerseyNumber: 14, position: 'MID' },
      { id: 'smp_p2_10', name: 'Jake Adeyemi', jerseyNumber: 7, position: 'FWD' },
      { id: 'smp_p2_11', name: 'Connor Walsh', jerseyNumber: 9, position: 'FWD' },
      { id: 'smp_p2_12', name: 'Luca Martini', jerseyNumber: 11, position: 'FWD' },
      { id: 'smp_p2_13', name: 'Remi Lambert', jerseyNumber: 17, position: 'FWD' },
    ],
  },
];

// Phoenix FC 3-1 vs Northgate FC (2026-05-28)
const m1ko = ko('2026-05-28T19:00:00.000Z');
// Phoenix FC 1-2 vs Central City (2026-05-14)
const m2ko = ko('2026-05-14T18:30:00.000Z');
// Phoenix FC 0-0 vs Riverside Athletic (2026-05-07)
const m3ko = ko('2026-05-07T19:00:00.000Z');
// Blue Waves 2-1 vs Eastside Rovers (2026-05-21)
const m4ko = ko('2026-05-21T19:30:00.000Z');

export const SAMPLE_PAST_MATCHES: Match[] = [
  {
    id: 'smp_m1',
    homeTeamId: 'smp_t1',
    opponentName: 'Northgate FC',
    periodDurationMinutes: 45,
    breakDurationMinutes: 15,
    status: 'finished',
    source: 'sample',
    segments: [
      { segmentType: 'period', startedAt: m1ko },
      { segmentType: 'break', startedAt: m1ko + PERIOD },
      { segmentType: 'period', startedAt: m1ko + PERIOD + BREAK },
    ],
    endedAt: m1ko + PERIOD + BREAK + PERIOD,
    homeScore: 3,
    awayScore: 1,
    activities: [
      {
        id: 'smp_a1_01',
        type: 'goal',
        createdAt: m1ko + 23 * 60000,
        side: 'home',
        playerId: 'smp_p1_11',
      },
      {
        id: 'smp_a1_02',
        type: 'goal',
        createdAt: m1ko + 38 * 60000,
        side: 'home',
        playerId: 'smp_p1_10',
      },
      {
        id: 'smp_a1_03',
        type: 'goal',
        createdAt: m1ko + PERIOD + BREAK + 7 * 60000,
        side: 'away',
        playerId: null,
      },
      {
        id: 'smp_a1_04',
        type: 'substitution',
        createdAt: m1ko + PERIOD + BREAK + 20 * 60000,
        side: 'home',
        playerOutId: 'smp_p1_12',
        playerInId: 'smp_p1_13',
      },
      {
        id: 'smp_a1_05',
        type: 'goal',
        createdAt: m1ko + PERIOD + BREAK + 35 * 60000,
        side: 'home',
        playerId: 'smp_p1_11',
      },
    ],
  },
  {
    id: 'smp_m2',
    homeTeamId: 'smp_t1',
    opponentName: 'Central City',
    periodDurationMinutes: 45,
    breakDurationMinutes: 15,
    status: 'finished',
    source: 'sample',
    segments: [
      { segmentType: 'period', startedAt: m2ko },
      { segmentType: 'break', startedAt: m2ko + PERIOD },
      { segmentType: 'period', startedAt: m2ko + PERIOD + BREAK },
    ],
    endedAt: m2ko + PERIOD + BREAK + PERIOD,
    homeScore: 1,
    awayScore: 2,
    activities: [
      { id: 'smp_a2_01', type: 'goal', createdAt: m2ko + 25 * 60000, side: 'away', playerId: null },
      {
        id: 'smp_a2_02',
        type: 'goal',
        createdAt: m2ko + 40 * 60000,
        side: 'home',
        playerId: 'smp_p1_08',
      },
      {
        id: 'smp_a2_03',
        type: 'goal',
        createdAt: m2ko + PERIOD + BREAK + 35 * 60000,
        side: 'away',
        playerId: null,
      },
    ],
  },
  {
    id: 'smp_m3',
    homeTeamId: 'smp_t1',
    opponentName: 'Riverside Athletic',
    periodDurationMinutes: 45,
    breakDurationMinutes: 15,
    status: 'finished',
    source: 'sample',
    segments: [
      { segmentType: 'period', startedAt: m3ko },
      { segmentType: 'break', startedAt: m3ko + PERIOD },
      { segmentType: 'period', startedAt: m3ko + PERIOD + BREAK },
    ],
    endedAt: m3ko + PERIOD + BREAK + PERIOD,
    homeScore: 0,
    awayScore: 0,
    activities: [
      {
        id: 'smp_a3_01',
        type: 'remark',
        createdAt: m3ko + 62 * 60000,
        text: 'Good defensive shape in second half.',
      },
    ],
  },
  {
    id: 'smp_m4',
    homeTeamId: 'smp_t2',
    opponentName: 'Eastside Rovers',
    periodDurationMinutes: 45,
    breakDurationMinutes: 15,
    status: 'finished',
    source: 'sample',
    segments: [
      { segmentType: 'period', startedAt: m4ko },
      { segmentType: 'break', startedAt: m4ko + PERIOD },
      { segmentType: 'period', startedAt: m4ko + PERIOD + BREAK },
    ],
    endedAt: m4ko + PERIOD + BREAK + PERIOD,
    homeScore: 2,
    awayScore: 1,
    activities: [
      { id: 'smp_a4_01', type: 'goal', createdAt: m4ko + 18 * 60000, side: 'away', playerId: null },
      {
        id: 'smp_a4_02',
        type: 'goal',
        createdAt: m4ko + 32 * 60000,
        side: 'home',
        playerId: 'smp_p2_10',
      },
      {
        id: 'smp_a4_03',
        type: 'goal',
        createdAt: m4ko + PERIOD + BREAK + 8 * 60000,
        side: 'home',
        playerId: 'smp_p2_11',
      },
    ],
  },
];
