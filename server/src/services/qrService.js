import QRCode from 'qrcode';

/**
 * Generate a QR code as a base64 Data URL
 * @param {string} token - Secure random token
 * @returns {Promise<string>} - Base64 PNG data URL
 */
export async function generateQrDataUrl(token) {
  try {
    const dataUrl = await QRCode.toDataURL(token, {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      margin: 2,
      width: 300,
      color: {
        dark: '#0A2540',
        light: '#FFFFFF',
      },
    });
    return dataUrl;
  } catch (err) {
    console.error('Error generating QR code:', err);
    throw new Error('Failed to generate QR code');
  }
}
