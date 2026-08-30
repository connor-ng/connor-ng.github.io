import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import landmarks from '../src/data/landmarks.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const outDir = path.join(__dirname, '../public/landmarks')

const SHAPE_PIXELS = {
  bridge: [
    [1, 10, 2, 5],
    [13, 10, 2, 5],
    [2, 8, 12, 2],
    [0, 9, 16, 1],
  ],
  tower: [
    [6, 2, 4, 2],
    [5, 4, 6, 10],
    [7, 0, 2, 2],
  ],
  building: [
    [3, 4, 10, 11],
    [5, 6, 2, 2],
    [9, 6, 2, 2],
    [7, 2, 2, 2],
  ],
  park: [
    [1, 6, 14, 8],
    [3, 4, 3, 3],
    [10, 5, 3, 2],
  ],
  pier: [
    [0, 8, 16, 6],
    [2, 6, 12, 2],
    [4, 4, 2, 2],
    [10, 4, 2, 2],
  ],
  island: [
    [2, 10, 12, 4],
    [4, 6, 8, 5],
    [6, 4, 4, 2],
  ],
  victorian: [
    [2, 12, 12, 3],
    [4, 8, 2, 4],
    [8, 7, 2, 5],
    [12, 8, 2, 4],
  ],
  coast: [
    [0, 6, 16, 4],
    [1, 10, 14, 2],
  ],
  industrial: [
    [2, 8, 12, 6],
    [4, 5, 8, 3],
    [6, 3, 4, 2],
  ],
}

fs.mkdirSync(outDir, { recursive: true })

for (const landmark of landmarks) {
  const scale = 2
  const rects = SHAPE_PIXELS[landmark.shape] ?? SHAPE_PIXELS.building
  const svgW = 16 * scale
  const svgH = 16 * scale
  const rectsSvg = rects
    .map(
      ([x, y, w, h]) =>
        `<rect x="${x * scale}" y="${y * scale}" width="${w * scale}" height="${h * scale}" fill="${landmark.accent}" />`,
    )
    .join('\n  ')

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${svgW} ${svgH}" width="${landmark.width}" height="${landmark.height}">
  ${rectsSvg}
</svg>
`
  const filename = path.basename(landmark.sprite)
  fs.writeFileSync(path.join(outDir, filename), svg)
}

console.log(`Wrote ${landmarks.length} landmark sprites to public/landmarks/`)
