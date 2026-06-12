import { formatPlayerLabel, parseJerseyNumber } from '../player';

describe('parseJerseyNumber', () => {
  it('returns undefined for empty string', () => {
    expect(parseJerseyNumber('')).toBeUndefined();
  });

  it('returns undefined for whitespace-only string', () => {
    expect(parseJerseyNumber('   ')).toBeUndefined();
  });

  it('parses a valid number string', () => {
    expect(parseJerseyNumber('10')).toBe(10);
  });

  it('trims whitespace before parsing', () => {
    expect(parseJerseyNumber(' 7 ')).toBe(7);
  });

  it('parses single-digit number', () => {
    expect(parseJerseyNumber('1')).toBe(1);
  });
});

describe('formatPlayerLabel', () => {
  it('returns just the name when jerseyNumber is undefined', () => {
    expect(formatPlayerLabel({ name: 'Alex Morgan' })).toBe('Alex Morgan');
  });

  it('prepends jersey number hash when defined', () => {
    expect(formatPlayerLabel({ name: 'Alex Morgan', jerseyNumber: 13 })).toBe('#13 Alex Morgan');
  });

  it('handles jerseyNumber 1', () => {
    expect(formatPlayerLabel({ name: 'Zara Lee', jerseyNumber: 1 })).toBe('#1 Zara Lee');
  });
});
