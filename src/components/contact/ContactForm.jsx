import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useEffect, useId, useRef, useState } from 'react';
import { ContactRequestError, submitContact } from '../../lib/contactClient.js';

const EASE = [0.16, 1, 0.3, 1];
const EMPTY_VALUES = { name: '', email: '', phone: '', message: '' };
const FORM_HEADLINE = ['Give', 'us', 'more', 'deets,', 'please!'];
const GENERIC_DELIVERY_ERROR = 'Your message could not be sent. Please try again or contact us directly by email.';

function validate(values) {
  const errors = {};
  const name = values.name.trim();
  const email = values.email.trim();
  const phone = values.phone.trim();
  const message = values.message.trim();

  if (!name) errors.name = 'Please enter your name.';
  else if (name.length < 2 || name.length > 100) errors.name = 'Enter a name between 2 and 100 characters.';

  if (!email) errors.email = 'Please enter your email address.';
  else if (!isValidEmail(email)) errors.email = 'Enter a valid email address.';

  if (phone && !isValidPhone(phone)) errors.phone = 'Enter a valid phone number or leave this field empty.';

  if (!message || message.length < 10) errors.message = 'Please provide a little more detail.';
  else if (message.length > 5000) errors.message = 'Keep your message under 5,000 characters.';

  return errors;
}

function isValidEmail(value) {
  if (value.length > 254 || /\s/u.test(value)) return false;
  const at = value.lastIndexOf('@');
  if (at < 1 || at !== value.indexOf('@')) return false;
  const local = value.slice(0, at);
  const domain = value.slice(at + 1);
  if (local.length > 64 || local.startsWith('.') || local.endsWith('.') || local.includes('..')) return false;
  if (domain.length < 3 || domain.startsWith('.') || domain.endsWith('.') || domain.includes('..')) return false;
  const labels = domain.split('.');
  return labels.length >= 2 && labels.every((label) => /^[\p{L}\p{N}](?:[\p{L}\p{N}-]{0,61}[\p{L}\p{N}])?$/u.test(label));
}

function isValidPhone(value) {
  if (!/^[+()\-\s\d.]+$/u.test(value)) return false;
  return value.replace(/\D/g, '').length >= 6 && value.replace(/\D/g, '').length <= 20;
}

function Turnstile({ onToken }) {
  const ref = useRef(null);
  const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY;

  useEffect(() => {
    if (!siteKey || !ref.current) return undefined;
    let widgetId;
    let existing;
    const clearToken = () => onToken('');
    const render = () => {
      if (!window.turnstile || !ref.current) return;
      widgetId = window.turnstile.render(ref.current, {
        sitekey: siteKey,
        action: 'contact_form',
        theme: 'dark',
        size: 'invisible',
        callback: onToken,
        'expired-callback': clearToken,
        'error-callback': clearToken,
        'timeout-callback': clearToken,
        'unsupported-callback': clearToken,
      });
    };

    existing = document.querySelector('script[data-turnstile-script]');
    if (window.turnstile) render();
    else if (existing) existing.addEventListener('load', render, { once: true });
    else {
      const script = document.createElement('script');
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
      script.async = true;
      script.defer = true;
      script.dataset.turnstileScript = 'true';
      script.addEventListener('load', render, { once: true });
      script.addEventListener('error', clearToken, { once: true });
      document.head.append(script);
      existing = script;
    }

    return () => {
      existing?.removeEventListener('load', render);
      existing?.removeEventListener('error', clearToken);
      if (widgetId !== undefined && window.turnstile) window.turnstile.remove(widgetId);
    };
  }, [onToken, siteKey]);

  return <div ref={ref} className="contact-turnstile" aria-hidden="true" />;
}

function Field({ field, label, values, errors, touched, onChange, onBlur, ...props }) {
  const errorId = `${field}-error`;
  const hasError = touched[field] && errors[field];
  const Component = field === 'message' ? 'textarea' : 'input';
  return (
    <div className="contact-control">
      <label className="contact-visually-hidden" htmlFor={field}>{label}</label>
      <Component
        id={field}
        name={field}
        value={values[field]}
        onChange={onChange}
        onBlur={onBlur}
        aria-invalid={Boolean(hasError)}
        aria-describedby={hasError ? errorId : undefined}
        className="contact-field"
        {...props}
      />
      {hasError && <p id={errorId} className="contact-error">{errors[field]}</p>}
    </div>
  );
}

