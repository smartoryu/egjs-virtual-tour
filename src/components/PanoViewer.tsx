import React, { useRef, useState, useEffect, useCallback } from "react";
import View360 from "@egjs/react-view360";
import {
  EquirectProjection,
  ControlBar,
  LoadingSpinner,
} from "@egjs/view360";
import "@egjs/view360/css/view360.min.css";

import HotspotOverlay from "./HotspotOverlay";
import type { TourScene, TourHotspot } from "../types/tour";

interface Props {
  scene: TourScene;
  onNavigate: (targetSceneId: string) => void;
}

const PanoViewer: React.FC<Props> = ({ scene, onNavigate }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<InstanceType<typeof View360>>(null);
  const [isInView, setIsInView] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // ── Lazy loading via IntersectionObserver ──
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // ── Refresh hotspots when scene changes ──
  const handleProjectionChange = useCallback(() => {
    const viewer = viewerRef.current?.view360;
    if (viewer) {
      viewer.hotspot.refresh();
    }
    setIsLoading(false);
  }, []);

  // ── Handle hotspot clicks ──
  const handleHotspotClick = useCallback(
    (hotspot: TourHotspot) => {
      switch (hotspot.type) {
        case "navigation":
          if (hotspot.targetSceneId) onNavigate(hotspot.targetSceneId);
          break;
        case "link":
          if (hotspot.href) window.open(hotspot.href, "_blank");
          break;
        case "info":
          break;
      }
    },
    [onNavigate]
  );

  const projection = new EquirectProjection({ src: scene.panoramaUrl });

  const plugins = [
    new ControlBar({ pieView: true, fullscreenButton: true }),
    new LoadingSpinner(),
  ];

  return (
    <div ref={containerRef} className="tour-viewer">
      {isLoading && (
        <div className="loading-overlay">Loading panorama…</div>
      )}

      {isInView && (
        <View360
          ref={viewerRef}
          className="tour-viewer"
          projection={projection}
          plugins={plugins}
          initialYaw={scene.initialYaw}
          initialPitch={scene.initialPitch}
          scrollable={false}
          wheelScrollable={false}
          hotspot={{ zoom: true }}
          onReady={() => {
            console.log("[View360] ready");
            viewerRef.current?.view360?.hotspot.refresh();
          }}
          onLoadStart={() => {
            setIsLoading(true);
          }}
          onLoad={() => {
            setIsLoading(false);
          }}
          onProjectionChange={handleProjectionChange}
          onViewChange={(e) => {
            void e;
          }}
          onStaticClick={(e) => {
            void e;
          }}
          onInputStart={(e) => {
            void e;
          }}
          onInputEnd={(e) => {
            void e;
          }}
        >
          <HotspotOverlay
            hotspots={scene.hotspots}
            onHotspotClick={handleHotspotClick}
          />
        </View360>
      )}

      <div className="scene-title">{scene.title}</div>
    </div>
  );
};

export default PanoViewer;