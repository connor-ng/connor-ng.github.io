import districts from '../data/districts'
import { gridToLngLat } from './sfGeo'

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
