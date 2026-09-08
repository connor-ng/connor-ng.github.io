/** Project type — used for pin ring / list accent when color-coding is on. */
export const PROJECT_TYPES = {
  personal: {
    label: 'Personal',
    color: '#6fa3d0',
  },
  school: {
    label: 'School',
    color: '#c4a15a',
  },
  work: {
    label: 'Work',
    color: '#8a9bb0',
  },
}

export const TYPE_ORDER = ['personal', 'school', 'work']

export function getProjectTypeColor(project) {
  return PROJECT_TYPES[project.type]?.color ?? PROJECT_TYPES.personal.color
}

export function getProjectTypeLabel(project) {
  return PROJECT_TYPES[project.type]?.label ?? 'Personal'
}
