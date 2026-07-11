import { randomUUID } from 'node:crypto';
import { loadContactConfig } from './config.js';
import { ConfigurationError, HttpError } from './errors.js';
import { consumeContactRateLimit } from './rate-limit.js';
import { getClientAddress, assertSameOrigin } from './request-security.js';
import { sendContactEmail } from './resend.js';
import { verifyTurnstile } from './turnstile.js';
import { readJsonBody, validateContactSubmission } from './validation.js';

function jsonResponse(body, status = 200, extraHeaders = {}) {
  return Response.json(body, {
    status,
    headers: {
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
      ...extraHeaders,
    },
  });
}

function safeLog(logger, level, event) {
  const method = logger?.[level] || logger?.log;
  if (typeof method !== 'function') return;
  method.call(logger, JSON.stringify(event));
}

export async function handleContactRequest(
  request,
  {
    env = process.env,
    fetchImpl = fetch,
    now = Date.now(),
    logger = console,
    loadConfig = loadContactConfig,
    consumeRateLimit = consumeContactRateLimit,
    verifyCaptcha = verifyTurnstile,
    deliverEmail = sendContactEmail,
  } = {},
) {
  let requestId = randomUUID();

  try {
    const config = loadConfig(env);
    if (!config.enabled) {
      throw new HttpError(503, 'The contact form is temporarily unavailable.');
    }

    assertSameOrigin(request);

    const body = await readJsonBody(request);
    const submission = validateContactSubmission(body);
    requestId = submission.submissionId;

    const rateLimit = await consumeRateLimit({
      request,
      upstashUrl: config.upstashUrl,
      upstashToken: config.upstashToken,
      hashSecret: config.rateLimitHashSecret,
      max: config.rateLimitMax,
      windowSeconds: config.rateLimitWindowSeconds,
      now,
      fetchImpl,
    });

    if (!rateLimit.allowed) {
      throw new HttpError(429, 'Too many requests. Please try again later.', {
        headers: { 'Retry-After': String(rateLimit.retryAfter) },
      });
    }

    if (submission.website) {
      safeLog(logger, 'warn', {
        event: 'contact_honeypot_blocked',
        requestId,
      });
      return jsonResponse({ ok: true, requestId }, 202);
    }

    const requestHostname = new URL(request.url).hostname;
    const allowedHostnames = new Set([
      requestHostname,
      ...config.allowedTurnstileHostnames,
    ]);

    let captchaValid;
    try {
      captchaValid = await verifyCaptcha({
        secret: config.turnstileSecretKey,
        token: submission.turnstileToken,
        remoteIp: getClientAddress(request),
        expectedAction: 'contact_form',
        allowedHostnames: [...allowedHostnames],
        fetchImpl,
      });
    } catch {
      throw new HttpError(503, 'The security verification service is temporarily unavailable.');
    }

    if (!captchaValid) {
      throw new HttpError(400, 'Security verification failed. Please try again.');
    }

    const email = await deliverEmail({
      apiKey: config.resendApiKey,
      fromEmail: config.fromEmail,
      toEmail: config.toEmail,
      submission,
      requestId,
      fetchImpl,
    });

    safeLog(logger, 'info', {
      event: 'contact_delivered',
      requestId,
      providerMessageId: email?.id || null,
    });

    return jsonResponse({ ok: true, requestId }, 202, {
      'X-RateLimit-Remaining': String(rateLimit.remaining),
    });
  } catch (error) {
    if (error instanceof HttpError) {
      safeLog(logger, error.status >= 500 ? 'error' : 'warn', {
        event: 'contact_request_rejected',
        requestId,
        status: error.status,
        errorName: error.name,
      });
      return jsonResponse(
        { ok: false, message: error.publicMessage },
        error.status,
        error.headers,
      );
    }

    if (error instanceof ConfigurationError) {
      safeLog(logger, 'error', {
        event: 'contact_configuration_error',
        requestId,
        missingKeys: error.missingKeys,
      });
      return jsonResponse(
        { ok: false, message: 'The contact form is temporarily unavailable.' },
        503,
      );
    }

    safeLog(logger, 'error', {
      event: 'contact_unhandled_error',
      requestId,
      errorName: error?.name || 'Error',
    });

    return jsonResponse(
      { ok: false, message: 'The request could not be sent right now. Please try again later.' },
      502,
    );
  }
}
