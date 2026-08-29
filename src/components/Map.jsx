import { useEffect, useMemo, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import projects from '../data/projects'
import { BIOMES, generatePlaceholderMap } from '../utils/generatePlaceholderMap'
import './Map.css'

const RING = {
  done: 'var(--color-status-done)',
  current: 'var(--color-status-current)',
  locked: 'var(--color-status-locked)',
}
const BADGE = { done: '✓', current: '⏳', locked: '🔒' }

function toLatLng(gx, gy, height, tileSize) {
  return [height - gy * tileSize, gx * tileSize]
}

function toGrid(lat, lng, height, tileSize) {
  return {
    gx: Math.round(lng / tileSize),
    gy: Math.round((height - lat) / tileSize),
  }
}

function buildPopupHtml(project) {
  if (project.status === 'locked') {
    return '<div class="popup-eyebrow">Sealed</div><div class="popup-title">???</div><p class="popup-blurb">Not revealed yet.</p>'
  }

  const tags = (project.stack ?? [])
    .map((tag) => `<span>${tag}</span>`)
    .join('')

  const caseStudyLink = project.caseStudyLink
    ? `<a class="popup-link popup-link-secondary" href="${project.caseStudyLink}" target="_blank" rel="noreferrer">Case study →</a>`
    : ''

  return `
    <div class="popup-card">
      <img class="popup-screenshot" src="${project.screenshot}" alt="${project.title} screenshot" />
      <div class="popup-eyebrow">${project.roleAndTimeframe}</div>
      <div class="popup-title">${project.title}</div>
      <p class="popup-problem">${project.oneLinerProblem}</p>
      <p class="popup-blurb">${project.description}</p>
      <div class="popup-tags">${tags}</div>
      <div class="popup-links">
        <a class="popup-link" href="${project.liveLink}" target="_blank" rel="noreferrer">Live product →</a>
        ${caseStudyLink}
      </div>
    </div>
  `
}

function markerLabel(project) {
  if (project.status === 'locked') return '🔒'
  return project.title.charAt(0)
}

function Map() {
  const mapContainerRef = useRef(null)
  const mapRef = useRef(null)
  const markerByIdRef = useRef({})

  const mapConfig = useMemo(() => generatePlaceholderMap(), [])

  const [coords, setCoords] = useState({ gx: 0, gy: 0 })
  const [searchQuery, setSearchQuery] = useState('')
  const [showingList, setShowingList] = useState(false)
  const [showHint, setShowHint] = useState(() => !localStorage.getItem('map-visited'))
  const [hintFaded, setHintFaded] = useState(false)

  const biomeEntries = useMemo(
    () =>
      Object.entries(mapConfig.biomeTileCounts)
        .filter(([biome]) => biome !== 'ocean')
        .sort((a, b) => b[1] - a[1]),
    [mapConfig.biomeTileCounts],
  )

  const statusCounts = useMemo(
    () => ({
      done: projects.filter((p) => p.status === 'done').length,
      current: projects.filter((p) => p.status === 'current').length,
      locked: projects.filter((p) => p.status === 'locked').length,
    }),
    [],
  )

  const searchResults = useMemo(() => {
    const q = searchQuery.toLowerCase()
    return projects.filter(
      (p) => p.status !== 'locked' && p.title.toLowerCase().includes(q),
    )
  }, [searchQuery])

  const listProjects = useMemo(
    () => projects.filter((p) => p.status !== 'locked'),
    [],
  )

  useEffect(() => {
    const container = mapContainerRef.current
    if (!container) return

    const { mapImageUrl, width, height, tileSize } = mapConfig

    const map = L.map(container, {
      crs: L.CRS.Simple,
      minZoom: -2,
      maxZoom: 3,
      zoomSnap: 0.25,
      zoomControl: false,
      attributionControl: false,
    })

    const bounds = [
      [0, 0],
      [height, width],
    ]
    L.imageOverlay(mapImageUrl, bounds).addTo(map)
    map.fitBounds(bounds)
    map.setMaxBounds(
      bounds.map((point, index) =>
        index === 0 ? [point[0] - 100, point[1] - 100] : [point[0] + 100, point[1] + 100],
      ),
    )

    markerByIdRef.current = {}
    projects.forEach((project) => {
      const isLocked = project.status === 'locked'
      const html = `
        <div class="pixel-pin ${isLocked ? 'locked' : ''}" style="--ring:${RING[project.status]}">
          <div class="body">${markerLabel(project)}</div>
          <div class="badge">${BADGE[project.status]}</div>
        </div>`

      const icon = L.divIcon({
        html,
        className: '',
        iconSize: [26, 26],
        iconAnchor: [13, 13],
      })

      const marker = L.marker(
        toLatLng(project.gx, project.gy, height, tileSize),
        { icon },
      ).addTo(map)

      markerByIdRef.current[project.id] = marker
      marker.bindPopup(buildPopupHtml(project), { maxWidth: 320 })
    })

    map.on('mousemove', (event) => {
      const grid = toGrid(event.latlng.lat, event.latlng.lng, height, tileSize)
      setCoords(grid)
    })

    if (!localStorage.getItem('map-visited')) {
      const dismissHint = () => {
        setHintFaded(true)
        localStorage.setItem('map-visited', '1')
        map.off('movestart', dismissHint)
        map.off('zoomstart', dismissHint)
        window.setTimeout(() => setShowHint(false), 600)
      }
      map.on('movestart', dismissHint)
      map.on('zoomstart', dismissHint)
    }

    mapRef.current = map

    return () => {
      map.remove()
      mapRef.current = null
      markerByIdRef.current = {}
    }
  }, [mapConfig])

  function jumpTo(id) {
    const project = projects.find((p) => p.id === id)
    const marker = markerByIdRef.current[id]
    const map = mapRef.current
    if (!project || !marker || !map) return

    const { height, tileSize } = mapConfig
    map.flyTo(toLatLng(project.gx, project.gy, height, tileSize), 1, {
      duration: 0.6,
    })
    window.setTimeout(() => marker.openPopup(), 400)
  }

  function handleZoomIn() {
    mapRef.current?.zoomIn()
  }

  function handleZoomOut() {
    mapRef.current?.zoomOut()
  }

  function toggleView() {
    setShowingList((prev) => !prev)
  }

  return (
    <div className="map-root">
      <div className="map-hud">
        <div className="eyebrow">Charted Works</div>
        <h1>PROJECT ATLAS</h1>
      </div>

      <div className="map-sidebar map-panel">
        <h2>Biomes</h2>
        {biomeEntries.map(([biome, count]) => {
          const [r, g, b] = BIOMES[biome].color
          return (
            <div key={biome} className="map-sidebar-row">
              <span>
                <span
                  className="sw"
                  style={{ background: `rgb(${r}, ${g}, ${b})` }}
                />
                {biome}
              </span>
              <span className="count">{count}</span>
            </div>
          )
        })}
        <div className="map-sidebar-divider" />
        <h2>Status</h2>
        <div className="map-sidebar-row">
          <span>
            <span className="sw" style={{ background: 'var(--color-status-done)' }} />
            shipped
          </span>
          <span className="count">{statusCounts.done}</span>
        </div>
        <div className="map-sidebar-row">
          <span>
            <span className="sw" style={{ background: 'var(--color-status-current)' }} />
            building
          </span>
          <span className="count">{statusCounts.current}</span>
        </div>
        <div className="map-sidebar-row">
          <span>
            <span className="sw" style={{ background: 'var(--color-status-locked)' }} />
            sealed
          </span>
          <span className="count">{statusCounts.locked}</span>
        </div>
      </div>

      <div className="map-topright">
        <div className="map-legend map-panel">
          <div className="row">
            <span className="sw" style={{ borderColor: 'var(--color-status-done)' }} />
            shipped
          </div>
          <div className="row">
            <span className="sw" style={{ borderColor: 'var(--color-status-current)' }} />
            building
          </div>
          <div className="row">
            <span className="sw" style={{ borderColor: 'var(--color-status-locked)' }} />
            sealed
          </div>
        </div>
        <button type="button" className="map-view-toggle" onClick={toggleView}>
          {showingList ? '🗺 Map view' : '☰ List view'}
        </button>
        <div className="map-zoom-controls">
          <button type="button" onClick={handleZoomIn} aria-label="Zoom in">
            +
          </button>
          <button type="button" onClick={handleZoomOut} aria-label="Zoom out">
            −
          </button>
        </div>
      </div>

      <div className="map-search-panel map-panel">
        <h2>Find a project</h2>
        <input
          className="map-search-input"
          type="text"
          placeholder="Search by name..."
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
        />
        <div className="map-search-grid">
          {searchResults.map((project) => (
            <button
              key={project.id}
              type="button"
              className="map-search-item"
              style={{ '--ring': RING[project.status] }}
              onClick={() => jumpTo(project.id)}
            >
              <div className="icon">
                {project.screenshot ? (
                  <img src={project.screenshot} alt="" className="search-thumb" />
                ) : (
                  markerLabel(project)
                )}
              </div>
              <div className="label">{project.title}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="map-coords map-panel">
        x: {coords.gx}, y: {coords.gy}
      </div>

      {showHint && (
        <div className={`map-onboarding map-panel${hintFaded ? ' faded' : ''}`}>
          drag to explore, click a marker to open it
        </div>
      )}

      <div
        ref={mapContainerRef}
        className={`map-container${showingList ? ' hidden' : ''}`}
      />

      <div className={`map-list-view${showingList ? ' visible' : ''}`}>
        {listProjects.map((project) => (
          <a
            key={project.id}
            className="map-list-row"
            href={project.liveLink}
            style={{ '--ring': RING[project.status] }}
          >
            <div className="icon">
              {project.screenshot ? (
                <img src={project.screenshot} alt="" className="list-thumb" />
              ) : (
                markerLabel(project)
              )}
            </div>
            <div className="meta">
              <div className="title">{project.title}</div>
              <div className="tag">{project.roleAndTimeframe}</div>
              <div className="problem">{project.oneLinerProblem}</div>
            </div>
            <div className="status">{project.status}</div>
          </a>
        ))}
      </div>
    </div>
  )
}

export default Map
