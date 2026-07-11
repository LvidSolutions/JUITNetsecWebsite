export class ContactRequestError extends Error {
  constructor(message, { code = 'request_failed', status = null } = {}) {
    super(message);
    this.name = 'ContactRequestError';
    this.code = code;
    this.status = status;
  }
}

function publicMessage(value, fallback) {
  if (typeof value !== 'string') return fallback;
  const normalized = value.trim();
  if (!normalized || normalized.length > 240) return fallback;
  return normalized;
}

export async function submitContactRequest(
  payload,
  {
    apiUrl = '/api/contact',
    fetchImpl = fetch,
    timeoutMs = 15_000,
    setTimeoutImpl = setTimeout,
    clearTimeoutImpl = clearTimeout,
  } = {},
) {
  const controller = new AbortController();
  const timeout = setTimeoutImpl(() => controller.abort(), timeoutMs);

  try {
    const response = await fetchImpl(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    const result = await response.json().catch(() => null);

    if (!response.ok) {
      throw new ContactRequestError(
        publicMessage(result?.message, 'The request could not be sent.'),
        { code: 'http_error', status: response.status },
      );
    }

    if (result?.ok !== true || typeof result.requestId !== 'string' || result.requestId.length === 0) {
      throw new ContactRequestError('The server returned an invalid response. Please try again.', {
        code: 'invalid_response',
        status: response.status,
      });
    }

    return result;
  } catch (error) {
    if (error instanceof ContactRequestError) throw error;

    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new ContactRequestError('The request timed out. Please check your connection and try again.', {
        code: 'timeout',
      });
    }

    throw new ContactRequestError('The request could not be sent. Please check your connection and try again.', {
      code: 'network_error',
    });
  } finally {
    clearTimeoutImpl(timeout);
  }
}
