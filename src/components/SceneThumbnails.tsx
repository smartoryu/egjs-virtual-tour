import React from "react";
import type { TourScene } from "../types/tour";

interface Props {
  scenes: TourScene[];
  activeSceneId: string;
  onSelect: (sceneId: string) => void;
}

const SceneThumbnails: React.FC<Props> = ({ scenes, activeSceneId, onSelect }) => (
  <div className="scene-thumbnails">
    {scenes.map((scene) => (
      <img
        key={scene.id}
        src={scene.thumbnailUrl}
        alt={scene.title}
        title={scene.title}
        className={`scene-thumb ${scene.id === activeSceneId ? "scene-thumb--active" : ""}`}
        onClick={() => onSelect(scene.id)}
      />
    ))}
  </div>
);

export default SceneThumbnails;