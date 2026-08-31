import districts from '../data/districts'
import { gridToLatLng, gridToLngLat } from './sfGeo'

function polygonArea(ring) {
  let area = 0
  for (let index = 0; index < ring.length - 1; index += 1) {
    const [x1, y1] = ring[index]
    const [x2, y2] = ring[index + 1]
    area += x1 * y2 - x2 * y1
  }
  return Math.abs(area / 2)
}

function pointInPolygon(lng, lat, ring) {
  let inside = false
  for (let index = 0, previous = ring.length - 2; index < ring.length - 1; previous = index, index += 1) {
    const [x1, y1] = ring[index]
    const [x2, y2] = ring[previous]
    const intersects =
      y1 > lat !== y2 > lat &&
      lng < ((x2 - x1) * (lat - y1)) / (y2 - y1 + Number.EPSILON) + x1
    if (intersects) inside = !inside
  }
  return inside
}

function districtRing(district) {
  if (district.polygon?.length) return district.polygon
  const { x, y, w, h } = district.bounds
  return [
    gridToLngLat(x, y),
    gridToLngLat(x + w, y),
    gridToLngLat(x + w, y + h),
    gridToLngLat(x, y + h),
    gridToLngLat(x, y),
  ]
}

/**
 * @param {number} lat
 * @param {number} lng
 * @returns {import('../data/districts').District | null}
 */
export function getDistrictAtLatLng(lat, lng) {
  const matches = districts.filter((district) => {
    const ring = district.polygon ?? districtRing(district)
    return pointInPolygon(lng, lat, ring)
  })

  if (matches.length === 0) return null

  matches.sort((a, b) => {
    const areaA = polygonArea(a.polygon ?? districtRing(a))
    const areaB = polygonArea(b.polygon ?? districtRing(b))
    return areaA - areaB
  })

  return matches[0]
}

/**
 * @param {number} gx
 * @param {number} gy
 * @returns {import('../data/districts').District | null}
 */
export function getDistrictAt(gx, gy) {
  const [lat, lng] = gridToLatLng(gx, gy)
  return getDistrictAtLatLng(lat, lng)
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
