import { randomUUID } from 'node:crypto';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import { sendContactEmail as defaultSendContactEmail } from './services/resend.js';
import { verifyTurnstile as defaultVerifyTurnstile } from './services/turnstile.js';

const NEEDS = [
  'IT infrastructure',
  'Networking & communication',
  'Cybersecurity',
  'Computer operations',
  'IT advisory',
  'Technical project management',
  'Other',
];

const contactBodySchema = {
  type: 'object',
  additionalProperties: false,
  required: ['name', 'email', 'need', 'message'],
  properties: {
    name: { type: 'string', minLength: 2, maxLength: 100 },
    company: { type: 'string', maxLength: 120, default: '' },
    email: { type: 'string', format: 'email', maxLength: 254 },
    phone: { type: 'string', maxLength: 40, default: '' },
    need: { type: 'string', enum: NEEDS },
    message: { type: 'string', minLength: 10, maxLength: 5000 },
    website: { type: 'string', maxLength: 200, default: '' },
    turnstileToken: { type: 'string', maxLength: 2048, default: '' },
  },
};

const responseSchema = {
  200: {
    type: 'object',
    additionalProperties: false,
    required: ['ok', 'requestId'],
    properties: {
      ok: { type: 'boolean' },
      requestId: { type: 'string' },
    },
  },
  400: {
    type: 'object',
    additionalProperties: false,
    required: ['ok', 'message'],
    properties: {
      ok: { type: 'boolean' },
      message: { type: 'string' },
    },
  },
  429: {
    type: 'object',
    additionalProperties: false,
    required: ['ok', 'message'],
    properties: {
      ok: { type: 'boolean' },
      message: { type: 'string' },
    },
  },
  500: {
    type: 'object',
    additionalProperties: false,
    required: ['ok', 'message'],
    properties: {
      ok: { type: 'boolean' },
      message: { type: 'string' },
    },
  },
};

export async function buildApp({
  config,
  sendContactEmail = defaultSendContactEmail,
  verifyTurnstile = defaultVerifyTurnstile,
} = {}) {
  if (!config) throw new Error('config is required');

  const app = Fastify({
    logger: {
      level: config.nodeEnv === 'production' ? 'info' : 'debug',
      redact: ['req.headers.authorization', 'req.headers.cookie'],
    },
    bodyLimit: 20 * 1024,
    requestTimeout: 15_000,
    trustProxy: config.trustProxy,
    ajv: {
      customOptions: {
        removeAdditional: false,
        coerceTypes: false,
        useDefaults: true,
      },
    },
  });

  await app.register(helmet, {
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: { policy: 'same-site' },
  });

  await app.register(cors, {
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type'],
    maxAge: 600,
    origin(origin, callback) {
      if (!origin) return callback(null, true);
      if (config.allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error('Origin not allowed'), false);
    },
  });

  await app.register(rateLimit, {
    global: false,
    max: 100,
    timeWindow: '1 minute',
  });

  app.get('/health', async () => ({ ok: true }));

  app.post(
    '/api/contact',
    {
      config: {
        rateLimit: {
          max: 5,
          timeWindow: '15 minutes',
        },
      },
      schema: {
        body: contactBodySchema,
        response: responseSchema,
      },
    },
    async (request, reply) => {
      const requestId = randomUUID();
      const submission = request.body;

      if (submission.website) {
        request.log.warn({ requestId }, 'Blocked contact form honeypot submission');
        return reply.code(200).send({ ok: true, requestId });
      }

      if (config.turnstileEnabled) {
        if (!submission.turnstileToken) {
          return reply.code(400).send({ ok: false, message: 'Security verification is required.' });
        }

        const verified = await verifyTurnstile({
          secret: config.turnstileSecretKey,
          token: submission.turnstileToken,
          remoteIp: request.ip,
        });

        if (!verified) {
          return reply.code(400).send({ ok: false, message: 'Security verification failed.' });
        }
      }

      await sendContactEmail({ config, submission, requestId });
      request.log.info({ requestId }, 'Contact request delivered');
      return reply.code(200).send({ ok: true, requestId });
    },
  );

  app.setErrorHandler((error, request, reply) => {
    if (error.statusCode === 429) {
      return reply.code(429).send({
        ok: false,
        message: 'Too many requests. Please try again later.',
      });
    }

    if (error.validation) {
      return reply.code(400).send({
        ok: false,
        message: 'Please check the form fields and try again.',
      });
    }

    if (error.message === 'Origin not allowed') {
      return reply.code(403).send({
        ok: false,
        message: 'Request origin is not allowed.',
      });
    }

    request.log.error({ err: error }, 'Unhandled contact API error');
    return reply.code(500).send({
      ok: false,
      message: 'The request could not be sent right now. Please try again later.',
    });
  });

  return app;
}
