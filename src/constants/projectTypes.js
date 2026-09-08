/** Project type — pin/list accent. Site chrome uses warm amber; blue is optional. */
export const PROJECT_TYPES = {
  personal: {
    label: 'Personal',
    // Optional cool accent so open pins don’t all match the amber chrome
    color: '#3db0ff',
  },
  school: {
    label: 'School',
    color: '#2dd4bf',
  },
  work: {
    label: 'Work',
    color: '#ffb020',
  },
}

export const TYPE_ORDER = ['personal', 'school', 'work']

export function getProjectTypeColor(project) {
  return PROJECT_TYPES[project.type]?.color ?? PROJECT_TYPES.personal.color
}

export function getProjectTypeLabel(project) {
  return PROJECT_TYPES[project.type]?.label ?? 'Personal'
}
