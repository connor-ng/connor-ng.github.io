import districts from '../data/districts'
import { gridToLatLng, gridToLngLat } from './sfGeo'

function ringCentroid(ring) {
  let sumLng = 0
  let sumLat = 0
  const count = ring.length - 1
  for (let index = 0; index < count; index += 1) {
    sumLng += ring[index][0]
    sumLat += ring[index][1]
  }
  return [sumLng / count, sumLat / count]
}

function polygonRing(district) {
  if (district.polygon?.length) {
    return district.polygon
  }

  const { x, y, w, h } = district.bounds
  return [
    gridToLngLat(x, y),
    gridToLngLat(x + w, y),
    gridToLngLat(x + w, y + h),
    gridToLngLat(x, y + h),
    gridToLngLat(x, y),
  ]
}

export function districtsToGeoJSON() {
  return {
    type: 'FeatureCollection',
    features: districts.map((district) => ({
      type: 'Feature',
      properties: {
        id: district.id,
        name: district.name,
        color: district.color,
        order: district.order,
      },
      geometry: {
        type: 'Polygon',
        coordinates: [polygonRing(district)],
      },
    })),
  }
}

export function getDistrictLabels() {
  return districts.map((district) => {
    const ring = polygonRing(district)
    const [lng, lat] = ringCentroid(ring)
    return {
      id: district.id,
      name: district.name,
      lat,
      lng,
    }
  })
}
