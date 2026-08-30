export function toLatLng(gx, gy, height, tileSize) {
  return [height - gy * tileSize, gx * tileSize]
}

export function toGrid(lat, lng, height, tileSize) {
  return {
    gx: Math.round(lng / tileSize),
    gy: Math.round((height - lat) / tileSize),
  }
}

export function formatGridCoords(gx, gy) {
  return `{ gx: ${gx}, gy: ${gy} }`
}
