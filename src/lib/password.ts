import * as Crypto from 'expo-crypto';

/**
 * Senhas: SHA-256 com salt aleatório de 16 bytes. Funções puras (sem DB),
 * então dá para testar sem banco. Nunca guarde senha pura — nem em demo.
 */
export async function hashPassword(password: string): Promise<{ salt: string; hash: string }> {
  const bytes = await Crypto.getRandomBytesAsync(16);
  const salt = Array.from(bytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
  const hash = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    `${salt}:${password}`
  );
  return { salt, hash };
}

export async function verifyPassword(
  password: string,
  salt: string,
  expectedHash: string
): Promise<boolean> {
  const hash = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    `${salt}:${password}`
  );
  return hash === expectedHash;
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
}
