import React, { useState } from "react";
import TourNavigator from "./components/TourNavigator";
import TourEditor from "./components/TourEditor";
import sampleTour from "./data/sample-tour.json";
import type { TourData } from "./types/tour";
import "./styles/tour.css";

const App: React.FC = () => {
  const [showEditor, setShowEditor] = useState(false);
  const [tour, setTour] = useState<TourData>(sampleTour as TourData);

  return (
    <div className={`app-layout ${showEditor ? "" : "app-layout--viewer-only"}`}> 
      {/* Main viewer */}
      <div style={{ position: "relative" }}>
        <TourNavigator tour={tour} />
        <button
          className="mode-toggle"
          onClick={() => setShowEditor((v) => !v)}
        >
          {showEditor ? "✕ Close Editor" : "✏️ Open Editor"}
        </button>
      </div>

      {/* Side editor panel */}
      {showEditor && (
        <TourEditor currentTour={tour} onTourUpdate={setTour} />
      )}
    </div>
  );
};

export default App;