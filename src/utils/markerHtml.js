import { PROJECT_STATUS } from '../constants/projectStatus'
import { getProjectTypeColor } from '../constants/projectTypes'
import { publicUrl } from './publicUrl'
import { escapeHtml, safeUrl } from './safeHtml'

function markerIconContent(project) {
  if (project.status === 'locked') return '?'
  if (project.mark) {
    const src = safeUrl(publicUrl(project.mark))
    if (!src) return escapeHtml(project.title?.charAt(0) || '?')
    return `<img class="marker-mark" src="${escapeHtml(src)}" alt="" />`
  }
  return escapeHtml(project.title?.charAt(0) || '?')
}

export function buildMarkerHtml(project, size = 'map') {
  const statusMeta = PROJECT_STATUS[project.status]
  const ring = escapeHtml(getProjectTypeColor(project))
  const icon = markerIconContent(project)
  const hasMark = Boolean(project.mark) && project.status !== 'locked'
  // Keep shipped pins clean; only current/sealed get a quiet status chip
  const showBadge = project.status === 'current' || project.status === 'locked'
  const badge = showBadge
    ? `<div class="marker-badge" aria-hidden="true">${escapeHtml(statusMeta.badge)}</div>`
    : ''

  return `
    <div class="project-marker project-marker--${size}${hasMark ? ' project-marker--has-mark' : ''}" data-status="${escapeHtml(project.status)}" style="--ring:${ring}">
      <div class="marker-icon">${icon}</div>
      ${badge}
    </div>
  `
}
