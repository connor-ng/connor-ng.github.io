/** @typedef {import('../data/landmarks').Landmark} Landmark */

const SHAPE_PIXELS = {
  bridge: `
    <rect x="1" y="10" width="2" height="5" fill="currentColor"/>
    <rect x="13" y="10" width="2" height="5" fill="currentColor"/>
    <rect x="2" y="8" width="12" height="2" fill="currentColor"/>
    <rect x="0" y="9" width="16" height="1" fill="currentColor" opacity="0.7"/>
    <rect x="4" y="6" width="1" height="2" fill="currentColor" opacity="0.5"/>
    <rect x="11" y="6" width="1" height="2" fill="currentColor" opacity="0.5"/>
  `,
  tower: `
    <rect x="6" y="2" width="4" height="2" fill="currentColor"/>
    <rect x="5" y="4" width="6" height="10" fill="currentColor"/>
    <rect x="7" y="0" width="2" height="2" fill="currentColor" opacity="0.8"/>
  `,
  building: `
    <rect x="3" y="4" width="10" height="11" fill="currentColor"/>
    <rect x="5" y="6" width="2" height="2" fill="#1a2030" opacity="0.35"/>
    <rect x="9" y="6" width="2" height="2" fill="#1a2030" opacity="0.35"/>
    <rect x="5" y="9" width="2" height="2" fill="#1a2030" opacity="0.35"/>
    <rect x="9" y="9" width="2" height="2" fill="#1a2030" opacity="0.35"/>
    <rect x="7" y="2" width="2" height="2" fill="currentColor"/>
  `,
  park: `
    <rect x="1" y="6" width="14" height="8" fill="currentColor" rx="1"/>
    <rect x="3" y="4" width="3" height="3" fill="currentColor" opacity="0.85"/>
    <rect x="10" y="5" width="3" height="2" fill="currentColor" opacity="0.85"/>
  `,
  pier: `
    <rect x="0" y="8" width="16" height="6" fill="#4a6878"/>
    <rect x="2" y="6" width="12" height="2" fill="currentColor"/>
    <rect x="4" y="4" width="2" height="2" fill="currentColor" opacity="0.7"/>
    <rect x="10" y="4" width="2" height="2" fill="currentColor" opacity="0.7"/>
  `,
  island: `
    <rect x="2" y="10" width="12" height="4" fill="#6a7888"/>
    <rect x="4" y="6" width="8" height="5" fill="currentColor"/>
    <rect x="6" y="4" width="4" height="2" fill="currentColor" opacity="0.8"/>
  `,
  victorian: `
    <polygon points="2,12 4,8 6,12" fill="currentColor"/>
    <polygon points="6,12 8,7 10,12" fill="currentColor" opacity="0.9"/>
    <polygon points="10,12 12,8 14,12" fill="currentColor"/>
    <rect x="2" y="12" width="12" height="3" fill="currentColor" opacity="0.75"/>
  `,
  coast: `
    <rect x="0" y="4" width="16" height="10" fill="#88a8c0" opacity="0.5"/>
    <rect x="0" y="6" width="16" height="4" fill="currentColor"/>
    <rect x="1" y="10" width="14" height="2" fill="currentColor" opacity="0.7"/>
  `,
  industrial: `
    <rect x="2" y="8" width="12" height="6" fill="currentColor"/>
    <rect x="4" y="5" width="8" height="3" fill="currentColor" opacity="0.85"/>
    <rect x="6" y="3" width="4" height="2" fill="currentColor" opacity="0.7"/>
  `,
}

/**
 * @param {Landmark} landmark
 */
function buildPlaceholderSvg(landmark) {
  const pixels = SHAPE_PIXELS[landmark.shape] ?? SHAPE_PIXELS.building
  return `
    <svg class="landmark-placeholder-svg" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      ${pixels}
    </svg>
  `
}

/**
 * @param {Landmark} landmark
 * @param {{ showLabel?: boolean, useSprite?: boolean }} [options]
 */
export function buildLandmarkHtml(landmark, options = {}) {
  const { showLabel = false, useSprite = true } = options
  const spriteMarkup =
    useSprite && landmark.sprite
      ? `<img class="landmark-sprite" src="${landmark.sprite}" alt="" width="${landmark.width}" height="${landmark.height}" />`
      : buildPlaceholderSvg(landmark)

  const labelMarkup = showLabel
    ? `<span class="landmark-label">${landmark.name}</span>`
    : ''

  return `
    <div
      class="landmark-marker landmark-marker--tier${landmark.tier}"
      style="--landmark-accent:${landmark.accent};width:${landmark.width}px;height:${landmark.height}px"
    >
      <div class="landmark-marker-body" style="color:${landmark.accent}">
        ${spriteMarkup}
      </div>
      ${labelMarkup}
    </div>
  `
}

/**
 * @param {Landmark} landmark
 */
export function buildLandmarkPopupHtml(landmark) {
  const tierLabel = landmark.tier === 1 ? 'Landmark' : 'Place of interest'

  return `
    <div class="landmark-popup">
      <div class="landmark-popup-eyebrow">${tierLabel}</div>
      <div class="landmark-popup-title">${landmark.name}</div>
      <p class="landmark-popup-blurb">${landmark.blurb}</p>
      <div class="landmark-popup-coords">gx: ${landmark.gx}, gy: ${landmark.gy}</div>
    </div>
  `
}
