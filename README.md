# Personal Portfolio

A Vite + React personal portfolio site with client-side routing.

## Setup

```bash
npm install
```

## Development

```bash
npm run dev
```

The dev server runs at [http://127.0.0.1:43123](http://127.0.0.1:43123).

## Routes

- `/` — Home
- `/about` — About
- `/contact` — Contact

## Project structure

```
src/
  components/
    Nav.jsx          # Shared navigation
    Map.jsx          # Pannable pixel-art project map (Leaflet)
  pages/
    Home.jsx         # Renders Map
    About.jsx
    Contact.jsx
  data/
    projects.js      # Project markers and list-view data
    districts.js     # SF district zones (bounds, colors, art-direction notes)
    landmarks.js     # SF landmarks (coords, tiers, blurbs, sprite paths)
  utils/
    districtUtils.js           # District lookup and project counts
    landmarkUtils.js           # Landmark helpers
    landmarkHtml.js            # Landmark marker + popup HTML
    mapCoords.js                 # Grid ↔ Leaflet coordinate helpers
    generatePlaceholderMap.js  # Procedural map image (swap for real asset later)
public/
  map/               # world.png + optional reference.png overlay for painting
  landmarks/         # Per-landmark sprite SVGs (replace with hand-painted art)
```

## Build

```bash
npm run build
npm run preview
```

## Painting the map

1. Enable **Coord picker** in Atlas tools (bottom-left) and click the map to copy `{ gx, gy }` values into `landmarks.js` or `projects.js`.
2. Replace placeholder sprites in `public/landmarks/` with hand-painted pixel art (keep the same filenames).
3. Drop a traced antique-map reference at `public/map/reference.png`, then toggle **Reference overlay** in Atlas tools.
4. Export the finished base map as `public/map/world.png` (256×192 tiles at 10px = 2560×1920 px).
5. Regenerate placeholder sprites after editing landmark colors: `npm run landmarks:sprites`
