import { useRef, useState } from 'react';
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion';
import { cn } from '../../lib/cn';

const EASE = [0.22, 1, 0.36, 1];
const TEXT_EASE = [0.2, 1, 0.32, 1];
const SCROLL_SPRING = { stiffness: 64, damping: 30, mass: 0.82 };
const VISUAL_TRACK_INPUT = [0, 0.26, 0.43, 0.57, 0.74, 1];
const VISUAL_TRACK_OUTPUT = ['0%', '0%', '-33.333333%', '-33.333333%', '-66.666667%', '-66.666667%'];
const TRANSITION_START = [0.26, 0.57];
const TRANSITION_END = [0.43, 0.74];
const TEXT_SWITCH_THRESHOLD = {
  down: TRANSITION_END,
  up: TRANSITION_START,
};

const infrastructureImage = '/assets/scroll-feature-infrastructure.png';
const securityImage = '/assets/scroll-feature-security-communication.png';
// Replace null with the final practical expertise image path when it is ready.
const practicalExpertiseImage = null;

const featureSteps = [
  {
    eyebrow: 'Infrastructure',
    title: 'Stable IT environments built for real operations.',
    text: 'Reliable infrastructure, networking and communication for organizations that need secure technical foundations.',
    imageSrc: infrastructureImage,
    imageAlt: 'Dark server hall with secure network infrastructure and green accent lighting.',
  },
  {
    eyebrow: 'Security & Communication',
    title: 'Secure communication without unnecessary complexity.',
    text: 'Structured environments and practical security expertise for businesses that need systems they can trust.',
    imageSrc: securityImage,
    imageAlt: 'Stockholm city hall at night with a subtle digital communication network overlay.',
  },
  {
    eyebrow: 'Practical Expertise',
    title: 'Senior expertise from real technical environments.',
    text: 'Hands-on experience from IT environments where stability, security and clear communication are critical.',
    imageSrc: practicalExpertiseImage,
    imageAlt: 'Image placeholder for practical expertise.',
    placeholder: !practicalExpertiseImage,
  },
];

function formatStep(index) {
  return String(index + 1).padStart(2, '0');
}

function getSyncedTextIndex(progress, direction) {
  if (direction >= 0) {
    if (progress >= TEXT_SWITCH_THRESHOLD.down[1]) return 2;
    if (progress >= TEXT_SWITCH_THRESHOLD.down[0]) return 1;
    return 0;
  }

  if (progress <= TEXT_SWITCH_THRESHOLD.up[0]) return 0;
  if (progress <= TEXT_SWITCH_THRESHOLD.up[1]) return 1;
  return 2;
}

function DesktopProgress({ activeIndex, progressScale }) {
  return (
    <div className="mt-10 w-full max-w-[22rem]">
      <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.22em] text-brand-mist/38">
        <span className="text-brand-green">{formatStep(activeIndex)} / 03</span>
        <span>{featureSteps[activeIndex].eyebrow}</span>
      </div>
      <div className="mt-4 h-px overflow-hidden bg-white/10">
        <motion.div className="h-full origin-left bg-brand-green" style={{ scaleX: progressScale }} />
      </div>
      <div className="mt-5 flex items-center gap-3">
        {featureSteps.map((step, index) => (
          <span
            key={step.eyebrow}
            className={cn(
              'h-2 w-2 rounded-full border transition-colors duration-500',
              index === activeIndex
                ? 'border-brand-green bg-brand-green shadow-[0_0_18px_rgba(0,200,83,0.45)]'
                : 'border-brand-mist/24 bg-transparent',
            )}
            aria-label={`${step.eyebrow} ${index === activeIndex ? 'active' : 'inactive'}`}
          />
        ))}
      </div>
    </div>
  );
}

function PlaceholderVisual() {
  return (
    <div className="relative flex h-full min-h-[22rem] items-center justify-center overflow-hidden bg-[#050806]">
      <div
        className="absolute inset-0 opacity-35"
        style={{
          backgroundImage:
            'linear-gradient(rgba(0,200,83,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(0,200,83,0.12) 1px, transparent 1px)',
          backgroundSize: '46px 46px',
        }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(0,200,83,0.18),transparent_42%)]"
        aria-hidden="true"
      />
      <div className="relative flex max-w-sm flex-col items-center px-8 text-center">
        <div className="relative mb-7 h-20 w-28 border border-brand-green/45 shadow-[0_0_42px_rgba(0,200,83,0.16)]">
          <span className="absolute left-4 top-4 h-2 w-2 rounded-full bg-brand-green" />
          <span className="absolute right-5 top-7 h-2 w-2 rounded-full border border-brand-green" />
          <span className="absolute bottom-5 left-1/2 h-2 w-2 rounded-full bg-brand-green/70" />
          <span className="absolute left-5 top-5 h-px w-16 rotate-12 bg-brand-green/45" />
          <span className="absolute bottom-6 left-10 h-px w-12 -rotate-12 bg-brand-green/35" />
        </div>
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-brand-green">
          Image placeholder {'\u2014'} practical expertise
        </p>
      </div>
    </div>
  );
}

function VisualPanel({ step, active, prefersReducedMotion }) {
  return (
    <motion.div
      className="relative h-1/3 overflow-hidden"
      initial={false}
      animate={{ opacity: active ? 1 : 0.72 }}
      transition={{ duration: prefersReducedMotion ? 0 : 0.9, ease: EASE }}
    >
      {step.placeholder ? (
        <PlaceholderVisual />
      ) : (
        <motion.img
          src={step.imageSrc}
          alt={step.imageAlt}
          className="h-full w-full object-cover"
          draggable="false"
          animate={{ scale: active && !prefersReducedMotion ? 1.025 : 1.07 }}
          transition={{ duration: 1.35, ease: EASE }}
        />
      )}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/26 via-transparent to-black/12" />
    </motion.div>
  );
}

