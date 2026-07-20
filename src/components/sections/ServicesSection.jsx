import { useState } from 'react';
import { ShiftStyleServiceSelector } from '../services/ShiftStyleServiceSelector.jsx';
import { NetsecOperatingModel } from '../services/NetsecOperatingModel.jsx';
import { GlideServicesHero } from '../services/GlideServicesHero.jsx';

/**
 * Services-sidan består av den interaktiva trepanelsväljaren och arbetsprocessen.
 */
export function ServicesSection({ renderClosingScene }) {
  const [activeTrack, setActiveTrack] = useState(0);
  const [activeStage, setActiveStage] = useState(0);

  return (
    <div id="tjanster" className="bg-brand-black text-brand-white">
      <GlideServicesHero />
      <ShiftStyleServiceSelector activeIndex={activeTrack} onSelect={setActiveTrack} />
      {renderClosingScene
        ? renderClosingScene(
          <NetsecOperatingModel cinematic activeIndex={activeStage} onSelect={setActiveStage} />,
        )
        : <NetsecOperatingModel activeIndex={activeStage} onSelect={setActiveStage} />}
    </div>
  );
}
