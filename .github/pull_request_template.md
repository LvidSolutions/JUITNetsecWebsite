## Summary

Describe what changed and why.

## Scope

- [ ] The pull request contains one coherent change.
- [ ] Unrelated local changes are not included.

## Validation

- [ ] `npm ci`
- [ ] `npm audit --audit-level=high`
- [ ] `npm test`
- [ ] `npm run build`
- [ ] Vercel Preview is Ready
- [ ] Relevant routes were tested directly and after refresh
- [ ] Browser console has no new errors

## Security and privacy

- [ ] No secrets or `.env` files are committed.
- [ ] No new `VITE_` variable contains a secret.
- [ ] No personal data is added to application logs, analytics or error reporting.
- [ ] New external origins are documented before CSP changes.
- [ ] Input and authorization checks are enforced server-side where applicable.

## Accessibility and responsive behavior

- [ ] Keyboard behavior was checked.
- [ ] Focus states remain visible.
- [ ] Reduced-motion behavior was considered.
- [ ] Mobile and desktop layouts were checked.

## Deployment notes

List environment-variable, migration, DNS, provider or rollback steps. Write `None` when there are no deployment changes.

## Screenshots

Include screenshots for visual changes or explain why none are required.
