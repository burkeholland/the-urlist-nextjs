// Utility functions for API routes

export function generateVanityUrl(): string {
  const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 7; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

export function isValidVanityUrl(vanityUrl: string): boolean {
  // Fixed regex to avoid ReDoS vulnerability
  // Only allow alphanumeric and single hyphens, no consecutive hyphens
  const regex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/i;
  return regex.test(vanityUrl) && vanityUrl.length >= 3 && vanityUrl.length <= 50;
}

export function generateId(): string {
  return crypto.randomUUID();
}
