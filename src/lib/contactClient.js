const REQUEST_ID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/iu;

const STATUS_MESSAGES = new Map([
  [400, 'Please check the form fields and try again.'],
  [403, 'The request could not be verified. Please reload the page and try again.'],
  [413, 'The message is too large. Please shorten it and try again.'],
  [415, 'The request format was not accepted. Please reload the page and try again.'],
  [429, 'Too many requests have been sent. Please wait a while and try again.'],
  [502, 'The message could not be delivered right now. Please try again or contact us directly by email.'],
  [503, 'The contact form is temporarily unavailable. Please try again or contact us directly by email.'],
]);

export class ContactRequestError extends Error {
  constructor(code, publicMessage, status = 0, options = {}) {
    super(publicMessage, options);
    this.name = 'ContactRequestError';
    this.code = code;
    this.publicMessage = publicMessage;
    this.status = status;
  }
}

function messageForStatus(status) {
  return STATUS_MESSAGES.get(status) || 'Your message could not be sent. Please try again or contact us directly by email.';
}

export async function submitContact(payload, { fetchImpl = fetch, timeoutMs = 15_000 } = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    let response;
    try {
      response = await fetchImpl('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
    } catch (error) {
      if (error?.name === 'AbortError') {
        throw new ContactRequestError(
          'timeout',
          'The request timed out. Please try again or contact us directly by email.',
          0,
          { cause: error },
        );
      }
      throw new ContactRequestError(
        'network',
        'The contact service could not be reached. Please check your connection and try again.',
        0,
        { cause: error },
      );
    }

    const result = await response.json().catch(() => null);
    if (!response.ok || result?.ok !== true) {
      throw new ContactRequestError('server', messageForStatus(response.status), response.status);
    }

    if (typeof result.requestId !== 'string' || !REQUEST_ID_PATTERN.test(result.requestId)) {
      throw new ContactRequestError(
        'invalid-response',
        'The contact service returned an invalid response. Please try again or contact us directly by email.',
        response.status,
      );
    }

    return { requestId: result.requestId };
  } finally {
    clearTimeout(timeout);
  }
}
