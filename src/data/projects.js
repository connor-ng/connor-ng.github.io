/** @typedef {'done' | 'current' | 'locked'} ProjectStatus */

/**
 * @typedef {Object} Project
 * @property {string} id
 * @property {string} title
 * @property {string} [roleAndTimeframe]
 * @property {string} [oneLinerProblem]
 * @property {string} [description]
 * @property {string[]} [stack]
 * @property {string} [screenshot] - path under /public
 * @property {string} [liveLink]
 * @property {string} [caseStudyLink]
 * @property {ProjectStatus} status
 * @property {number} gx - grid x coordinate on the map
 * @property {number} gy - grid y coordinate on the map
 * @property {number} [lat] - WGS84 latitude (preferred on the live street map)
 * @property {number} [lng] - WGS84 longitude (preferred on the live street map)
 * @property {string} [districtId] - optional override; otherwise inferred from gx/gy
 */

/** @type {Project[]} */
const projects = [
  {
    id: 'project-one',
    title: 'PROJECT NAME',
    roleAndTimeframe: 'Lead Designer · 2024–2025',
    oneLinerProblem: 'Users struggled to [describe the core problem here].',
    description:
      'A short paragraph about what you built, who it was for, and the outcome. Replace this with your real project story.',
    stack: ['React', 'TypeScript', 'Figma'],
    screenshot: '/projects/placeholder-screenshot.svg',
    liveLink: 'https://example.com',
    caseStudyLink: 'https://example.com/case-study',
    status: 'done',
    districtId: 'mission',
    lat: 37.7594,
    lng: -122.4214,
    gx: 128,
    gy: 96,
  },
  {
    id: 'p7',
    title: '???',
    status: 'locked',
    districtId: 'bayview',
    lat: 37.7346,
    lng: -122.389,
    gx: 192,
    gy: 124,
  },
  {
    id: 'p8',
    title: '???',
    status: 'locked',
    lat: 37.7434,
    lng: -122.4832,
    districtId: 'sunset',
    gx: 56,
    gy: 158,
  },
]

export default projects
