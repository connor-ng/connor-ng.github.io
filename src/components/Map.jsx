import { useEffect, useMemo, useRef, useState } from 'react'
import L from 'leaflet'
import '@maplibre/maplibre-gl-leaflet'
import 'maplibre-gl/dist/maplibre-gl.css'
import 'leaflet/dist/leaflet.css'
import projects from '../data/projects'
import landmarks from '../data/landmarks'
import { PROJECT_STATUS, STATUS_ORDER } from '../constants/projectStatus'
import {
  countProjectsByDistrict,
  getDistrictAt,
  getSortedDistricts,
} from '../utils/districtUtils'
import { buildLandmarkHtml, buildLandmarkPopupHtml } from '../utils/landmarkHtml'
import { loadMapConfig } from '../utils/loadMapConfig'
import { formatGridCoords, toGrid, toLatLng } from '../utils/mapCoords'
import {
  formatGeoCoords,
  getPointLatLng,
  getSfMaxBounds,
  latLngToGrid,
  MAP_STYLE_URL,
  SF_CENTER,
  SF_DEFAULT_ZOOM,
  SF_MAX_ZOOM,
  SF_MIN_ZOOM,
  SF_VIEW_BOUNDS,
  ZOOM_LANDMARKS_T1,
  ZOOM_LANDMARKS_T2,
} from '../utils/sfGeo'
import { buildMarkerHtml } from '../utils/markerHtml'
import './Map.css'

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

