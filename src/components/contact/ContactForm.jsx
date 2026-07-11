import { useState } from 'react';
import { submitContactRequest } from '../../lib/contactApi.js';
import { readPublicContactConfig } from '../../lib/contactConfig.js';
import { TurnstileWidget } from './TurnstileWidget.jsx';

const fields = [
  { id: 'name', label: 'Name', type: 'text', autoComplete: 'name', placeholder: 'First and last name', required: true },
  { id: 'company', label: 'Company', type: 'text', autoComplete: 'organization', placeholder: 'Organization' },
  { id: 'email', label: 'Email', type: 'email', autoComplete: 'email', placeholder: 'Your email address', required: true },
  { id: 'phone', label: 'Phone', type: 'tel', autoComplete: 'tel', placeholder: '+46 ...' },
];

const needs = [
  'IT infrastructure',
  'Networking & communication',
  'Cybersecurity',
  'Computer operations',
  'IT advisory',
  'Technical project management',
  'Other',
];

const labelClass = 'mb-2.5 block text-[11px] font-medium uppercase tracking-[0.2em] text-brand-mist/55';
const contactConfig = readPublicContactConfig(import.meta.env);

function createSubmissionId() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();

  const bytes = new Uint8Array(16);

  if (globalThis.crypto?.getRandomValues) {
    globalThis.crypto.getRandomValues(bytes);
  } else {
    for (let index = 0; index < bytes.length; index += 1) {
      bytes[index] = Math.floor(Math.random() * 256);
    }
  }

  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;

  const hex = [...bytes].map((value) => value.toString(16).padStart(2, '0'));
  return `${hex.slice(0, 4).join('')}-${hex.slice(4, 6).join('')}-${hex.slice(6, 8).join('')}-${hex.slice(8, 10).join('')}-${hex.slice(10).join('')}`;
}

function Field({ id, label, type, autoComplete, placeholder, required }) {
  return (
    <label className="block" htmlFor={id}>
      <span className={labelClass}>{label}</span>
      <input
        id={id}
        name={id}
        type={type}
        autoComplete={autoComplete}
        placeholder={placeholder}
        required={required}
        maxLength={id === 'email' ? 254 : id === 'phone' ? 40 : id === 'company' ? 120 : 100}
        className="contact-field"
      />
    </label>
  );
}

