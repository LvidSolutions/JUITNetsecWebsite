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

function cleanPlainText(value = '') {
  return String(value).replace(/\u0000/g, '').trim();
}

export async function sendContactEmail({
  apiKey,
  fromEmail,
  toEmail,
  submission,
  requestId,
  fetchImpl = fetch,
}) {
  const safe = {
    name: escapeHtml(submission.name),
    company: escapeHtml(submission.company),
    email: escapeHtml(submission.email),
    phone: escapeHtml(submission.phone),
    need: escapeHtml(submission.need),
    message: escapeHtml(submission.message),
  };

  const subject = `New website request: ${cleanHeader(submission.need)}`;
  const text = [
    'New contact request from the JUIT NetSec website',
    '',
    `Request ID: ${requestId}`,
    `Name: ${cleanPlainText(submission.name)}`,
    `Company: ${cleanPlainText(submission.company) || '-'}`,
    `Email: ${cleanPlainText(submission.email)}`,
    `Phone: ${cleanPlainText(submission.phone) || '-'}`,
    `Need: ${cleanPlainText(submission.need)}`,
    '',
    'Message:',
    cleanPlainText(submission.message),
  ].join('\n');

  const html = `
    <h2>New contact request from the JUIT NetSec website</h2>
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

  const response = await fetchImpl(RESEND_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'Idempotency-Key': requestId,
    },
    body: JSON.stringify({
      from: cleanHeader(fromEmail),
      to: [cleanHeader(toEmail)],
      reply_to: cleanHeader(submission.email),
      subject,
      text,
      html,
    }),
    signal: AbortSignal.timeout(10_000),
  });

  if (!response.ok) {
    const error = new Error(`Email provider rejected request with status ${response.status}`);
    error.name = 'EmailProviderError';
    error.status = response.status;
    throw error;
  }

  // A successful provider status means the message was accepted. Do not turn a
  // malformed optional response body into a retry that could create duplicates.
  try {
    const result = await response.json();
    return { id: typeof result?.id === 'string' ? result.id : null };
  } catch {
    return { id: null };
  }
}
