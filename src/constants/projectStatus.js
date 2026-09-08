/** Shared status colors and badges for map markers, legend, and sidebar. */
export const PROJECT_STATUS = {
  done: {
    label: 'shipped',
    color: '#7a9f74',
    badge: '✓',
  },
  current: {
    label: 'building',
    color: '#f0bc3d',
    badge: '·',
  },
  locked: {
    label: 'sealed',
    color: '#5a5a56',
    badge: '?',
  },
}

export const STATUS_ORDER = ['done', 'current', 'locked']