export function ContactForm() {
  const [status, setStatus] = useState(contactConfig.configured ? 'idle' : 'error');
  const [feedback, setFeedback] = useState(
    contactConfig.configured ? '' : 'The contact form is temporarily unavailable. Please use the contact details above.',
  );
  const [turnstileToken, setTurnstileToken] = useState('');
  const [turnstileResetKey, setTurnstileResetKey] = useState(0);
  const [submissionId, setSubmissionId] = useState(createSubmissionId);

  async function handleSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;

    if (!contactConfig.configured) {
      setStatus('error');
      setFeedback('The contact form is temporarily unavailable. Please use the contact details above.');
      return;
    }

    if (!form.reportValidity()) return;

    if (!turnstileToken) {
      setStatus('error');
      setFeedback('Please complete the security verification before sending.');
      return;
    }

    setStatus('submitting');
    setFeedback('');

    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());
    payload.turnstileToken = turnstileToken;
    payload.submissionId = submissionId;

    try {
      await submitContactRequest(payload);
      form.reset();
      setTurnstileToken('');
      setTurnstileResetKey((value) => value + 1);
      setSubmissionId(createSubmissionId());
      setStatus('success');
      setFeedback('Thank you. Your request has been sent and we will get back to you shortly.');
    } catch (error) {
      setStatus('error');
      setFeedback(error instanceof Error ? error.message : 'The request could not be sent.');
      setTurnstileToken('');
      setTurnstileResetKey((value) => value + 1);
    }
  }

  function handleTurnstileError() {
    setTurnstileToken('');
    setStatus('error');
    setFeedback('The security verification could not be loaded. Please reload the page and try again.');
  }

  const submitting = status === 'submitting';
  const submitDisabled = submitting || !contactConfig.configured || !turnstileToken;

  return (
    <section
      id="kontaktformular"
      aria-labelledby="contact-form-title"
      className="relative px-4 py-20 sm:px-6 lg:py-28"
    >
      <div
        aria-hidden="true"
        className="contact-form-glow pointer-events-none absolute inset-x-0 top-1/2 -z-10 -translate-y-1/2"
      />

      <div className="contact-panel mx-auto w-full max-w-5xl overflow-hidden rounded-[28px] px-6 py-14 sm:rounded-[40px] sm:px-12 sm:py-16 lg:px-20 lg:py-[5.5rem]">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-mono text-xs font-medium uppercase tracking-[0.32em] text-brand-green sm:text-sm">
            Write to us
          </p>
          <h2
            id="contact-form-title"
            className="mt-5 font-display text-3xl font-semibold leading-[1.1] tracking-tight text-brand-white sm:text-[2.6rem]"
          >
            Tell us briefly about your needs
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-brand-mist/60 sm:text-lg sm:leading-8">
            Describe your current situation, needs or project and we'll get back to you for a first
            conversation. The more context, the better we can prepare.
          </p>
        </div>

        <div className="mx-auto mt-9 flex max-w-md flex-col items-center justify-center gap-5 text-center sm:flex-row sm:gap-12">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-brand-green/70">Email</p>
            <a
              href="mailto:contact@juit.se"
              className="mt-1.5 inline-block font-display text-base font-medium text-brand-white transition-colors hover:text-brand-green"
            >
              contact@juit.se
            </a>
          </div>
          <div aria-hidden="true" className="hidden h-8 w-px bg-brand-line sm:block" />
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-brand-green/70">Phone</p>
            <a
              href="tel:+46708256393"
              className="mt-1.5 inline-block font-display text-base font-medium text-brand-white transition-colors hover:text-brand-green"
            >
              +46 708-25 63 93
            </a>
          </div>
        </div>

        <form
          className="mx-auto mt-12 grid max-w-3xl gap-6 text-left sm:mt-14"
          onSubmit={handleSubmit}
          aria-busy={submitting}
        >
          <div className="grid gap-6 sm:grid-cols-2">
            {fields.map((field) => (
              <Field key={field.id} {...field} />
            ))}
          </div>

          <label className="block" htmlFor="need">
            <span className={labelClass}>Type of need</span>
            <select id="need" name="need" defaultValue="" required className="contact-field appearance-none">
              <option value="" disabled>
                Choose an area …
              </option>
              {needs.map((option) => (
                <option key={option} value={option} className="bg-brand-black text-brand-white">
                  {option}
                </option>
              ))}
            </select>
          </label>

          <label className="block" htmlFor="message">
            <span className={labelClass}>Message</span>
            <textarea
              id="message"
              name="message"
              rows="5"
              minLength="10"
              maxLength="5000"
              required
              placeholder="Describe your current situation, needs or project …"
              className="contact-field contact-field--area"
            />
          </label>

          <div className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
            <label htmlFor="website">Website</label>
            <input id="website" name="website" type="text" tabIndex="-1" autoComplete="off" />
          </div>

          {contactConfig.configured && (
            <TurnstileWidget
              siteKey={contactConfig.turnstileSiteKey}
              onVerify={setTurnstileToken}
              onError={handleTurnstileError}
              resetKey={turnstileResetKey}
            />
          )}

          <button
            type="submit"
            disabled={submitDisabled}
            className="group mt-2 inline-flex min-h-[3.5rem] w-full items-center justify-center gap-3 rounded-full bg-brand-green px-8 text-[13px] font-semibold uppercase tracking-[0.18em] text-brand-black transition-all duration-200 ease-smooth hover:bg-brand-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? 'Sending…' : 'Send request'}
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="transition-transform duration-300 ease-smooth group-hover:translate-x-0.5">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <p
            className={`min-h-6 text-center text-sm ${status === 'error' ? 'text-red-300' : 'text-brand-mist/70'}`}
            role={status === 'error' ? 'alert' : 'status'}
            aria-live="polite"
          >
            {feedback}
          </p>
        </form>
      </div>
    </section>
  );
}
