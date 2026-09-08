/**
 * Pin/list accents. Open work shares the warm site signal;
 * coming-soon pins always use muted gray (not amber).
 */
export const PROJECT_TYPES = {
  personal: {
    label: 'Personal',
    color: '#ffb020',
  },
  school: {
    label: 'School',
    color: '#ffb020',
  },
  work: {
    label: 'Work',
    color: '#ffb020',
  },
}

export const TYPE_ORDER = ['personal', 'school', 'work']

const COMING_SOON_RING = '#8a8a84'

export function getProjectTypeColor(project) {
  if (project.status === 'locked') return COMING_SOON_RING
  return PROJECT_TYPES[project.type]?.color ?? PROJECT_TYPES.personal.color
}

export function getProjectTypeLabel(project) {
  return PROJECT_TYPES[project.type]?.label ?? 'Personal'
}
