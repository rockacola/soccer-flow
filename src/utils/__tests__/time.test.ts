import { formatElapsed } from '../time';

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
