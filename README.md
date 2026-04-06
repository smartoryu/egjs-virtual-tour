# egjs Virtual Tour

A complete virtual tour demo built with [@egjs/react-view360](https://github.com/naver/egjs-view360) featuring:

- **Multi-scene navigation** — switch between panorama scenes via hotspots or thumbnails
- **Hotspots with tooltips** — info, navigation, and link hotspots positioned by yaw/pitch
- **Lazy loading** — panorama viewer only initializes when scrolled into view
- **Tour editor** — upload panoramas, place hotspots, export/import tour JSON
- **Full egjs-view360 v4 API** — ControlBar, LoadingSpinner, all events wired up

## Quick Start

```bash
npm install
npm run dev
```

## Project Structure

```
src/
├── App.tsx                    # Main app shell with editor toggle
├── index.tsx                  # Entry point
├── types/tour.ts              # TypeScript interfaces for tour data
├── data/sample-tour.json      # Sample 2-scene tour
├── components/
│   ├── PanoViewer.tsx          # Core viewer with lazy loading & hotspots
│   ├── HotspotOverlay.tsx     # Hotspot DOM elements for view360
│   ├── TourNavigator.tsx      # Multi-scene navigation controller
│   ├── SceneThumbnails.tsx    # Scene picker thumbnails
│   └── TourEditor.tsx         # Authoring: upload, place hotspots, export JSON
└── styles/tour.css            # All styles
```

## egjs-view360 v4 Events

| Event | React Prop | Description |
|---|---|---|
| `ready` | `onReady` | Fired once after init |
| `loadStart` | `onLoadStart` | Before content loading |
| `load` | `onLoad` | After content loaded |
| `projectionChange` | `onProjectionChange` | Projection swapped |
| `viewChange` | `onViewChange` | Camera moved (yaw/pitch/zoom) |
| `staticClick` | `onStaticClick` | Canvas clicked without drag |
| `inputStart` | `onInputStart` | User starts interaction |
| `inputEnd` | `onInputEnd` | User ends interaction |

## License

MIT
