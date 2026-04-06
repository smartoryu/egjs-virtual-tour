import React from "react";
import type { TourHotspot } from "../types/tour";

const ICONS: Record<TourHotspot["type"], string> = {
  info: "ℹ️",
  navigation: "➡️",
  link: "🔗",
};

interface Props {
  hotspots: TourHotspot[];
  onHotspotClick: (hotspot: TourHotspot) => void;
}

const HotspotOverlay: React.FC<Props> = ({ hotspots, onHotspotClick }) => {
  return (
    <div className="view360-hotspots">
      {hotspots.map((hs) => (
        <div
          key={hs.id}
          className="view360-hotspot"
          data-yaw={String(hs.yaw)}
          data-pitch={String(hs.pitch)}
          onClick={() => onHotspotClick(hs)}
        >
          <div className="hotspot-tooltip">{hs.tooltip}</div>
          <div className={`hotspot-marker hotspot-marker--${hs.type}`}>{ICONS[hs.type]}</div>
        </div>
      ))}
    </div>
  );
};

export default HotspotOverlay;