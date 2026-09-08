/** Shared status colors and badges for map markers, legend, and sidebar. */
export const PROJECT_STATUS = {
  done: {
    label: 'shipped',
    color: '#6f8f6a',
    badge: '✓',
  },
  current: {
    label: 'building',
    color: '#c4a15a',
    badge: '·',
  },
  locked: {
    label: 'sealed',
    color: '#5a5a56',
    badge: '?',
  },
}

export const STATUS_ORDER = ['done', 'current', 'locked']
