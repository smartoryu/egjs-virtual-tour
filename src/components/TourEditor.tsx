import React, { useState, useRef } from "react";
import type { TourData, TourScene, TourHotspot } from "../types/tour";

interface Props {
  onTourUpdate: (tour: TourData) => void;
  currentTour: TourData;
}

let nextId = 1;

const TourEditor: React.FC<Props> = ({ onTourUpdate, currentTour }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [editingSceneId, setEditingSceneId] = useState<string>(currentTour.startSceneId);

  const [hsYaw, setHsYaw] = useState(0);
  const [hsPitch, setHsPitch] = useState(0);
  const [hsTooltip, setHsTooltip] = useState("");
  const [hsType, setHsType] = useState<TourHotspot["type"]>("info");
  const [hsTarget, setHsTarget] = useState("");
  const [hsHref, setHsHref] = useState("");

  const [newSceneTitle, setNewSceneTitle] = useState("");

  const editingScene = currentTour.scenes.find((s) => s.id === editingSceneId);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);
    const sceneId = `scene_${nextId++}`;
    const title = newSceneTitle || file.name.replace(/\.[^.]+$/, "");

    const newScene: TourScene = {
      id: sceneId,
      title,
      panoramaUrl: objectUrl,
      thumbnailUrl: objectUrl,
      initialYaw: 0,
      initialPitch: 0,
      hotspots: [],
    };

    const updatedTour: TourData = {
      ...currentTour,
      scenes: [...currentTour.scenes, newScene],
    };

    if (updatedTour.scenes.length === 1) {
      updatedTour.startSceneId = sceneId;
    }

    onTourUpdate(updatedTour);
    setEditingSceneId(sceneId);
    setNewSceneTitle("");
  };

  const addHotspot = () => {
    if (!editingScene) return;

    const hotspot: TourHotspot = {
      id: `hs_${nextId++}`,
      yaw: hsYaw,
      pitch: hsPitch,
      type: hsType,
      tooltip: hsTooltip || "Untitled hotspot",
      targetSceneId: hsType === "navigation" ? hsTarget : undefined,
      href: hsType === "link" ? hsHref : undefined,
    };

    const updatedScenes = currentTour.scenes.map((s) =>
      s.id === editingSceneId
        ? { ...s, hotspots: [...s.hotspots, hotspot] }
        : s
    );

    onTourUpdate({ ...currentTour, scenes: updatedScenes });
    setHsTooltip("");
  };

  const removeHotspot = (hotspotId: string) => {
    const updatedScenes = currentTour.scenes.map((s) =>
      s.id === editingSceneId
        ? { ...s, hotspots: s.hotspots.filter((h) => h.id !== hotspotId) }
        : s
    );
    onTourUpdate({ ...currentTour, scenes: updatedScenes });
  };

  const exportJson = () => {
    const json = JSON.stringify(currentTour, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${currentTour.name.replace(/\s+/g, "_")}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(currentTour, null, 2));
  };

  return (
    <div className="editor-panel">
      <h2>🛠 Tour Editor</h2>

      <h3>Add Scene</h3>
      <input
        type="text"
        placeholder="Scene title (optional)"
        value={newSceneTitle}
        onChange={(e) => setNewSceneTitle(e.target.value)}
      />
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
      />

      {currentTour.scenes.length > 0 && (
        <>
          <h3>Edit Scene</h3>
          <select
            value={editingSceneId}
            onChange={(e) => setEditingSceneId(e.target.value)}
            style={{
              width: "100%", padding: "8px", marginBottom: "8px",
              background: "#313244", color: "#cdd6f4", border: "1px solid #45475a",
              borderRadius: "6px",
            }}
          >
            {currentTour.scenes.map((s) => (
              <option key={s.id} value={s.id}>{s.title}</option>
            ))}
          </select>
        </>
      )}

      {editingScene && (
        <>
          <h3>Add Hotspot to "{editingScene.title}"</h3>

          <label style={{ fontSize: 13 }}>
            Yaw (degrees, 0=front):
            <input type="number" value={hsYaw} onChange={(e) => setHsYaw(Number(e.target.value))} />
          </label>

          <label style={{ fontSize: 13 }}>
            Pitch (degrees, 0=horizon):
            <input type="number" value={hsPitch} onChange={(e) => setHsPitch(Number(e.target.value))} />
          </label>

          <label style={{ fontSize: 13 }}>
            Type:
            <select
              value={hsType}
              onChange={(e) => setHsType(e.target.value as TourHotspot["type"])}
              style={{
                width: "100%", padding: "8px", marginBottom: "8px",
                background: "#313244", color: "#cdd6f4",
                border: "1px solid #45475a", borderRadius: "6px",
              }}
            >
              <option value="info">ℹ️ Info</option>
              <option value="navigation">➡️ Navigation</option>
              <option value="link">🔗 Link</option>
            </select>
          </label>

          <input
            type="text"
            placeholder="Tooltip text"
            value={hsTooltip}
            onChange={(e) => setHsTooltip(e.target.value)}
          />

          {hsType === "navigation" && (
            <input
              type="text"
              placeholder="Target scene ID"
              value={hsTarget}
              onChange={(e) => setHsTarget(e.target.value)}
            />
          )}

          {hsType === "link" && (
            <input
              type="text"
              placeholder="URL (https://…)"
              value={hsHref}
              onChange={(e) => setHsHref(e.target.value)}
            />
          )}

          <button onClick={addHotspot}>+ Add Hotspot</button>

          <h3>Hotspots ({editingScene.hotspots.length})</h3>
          <ul className="hotspot-list">
            {editingScene.hotspots.map((hs) => (
              <li key={hs.id}>
                <strong>{hs.type}</strong> @ yaw={hs.yaw}° pitch={hs.pitch}°
                <br />"{hs.tooltip}"
                <br />
                <button
                  onClick={() => removeHotspot(hs.id)}
                  style={{ background: "#f38ba8", marginTop: 4 }}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </>
      )}

      <h3>Export Tour JSON</h3>
      <button onClick={exportJson}>⬇ Download JSON</button>
      <button onClick={copyJson}>📋 Copy to Clipboard</button>
      <div className="json-preview">
        {JSON.stringify(currentTour, null, 2)}
      </div>
    </div>
  );
};

export default TourEditor;