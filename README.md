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

You're **not** painting over the old biome blobs. The on-screen map is now a **San Francisco scaffold**:

- Pacific Ocean on the **left**, San Francisco Bay on the **right**
- Peninsula shape with **district-colored zones** (Marina, Mission, Sunset, etc.)
- A rough **Golden Gate** line and **Golden Gate Park** green strip
- Light **street-grid hints** per district

That scaffold is a layout guide. Your finished pixel art replaces it entirely.

### When you're ready to paint

1. In Aseprite, create a **2560×1920** canvas (256×192 tiles at 10px).
2. Optionally drop a traced antique map at `public/map/reference.png` and use `?tools=1` → **Reference overlay**.
3. Paint districts, streets, landmarks, and water on top of the scaffold layout.
4. Export as **`public/map/world.png`** — the app loads that file automatically and stops using the scaffold.

Until `world.png` exists, the district scaffold is what you see. Landmark data in `landmarks.js` is for later — toggle with `?tools=1` → **Show landmarks** while placing art.
