import React, { useState, useCallback } from "react";
import PanoViewer from "./PanoViewer";
import SceneThumbnails from "./SceneThumbnails";
import type { TourData } from "../types/tour";

interface Props {
  tour: TourData;
}

const TourNavigator: React.FC<Props> = ({ tour }) => {
  const [activeSceneId, setActiveSceneId] = useState(tour.startSceneId);

  const activeScene = tour.scenes.find((s) => s.id === activeSceneId) ?? tour.scenes[0];

  const handleNavigate = useCallback((targetSceneId: string) => {
    if (tour.scenes.some((s) => s.id === targetSceneId)) {
      setActiveSceneId(targetSceneId);
    }
  }, [tour]);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <PanoViewer
        key={activeScene.id}
        scene={activeScene}
        onNavigate={handleNavigate}
      />
      <SceneThumbnails
        scenes={tour.scenes}
        activeSceneId={activeSceneId}
        onSelect={handleNavigate}
      />
    </div>
  );
};

export default TourNavigator;