import * as ExpoCrypto from 'expo-crypto';

const ALPHABET = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const ID_LENGTH = 8;

export function generateId(prefix?: string): string {
  const bytes = ExpoCrypto.getRandomBytes(ID_LENGTH);
  const id = Array.from(bytes, (b) => ALPHABET[b % ALPHABET.length]).join('');
  return prefix ? `${prefix}_${id}` : id;
}
