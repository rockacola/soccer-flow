import { generateId } from '../id';

jest.mock('expo-crypto', () => ({
  getRandomBytes: (length: number) => new Uint8Array(length).fill(0),
}));

describe('generateId', () => {
  it('returns a string of 8 characters without a prefix', () => {
    expect(generateId()).toHaveLength(8);
  });

  it('returns only characters from the allowed alphabet', () => {
    expect(generateId()).toMatch(/^[0-9A-Za-z]{8}$/);
  });

  it('prepends prefix and underscore when given a prefix', () => {
    expect(generateId('t')).toMatch(/^t_[0-9A-Za-z]{8}$/);
  });

  it('works with multi-character prefixes', () => {
    expect(generateId('match')).toMatch(/^match_[0-9A-Za-z]{8}$/);
  });

  it('returns plain 8 chars when prefix is undefined', () => {
    const id = generateId(undefined);
    expect(id).toHaveLength(8);
    expect(id).not.toContain('_');
  });
});
