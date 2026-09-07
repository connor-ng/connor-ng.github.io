/** @typedef {'done' | 'current' | 'locked'} ProjectStatus */

/**
 * @typedef {Object} Project
 * @property {string} id - unique slug, e.g. 'acme-launch'
 * @property {string} title
 * @property {string} [roleAndTimeframe] - e.g. 'Product lead · 2024'
 * @property {string} [oneLinerProblem] - one sentence: the problem or opportunity
 * @property {string} [description] - short story: what you owned and the outcome
 * @property {string[]} [tags] - themes, skills, or domains (shown as chips)
 * @property {string} [screenshot] - path under /public, e.g. '/projects/acme.png'
 * @property {string} [mark] - optional map-pin artwork, e.g. '/projects/marks/cycle.png'
 * @property {string} [liveLink] - live site or demo URL (optional)
 * @property {string} [caseStudyLink] - write-up URL (optional)
 * @property {ProjectStatus} status - 'done' | 'current' | 'locked'
 * @property {number} gx - grid x (legacy pixel map; still useful for tools)
 * @property {number} gy - grid y
 * @property {number} [lat] - WGS84 latitude (preferred on the live street map)
 * @property {number} [lng] - WGS84 longitude
 * @property {string} [districtId] - e.g. 'mission' | 'marina' | 'sunset' | …
 * @property {boolean} [featured] - show in the featured list section
 * @property {string} [featuredLabel] - eyebrow on featured card (default: "Featured")
 */

/**
 * Add projects here. Example (copy, then fill in):
 *
 * {
 *   id: 'my-first-project',
 *   title: 'Project name',
 *   roleAndTimeframe: 'Product manager · 2024–2025',
 *   oneLinerProblem: 'One sentence on the problem or opportunity.',
 *   description:
 *     'What you owned, who it was for, and the outcome (metrics if you have them).',
 *   tags: ['Go-to-market', 'Research', 'Strategy'],
 *   screenshot: '/projects/my-first-project.png',
 *   mark: '/projects/marks/cycle.png',
 *   liveLink: 'https://…',
 *   caseStudyLink: 'https://…',
 *   status: 'done',
 *   featured: true,
 *   featuredLabel: 'Featured',
 *   districtId: 'mission',
 *   lat: 37.7594,
 *   lng: -122.4214,
 *   gx: 128,
 *   gy: 96,
 * },
 *
 * Pick a pin location with /?tools=1 → Coord picker, then paste lat/lng here.
 * Drop a screenshot in public/projects/ (PNG or JPG, ~1200px wide works well).
 */

/** @type {Project[]} */
const projects = []

export default projects
