import { useState } from 'react';
import { ShiftStyleServiceSelector } from '../services/ShiftStyleServiceSelector.jsx';
import { NetsecOperatingModel } from '../services/NetsecOperatingModel.jsx';

/**
 * Services-sidan består av den interaktiva trepanelsväljaren och arbetsprocessen.
 */
export function ServicesSection() {
  const [activeTrack, setActiveTrack] = useState(0);
  const [activeStage, setActiveStage] = useState(0);

  return (
    <div id="tjanster" className="bg-brand-black text-brand-white">
      <ShiftStyleServiceSelector activeIndex={activeTrack} onSelect={setActiveTrack} />
      <NetsecOperatingModel activeIndex={activeStage} onSelect={setActiveStage} />
    </div>
  );
}
