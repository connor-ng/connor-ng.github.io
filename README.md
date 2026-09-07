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

Useful `districtId` values: `marina`, `northern-waterfront`, `richmond`, `western-addition`, `fidi`, `sunset`, `castro`, `mission`, `excelsior`, `bayview` (see `src/data/districts.js` for the full list).

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

## Deploy (Netlify recommended)

This is a static Vite app — build output is `dist/`.

### Netlify (easiest path)

1. Push this repo to **GitHub** (Netlify connects to GitHub; Cursor’s git host won’t work as the source).
2. Go to [app.netlify.com](https://app.netlify.com) → **Add new site** → **Import an existing project**.
3. Pick the GitHub repo.
4. Build settings are already in `netlify.toml`:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. Deploy — you’ll get a free URL like `https://something.netlify.app`.

SPA routes (`/about`, `/contact`) are handled by `_redirects` / `netlify.toml`.

### Want a URL that ends in `.io`?

Free hosts don’t give you a bare `.io` domain. Options:

| Approach | Example URL | Notes |
|----------|-------------|--------|
| **Buy a custom domain** | `connorng.io` | Best look. Buy on Namecheap / Google Domains / Cloudflare, then add it in Netlify → Domain settings. |
| **GitHub Pages user site** | `gitraccd.github.io` | Free `.io`, but only if the site lives on GitHub Pages. |
| **Keep Netlify subdomain** | `yoursite.netlify.app` | Free forever; fine while building. |

Most people: ship on **Netlify** first → later buy `something.io` and point DNS at Netlify (CNAME).

### Other solid hosts (same idea)

- **Vercel** — free `*.vercel.app`, custom domain later
- **Cloudflare Pages** — free `*.pages.dev`, custom domain later

Same flow: GitHub repo → connect host → build `npm run build` → publish `dist`.

### GitHub Pages (optional)

A workflow still exists at `.github/workflows/deploy-pages.yml` if you ever want `username.github.io`. Prefer Netlify unless you specifically want GitHub’s free `.io`.

## Tips

- **PM / business framing:** Lead with problem → your role → outcome. Tags can be domains or skills, not just tech stack.
- **Optional fields:** Missing screenshot, live link, or case study are fine — the UI skips empty pieces.
- **Atlas tools:** `/?tools=1` for coord picker. `/?pixel=1` for the legacy pixel map.
