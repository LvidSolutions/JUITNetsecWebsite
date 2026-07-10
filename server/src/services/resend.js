const RESEND_ENDPOINT = 'https://api.resend.com/emails';

function escapeHtml(value = '') {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function cleanHeader(value = '') {
  return value.replace(/[\r\n]+/g, ' ').trim();
}

export async function sendContactEmail({ config, submission, requestId }) {
  const subject = `New website request: ${cleanHeader(submission.need)}`;
  const safe = Object.fromEntries(
    Object.entries(submission).map(([key, value]) => [key, escapeHtml(String(value || '').trim())]),
  );

  const text = [
    'New contact request from juitnetsec.se',
    '',
    `Request ID: ${requestId}`,
    `Name: ${submission.name}`,
    `Company: ${submission.company || '-'}`,
    `Email: ${submission.email}`,
    `Phone: ${submission.phone || '-'}`,
    `Need: ${submission.need}`,
    '',
    'Message:',
    submission.message,
  ].join('\n');

  const html = `
    <h2>New contact request from juitnetsec.se</h2>
    <p><strong>Request ID:</strong> ${escapeHtml(requestId)}</p>
    <table cellpadding="6" cellspacing="0" style="border-collapse:collapse">
      <tr><td><strong>Name</strong></td><td>${safe.name}</td></tr>
      <tr><td><strong>Company</strong></td><td>${safe.company || '-'}</td></tr>
      <tr><td><strong>Email</strong></td><td>${safe.email}</td></tr>
      <tr><td><strong>Phone</strong></td><td>${safe.phone || '-'}</td></tr>
      <tr><td><strong>Need</strong></td><td>${safe.need}</td></tr>
    </table>
    <h3>Message</h3>
    <p style="white-space:pre-wrap">${safe.message}</p>
  `;

  const response = await fetch(RESEND_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${config.resendApiKey}`,
      'Content-Type': 'application/json',
      'Idempotency-Key': requestId,
    },
    body: JSON.stringify({
      from: config.fromEmail,
      to: [config.contactToEmail],
      reply_to: submission.email,
      subject,
      text,
      html,
    }),
    signal: AbortSignal.timeout(10_000),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Email provider rejected request (${response.status}): ${errorBody.slice(0, 300)}`);
  }

  return response.json();
}
