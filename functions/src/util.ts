const crypto = require('crypto');

export function decodeJwt(token: string): string {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  return JSON.parse(
    decodeURIComponent(Buffer.from(base64, 'base64').toString())
  );
}

export function generateUUID(text: string) {
  return crypto
    .createHash('sha256')
    .update(text, 'utf8')
    .digest('hex');
}
