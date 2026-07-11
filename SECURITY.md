# Security policy

## Supported code

Security fixes are applied to the currently deployed production branch and active release branches. Experimental and archived branches are not supported unless they are being prepared for deployment.

## Reporting a vulnerability

Do not publish suspected vulnerabilities, credentials, personal data or exploitation details in a public issue.

Use GitHub's private vulnerability reporting or a private security advisory for this repository when available. If that channel is unavailable, contact JUIT NetSec AB through a confirmed private company channel listed on the production website and request a secure reporting method.

A useful report includes:

- affected URL, endpoint or commit;
- clear reproduction steps;
- expected and observed impact;
- whether personal data, credentials or availability may be affected;
- proof-of-concept material with secrets and personal data removed;
- a safe way to contact the reporter.

## Handling expectations

The maintainers should:

1. acknowledge receipt without confirming impact prematurely;
2. restrict access to the report and preserve relevant evidence;
3. assess severity, exploitability and personal-data impact;
4. rotate exposed credentials immediately when applicable;
5. prepare and verify a fix in a protected environment;
6. deploy or roll back using the documented release process;
7. evaluate notification duties with the responsible legal contact;
8. publish a limited advisory only after affected systems are protected.

## Secrets

Never include real API keys, tokens, passwords, cookies, private URLs or personal data in issues, pull requests, screenshots, test fixtures or logs. Use placeholders such as `EMAIL_API_KEY`, `TURNSTILE_SECRET_KEY` and `REDIS_REST_TOKEN`.
