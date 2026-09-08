# Personal Portfolio

Connor Ng's personal portfolio — a San Francisco map of selected work, plus About (with Connect).

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

- `/` — Map of projects (Map / List toggle)
- `/about` — About + Connect (email, LinkedIn, GitHub, resume)
- `/contact` — Redirects to `/about`

## Add your first project

Everything lives in one file: `src/data/projects.js`.

### 1. Gather content

| Field | What to write | Required? |
|-------|----------------|-----------|
| `title` | Project name | Yes |
| `roleAndTimeframe` | e.g. `Product lead · 2024–2025` | Recommended |
| `oneLinerProblem` | One sentence on the problem or opportunity | Recommended |
| `description` | What you owned + outcome (metrics if you have them) | Recommended |
| `tags` | Themes or domains, e.g. `['Go-to-market', 'Research']` | Optional |
| `screenshot` | Image path under `public/projects/` | Recommended |
| `liveLink` | Live site / demo | Optional |
| `caseStudyLink` | Write-up URL | Optional |
| `status` | `'done'`, `'current'`, or `'locked'` | Yes |
| `type` | `'personal'`, `'school'`, or `'work'` (pin ring color) | Recommended |
| `popupBlurb` | Short map-popup body (falls back to description) | Optional |
| `featured` | `true` to highlight in list view | Optional |
| `lat` / `lng` | Map pin location in SF | Yes |
| `districtId` | Neighborhood id (see below) | Recommended |

### 2. Drop a screenshot

Put an image in `public/projects/`, e.g. `public/projects/acme.png`.

Use about **1200px wide** PNG or JPG. Then set:

```js
screenshot: '/projects/acme.png',
```

### 3. Pick a map location

1. Open [/?tools=1](http://127.0.0.1:43123/?tools=1)
2. Enable **Coord picker**
3. Click a spot on the map
4. Copy the coords into your project entry (`lat`, `lng`, and optionally `gx` / `gy`)

Useful `districtId` values: `marina`, `presidio`, `northern-waterfront`, `richmond`, `western-addition`, `fidi`, `sunset`, `castro`, `mission`, `bayview` (see `src/data/districts.js` for the full list).

### 4. Paste into `projects.js`

```js
const projects = [
  {
    id: 'my-first-project',
    title: 'Project name',
    roleAndTimeframe: 'Product lead · 2024–2025',
    oneLinerProblem: 'One sentence on the problem or opportunity.',
    description:
      'What you owned, who it was for, and the outcome.',
    tags: ['Strategy', 'Research'],
    screenshot: '/projects/my-first-project.png',
    liveLink: 'https://…',
    status: 'done',
    featured: true,
    districtId: 'mission',
    lat: 37.7594,
    lng: -122.4214,
    gx: 128,
    gy: 96,
  },
]
```

Save — the map and list view update immediately in the dev server.

## Project structure

```
src/
  components/        # Nav, Map
  pages/             # Home, About
  data/
    projects.js      # ← your portfolio pins
    districts.js     # SF neighborhood zones
public/
  projects/          # screenshots
  resume.pdf         # About / Connect download
```

## Build

```bash
npm run build
npm run preview
```

## Deploy (GitHub Pages)

Live site: **https://connor-ng.github.io/**

Repo: [`connor-ng/connor-ng.github.io`](https://github.com/connor-ng/connor-ng.github.io)

Every push to `main` builds and publishes via `.github/workflows/deploy-pages.yml`.

SPA routes (`/about`, `/contact`) work via `dist/404.html` (copied from `index.html` on build).

Local / Cursor preview and production both use base `/`.

### Custom domain later

Buy a domain (e.g. `connorng.io`), then in the repo: **Settings → Pages → Custom domain**.

### Other hosts (optional)

Netlify / Vercel / Cloudflare Pages still work with `npm run build` → publish `dist` if you want them again. GitHub Pages is the primary host now.
## Tips

- **PM / business framing:** Lead with problem → your role → outcome. Tags can be domains or skills, not just tech stack.
- **Optional fields:** Missing screenshot, live link, or case study are fine — the UI skips empty pieces.
- **Atlas tools:** `/?tools=1` for coord picker. `/?pixel=1` for the legacy pixel map.
