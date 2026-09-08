import { PROJECT_STATUS } from '../constants/projectStatus'
import { getProjectTypeColor } from '../constants/projectTypes'
import { publicUrl } from './publicUrl'

function markerIconContent(project) {
  if (project.status === 'locked') return '?'
  if (project.mark) {
    return `<img class="marker-mark" src="${publicUrl(project.mark)}" alt="" />`
  }
  return project.title.charAt(0)
}

export function buildMarkerHtml(project, size = 'map') {
  const statusMeta = PROJECT_STATUS[project.status]
  const ring = getProjectTypeColor(project)
  const icon = markerIconContent(project)
  const hasMark = Boolean(project.mark) && project.status !== 'locked'
  // Keep shipped pins clean; only current/sealed get a quiet status chip
  const showBadge = project.status === 'current' || project.status === 'locked'
  const badge = showBadge
    ? `<div class="marker-badge" aria-hidden="true">${statusMeta.badge}</div>`
    : ''

  return `
    <div class="project-marker project-marker--${size}${hasMark ? ' project-marker--has-mark' : ''}" data-status="${project.status}" style="--ring:${ring}">
      <div class="marker-icon">${icon}</div>
      ${badge}
    </div>
  `
}
