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
    gx: 48,
    gy: 35,
  },
  {
    id: 'p7',
    title: '???',
    status: 'locked',
    gx: 72,
    gy: 49,
  },
  {
    id: 'p8',
    title: '???',
    status: 'locked',
    gx: 14,
    gy: 61,
  },
]

export default projects
