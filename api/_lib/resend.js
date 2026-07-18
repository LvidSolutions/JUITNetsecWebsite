const RESEND_ENDPOINT = 'https://api.resend.com/emails';
const escapeHtml = (value = '') => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#039;');
const cleanHeader = (value = '') => value.replace(/[\r\n]+/g, ' ').trim();
const cleanPlainText = (value = '') => String(value).replace(/\u0000/g, '').trim();

export async function sendContactEmail({ apiKey, fromEmail, toEmail, submission, requestId, fetchImpl = fetch }) {
  const submittedAt = new Date().toISOString();
  const subject = 'New website message';
  const text = ['New message from the JUIT NetSec website', '', `Request ID: ${requestId}`, `Submitted: ${submittedAt}`, `Name: ${cleanPlainText(submission.name)}`, `Email: ${cleanPlainText(submission.email)}`, `Phone: ${cleanPlainText(submission.phone) || '-'}`, '', 'Message:', cleanPlainText(submission.message)].join('\n');
  const html = `<h2>New message from the JUIT NetSec website</h2><p><strong>Request ID:</strong> ${escapeHtml(requestId)}<br><strong>Submitted:</strong> ${escapeHtml(submittedAt)}</p><table cellpadding="6" cellspacing="0" style="border-collapse:collapse"><tr><td><strong>Name</strong></td><td>${escapeHtml(submission.name)}</td></tr><tr><td><strong>Email</strong></td><td>${escapeHtml(submission.email)}</td></tr><tr><td><strong>Phone</strong></td><td>${escapeHtml(submission.phone) || '-'}</td></tr></table><h3>Message</h3><p style="white-space:pre-wrap">${escapeHtml(submission.message)}</p>`;
  const response = await fetchImpl(RESEND_ENDPOINT, { method: 'POST', headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json', 'Idempotency-Key': requestId }, body: JSON.stringify({ from: cleanHeader(fromEmail), to: [cleanHeader(toEmail)], reply_to: cleanHeader(submission.email), subject, text, html }), signal: AbortSignal.timeout(10_000) });
  if (!response.ok) { const error = new Error(`Email provider rejected request with status ${response.status}`); error.name = 'EmailProviderError'; throw error; }
  try { const result = await response.json(); return { id: typeof result?.id === 'string' ? result.id : null }; } catch { return { id: null }; }
}
