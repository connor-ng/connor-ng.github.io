import { PROJECT_STATUS } from '../constants/projectStatus'
import { publicUrl } from './publicUrl'

function markerIconContent(project) {
  if (project.status === 'locked') return '🔒'
  if (project.mark) {
    return `<img class="marker-mark" src="${publicUrl(project.mark)}" alt="" />`
  }
  return project.title.charAt(0)
}

export function buildMarkerHtml(project, size = 'map') {
  const { color, badge } = PROJECT_STATUS[project.status]
  const icon = markerIconContent(project)
  const hasMark = Boolean(project.mark) && project.status !== 'locked'

  return `
    <div class="project-marker project-marker--${size}${hasMark ? ' project-marker--has-mark' : ''}" data-status="${project.status}" style="--ring:${color}">
      <div class="marker-icon">${icon}</div>
      <div class="marker-badge">${badge}</div>
    </div>
  `
}
