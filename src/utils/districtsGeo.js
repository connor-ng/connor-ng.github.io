import districts from '../data/districts'
import { gridToLatLng, gridToLngLat } from './sfGeo'

export function districtsToGeoJSON() {
  return {
    type: 'FeatureCollection',
    features: districts.map((district) => {
      const { x, y, w, h } = district.bounds
      const ring = [
        gridToLngLat(x, y),
        gridToLngLat(x + w, y),
        gridToLngLat(x + w, y + h),
        gridToLngLat(x, y + h),
        gridToLngLat(x, y),
      ]

      return {
        type: 'Feature',
        properties: {
          id: district.id,
          name: district.name,
          color: district.color,
        },
        geometry: {
          type: 'Polygon',
          coordinates: [ring],
        },
      }
    }),
  }
}

export function getDistrictLabels() {
  return districts.map((district) => {
    const cx = district.bounds.x + district.bounds.w / 2
    const cy = district.bounds.y + district.bounds.h / 2
    const [lat, lng] = gridToLatLng(cx, cy)
    return {
      id: district.id,
      name: district.name,
      lat,
      lng,
    }
  })
}
