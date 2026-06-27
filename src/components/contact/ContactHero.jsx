import { motion, useReducedMotion } from 'framer-motion';
import { Container } from '../ui';
import { ContactVideoObject } from './ContactVideoObject.jsx';

const EASE = [0.16, 1, 0.3, 1];

function MaskReveal({ as: Tag = 'span', children, delay = 0, duration = 1, className = '', reduce }) {
  if (reduce) return <Tag className={className}>{children}</Tag>;
  return (
    <span className="block overflow-hidden pb-[0.12em]">
      <motion.span
        className={`block ${className}`}
        initial={{ y: '115%' }}
        animate={{ y: '0%' }}
        transition={{ duration, ease: EASE, delay }}
      >
        {children}
      </motion.span>
    </span>
  );
}

export function ContactHero() {
  const reduce = useReducedMotion();

  return (
    <section
      aria-labelledby="contact-hero-title"
      className="relative isolate flex min-h-[100svh] flex-col justify-center overflow-hidden pb-24 pt-28 sm:pt-32 lg:pb-28 lg:pt-36"
    >
      <Container className="relative z-30">
        <motion.div
          className="flex justify-end"
          initial={reduce ? false : { opacity: 0, y: -8 }}
          animate={reduce ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.15 }}
        >
          <a
            href="#kontaktformular"
            className="group inline-flex items-center gap-3 rounded-full border border-brand-line bg-white/[0.03] py-2 pl-6 pr-2 text-sm font-semibold uppercase tracking-[0.14em] text-brand-white backdrop-blur-sm transition-colors duration-200 hover:border-brand-green/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
          >
            Discuss your needs
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-green text-brand-black transition-transform duration-300 ease-smooth group-hover:translate-x-0.5">
              <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </a>
        </motion.div>
      </Container>

      <Container className="relative mt-10 flex-1 sm:mt-12 lg:mt-0 lg:flex lg:max-w-[96rem] lg:items-center">
        <div className="relative w-full">
          <h1
            id="contact-hero-title"
            className="font-display font-bold uppercase leading-[0.82] tracking-[-0.04em] text-brand-white"
          >
            <MaskReveal
              reduce={reduce}
              delay={0.05}
              duration={1.15}
              className="whitespace-nowrap text-[clamp(4.4rem,25vw,10rem)] sm:text-[clamp(7.5rem,22vw,15rem)] lg:text-[clamp(12rem,17vw,20rem)]"
            >
              CONTACT
            </MaskReveal>
          </h1>

          <div className="pointer-events-none absolute right-[-3vw] top-1/2 z-20 hidden w-[42vw] max-w-[720px] -translate-y-[56%] lg:block">
            <ContactVideoObject reveal />
          </div>

          <div className="relative z-10 mt-7 max-w-2xl lg:-mt-[1vw] lg:ml-[8%] xl:ml-[10%]">
            <h2 className="font-display text-[7vw] font-semibold leading-[1.02] tracking-tight text-brand-white sm:text-4xl lg:text-[2.6rem]">
              <MaskReveal reduce={reduce} delay={0.42} duration={0.9}>
                Start a conversation
              </MaskReveal>
              <MaskReveal reduce={reduce} delay={0.52} duration={0.9}>
                about your IT environment.
              </MaskReveal>
            </h2>

            <motion.p
              className="mt-6 max-w-xl text-base leading-relaxed text-brand-mist/65 sm:text-lg sm:leading-8"
              initial={reduce ? false : { opacity: 0, y: 16 }}
              animate={reduce ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: EASE, delay: 0.72 }}
            >
              JUIT NetSec helps companies build more stable infrastructure, more secure communication
              and better technical control.
            </motion.p>
          </div>

          <div className="mt-10 lg:hidden">
            <ContactVideoObject className="mx-auto w-[78%] max-w-[420px]" reveal />
          </div>
        </div>
      </Container>

      <Container className="relative z-10">
        <motion.div
          className="mt-10 flex items-center gap-3 lg:mt-12"
          initial={reduce ? false : { opacity: 0 }}
          animate={reduce ? undefined : { opacity: 1 }}
          transition={{ duration: 0.6, ease: EASE, delay: 1 }}
        >
          <span className="contact-scroll-line" aria-hidden="true" />
          <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-brand-mist/45">Scroll</span>
        </motion.div>
      </Container>
    </section>
  );
}
