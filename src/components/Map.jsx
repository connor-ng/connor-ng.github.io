import { useEffect, useMemo, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import projects from '../data/projects'
import { PROJECT_STATUS, STATUS_ORDER } from '../constants/projectStatus'
import {
  countProjectsByDistrict,
  getDistrictAt,
  getProjectDistrict,
  getSortedDistricts,
} from '../utils/districtUtils'
import { loadMapConfig } from '../utils/loadMapConfig'
import { formatGridCoords, toGrid, toLatLng } from '../utils/mapCoords'
import {
  formatGeoCoords,
  getPointLatLng,
  getSfMaxBounds,
  latLngToGrid,
  SF_CENTER,
  SF_DEFAULT_ZOOM,
  SF_LABEL_TILE_URL,
  SF_MAX_ZOOM,
  SF_MIN_ZOOM,
  SF_TILE_MAX_ZOOM,
  SF_TILE_URL,
  SF_VIEW_BOUNDS,
} from '../utils/sfGeo'
import { districtsToGeoJSON, getDistrictLabels } from '../utils/districtsGeo'
import { buildMarkerHtml } from '../utils/markerHtml'
import './Map.css'

function buildPopupHtml(project) {
  if (project.status === 'locked') {
    return '<div class="popup-eyebrow">Coming soon</div><div class="popup-title">???</div><p class="popup-blurb">Not revealed yet.</p>'
  }

  const tags = (project.tags ?? project.stack ?? [])
    .map((tag) => `<span>${tag}</span>`)
    .join('')

  const screenshot = project.screenshot
    ? `<img class="popup-screenshot" src="${project.screenshot}" alt="" />`
    : ''

  const eyebrow = project.roleAndTimeframe
    ? `<div class="popup-eyebrow">${project.roleAndTimeframe}</div>`
    : ''

  const problem = project.oneLinerProblem
    ? `<p class="popup-problem">${project.oneLinerProblem}</p>`
    : ''

  const blurb = project.description
    ? `<p class="popup-blurb">${project.description}</p>`
    : ''

  const tagRow = tags ? `<div class="popup-tags">${tags}</div>` : ''

  const liveLink = project.liveLink
    ? `<a class="popup-link" href="${project.liveLink}" target="_blank" rel="noreferrer">Live site →</a>`
    : ''

  const caseStudyLink = project.caseStudyLink
    ? `<a class="popup-link popup-link-secondary" href="${project.caseStudyLink}" target="_blank" rel="noreferrer">Case study →</a>`
    : ''

  const links =
    liveLink || caseStudyLink
      ? `<div class="popup-links">${liveLink}${caseStudyLink}</div>`
      : ''

  return `
    <div class="popup-card">
      ${screenshot}
      ${eyebrow}
      <div class="popup-title">${project.title}</div>
      ${problem}
      ${blurb}
      ${tagRow}
      ${links}
    </div>
  `
}

function Map() {
  const mapContainerRef = useRef(null)
  const mapRef = useRef(null)
  const markerByIdRef = useRef({})
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
  const [showHint, setShowHint] = useState(
    () => !localStorage.getItem('map-visited') && projects.some((p) => p.status !== 'locked'),
  )
  const [hintFaded, setHintFaded] = useState(false)
  const [coordPickerMode, setCoordPickerMode] = useState(false)
  const [pickedCoords, setPickedCoords] = useState(null)
  const [copyFeedback, setCopyFeedback] = useState('')
  const [showReference, setShowReference] = useState(false)
  const [referenceAvailable, setReferenceAvailable] = useState(false)

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
    () => projects.filter((project) => project.status !== 'locked'),
    [],
  )

  const featuredProjects = useMemo(
    () => listProjects.filter((project) => project.featured),
    [listProjects],
  )

  const otherListProjects = useMemo(
    () => listProjects.filter((project) => !project.featured),
    [listProjects],
  )

  const hasProjects = listProjects.length > 0

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
      attributionControl: false,
    })

    // Dark basemap via Esri (no API key / no MapLibre workers).
    L.tileLayer(SF_TILE_URL, {
      maxZoom: SF_TILE_MAX_ZOOM,
      maxNativeZoom: SF_TILE_MAX_ZOOM,
    }).addTo(map)

    L.tileLayer(SF_LABEL_TILE_URL, {
      maxZoom: SF_TILE_MAX_ZOOM,
      maxNativeZoom: SF_TILE_MAX_ZOOM,
      pane: 'overlayPane',
    }).addTo(map)

    // Soft district highlights — popular neighborhoods read stronger.
    const districtLayer = L.geoJSON(districtsToGeoJSON(), {
      style: (feature) => {
        const [r, g, b] = feature?.properties?.color ?? [142, 196, 184]
        const popular = feature?.properties?.popular
        return {
          color: `rgb(${r}, ${g}, ${b})`,
          weight: popular ? 1.75 : 0.8,
          opacity: popular ? 0.9 : 0.35,
          fillColor: `rgb(${r}, ${g}, ${b})`,
          fillOpacity: popular ? 0.28 : 0.08,
          className: popular
            ? 'district-poly district-poly--popular'
            : 'district-poly',
        }
      },
      onEachFeature: (feature, layer) => {
        layer.on({
          mouseover: () => {
            layer.setStyle({
              fillOpacity: feature.properties.popular ? 0.4 : 0.2,
              weight: 2.25,
              opacity: 1,
            })
            layer.bringToFront()
          },
          mouseout: () => {
            districtLayer.resetStyle(layer)
          },
        })
      },
    }).addTo(map)

    getDistrictLabels().forEach((label) => {
      const district = sortedDistricts.find((item) => item.id === label.id)
      const popular = district?.popular
      const icon = L.divIcon({
        className: 'district-label-wrap',
        html: `<span class="district-map-label${popular ? ' district-map-label--popular' : ''}">${label.name}</span>`,
        iconSize: [0, 0],
        iconAnchor: [0, 0],
      })
      L.marker([label.lat, label.lng], {
        icon,
        interactive: false,
        keyboard: false,
        zIndexOffset: popular ? 80 : 40,
      }).addTo(map)
    })

    map.whenReady(() => {
      window.setTimeout(() => map.invalidateSize(), 50)
      window.setTimeout(() => map.invalidateSize(), 300)
    })

    // Frame San Francisco city specifically (not the wider Bay Area).
    map.fitBounds(SF_VIEW_BOUNDS, { padding: [20, 20], maxZoom: 13 })
    map.setMaxBounds(getSfMaxBounds())
    map.options.maxBoundsViscosity = 0.95

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
        map.off('popupopen', dismissHint)
        window.setTimeout(() => setShowHint(false), 600)
      }
      map.on('movestart', dismissHint)
      map.on('zoomstart', dismissHint)
      map.on('popupopen', dismissHint)
    }

    mapRef.current = map

    return () => {
      map.remove()
      mapRef.current = null
      markerByIdRef.current = {}
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
        map.off('popupopen', dismissHint)
        window.setTimeout(() => setShowHint(false), 600)
      }
      map.on('movestart', dismissHint)
      map.on('zoomstart', dismissHint)
      map.on('popupopen', dismissHint)
    }

    mapRef.current = map

    return () => {
      map.remove()
      mapRef.current = null
      markerByIdRef.current = {}
      referenceLayerRef.current = null
      pickMarkerRef.current = null
    }
  }, [isPixelMode, mapConfig])

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

  function openOnMap(id) {
    setShowingList(false)
    window.setTimeout(() => jumpTo(id), 50)
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

  if (isPixelMode && !mapConfig) {
    return (
      <div className="map-root map-root--loading">
        <div className="map-loading map-panel">Loading atlas…</div>
      </div>
    )
  }

  return (
    <div
      className={`map-root map-root--geo${mapFocusMode ? ' map-root--focus' : ''}${showingList ? ' map-root--list' : ''}${showHint && !hintFaded && hasProjects ? ' map-root--onboarding' : ''}${coordPickerMode ? ' map-root--coord-picker' : ''}`}
    >
      {!showingList && (
        <div className="map-hud">
          <p className="map-hud-tagline">Personal portfolio</p>
        </div>
      )}

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
        )}
        <div className="map-view-switcher map-panel" role="group" aria-label="View mode">
          <button
            type="button"
            className={`map-view-switcher-btn${!showingList ? ' is-active' : ''}`}
            onClick={() => setShowingList(false)}
            aria-pressed={!showingList}
          >
            Map
          </button>
          <button
            type="button"
            className={`map-view-switcher-btn${showingList ? ' is-active' : ''}`}
            onClick={() => setShowingList(true)}
            aria-pressed={showingList}
          >
            List
          </button>
        </div>
        {!showingList && (
          <div className="map-zoom-controls">
            <button type="button" className="map-panel" onClick={handleZoomIn} aria-label="Zoom in">
              +
            </button>
            <button type="button" className="map-panel" onClick={handleZoomOut} aria-label="Zoom out">
              −
            </button>
          </div>
        )}
      </div>

      {showAtlasTools && (
        <div className="map-atlas-tools map-panel">
          <h2>Atlas tools</h2>
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

      {showHint && !showingList && hasProjects && (
        <div className={`map-onboarding map-panel${hintFaded ? ' faded' : ''}`}>
          Click a pin to view work · drag to explore
        </div>
      )}

      {!showingList && (
        <p className="map-attribution">
          <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">
            OpenStreetMap
          </a>
          {' · '}
          <a
            href="https://www.esri.com/"
            target="_blank"
            rel="noreferrer"
          >
            Esri
          </a>
        </p>
      )}

      <div
        ref={mapContainerRef}
        className={`map-container${showingList ? ' hidden' : ''}`}
      />

      <div className={`map-list-view${showingList ? ' visible' : ''}`}>
        <header className="map-list-header">
          <h2 className="map-list-title">Selected work</h2>
          <p className="map-list-intro">
            {hasProjects
              ? 'Projects I have worked on — open one or view it on the map.'
              : 'Projects will show up here once you add them to the map.'}
          </p>
        </header>

        {!hasProjects && (
          <div className="map-list-empty map-panel">
            <p className="map-list-empty-title">No projects yet</p>
            <p className="map-list-empty-body">
              Add your first entry in <code>src/data/projects.js</code> and drop a
              screenshot in <code>public/projects/</code>.
            </p>
          </div>
        )}

        {featuredProjects.map((project) => {
          const district = getProjectDistrict(project)
          const status = PROJECT_STATUS[project.status]
          return (
            <article
              key={project.id}
              className="map-list-featured map-panel"
              style={{ '--featured-ring': status.color }}
            >
              {project.screenshot && (
                <img
                  className="map-list-featured-shot"
                  src={project.screenshot}
                  alt=""
                />
              )}
              <div className="map-list-featured-body">
                <p className="map-list-featured-eyebrow">
                  {project.featuredLabel ?? 'Featured'}
                </p>
                <h3 className="map-list-featured-title">{project.title}</h3>
                {project.roleAndTimeframe && (
                  <p className="map-list-featured-role">{project.roleAndTimeframe}</p>
                )}
                {district && (
                  <p className="map-list-featured-district">{district.name}</p>
                )}
                {project.oneLinerProblem && (
                  <p className="map-list-featured-problem">{project.oneLinerProblem}</p>
                )}
                <div className="map-list-actions">
                  <button
                    type="button"
                    className="map-list-btn map-list-btn--primary"
                    onClick={() => openOnMap(project.id)}
                  >
                    View on map
                  </button>
                  {project.liveLink && (
                    <a
                      className="map-list-btn map-list-btn--secondary"
                      href={project.liveLink}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Live site →
                    </a>
                  )}
                  {project.caseStudyLink && (
                    <a
                      className="map-list-btn map-list-btn--secondary"
                      href={project.caseStudyLink}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Case study →
                    </a>
                  )}
                </div>
              </div>
            </article>
          )
        })}

        {otherListProjects.length > 0 && (
          <>
            <h3 className="map-list-section-label">More projects</h3>
            {otherListProjects.map((project) => (
              <div key={project.id} className="map-list-row map-panel">
                <div
                  className="list-marker"
                  dangerouslySetInnerHTML={{
                    __html: buildMarkerHtml(project, 'list'),
                  }}
                />
                <div className="meta">
                  <div className="title">{project.title}</div>
                  <div className="tag">{project.roleAndTimeframe}</div>
                  <div className="problem">{project.oneLinerProblem}</div>
                </div>
                <div className="map-list-row-actions">
                  <button
                    type="button"
                    className="map-list-btn map-list-btn--ghost"
                    onClick={() => openOnMap(project.id)}
                  >
                    Map
                  </button>
                  {project.liveLink && (
                    <a
                      className="map-list-btn map-list-btn--ghost"
                      href={project.liveLink}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Open
                    </a>
                  )}
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  )
}

export default Map
