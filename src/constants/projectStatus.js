/** Shared status colors and badges for map markers, legend, and sidebar. */
export const PROJECT_STATUS = {
  done: {
    label: 'shipped',
    color: '#7a9f74',
    badge: '✓',
  },
  current: {
    label: 'building',
    color: '#ffb020',
    badge: '·',
  },
  locked: {
    label: 'coming soon',
    color: '#5a5a56',
    badge: '?',
  },
}

export const STATUS_ORDER = ['done', 'current', 'locked']