function VisualStack({ activeIndex, panelY, prefersReducedMotion }) {
  return (
    <motion.div
      className="absolute inset-x-0 top-0 h-[300%] will-change-transform"
      style={prefersReducedMotion ? undefined : { y: panelY }}
      animate={prefersReducedMotion ? { y: `-${activeIndex * 33.333333}%` } : undefined}
      transition={{ duration: 0.85, ease: EASE }}
    >
      {featureSteps.map((step, index) => (
        <VisualPanel
          key={step.eyebrow}
          step={step}
          active={index === activeIndex}
          prefersReducedMotion={prefersReducedMotion}
        />
      ))}
    </motion.div>
  );
}

function MobileStep({ step, index }) {
  return (
    <article className="overflow-hidden border-t border-brand-line bg-brand-black">
      <div className="relative aspect-[4/3] overflow-hidden">
        {step.placeholder ? (
          <PlaceholderVisual />
        ) : (
          <img src={step.imageSrc} alt={step.imageAlt} className="h-full w-full object-cover" loading="lazy" />
        )}
      </div>
      <div className="px-5 py-8">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-brand-green">
          {formatStep(index)} / {step.eyebrow}
        </p>
        <h3 className="mt-4 text-3xl font-semibold leading-[1.02] tracking-tight text-brand-white">
          {step.title}
        </h3>
        <p className="mt-5 text-base leading-7 text-brand-mist/72">{step.text}</p>
      </div>
    </article>
  );
}

export function ScrollFeatureSection() {
  const sectionRef = useRef(null);
  const lastProgressRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });
  const smoothProgress = useSpring(scrollYProgress, SCROLL_SPRING);
  const panelY = useTransform(smoothProgress, VISUAL_TRACK_INPUT, VISUAL_TRACK_OUTPUT);
  const progressScale = useTransform(smoothProgress, [0, 1], [0.08, 1]);

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    const previous = lastProgressRef.current;
    const direction = latest >= previous ? 1 : -1;
    lastProgressRef.current = latest;
    setActiveIndex(getSyncedTextIndex(latest, direction));
  });

  const activeStep = featureSteps[activeIndex];

  return (
    <section ref={sectionRef} className="bg-brand-black text-brand-white lg:h-[340vh]">
      <div className="lg:sticky lg:top-0 lg:h-screen lg:overflow-hidden">
        <div className="hidden lg:grid lg:h-screen lg:grid-cols-2">
          <div className="relative flex min-h-screen flex-col justify-end overflow-hidden bg-brand-black px-[clamp(2rem,5vw,6rem)] pb-[12vh] pt-28">
            <div
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_74%,rgba(0,200,83,0.16),transparent_34%),linear-gradient(180deg,rgba(255,255,255,0.025),transparent_42%)]"
              aria-hidden="true"
            />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-px bg-brand-green/18" aria-hidden="true" />

            <motion.div
              key={activeStep.eyebrow}
              className="relative max-w-[43rem]"
              initial={prefersReducedMotion ? false : { opacity: 0, y: 28, filter: 'blur(6px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.68, ease: TEXT_EASE }}
            >
              <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-brand-green">
                {activeStep.eyebrow}
              </p>
              <h2 className="mt-6 text-[clamp(3rem,4.8vw,6rem)] font-semibold leading-[0.96] tracking-tight text-brand-white">
                {activeStep.title}
              </h2>
              <p className="mt-8 max-w-[34rem] text-xl leading-8 text-brand-mist/76">
                {activeStep.text}
              </p>
              <div className="mt-7 inline-flex items-center gap-2 rounded-full border border-brand-green/40 bg-brand-green/5 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-brand-mist">
                <span className="h-2 w-2 rounded-full bg-brand-green shadow-[0_0_18px_rgba(0,200,83,0.55)]" />
                JUIT NetSec layer
              </div>
            </motion.div>

            <div className="relative">
              <DesktopProgress activeIndex={activeIndex} progressScale={progressScale} />
            </div>
          </div>

          <div className="relative h-screen overflow-hidden bg-brand-black">
            <VisualStack
              activeIndex={activeIndex}
              panelY={panelY}
              prefersReducedMotion={prefersReducedMotion}
            />
            <div className="pointer-events-none absolute inset-y-0 left-0 w-px bg-brand-green/16" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/44 to-transparent" />
            <div className="absolute bottom-6 left-7 right-7 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.22em] text-white/72">
              <span>{formatStep(activeIndex)} / 03</span>
              <span className="text-brand-green">{activeStep.eyebrow}</span>
            </div>
          </div>
        </div>

        <div className="lg:hidden">
          <div className="relative overflow-hidden bg-brand-black px-5 pb-10 pt-16">
            <div
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_8%_18%,rgba(0,200,83,0.15),transparent_38%)]"
              aria-hidden="true"
            />
            <div className="relative">
              <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-brand-green">
                About JUIT NetSec
              </p>
              <h2 className="mt-5 text-4xl font-semibold leading-[1.02] tracking-tight text-brand-white">
                Secure technical foundations, built for real operations.
              </h2>
              <p className="mt-5 text-base leading-7 text-brand-mist/72">
                Three core layers of JUIT NetSec's work: infrastructure, secure communication and practical expertise.
              </p>
            </div>
          </div>
          {featureSteps.map((step, index) => (
            <MobileStep key={step.eyebrow} step={step} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
