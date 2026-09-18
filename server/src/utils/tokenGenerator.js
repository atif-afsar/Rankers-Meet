import crypto from 'crypto';

/**
 * Generate a cryptographically secure 32-character random hex token.
 * This is used exclusively for the QR ticket code, ensuring zero sensitive
 * student information is encoded directly in the QR code.
 */
export function generateSecureQrToken() {
  return crypto.randomBytes(24).toString('hex');
}