function Map() {
  const mapContainerRef = useRef(null)
  const mapRef = useRef(null)
  const markerByIdRef = useRef({})
  const landmarkLayerRef = useRef(null)
  const landmarkEntriesRef = useRef([])
  const referenceLayerRef = useRef(null)
  const pickMarkerRef = useRef(null)
  const coordPickerRef = useRef(false)

  const isPixelMode = useMemo(
    () => new URLSearchParams(window.location.search).has('pixel'),
    [],
  )

  const [mapConfig, setMapConfig] = useState(null)
  const [coords, setCoords] = useState({
    gx: 0,
    gy: 0,
    lat: SF_CENTER.lat,
    lng: SF_CENTER.lng,
  })
  const [searchQuery, setSearchQuery] = useState('')
  const [showingList, setShowingList] = useState(false)
  const [showHint, setShowHint] = useState(() => !localStorage.getItem('map-visited'))
  const [hintFaded, setHintFaded] = useState(false)
  const [showLandmarks, setShowLandmarks] = useState(() => {
    const saved = localStorage.getItem('map-show-landmarks')
    return saved === null ? false : saved === '1'
  })
  const [showLandmarkLabels, setShowLandmarkLabels] = useState(false)
  const [coordPickerMode, setCoordPickerMode] = useState(false)
  const [pickedCoords, setPickedCoords] = useState(null)
  const [copyFeedback, setCopyFeedback] = useState('')
  const [showReference, setShowReference] = useState(false)
  const [referenceAvailable, setReferenceAvailable] = useState(false)

  const showLandmarksRef = useRef(showLandmarks)

  const sortedDistricts = useMemo(() => getSortedDistricts(), [])

  const projectCountsByDistrict = useMemo(
    () => countProjectsByDistrict(projects),
    [],
  )

  const showAtlasTools = useMemo(
    () => new URLSearchParams(window.location.search).has('tools'),
    [],
  )

  const showProjectMarkers = true

  const mapFocusMode = !showAtlasTools

  const activeDistrict = useMemo(
    () => getDistrictAt(coords.gx, coords.gy),
    [coords.gx, coords.gy],
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

  const displayCoords = pickedCoords ?? coords
  const coordSnippet = isPixelMode
    ? formatGridCoords(displayCoords.gx, displayCoords.gy)
    : formatGeoCoords(
        displayCoords.lat,
        displayCoords.lng,
        displayCoords.gx,
        displayCoords.gy,
      )

  useEffect(() => {
    if (!isPixelMode) return undefined
    let cancelled = false
    loadMapConfig().then((config) => {
      if (!cancelled) setMapConfig(config)
    })
    return () => {
      cancelled = true
    }
  }, [isPixelMode])

  useEffect(() => {
    coordPickerRef.current = coordPickerMode
  }, [coordPickerMode])

  useEffect(() => {
    showLandmarksRef.current = showLandmarks
    localStorage.setItem('map-show-landmarks', showLandmarks ? '1' : '0')
    const map = mapRef.current
    if (map && !isPixelMode) map.fire('zoomend')
  }, [showLandmarks, isPixelMode])

  useEffect(() => {
    if (!isPixelMode) return undefined
    fetch('/map/reference.png', { method: 'HEAD' })
      .then((response) => setReferenceAvailable(response.ok))
      .catch(() => setReferenceAvailable(false))
    return undefined
  }, [isPixelMode])

  useEffect(() => {
    const container = mapContainerRef.current
    if (!container || isPixelMode) return undefined

    const map = L.map(container, {
      center: [SF_CENTER.lat, SF_CENTER.lng],
      zoom: SF_DEFAULT_ZOOM,
      minZoom: SF_MIN_ZOOM,
      maxZoom: SF_MAX_ZOOM,
      zoomControl: false,
      attributionControl: true,
    })

    L.maplibreGL({
      style: MAP_STYLE_URL,
    }).addTo(map)

    map.fitBounds(SF_VIEW_BOUNDS, { padding: [32, 32] })
    map.setMaxBounds(getSfMaxBounds())
    map.attributionControl.setPrefix('')
    map.attributionControl.addAttribution(
      '© OpenStreetMap · OpenFreeMap',
    )

    const landmarkLayer = L.layerGroup()
    const landmarkEntries = []
    landmarks.forEach((landmark) => {
      const icon = L.divIcon({
        html: buildLandmarkHtml(landmark, {
          useSprite: true,
          showLabel: showLandmarkLabels && landmark.tier === 1,
        }),
        className: `landmark-icon-wrap landmark-icon-wrap--tier${landmark.tier}`,
        iconSize: [landmark.width, landmark.height + (showLandmarkLabels && landmark.tier === 1 ? 14 : 0)],
        iconAnchor: [landmark.anchorX, landmark.anchorY],
      })

      const marker = L.marker(getPointLatLng(landmark), {
        icon,
        zIndexOffset: landmark.tier === 1 ? 180 : 120,
      })

      marker.bindPopup(buildLandmarkPopupHtml(landmark), {
        maxWidth: 280,
        className: 'landmark-popup-wrapper',
      })
      landmarkEntries.push({ marker, tier: landmark.tier })
    })
    landmarkLayerRef.current = landmarkLayer
    landmarkEntriesRef.current = landmarkEntries

    function syncMapDetail() {
      const zoom = map.getZoom()
      const landmarksOn = showLandmarksRef.current

      landmarkLayer.clearLayers()
      if (landmarksOn) {
        landmarkEntries.forEach(({ marker, tier }) => {
          const visible =
            (tier === 1 && zoom >= ZOOM_LANDMARKS_T1) ||
            (tier === 2 && zoom >= ZOOM_LANDMARKS_T2)
          if (visible) landmarkLayer.addLayer(marker)
        })
      }
      if (landmarkLayer.getLayers().length > 0 && !map.hasLayer(landmarkLayer)) {
        landmarkLayer.addTo(map)
      }
      if (landmarkLayer.getLayers().length === 0 && map.hasLayer(landmarkLayer)) {
        map.removeLayer(landmarkLayer)
      }
    }

    map.on('zoomend', syncMapDetail)
    syncMapDetail()

    markerByIdRef.current = {}
    if (showProjectMarkers) {
      projects.forEach((project) => {
        const icon = L.divIcon({
          html: buildMarkerHtml(project, 'map'),
          className: 'project-marker-layer',
          iconSize: [40, 40],
          iconAnchor: [20, 20],
        })

        const marker = L.marker(getPointLatLng(project), {
          icon,
          zIndexOffset: project.status === 'locked' ? 900 : 1200,
        }).addTo(map)

        markerByIdRef.current[project.id] = marker
        marker.bindPopup(buildPopupHtml(project), { maxWidth: 320 })
      })
    }

    const updateCoords = (lat, lng) => {
      const grid = latLngToGrid(lat, lng)
      setCoords({ gx: grid.gx, gy: grid.gy, lat, lng })
    }

    map.on('mousemove', (event) => {
      updateCoords(event.latlng.lat, event.latlng.lng)
    })

    map.on('click', (event) => {
      if (!coordPickerRef.current) return

      const { lat, lng } = event.latlng
      const grid = latLngToGrid(lat, lng)
      setPickedCoords({ gx: grid.gx, gy: grid.gy, lat, lng })

      if (pickMarkerRef.current) {
        pickMarkerRef.current.setLatLng(event.latlng)
      } else {
        const pickIcon = L.divIcon({
          html: '<div class="coord-pick-marker"></div>',
          className: '',
          iconSize: [12, 12],
          iconAnchor: [6, 6],
        })
        pickMarkerRef.current = L.marker(event.latlng, {
          icon: pickIcon,
          zIndexOffset: 800,
        }).addTo(map)
      }
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
      landmarkLayerRef.current = null
      landmarkEntriesRef.current = []
      pickMarkerRef.current = null
    }
  }, [isPixelMode])

  useEffect(() => {
    const container = mapContainerRef.current
    if (!container || !isPixelMode || !mapConfig) return undefined

    const { mapImageUrl, width, height, tileSize } = mapConfig

    const map = L.map(container, {
      crs: L.CRS.Simple,
      minZoom: -3,
      maxZoom: 4,
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
    const boundsPadding = Math.max(width, height) * 0.08
    map.setMaxBounds(
      bounds.map((point, index) =>
        index === 0
          ? [point[0] - boundsPadding, point[1] - boundsPadding]
          : [point[0] + boundsPadding, point[1] + boundsPadding],
      ),
    )

    const referenceLayer = L.imageOverlay('/map/reference.png', bounds, {
      opacity: 0.42,
      interactive: false,
    })
    referenceLayerRef.current = referenceLayer

    const landmarkLayer = L.layerGroup()
    landmarks.forEach((landmark) => {
      const icon = L.divIcon({
        html: buildLandmarkHtml(landmark, { useSprite: true }),
        className: 'landmark-icon-wrap',
        iconSize: [landmark.width, landmark.height],
        iconAnchor: [landmark.anchorX, landmark.anchorY],
      })

      const marker = L.marker(
        toLatLng(landmark.gx, landmark.gy, height, tileSize),
        {
          icon,
          zIndexOffset: landmark.tier === 1 ? 250 : 150,
        },
      )

      marker.bindPopup(buildLandmarkPopupHtml(landmark), {
        maxWidth: 280,
        className: 'landmark-popup-wrapper',
      })
      landmarkLayer.addLayer(marker)
    })
    landmarkLayerRef.current = landmarkLayer

    markerByIdRef.current = {}
    projects.forEach((project) => {
      const icon = L.divIcon({
        html: buildMarkerHtml(project, 'map'),
        className: '',
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      })

      const marker = L.marker(
        toLatLng(project.gx, project.gy, height, tileSize),
        { icon, zIndexOffset: 500 },
      ).addTo(map)

      markerByIdRef.current[project.id] = marker
      marker.bindPopup(buildPopupHtml(project), { maxWidth: 320 })
    })

    map.on('mousemove', (event) => {
      const grid = toGrid(event.latlng.lat, event.latlng.lng, height, tileSize)
      setCoords({
        gx: grid.gx,
        gy: grid.gy,
        lat: SF_CENTER.lat,
        lng: SF_CENTER.lng,
      })
    })

    map.on('click', (event) => {
      if (!coordPickerRef.current) return

      const grid = toGrid(event.latlng.lat, event.latlng.lng, height, tileSize)
      setPickedCoords({
        gx: grid.gx,
        gy: grid.gy,
        lat: SF_CENTER.lat,
        lng: SF_CENTER.lng,
      })

      if (pickMarkerRef.current) {
        pickMarkerRef.current.setLatLng(event.latlng)
      } else {
        const pickIcon = L.divIcon({
          html: '<div class="coord-pick-marker"></div>',
          className: '',
          iconSize: [12, 12],
          iconAnchor: [6, 6],
        })
        pickMarkerRef.current = L.marker(event.latlng, {
          icon: pickIcon,
          zIndexOffset: 800,
        }).addTo(map)
      }
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
      landmarkLayerRef.current = null
      referenceLayerRef.current = null
      pickMarkerRef.current = null
    }
  }, [isPixelMode, mapConfig])

  useEffect(() => {
    const layer = landmarkLayerRef.current
    const map = mapRef.current
    if (!layer || !map || !isPixelMode) return

    if (showLandmarks) {
      layer.addTo(map)
    } else {
      map.removeLayer(layer)
    }
  }, [showLandmarks, isPixelMode])

  useEffect(() => {
    const layer = referenceLayerRef.current
    const map = mapRef.current
    if (!layer || !map || !referenceAvailable || !isPixelMode) return

    if (showReference) {
      layer.addTo(map)
    } else {
      map.removeLayer(layer)
    }
  }, [showReference, referenceAvailable, isPixelMode])

  useEffect(() => {
    if (!coordPickerMode && pickMarkerRef.current && mapRef.current) {
      mapRef.current.removeLayer(pickMarkerRef.current)
      pickMarkerRef.current = null
      setPickedCoords(null)
    }
  }, [coordPickerMode])

  function jumpTo(id) {
    const project = projects.find((p) => p.id === id)
    const marker = markerByIdRef.current[id]
    const map = mapRef.current
    if (!project || !marker || !map) return

    if (isPixelMode && mapConfig) {
      const { height, tileSize } = mapConfig
      map.flyTo(toLatLng(project.gx, project.gy, height, tileSize), 2, {
        duration: 0.6,
      })
    } else {
      map.flyTo(getPointLatLng(project), 15, { duration: 0.6 })
    }

    window.setTimeout(() => marker.openPopup(), 400)
  }

  async function copyCoords() {
    try {
      await navigator.clipboard.writeText(coordSnippet)
      setCopyFeedback('Copied')
      window.setTimeout(() => setCopyFeedback(''), 1500)
    } catch {
      setCopyFeedback('Failed')
      window.setTimeout(() => setCopyFeedback(''), 1500)
    }
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

  if (isPixelMode && !mapConfig) {
    return (
      <div className="map-root map-root--loading">
        <div className="map-loading map-panel">Loading atlas…</div>
      </div>
    )
  }

  return (
    <div
      className={`map-root map-root--geo${mapFocusMode ? ' map-root--focus' : ''}${showLandmarks ? ' map-root--landmarks-on' : ''}${showLandmarkLabels ? ' map-root--landmark-labels' : ''}${coordPickerMode ? ' map-root--coord-picker' : ''}`}
    >
      <div className="map-hud">
        <div className="eyebrow">Charted Works</div>
        <h1>PROJECT ATLAS</h1>
        <p className="map-hud-subtitle">San Francisco</p>
      </div>

      {!mapFocusMode && (
        <div className="map-sidebar map-panel">
          <h2>Districts</h2>
          {sortedDistricts.map((district) => {
            const [r, g, b] = district.color
            const isActive = activeDistrict?.id === district.id
            return (
              <div
                key={district.id}
                className={`map-sidebar-row${isActive ? ' is-active' : ''}`}
                title={`${district.flavor} (${district.pattern})`}
              >
                <span className="map-sidebar-label">
                  <span
                    className="sw sw--filled"
                    style={{ background: `rgb(${r}, ${g}, ${b})` }}
                  />
                  {district.name}
                </span>
                <span className="count">{projectCountsByDistrict[district.id]}</span>
              </div>
            )
          })}
          <div className="map-sidebar-divider" />
          <h2>Status</h2>
          {STATUS_ORDER.map((status) => (
            <div key={status} className="map-sidebar-row">
              <span>
                <span
                  className="sw sw--filled"
                  style={{ background: PROJECT_STATUS[status].color }}
                />
                {PROJECT_STATUS[status].label}
              </span>
              <span className="count">{statusCounts[status]}</span>
            </div>
          ))}
        </div>
      )}

      <div className="map-topright">
        {!mapFocusMode && (
          <>
            <div className="map-legend map-panel">
              {STATUS_ORDER.map((status) => (
                <div key={status} className="row">
                  <span
                    className="legend-swatch"
                    style={{ borderColor: PROJECT_STATUS[status].color }}
                  />
                  {PROJECT_STATUS[status].label}
                </div>
              ))}
            </div>
            <button type="button" className="map-view-toggle map-panel" onClick={toggleView}>
              {showingList ? '🗺 Map view' : '☰ List view'}
            </button>
          </>
        )}
        {mapFocusMode && (
          <div className="map-focus-toggles map-panel">
            <label className="map-focus-toggle">
              <input
                type="checkbox"
                checked={showLandmarks}
                onChange={(event) => setShowLandmarks(event.target.checked)}
              />
              <span>Landmarks</span>
            </label>
          </div>
        )}
        <div className="map-zoom-controls">
          <button type="button" className="map-panel" onClick={handleZoomIn} aria-label="Zoom in">
            +
          </button>
          <button type="button" className="map-panel" onClick={handleZoomOut} aria-label="Zoom out">
            −
          </button>
        </div>
      </div>

      {showAtlasTools && (
        <div className="map-atlas-tools map-panel">
          <h2>Atlas tools</h2>
          <label className="map-tool-toggle">
            <input
              type="checkbox"
              checked={showLandmarks}
              onChange={(event) => setShowLandmarks(event.target.checked)}
            />
            Show landmarks
          </label>
          <label className="map-tool-toggle">
            <input
              type="checkbox"
              checked={showLandmarkLabels}
              onChange={(event) => setShowLandmarkLabels(event.target.checked)}
            />
            Landmark labels
          </label>
          <label className="map-tool-toggle">
            <input
              type="checkbox"
              checked={coordPickerMode}
              onChange={(event) => setCoordPickerMode(event.target.checked)}
            />
            Coord picker
          </label>
          {isPixelMode && referenceAvailable && (
            <label className="map-tool-toggle">
              <input
                type="checkbox"
                checked={showReference}
                onChange={(event) => setShowReference(event.target.checked)}
              />
              Reference overlay
            </label>
          )}
          <div className="map-tool-coords">
            <code>{coordSnippet}</code>
            <button type="button" className="map-tool-copy" onClick={copyCoords}>
              {copyFeedback || 'Copy'}
            </button>
          </div>
          {coordPickerMode && (
            <p className="map-tool-hint">
              Click the map to copy coordinates into projects.js.
            </p>
          )}
          {isPixelMode && !referenceAvailable && (
            <p className="map-tool-hint">
              Drop a traced reference at <code>public/map/reference.png</code> to overlay it.
            </p>
          )}
        </div>
      )}

      {!mapFocusMode && (
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
                onClick={() => jumpTo(project.id)}
              >
                <div
                  className="search-marker"
                  dangerouslySetInnerHTML={{ __html: buildMarkerHtml(project, 'search') }}
                />
                <div className="label">{project.title}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className={`map-coords map-panel${mapFocusMode ? ' map-coords--focus' : ''}`}>
        <span className="map-coords-district">
          {activeDistrict?.name ?? 'Open water'}
        </span>
        <span className="map-coords-grid">
          x: {coords.gx}, y: {coords.gy}
        </span>
        {!mapFocusMode && !isPixelMode && (
          <span className="map-coords-grid map-coords-grid--muted">
            {coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}
          </span>
        )}
      </div>

      {showHint && (
        <div className={`map-onboarding map-panel${hintFaded ? ' faded' : ''}`}>
          {mapFocusMode
            ? 'drag to explore · district updates as you move the cursor'
            : 'drag to explore, click a marker to open it'}
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
            className="map-list-row map-panel"
            href={project.liveLink}
          >
            <div
              className="list-marker"
              dangerouslySetInnerHTML={{ __html: buildMarkerHtml(project, 'list') }}
            />
            <div className="meta">
              <div className="title">{project.title}</div>
              <div className="tag">{project.roleAndTimeframe}</div>
              <div className="problem">{project.oneLinerProblem}</div>
            </div>
            <div
              className="status"
              style={{ color: PROJECT_STATUS[project.status].color }}
            >
              {PROJECT_STATUS[project.status].label}
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}

export default Map
