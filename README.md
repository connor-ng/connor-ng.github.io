# Personal Portfolio

Connor Ng's personal portfolio — a San Francisco map of selected work, plus About and Contact.

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
- `/about` — About
- `/contact` — Email, LinkedIn, GitHub, resume

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
| `status` | `'done'` or `'current'` | Yes |
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

Useful `districtId` values: `marina`, `northern-waterfront`, `richmond`, `western-addition`, `downtown`, `mission`, `sunset`, `bayview` (see `src/data/districts.js` for the full list).

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
  pages/             # Home, About, Contact
  data/
    projects.js      # ← your portfolio pins
    districts.js     # SF neighborhood zones
public/
  projects/          # screenshots
  resume.pdf         # contact page download
```

## Build

```bash
npm run build
npm run preview
```

## Deploy to GitHub Pages (`.io`)

This site is ready for GitHub Pages. The repo currently lives in Cursor’s git host — you need a **GitHub** repo before Pages will work.

### Option A — User site (recommended for a clean `.io` URL)

URL: `https://gitraccd.github.io`

1. On GitHub, create a **public** repo named exactly `gitraccd.github.io` (must match your GitHub username).
2. Locally (or in Cursor Desktop), add GitHub as a remote and push:

```bash
git remote add github https://github.com/gitraccd/gitraccd.github.io.git
git push -u github main
```

3. Repo → **Settings → Pages**
   - Source: **GitHub Actions**
4. The workflow in `.github/workflows/deploy-pages.yml` builds and publishes on every push to `main`.

### Option B — Project site

URL: `https://gitraccd.github.io/my-folio`

1. Create any public repo (e.g. `my-folio`) and push.
2. In `.github/workflows/deploy-pages.yml`, set `VITE_BASE: /my-folio/` (match the repo name).
3. Enable Pages with **GitHub Actions** as above.

SPA routes (`/about`, `/contact`) are handled by copying `index.html` → `404.html` on build.

## Tips

- **PM / business framing:** Lead with problem → your role → outcome. Tags can be domains or skills, not just tech stack.
- **Optional fields:** Missing screenshot, live link, or case study are fine — the UI skips empty pieces.
- **Atlas tools:** `/?tools=1` for coord picker. `/?pixel=1` for the legacy pixel map.
