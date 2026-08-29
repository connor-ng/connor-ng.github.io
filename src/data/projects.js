/** @typedef {'done' | 'current' | 'locked'} ProjectStatus */

/**
 * @typedef {Object} Project
 * @property {string} id
 * @property {number} gx - grid x coordinate
 * @property {number} gy - grid y coordinate
 * @property {ProjectStatus} status
 * @property {string} icon
 * @property {string} title
 * @property {string} [tag]
 * @property {string} [year]
 * @property {string} [blurb]
 * @property {string[]} [stack]
 * @property {string} [link]
 */

/** @type {Project[]} */
const projects = [
  {
    id: 'p1',
    gx: 20,
    gy: 15,
    status: 'done',
    icon: '💻',
    title: 'WEATHER TERMINAL',
    tag: 'CLI tool',
    year: '2023',
    blurb: 'A terminal weather dashboard written in Rust with live ASCII forecasts.',
    stack: ['Rust', 'tokio', 'ratatui'],
    link: '#',
  },
  {
    id: 'p2',
    gx: 41,
    gy: 10,
    status: 'done',
    icon: '🎮',
    title: 'FROSTLINE',
    tag: 'Game jam',
    year: '2023',
    blurb: 'A 48-hour game jam entry — a short puzzle-platformer about melting ice.',
    stack: ['Godot'],
    link: '#',
  },
  {
    id: 'p3',
    gx: 63,
    gy: 17,
    status: 'done',
    icon: '🗺',
    title: 'RECIPE ATLAS',
    tag: 'Web app',
    year: '2023',
    blurb: 'A recipe manager with a map-based view of cuisines by region.',
    stack: ['React', 'Postgres', 'Mapbox'],
    link: '#',
  },
  {
    id: 'p4',
    gx: 48,
    gy: 35,
    status: 'done',
    icon: '🎛',
    title: 'PIXEL SYNTH',
    tag: 'Audio',
    year: '2024',
    blurb: 'A browser step sequencer with a chiptune engine, built on the Web Audio API.',
    stack: ['JS', 'Web Audio API'],
    link: '#',
  },
  {
    id: 'p5',
    gx: 55,
    gy: 53,
    status: 'current',
    icon: '📱',
    title: 'STUDY BUDDY',
    tag: 'Mobile app',
    year: '2024',
    blurb: 'Spaced-repetition flashcards with a focus-timer companion. In active development.',
    stack: ['React Native', 'SQLite'],
    link: '#',
  },
  {
    id: 'p6',
    gx: 18,
    gy: 47,
    status: 'current',
    icon: '⚙',
    title: 'EMBERFORGE',
    tag: 'Systems tool',
    year: '2024',
    blurb: 'A build-pipeline visualizer for tracking CI job dependencies in real time.',
    stack: ['TypeScript', 'D3'],
    link: '#',
  },
  {
    id: 'p7',
    gx: 72,
    gy: 49,
    status: 'locked',
    icon: '🔒',
    title: '???',
  },
  {
    id: 'p8',
    gx: 14,
    gy: 61,
    status: 'locked',
    icon: '🔒',
    title: '???',
  },
]

export default projects
