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
  const regex = /^([\w\d-])+([\w\d-])*$/;
  return regex.test(vanityUrl);
}

export function generateId(): string {
  return crypto.randomUUID();
}
