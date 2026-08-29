import { PROJECT_STATUS } from '../constants/projectStatus'

function markerIconContent(project) {
  if (project.status === 'locked') return '🔒'
  return project.title.charAt(0)
}

export function buildMarkerHtml(project, size = 'map') {
  const { color, badge } = PROJECT_STATUS[project.status]
  const icon = markerIconContent(project)

  return `
    <div class="project-marker project-marker--${size}" style="--ring:${color}">
      <div class="marker-icon">${icon}</div>
      <div class="marker-badge">${badge}</div>
    </div>
  `
}
