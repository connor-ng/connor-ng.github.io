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

/** @type {Project[]} */
const projects = [
  {
    id: 'cft',
    title: 'CFT',
    roleAndTimeframe: 'Personal product · Jun–Aug 2026',
    oneLinerProblem:
      'During a busy internship I kept falling off tracking lifts — and I still needed a clear path toward big strength goals.',
    description:
      'Consistency Fitness Tracker is a personal training app I built to turn powerlifting knowledge into structured blocks and progressive overload. Instead of guessing workouts when life got hectic, I can plan cycles, log lifts, and keep moving toward targets like a 405 deadlift and 315 bench.',
    tags: ['Product', 'Fitness', 'Progressive overload'],
    mark: '/projects/marks/cycle.png',
    liveLink: 'https://consistency-azure.vercel.app',
    status: 'done',
    featured: true,
    featuredLabel: 'Featured',
    districtId: 'mission',
    // Placeholder pin — adjust later with /?tools=1
    lat: 37.7599,
    lng: -122.4148,
    gx: 148,
    gy: 108,
  },
]

export default projects
