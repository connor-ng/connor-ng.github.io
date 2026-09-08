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
    color: '#7a7a74',
    badge: '–',
  },
}

export const STATUS_ORDER = ['done', 'current', 'locked']
