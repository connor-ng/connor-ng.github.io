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

## Map

The home page uses a **live San Francisco street map** (OpenStreetMap data via [OpenFreeMap](https://openfreemap.org)) with your project markers on top. No hand-painted `world.png` required.

- **Real streets, parks, and coastline** at every zoom level
- **Dark theme** matching the rest of the site
- Project pins use `lat` / `lng` in `projects.js` (with `gx` / `gy` kept for district lookup)

### Atlas tools (`?tools=1`)

- **Coord picker** — click the map, copy `{ lat, lng, gx, gy }` into `projects.js`
- **District zones** — overlay approximate neighborhood bounds
- **Show landmarks** — preview landmark placement (hidden by default)

### Pixel map mode (optional)

Add `?pixel=1` to use the old painted/scaffold image map instead of live streets.

## Painting the map (optional)

If you later want a custom pixel-art `world.png`, use Pixelorama and add `?pixel=1`. The live street map is the default.
