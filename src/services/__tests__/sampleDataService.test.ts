import { loadSampleData, removeSampleData } from '../sampleDataService';

const mockAddTeam = jest.fn();
const mockAddPastMatch = jest.fn();
const mockRemoveTeamsByIds = jest.fn();
const mockRemovePastMatchesByIds = jest.fn();
const mockSetHasSampleData = jest.fn();

let mockHasSampleData = false;

jest.mock('../../stores/appStore', () => ({
  useAppStore: {
    getState: () => ({
      get hasSampleData() {
        return mockHasSampleData;
      },
      setHasSampleData: mockSetHasSampleData,
    }),
  },
}));

jest.mock('../../stores/teamsStore', () => ({
  useTeamsStore: {
    getState: () => ({
      addTeam: mockAddTeam,
      removeTeamsByIds: mockRemoveTeamsByIds,
    }),
  },
}));

jest.mock('../../stores/matchStore', () => ({
  useMatchStore: {
    getState: () => ({
      addPastMatch: mockAddPastMatch,
      removePastMatchesByIds: mockRemovePastMatchesByIds,
    }),
  },
}));

const MOCK_TEAMS = [{ id: 'sample_t1' }, { id: 'sample_t2' }];
const MOCK_MATCHES = [{ id: 'sample_m1' }];

jest.mock('../../data/sampleData', () => ({
  SAMPLE_TEAMS: [{ id: 'sample_t1' }, { id: 'sample_t2' }],
  SAMPLE_PAST_MATCHES: [{ id: 'sample_m1' }],
}));

beforeEach(() => {
  jest.clearAllMocks();
  mockHasSampleData = false;
});

// ── loadSampleData ────────────────────────────────────────────────────────────

describe('loadSampleData', () => {
  it('does nothing when hasSampleData is already true', () => {
    mockHasSampleData = true;
    loadSampleData();
    expect(mockAddTeam).not.toHaveBeenCalled();
    expect(mockAddPastMatch).not.toHaveBeenCalled();
    expect(mockSetHasSampleData).not.toHaveBeenCalled();
  });

  it('adds all sample teams to the store', () => {
    loadSampleData();
    expect(mockAddTeam).toHaveBeenCalledTimes(MOCK_TEAMS.length);
    MOCK_TEAMS.forEach((t) => expect(mockAddTeam).toHaveBeenCalledWith(t));
  });

  it('adds all sample matches to the store', () => {
    loadSampleData();
    expect(mockAddPastMatch).toHaveBeenCalledTimes(MOCK_MATCHES.length);
    MOCK_MATCHES.forEach((m) => expect(mockAddPastMatch).toHaveBeenCalledWith(m));
  });

  it('sets hasSampleData to true', () => {
    loadSampleData();
    expect(mockSetHasSampleData).toHaveBeenCalledWith(true);
  });
});

// ── removeSampleData ──────────────────────────────────────────────────────────

describe('removeSampleData', () => {
  it('does nothing when hasSampleData is false', () => {
    mockHasSampleData = false;
    removeSampleData();
    expect(mockRemoveTeamsByIds).not.toHaveBeenCalled();
    expect(mockRemovePastMatchesByIds).not.toHaveBeenCalled();
    expect(mockSetHasSampleData).not.toHaveBeenCalled();
  });

  it('removes sample teams by their ids', () => {
    mockHasSampleData = true;
    removeSampleData();
    expect(mockRemoveTeamsByIds).toHaveBeenCalledWith(MOCK_TEAMS.map((t) => t.id));
  });

  it('removes sample matches by their ids', () => {
    mockHasSampleData = true;
    removeSampleData();
    expect(mockRemovePastMatchesByIds).toHaveBeenCalledWith(MOCK_MATCHES.map((m) => m.id));
  });

  it('sets hasSampleData to false', () => {
    mockHasSampleData = true;
    removeSampleData();
    expect(mockSetHasSampleData).toHaveBeenCalledWith(false);
  });
});
