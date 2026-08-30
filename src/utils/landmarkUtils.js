import landmarks from '../data/landmarks'

export function getLandmarksByTier(tier) {
  return landmarks.filter((landmark) => landmark.tier === tier)
}

export function getSortedLandmarks() {
  return [...landmarks].sort((a, b) => a.tier - b.tier || a.name.localeCompare(b.name))
}

export function getLandmarkById(id) {
  return landmarks.find((landmark) => landmark.id === id) ?? null
}

export function countLandmarksByTier() {
  return {
    1: landmarks.filter((landmark) => landmark.tier === 1).length,
    2: landmarks.filter((landmark) => landmark.tier === 2).length,
    3: landmarks.filter((landmark) => landmark.tier === 3).length,
  }
}
