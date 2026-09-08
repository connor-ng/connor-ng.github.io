/** Project type — used for pin ring / list accent when color-coding is on. */
export const PROJECT_TYPES = {
  personal: {
    label: 'Personal',
    color: '#3db0ff',
  },
  school: {
    label: 'School',
    color: '#f0bc3d',
  },
  work: {
    label: 'Work',
    color: '#6a9ad4',
  },
}

export const TYPE_ORDER = ['personal', 'school', 'work']

export function getProjectTypeColor(project) {
  return PROJECT_TYPES[project.type]?.color ?? PROJECT_TYPES.personal.color
}

export function getProjectTypeLabel(project) {
  return PROJECT_TYPES[project.type]?.label ?? 'Personal'
}
