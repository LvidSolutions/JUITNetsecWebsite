import { useState } from 'react';
import { ServicesHero } from '../services/ServicesHero.jsx';
import { ShiftStyleServiceSelector } from '../services/ShiftStyleServiceSelector.jsx';
import { ServiceDetailPanel } from '../services/ServiceDetailPanel.jsx';
import { NetsecOperatingModel } from '../services/NetsecOperatingModel.jsx';
import { ServiceSupportMatrix } from '../services/ServiceSupportMatrix.jsx';
import { ServicesCTA } from '../services/ServicesCTA.jsx';
import { serviceTracks } from '../services/servicesData.js';

/**
 * Services-sidan, helt ombyggd kring två Shift5-inspirerade funktioner:
 *  1. En tre-panels tjänsteväljare (Section 2) som styr en dynamisk detaljpanel (Section 3).
 *  2. En cirkulär driftsmodell/radar med sex steg (Section 4).
 * Allt innehåll kommer från den befintliga Services-sidan (servicesData.js).
 * Aktiv färg är pastellgrön (ersätter Shift5:s röda).
 */
export function ServicesSection() {
  const [activeTrack, setActiveTrack] = useState(0);
  const [activeStage, setActiveStage] = useState(0);

  return (
    <div id="tjanster" className="bg-brand-black text-brand-white">
      <ServicesHero />
      <ShiftStyleServiceSelector activeIndex={activeTrack} onSelect={setActiveTrack} />
      <ServiceDetailPanel track={serviceTracks[activeTrack]} />
      <NetsecOperatingModel activeIndex={activeStage} onSelect={setActiveStage} />
      <ServiceSupportMatrix />
      <ServicesCTA />
    </div>
  );
}
