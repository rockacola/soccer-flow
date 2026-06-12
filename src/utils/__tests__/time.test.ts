import {
  formatBreakDuration,
  formatDurationLabel,
  formatElapsed,
  formatMatchDate,
  formatMatchDateLong,
} from '../time';

describe('formatElapsed', () => {
  it('formats zero as 00:00', () => {
    expect(formatElapsed(0)).toBe('00:00');
  });

  it('formats single-digit seconds', () => {
    expect(formatElapsed(9)).toBe('00:09');
  });

  it('formats exactly one minute', () => {
    expect(formatElapsed(60)).toBe('01:00');
  });

  it('formats minutes and seconds', () => {
    expect(formatElapsed(65)).toBe('01:05');
  });

  it('pads single-digit seconds when minutes are double-digit', () => {
    expect(formatElapsed(601)).toBe('10:01');
  });

  it('handles 90 minutes', () => {
    expect(formatElapsed(5400)).toBe('90:00');
  });

  it('handles mid-match value', () => {
    expect(formatElapsed(2700)).toBe('45:00');
  });
});

describe('formatBreakDuration', () => {
  it('formats exactly one minute', () => {
    expect(formatBreakDuration(60000)).toBe('1 min');
  });

  it('formats 15 minutes', () => {
    expect(formatBreakDuration(900000)).toBe('15 min');
  });

  it('rounds to nearest minute', () => {
    expect(formatBreakDuration(89999)).toBe('1 min');
    expect(formatBreakDuration(90000)).toBe('2 min');
  });
});

describe('formatDurationLabel', () => {
  it('formats whole minutes with no seconds', () => {
    expect(formatDurationLabel(60)).toBe('1m');
    expect(formatDurationLabel(120)).toBe('2m');
  });

  it('formats seconds only when under a minute', () => {
    expect(formatDurationLabel(30)).toBe('30s');
    expect(formatDurationLabel(1)).toBe('1s');
  });

  it('formats minutes and seconds', () => {
    expect(formatDurationLabel(90)).toBe('1m 30s');
    expect(formatDurationLabel(125)).toBe('2m 5s');
  });

  it('formats zero as 0m', () => {
    expect(formatDurationLabel(0)).toBe('0m');
  });
});

describe('formatMatchDate', () => {
  it('returns empty string for null', () => {
    expect(formatMatchDate(null)).toBe('');
  });

  it('returns a non-empty string for a valid timestamp', () => {
    expect(formatMatchDate(1_000_000_000_000)).toBeTruthy();
  });
});

describe('formatMatchDateLong', () => {
  it('returns empty string for null', () => {
    expect(formatMatchDateLong(null)).toBe('');
  });

  it('returns a non-empty string for a valid timestamp', () => {
    expect(formatMatchDateLong(1_000_000_000_000)).toBeTruthy();
  });
});
