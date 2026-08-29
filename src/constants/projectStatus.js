/** Shared status colors and badges for map markers, legend, and sidebar. */
export const PROJECT_STATUS = {
  done: {
    label: 'shipped',
    color: '#7fae6b',
    badge: '✓',
  },
  current: {
    label: 'building',
    color: '#e0b04a',
    badge: '⏳',
  },
  locked: {
    label: 'sealed',
    color: '#8892a0',
    badge: '🔒',
  },
}

export const STATUS_ORDER = ['done', 'current', 'locked']
