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
  utils/
    districtUtils.js           # District lookup and project counts
    mapCoords.js                 # Grid ↔ Leaflet coordinate helpers
    generatePlaceholderMap.js  # Procedural map image (swap for real asset later)
public/
  map/               # world.png + optional reference.png overlay for painting
```

## Build

```bash
npm run build
npm run preview
```

## Map

The home page uses a **live San Francisco street map** (OpenStreetMap via OpenFreeMap) focused on the **city peninsula only** — you can't pan away to Oakland or Marin.

### What's on the map

| Zoom level | Detail |
|------------|--------|
| City view | Real streets, parks, waterfront |
| District zones | Colored neighborhood overlays + labels (atlas tools) |

### Add more detail yourself

**1. Projects (your portfolio pins)**  
Open `/?tools=1` → enable **Coord picker** → click a spot → copy coords into `src/data/projects.js`:

```js
lat: 37.7594,
lng: -122.4214,
districtId: 'mission',
```

**2. Districts**  
Edit `src/data/districts.js` — adjust `bounds`, `color`, and `flavor` text for each neighborhood zone.

**3. Even more street detail**  
Zoom in — OpenStreetMap already has building-level data. For a custom illustrated look later, add `?pixel=1` and paint `public/map/world.png` in Pixelorama.

### Atlas tools (`?tools=1`)

Toggle district zones and coord picker.
