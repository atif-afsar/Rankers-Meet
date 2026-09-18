import { Resend } from 'resend';
import { Registration } from '../models/Registration.js';
import { EventSetting } from '../models/EventSetting.js';

let resendClient = null;

function getResendClient() {
  if (!resendClient && process.env.RESEND_API_KEY) {
    resendClient = new Resend(process.env.RESEND_API_KEY);
  }
  return resendClient;
}

/**
 * Send registration confirmation email with ticket details and QR attachment/link
 * Updates emailStatus (PENDING -> SENT or FAILED) without failing registration.
 */
export async function sendTicketEmail({
  to,
  studentName,
  registrationId,
  exam,
  rank,
  numberOfGuests,
  ticketUrl,
  qrDataUrl,
}) {
  const fromEmail = process.env.EMAIL_FROM || 'Rankers Meet 2026 <no-reply@yasiraliclasses.in>';
  const resend = getResendClient();

  // Retrieve event logistics
  const eventSettings = await EventSetting.findOne().catch(() => null);
  const eventName = eventSettings?.eventName || 'Rankers Meet 2026';
  const eventDate = eventSettings?.eventDate || 'Saturday, October 3, 2026';
  const eventTime = eventSettings?.eventTime || '10:00 AM - 02:00 PM IST';
  const venue = eventSettings?.venue || 'Grand Auditorium, Aligarh Cultural Complex';
  const address = eventSettings?.address || 'Grand Bazaar, 1st Floor, Lal Diggi Road, Aligarh, UP 202002';

  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Rankers Meet 2026 — Registration Confirmed</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background-color: #0B192C;
      margin: 0;
      padding: 24px 12px;
      color: #1E293B;
    }
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background: #ffffff;
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 12px 30px rgba(0, 0, 0, 0.25);
    }
    .header {
      background: linear-gradient(135deg, #0A2540 0%, #1E40AF 100%);
      color: #ffffff;
      padding: 36px 24px;
      text-align: center;
    }
    .org-label {
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 2px;
      color: #F59E0B;
      text-transform: uppercase;
      margin-bottom: 6px;
    }
    .event-title {
      margin: 0;
      font-size: 26px;
      font-weight: 900;
      letter-spacing: -0.5px;
      color: #ffffff;
    }
    .header-sub {
      margin-top: 6px;
      font-size: 13px;
      color: #93C5FD;
      font-weight: 500;
    }
    .content {
      padding: 32px 28px;
    }
    .salutation {
      font-size: 18px;
      font-weight: 800;
      color: #0F172A;
      margin: 0 0 12px 0;
    }
    .intro-text {
      font-size: 15px;
      line-height: 1.6;
      color: #334155;
      margin: 0 0 20px 0;
    }
    .id-badge-card {
      background: #EFF6FF;
      border: 1px solid #BFDBFE;
      border-radius: 14px;
      padding: 16px 20px;
      text-align: center;
      margin-bottom: 24px;
    }
    .id-label {
      font-size: 11px;
      font-weight: 700;
      color: #1E40AF;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 4px;
    }
    .id-val {
      font-size: 24px;
      font-weight: 900;
      color: #1E3A8A;
      letter-spacing: 1px;
      font-family: monospace;
    }
    .logistics-card {
      background: #F8FAFC;
      border: 1px solid #E2E8F0;
      border-radius: 14px;
      padding: 18px 20px;
      margin-bottom: 24px;
    }
    .logistics-title {
      font-size: 12px;
      font-weight: 800;
      color: #64748B;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 12px;
      border-bottom: 1px solid #E2E8F0;
      padding-bottom: 8px;
    }
    .row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 7px 0;
      font-size: 14px;
      border-bottom: 1px solid #F1F5F9;
    }
    .row:last-child {
      border-bottom: none;
    }
    .row-label {
      color: #64748B;
      font-weight: 500;
    }
    .row-value {
      color: #0F172A;
      font-weight: 700;
      text-align: right;
    }
    .qr-block {
      background: #FFFFFF;
      border: 2px dashed #CBD5E1;
      border-radius: 16px;
      padding: 24px;
      text-align: center;
      margin-bottom: 24px;
    }
    .qr-block img {
      width: 200px;
      height: 200px;
      display: block;
      margin: 0 auto;
      border-radius: 8px;
    }
    .qr-instruction {
      font-size: 13px;
      font-weight: 700;
      color: #0F172A;
      margin-top: 14px;
      margin-bottom: 4px;
    }
    .qr-tip {
      font-size: 12px;
      color: #64748B;
      margin: 0;
    }
    .btn-action {
      display: block;
      background: #1E40AF;
      color: #ffffff !important;
      text-align: center;
      text-decoration: none;
      font-weight: 800;
      font-size: 15px;
      padding: 15px 24px;
      border-radius: 12px;
      margin-top: 8px;
    }
    .footer {
      background: #F8FAFC;
      border-top: 1px solid #E2E8F0;
      padding: 24px;
      text-align: center;
      font-size: 12px;
      color: #64748B;
      line-height: 1.5;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <!-- Header -->
    <div class="header">
      <div class="org-label">Yasir Ali Classes</div>
      <h1 class="event-title">${eventName}</h1>
      <div class="header-sub">Felicitation & Digital Admission Pass</div>
    </div>

    <!-- Content -->
    <div class="content">
      <h2 class="salutation">Hello ${studentName},</h2>
      <p class="intro-text">
        Your registration for <strong>${eventName}</strong> has been successfully completed.
      </p>

      <!-- Registration ID Badge -->
      <div class="id-badge-card">
        <div class="id-label">Registration ID</div>
        <div class="id-val">${registrationId}</div>
      </div>

      <!-- QR Code Section -->
      <div class="qr-block">
        <p style="margin: 0 0 12px 0; font-size: 11px; font-weight: 800; color: #1E40AF; text-transform: uppercase; letter-spacing: 1px;">
          Official Entrance QR Pass
        </p>
        ${
          qrDataUrl
            ? `<img src="${qrDataUrl}" alt="Digital Entry Pass QR Code for ${studentName}">`
            : `<div style="padding: 30px; color: #64748B; font-size: 13px;">QR Pass Available Online</div>`
        }
        <p class="qr-instruction">Please keep your QR ticket ready for entry.</p>
        <p class="qr-tip">Present this barcode on your phone screen or bring a printout for fast-track scanning at the gate.</p>
      </div>

      <!-- Event Details & Logistics -->
      <div class="logistics-card">
        <div class="logistics-title">Event & Venue Logistics</div>
        <div class="row">
          <span class="row-label">Date:</span>
          <span class="row-value">${eventDate}</span>
        </div>
        <div class="row">
          <span class="row-label">Time:</span>
          <span class="row-value">${eventTime}</span>
        </div>
        <div class="row">
          <span class="row-label">Venue:</span>
          <span class="row-value">${venue}</span>
        </div>
        <div class="row">
          <span class="row-label">Address:</span>
          <span class="row-value" style="font-size: 12px;">${address}</span>
        </div>
        <div class="row">
          <span class="row-label">Exam / Category:</span>
          <span class="row-value">${exam} &bull; ${rank}</span>
        </div>
        <div class="row">
          <span class="row-label">Accompanying Guests:</span>
          <span class="row-value">${numberOfGuests} Persons</span>
        </div>
      </div>

      <!-- Button -->
      <a href="${ticketUrl}" class="btn-action" target="_blank">
        Download & View Digital Ticket
      </a>
    </div>

    <!-- Footer -->
    <div class="footer">
      <p style="margin: 0 0 6px 0; font-weight: 600; color: #334155;">
        Yasir Ali Classes &bull; Medical Road, Near AMU Circle, Aligarh
      </p>
      <p style="margin: 0; color: #94A3B8;">
        For questions or seating assistance, call +91 88997 76655 or reply to this email.
      </p>
    </div>
  </div>
</body>
</html>
  `;

  const subject = 'Rankers Meet 2026 — Registration Confirmed';

  if (!resend) {
    console.log(`[EmailService MOCK] RESEND_API_KEY is not set. Mock email dispatched to: ${to}`);
    console.log(`[EmailService MOCK] Subject: ${subject}`);
    console.log(`[EmailService MOCK] Registration ID: ${registrationId}`);

    // Mark emailStatus as SENT in mock/dev mode so system tracks delivery
    await Registration.updateOne(
      { registrationId },
      { emailStatus: 'SENT' }
    ).catch((e) => console.error('Failed to update emailStatus in DB:', e));

    return { success: true, mocked: true, emailStatus: 'SENT' };
  }

  try {
    const response = await resend.emails.send({
      from: fromEmail,
      to: [to],
      subject,
      html: htmlContent,
    });

    await Registration.updateOne(
      { registrationId },
      { emailStatus: 'SENT' }
    ).catch((e) => console.error('Failed to update emailStatus in DB:', e));

    return { success: true, data: response, emailStatus: 'SENT' };
  } catch (error) {
    console.error('[EmailService Error] Resend dispatch failed:', error.message);

    // Email failure must NOT invalidate registration. Store emailStatus as FAILED.
    await Registration.updateOne(
      { registrationId },
      { emailStatus: 'FAILED' }
    ).catch((e) => console.error('Failed to update emailStatus to FAILED in DB:', e));

    return { success: false, error: error.message, emailStatus: 'FAILED' };
  }
}
