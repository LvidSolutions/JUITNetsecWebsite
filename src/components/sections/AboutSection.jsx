import { useRef, useState } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import './AboutDemo.css';

const disciplines = [
  { title: 'IT Infrastructure', text: 'Reliable infrastructure, networking and communication for organizations that need secure technical foundations.', image: '/assets/scroll-feature-infrastructure.png' },
  { title: 'Network & Secure Communication', text: 'Structured environments and practical security expertise for businesses that need systems they can trust.', image: '/assets/scroll-feature-security-communication.png' },
  { title: 'Cybersecurity', text: 'Practical cybersecurity guidance, cloud and identity hardening, incident readiness, compliance support and security awareness.', image: '/assets/scroll-feature-infrastructure.png' },
  { title: 'IT Operations', text: 'Support, advise, improve and maintain secure IT operations over time with clear communication and technical ownership.', image: '/assets/scroll-feature-security-communication.png' },
  { title: 'Technical Advisory & IT Management', text: 'Connect IT and security across identity, tooling, visibility, ownership, governance and continuous improvement.', image: '/assets/scroll-feature-infrastructure.png' },
];

function Reveal({ children, className = '' }) {
  const reduce = useReducedMotion();
  return <motion.div className={className} initial={reduce ? false : { opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.15 }}
    transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}>{children}</motion.div>;
}

export function AboutSection() {
  const hero = useRef(null);
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({ target: hero, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);

  return <div className="about-demo">
    <section ref={hero} className="about-demo__hero">
      <div className="about-demo__hero-top"><span>JUIT NETSEC AB</span><span>STOCKHOLM, SWEDEN</span></div>
      <div className="about-demo__hero-copy">
        <p className="about-demo__label">Practical expertise. Connected thinking.</p>
        <h1>Built for<br /><span>real operations.</span></h1>
        <p className="about-demo__lead">IT infrastructure, secure communication and cybersecurity.<br />{' '}Practical expertise for the environments you depend on.</p>
        <a className="about-demo__link" href="/kontakt">Talk to JUIT NetSec <span aria-hidden="true">↗</span></a>
      </div>
      <div className="about-demo__hero-image" aria-hidden="true">
        <motion.img src="/assets/scroll-feature-infrastructure.png" alt="" width="1672" height="941"
          style={reduce ? undefined : { y, scale }} />
        <div className="about-demo__reticle"><span /><span /><span /><span /></div>
        <p>INFRASTRUCTURE / SECURITY / OPERATIONS</p>
      </div>
      <div className="about-demo__hero-foot"><span>Technical foundations.</span><span>Human judgment.</span><span className="about-demo__square" /></div>
    </section>

    <section className="about-demo__statement">
      <p className="about-demo__label">The way we work</p>
      <Reveal><h2>Complex environments.<br /><span>Clear decisions.</span></h2></Reveal>
      <div className="about-demo__statement-bottom">
        <span className="about-demo__cross" aria-hidden="true">+</span>
        <Reveal><p>JUIT NetSec connects infrastructure, secure communication, cybersecurity and operations into a practical workflow from context to long-term support.</p>
        <p>The best security work is calm, practical and built for continuity.</p></Reveal>
      </div>
    </section>

    <section className="about-demo__expertise" aria-labelledby="about-expertise">
      <div className="about-demo__section-head"><h2 id="about-expertise">One connected<br />technical perspective.</h2><p>From the foundations to everyday operations.<br />Explore our areas of expertise.</p></div>
      <div className="about-demo__expertise-grid">
        <div className="about-demo__disciplines">
          {disciplines.map((item, index) => <div key={item.title} className={'about-demo__discipline' + (index === active ? ' is-active' : '')}>
            <h3><button aria-expanded={index === active} aria-controls={'about-discipline-' + index} onClick={() => setActive(index)}>
              <span>{item.title}</span><span aria-hidden="true">{index === active ? '−' : '+'}</span>
            </button></h3>
            <div id={'about-discipline-' + index} hidden={index !== active}><p>{item.text}</p></div>
          </div>)}
        </div>
        <div className="about-demo__expertise-image">
          <motion.img key={disciplines[active].image} src={disciplines[active].image} alt="" width="1672" height="941"
            loading="lazy" initial={reduce ? false : { opacity: 0.5 }} animate={{opacity:1}} transition={{duration:.25}} />
          <div className="about-demo__image-label"><span className="about-demo__square" />{disciplines[active].title}</div>
        </div>
      </div>
    </section>

    <section className="about-demo__principles">
      <Reveal><h2>Calm. Practical.<br /><span>Built for continuity.</span></h2></Reveal>
      <div className="about-demo__principle-grid">
        <article><span>CONTEXT</span><h3>Understand first.</h3><p>Understand the infrastructure, risks, requirements and business context before changing the environment.</p></article>
        <article><span>CLARITY</span><h3>Make it workable.</h3><p>Identify dependencies, ownership and priorities across the technical estate.</p></article>
        <article><span>CONTINUITY</span><h3>Stay connected.</h3><p>Support and improve secure IT operations over time with clear communication and technical ownership.</p></article>
      </div>
    </section>

    <section className="about-demo__close">
      <p className="about-demo__label">Your environment. Our next conversation.</p>
      <a href="/kontakt"><span>Let's talk.</span><span aria-hidden="true">↗</span></a>
      <div><span>JUIT NETSEC AB</span><span>STOCKHOLM, SWEDEN</span></div>
    </section>
  </div>;
}
