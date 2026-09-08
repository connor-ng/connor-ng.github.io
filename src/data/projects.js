/** @typedef {'done' | 'current' | 'locked'} ProjectStatus */
/** @typedef {'personal' | 'school' | 'work'} ProjectType */

/**
 * @typedef {Object} Project
 * @property {string} id - unique slug, e.g. 'acme-launch'
 * @property {string} title
 * @property {ProjectType} [type] - personal | school | work (pin/list accent)
 * @property {string} [roleAndTimeframe] - e.g. 'Product lead · 2024'
 * @property {string} [oneLinerProblem] - one sentence: the problem or opportunity
 * @property {string} [description] - short story: what you owned and the outcome
 * @property {string} [popupBlurb] - optional shorter popup body (falls back to trimmed description)
 * @property {string} [motivation] - detail panel: why you built it
 * @property {string} [built] - detail panel: what you shipped (falls back to description)
 * @property {string} [outcome] - detail panel: result / where it stands
 * @property {string[]} [tags] - up to 3 chips, in order: domain, use case, format
 *   (see `src/constants/projectTags.js`). Example:
 *   ['Fitness', 'Habit tracking', 'Mobile / web app']
 *   Do not repeat type/role (“Product”, “Personal”) here.
 * @property {string} [screenshot] - path under /public, e.g. '/projects/acme.png'
 * @property {{ src: string, label?: string }[]} [screenshots] - optional gallery for the detail panel
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
    title: 'Consistency',
    type: 'personal',
    roleAndTimeframe: 'Personal product · Jun–Aug 2026',
    oneLinerProblem:
      'During a busy internship I kept falling off tracking lifts, and I still needed a clear path toward big strength goals.',
    description:
      'Consistency Fitness Tracker turns powerlifting knowledge into structured blocks and progressive overload, so I can plan cycles, log lifts, and keep moving toward targets like a 315 bench.',
    popupBlurb:
      'A training app I built to keep progressive overload on track through a busy internship.',
    motivation:
      'During a busy internship I kept falling off tracking lifts, and I still needed a clear path toward big strength goals. Spreadsheets and generic apps weren’t enough to keep me honest week to week.',
    built:
      'Consistency turns powerlifting knowledge into structured blocks and progressive overload. I can plan cycles, log lifts, and keep moving toward targets like a 315 bench, end to end as a personal product.',
    outcome:
      'It’s live and I’m still using it as my training system, and continuing to iterate on it as I use it. The build taught me how to ship my first product, and that apps take a lot of time and iteration.',
    tags: ['Fitness', 'Habit tracking', 'Mobile / web app'],
    mark: '/projects/marks/cycle.png',
    liveLink: 'https://consistency-azure.vercel.app',
    status: 'done',
    featured: true,
    featuredLabel: 'Featured',
    districtId: 'sunset',
    lat: 37.73119,
    lng: -122.47628,
    gx: 65,
    gy: 147,
    screenshot: '/projects/cft/home.jpg',
    screenshots: [
      { src: '/projects/cft/home.jpg', label: 'Home' },
      { src: '/projects/cft/program.jpg', label: 'Program' },
      { src: '/projects/cft/history.jpg', label: 'History' },
      { src: '/projects/cft/nutrition.jpg', label: 'Nutrition' },
    ],
  },
  {
    id: 'sealed-marina',
    title: '???',
    type: 'work',
    roleAndTimeframe: 'Work · sealed',
    status: 'locked',
    districtId: 'marina',
    lat: 37.8025,
    lng: -122.4365,
    gx: 90,
    gy: 30,
  },
  {
    id: 'sealed-fidi',
    title: '???',
    type: 'school',
    roleAndTimeframe: 'School · sealed',
    status: 'locked',
    districtId: 'fidi',
    lat: 37.7895,
    lng: -122.401,
    gx: 170,
    gy: 55,
  },
]

export default projects