export function ContactForm() {
  const reduce = useReducedMotion();
  const [state, setState] = useState('intro');
  const [values, setValues] = useState(EMPTY_VALUES);
  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [token, setToken] = useState('');
  const [turnstileResetKey, setTurnstileResetKey] = useState(0);
  const [startedAt, setStartedAt] = useState(0);
  const [submissionId, setSubmissionId] = useState('');
  const headingRef = useRef(null);
  const triggerRef = useRef(null);
  const formRef = useRef(null);
  const previousStateRef = useRef(state);
  const formId = useId();

  useEffect(() => {
    if (state === 'form') headingRef.current?.focus();
    if (state === 'intro' && previousStateRef.current !== 'intro') triggerRef.current?.focus();
    previousStateRef.current = state;
  }, [state]);

  const updateField = (event) => {
    const next = { ...values, [event.target.name]: event.target.value };
    setValues(next);
    if (touched[event.target.name]) setErrors(validate(next));
  };

  const blurField = (event) => {
    setTouched((current) => ({ ...current, [event.target.name]: true }));
    setErrors(validate(values));
  };

  const resetTurnstile = () => {
    setToken('');
    setTurnstileResetKey((current) => current + 1);
  };

  const openForm = () => {
    setStartedAt(Date.now());
    setSubmissionId(crypto.randomUUID());
    setStatus('');
    setState('form');
  };

  const goBack = () => {
    resetTurnstile();
    setState('intro');
    setStatus('');
  };

  const submit = async (event) => {
    event.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);
    setTouched({ name: true, email: true, phone: true, message: true });
    if (Object.keys(nextErrors).length) {
      formRef.current?.querySelector('[aria-invalid="true"]')?.focus();
      return;
    }
    if (!token) {
      setStatus(GENERIC_DELIVERY_ERROR);
      return;
    }

    const formData = new FormData(event.currentTarget);
    setSubmitting(true);
    setStatus('');

    try {
      await submitContact({
        ...values,
        website: String(formData.get('website') || ''),
        turnstileToken: token,
        submissionId,
        formStartedAt: startedAt,
      });
      setToken('');
      setState('success');
    } catch (error) {
      setStatus(error instanceof ContactRequestError ? error.publicMessage : GENERIC_DELIVERY_ERROR);
      resetTurnstile();
    } finally {
      setSubmitting(false);
    }
  };

  const motionProps = reduce ? {} : { initial: { opacity: 0, y: 18 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -12 }, transition: { duration: 0.55, ease: EASE } };
  const formMotionProps = reduce ? {} : {
    initial: { opacity: 0, y: 24, scale: 0.985, clipPath: 'inset(8% 7% round 2.4rem)' },
    animate: { opacity: 1, y: 0, scale: 1, clipPath: 'inset(0% 0% round 2.4rem)' },
    exit: { opacity: 0, y: -12, scale: 0.99, clipPath: 'inset(7% 7% round 2.4rem)' },
    transition: { duration: 0.7, ease: EASE },
  };

  return (
    <section id="kontaktformular" className="contact-experience" aria-labelledby={`${formId}-heading`}>
      <AnimatePresence mode="wait">
        {state === 'intro' && (
          <motion.div key="intro" className="contact-stage contact-stage--intro" {...motionProps}>
            <p className="contact-eyebrow">Contact</p>
            <h1 id={`${formId}-heading`}>Start a conversation.</h1>
            <p className="contact-lede">Tell us what you need help with and we&apos;ll get back to you.</p>
            <button ref={triggerRef} type="button" className="contact-say-hi" onClick={openForm}>
              <span>Say hi</span><span aria-hidden="true">↗</span>
            </button>
          </motion.div>
        )}
        {state === 'form' && (
          <motion.div key="form" className="contact-stage contact-stage--form" {...formMotionProps}>
            <div className="contact-form-heading">
              <p className="contact-eyebrow">Say hi</p>
              <motion.h1
                id={`${formId}-heading`}
                ref={headingRef}
                tabIndex="-1"
                aria-label={FORM_HEADLINE.join(' ')}
              >
                {FORM_HEADLINE.map((word, index) => (
                  <motion.span
                    key={word}
                    className="contact-heading-word"
                    initial={reduce ? false : { opacity: 0, y: '115%' }}
                    animate={reduce ? undefined : { opacity: 1, y: '0%' }}
                    transition={{ duration: 0.58, ease: EASE, delay: 0.16 + index * 0.07 }}
                  >
                    {word}{index < FORM_HEADLINE.length - 1 ? ' ' : ''}
                  </motion.span>
                ))}
              </motion.h1>
            </div>
            <form ref={formRef} noValidate onSubmit={submit} className="contact-form-grid">
              <div className="contact-honeypot" aria-hidden="true">
                <label htmlFor="website">Website</label><input id="website" name="website" tabIndex="-1" autoComplete="off" />
              </div>
              <Field field="name" label="Full Name" placeholder="Full Name" values={values} errors={errors} touched={touched} onChange={updateField} onBlur={blurField} type="text" autoComplete="name" maxLength="100" />
              <div className="contact-field-row">
                <Field field="email" label="Email" placeholder="Email" values={values} errors={errors} touched={touched} onChange={updateField} onBlur={blurField} type="email" autoComplete="email" inputMode="email" spellCheck="false" autoCapitalize="none" maxLength="254" />
                <Field field="phone" label="Phone (optional)" placeholder="Phone (optional)" values={values} errors={errors} touched={touched} onChange={updateField} onBlur={blurField} type="tel" autoComplete="tel" inputMode="tel" maxLength="40" />
              </div>
              <Field field="message" label="Message" placeholder="Message" values={values} errors={errors} touched={touched} onChange={updateField} onBlur={blurField} rows="7" autoComplete="off" maxLength="5000" />
              <Turnstile key={turnstileResetKey} onToken={setToken} />
              <div className="contact-actions">
                <button type="button" className="contact-back" onClick={goBack} disabled={submitting}>Back</button>
                <button type="submit" className="contact-submit" disabled={submitting}>{submitting ? 'Sending…' : 'Send message'}</button>
              </div>
              <div aria-live="polite" className="contact-status">{status && <p>{status} <a href="mailto:contact@juit.se">contact@juit.se</a></p>}</div>
            </form>
          </motion.div>
        )}
        {state === 'success' && (
          <motion.div key="success" className="contact-stage contact-stage--success" {...motionProps} role="status" aria-live="polite">
            <p className="contact-eyebrow">Message sent</p>
            <h1>Thank you for reaching out.</h1>
            <p className="contact-lede">We&apos;ll get back to you as soon as possible.</p>
            <button type="button" className="contact-say-hi" onClick={() => { setValues(EMPTY_VALUES); setTouched({}); setErrors({}); goBack(); }}>Return to contact</button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
