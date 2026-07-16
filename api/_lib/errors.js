export class HttpError extends Error {
  constructor(status, publicMessage, options = {}) {
    super(publicMessage, options);
    this.name = 'HttpError';
    this.status = status;
    this.publicMessage = publicMessage;
    this.headers = options.headers || {};
  }
}

export class ConfigurationError extends Error {
  constructor(missingKeys) {
    super(`Missing required configuration: ${missingKeys.join(', ')}`);
    this.name = 'ConfigurationError';
    this.missingKeys = missingKeys;
  }
}
