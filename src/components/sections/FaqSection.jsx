import { useState } from 'react';
import { Container } from '../ui';
import { faqItems } from './faqData.js';
import './FaqSection.css';

function PlusIcon({ expanded }) {
  return (
    <span className="faq-section__icon" aria-hidden="true" data-expanded={expanded ? 'true' : 'false'}>
      <span />
      <span />
    </span>
  );
}

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section className="faq-section" aria-labelledby="faq-title">
      <Container className="faq-section__container">
        <div className="faq-section__intro">
          <h2 id="faq-title" className="faq-section__title">FAQ</h2>
          <p className="faq-section__description">
            Can’t find what you’re looking for? Let’s discuss your infrastructure, security
            requirements and technical priorities.
          </p>
          <a className="faq-section__contact-link" href="/kontakt">
            Contact us <span aria-hidden="true">→</span>
          </a>
        </div>

        <div className="faq-section__list">
          {faqItems.map((item, index) => {
            const expanded = openIndex === index;
            const buttonId = `faq-question-${index}`;
            const panelId = `faq-answer-${index}`;

            return (
              <article className="faq-section__item" key={item.question}>
                <h3 className="faq-section__question-heading">
                  <button
                    id={buttonId}
                    className="faq-section__trigger"
                    type="button"
                    aria-expanded={expanded}
                    aria-controls={panelId}
                    onClick={() => setOpenIndex((current) => (current === index ? null : index))}
                  >
                    <span>{item.question}</span>
                    <PlusIcon expanded={expanded} />
                  </button>
                </h3>
                <div
                  id={panelId}
                  className="faq-section__panel"
                  role="region"
                  aria-labelledby={buttonId}
                  aria-hidden={!expanded}
                  data-open={expanded ? 'true' : 'false'}
                >
                  <div className="faq-section__answer-wrap">
                    <p className="faq-section__answer">{item.answer}</p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
