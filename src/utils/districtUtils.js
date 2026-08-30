import districts from '../data/districts'

/**
 * @param {number} gx
 * @param {number} gy
 * @returns {import('../data/districts').District | null}
 */
export function getDistrictAt(gx, gy) {
  const matches = districts.filter(
    (district) =>
      gx >= district.bounds.x &&
      gx < district.bounds.x + district.bounds.w &&
      gy >= district.bounds.y &&
      gy < district.bounds.y + district.bounds.h,
  )

  if (matches.length === 0) return null

  matches.sort(
    (a, b) =>
      a.bounds.w * a.bounds.h - b.bounds.w * b.bounds.h,
  )

  return matches[0]
}

/**
 * @param {{ gx: number, gy: number, districtId?: string }} project
 * @returns {import('../data/districts').District | null}
 */
export function getProjectDistrict(project) {
  if (project.districtId) {
    return (
      districts.find((district) => district.id === project.districtId) ??
      getDistrictAt(project.gx, project.gy)
    )
  }

  return getDistrictAt(project.gx, project.gy)
}

/**
 * @param {Array<{ gx: number, gy: number, districtId?: string }>} projectList
 * @returns {Record<string, number>}
 */
export function countProjectsByDistrict(projectList) {
  /** @type {Record<string, number>} */
  const counts = Object.fromEntries(districts.map((district) => [district.id, 0]))

  for (const project of projectList) {
    const district = getProjectDistrict(project)
    if (district) counts[district.id] += 1
  }

  return counts
}

export function getSortedDistricts() {
  return [...districts].sort((a, b) => a.order - b.order)
}
