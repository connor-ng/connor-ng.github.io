import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import projects from '../data/projects'
import { PROJECT_STATUS, STATUS_ORDER } from '../constants/projectStatus'
import {
  countProjectsByDistrict,
  getDistrictAt,
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
  SF_TONE_GEOJSON_URL,
  SF_USE_LABEL_TILES,
  SF_VIEW_BOUNDS,
} from '../utils/sfGeo'
import { getDistrictLabels } from '../utils/districtsGeo'
import { buildMarkerHtml } from '../utils/markerHtml'
import { publicUrl } from '../utils/publicUrl'
import { getProjectTypeColor } from '../constants/projectTypes'
import ProjectDetailPanel from './ProjectDetailPanel'
import './Map.css'

function buildPopupHtml(project) {
  if (project.status === 'locked') {
    return `
      <div class="popup-card popup-card--locked">
        <div class="popup-eyebrow" style="color:#8a8a84">Coming soon</div>
        <div class="popup-title">Still in the works</div>
        <p class="popup-blurb">This pin marks a project that isn’t public yet. Check back as the map grows.</p>
      </div>
    `
  }

  const tags = (project.tags ?? project.stack ?? [])
    .slice(0, 3)
    .map((tag) => `<span>${tag}</span>`)
    .join('')

  const screenshot = project.screenshot
    ? `<img class="popup-screenshot" src="${publicUrl(project.screenshot)}" alt="" />`
    : ''

  const eyebrow = project.roleAndTimeframe
    ? `<div class="popup-eyebrow">${project.roleAndTimeframe}</div>`
    : ''

  const problem =
    !project.popupBlurb && project.oneLinerProblem
      ? `<p class="popup-problem">${project.oneLinerProblem}</p>`
      : ''

  const blurbText = project.popupBlurb || project.description
  const blurb = blurbText
    ? `<p class="popup-blurb">${blurbText}</p>`
    : ''

  const tagRow = tags ? `<div class="popup-tags">${tags}</div>` : ''

  const liveLink = project.liveLink
    ? `<a class="popup-link" href="${project.liveLink}" target="_blank" rel="noreferrer">Live site →</a>`
    : ''

  const hasDetail =
    Boolean(project.motivation) ||
    Boolean(project.built) ||
    Boolean(project.outcome) ||
    Boolean(project.description)

  const readMore = hasDetail
    ? `<button type="button" class="popup-link popup-link-secondary popup-read-more" data-open-detail="${project.id}">Read more</button>`
    : ''

  const caseStudyLink = project.caseStudyLink
    ? `<a class="popup-link popup-link-secondary" href="${project.caseStudyLink}" target="_blank" rel="noreferrer">Case study →</a>`
    : ''

  const links =
    liveLink || readMore || caseStudyLink
      ? `<div class="popup-links">${liveLink}${readMore}${caseStudyLink}</div>`
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
  const navigate = useNavigate()
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
  const [showIntro, setShowIntro] = useState(
    () =>
      !localStorage.getItem('atlas-intro-seen') &&
      projects.some((project) => project.status !== 'locked'),
  )
  const [introLeaving, setIntroLeaving] = useState(false)
  const [pinPulse, setPinPulse] = useState(false)
  const [showIdleHint, setShowIdleHint] = useState(false)
  const [idleHintFaded, setIdleHintFaded] = useState(false)
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

  const hasProjects = listProjects.length > 0
  const sealedCount = useMemo(
    () => projects.filter((project) => project.status === 'locked').length,
    [],
  )

  const [selectedLogId, setSelectedLogId] = useState(null)
  const [detailProjectId, setDetailProjectId] = useState(null)
  const openProjectDetailRef = useRef(() => {})

  const detailProject = useMemo(
    () => projects.find((project) => project.id === detailProjectId) ?? null,
    [detailProjectId],
  )

  useEffect(() => {
    openProjectDetailRef.current = (id) => {
      setDetailProjectId(id)
      mapRef.current?.closePopup()
      setShowIdleHint(false)
      setIdleHintFaded(false)
    }
  }, [])

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
    fetch(publicUrl('/map/reference.png'), { method: 'HEAD' })
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
      zoomSnap: 0.25,
      zoomDelta: 0.5,
      wheelPxPerZoomLevel: 80,
      zoomControl: false,
      attributionControl: false,
      // Prefer touch/drag reliability on iOS Safari
      preferCanvas: false,
      bounceAtZoomLimits: false,
    })

    // Dark mono Esri basemap + optional label tiles. No API key.
    L.tileLayer(SF_TILE_URL, {
      className: 'map-basemap-tiles',
      maxZoom: SF_MAX_ZOOM,
      maxNativeZoom: SF_TILE_MAX_ZOOM,
      updateWhenIdle: true,
      keepBuffer: 2,
    }).addTo(map)

    if (SF_USE_LABEL_TILES) {
      L.tileLayer(SF_LABEL_TILE_URL, {
        className: 'map-label-tiles',
        maxZoom: SF_MAX_ZOOM,
        maxNativeZoom: SF_TILE_MAX_ZOOM,
        pane: 'overlayPane',
        updateWhenIdle: true,
        keepBuffer: 2,
      }).addTo(map)
    }

    // Quiet tonal accents: dark blue water, dark green parks/hills.
    let toneLayer = null
    let toneCancelled = false
    fetch(publicUrl(SF_TONE_GEOJSON_URL))
      .then((res) => (res.ok ? res.json() : null))
      .then((geojson) => {
        if (toneCancelled || !geojson) return
        toneLayer = L.geoJSON(geojson, {
          interactive: false,
          style: (feature) => {
            const kind = feature?.properties?.kind
            if (kind === 'water') {
              return {
                className: 'map-tone-water',
                color: '#243f52',
                weight: 0,
                fillColor: '#1c3648',
                fillOpacity: 0.72,
              }
            }
            return {
              className: 'map-tone-green',
              color: '#2a3d2c',
              weight: 0,
              fillColor: '#223528',
              fillOpacity: 0.58,
            }
          },
        }).addTo(map)
      })
      .catch(() => {
        /* tonal layer is optional */
      })

    // No district boxes — quiet place labels only (OSM-style names).
    getDistrictLabels().forEach((label) => {
      const district = sortedDistricts.find((item) => item.id === label.id)
      if (!district?.popular) return

      const icon = L.divIcon({
        className: 'district-label-wrap',
        html: `<span class="district-map-label district-map-label--popular">${label.name}</span>`,
        iconSize: [0, 0],
        iconAnchor: [0, 0],
      })
      L.marker([label.lat, label.lng], {
        icon,
        interactive: false,
        keyboard: false,
        zIndexOffset: 40,
      }).addTo(map)
    })

    const syncSize = () => {
      map.invalidateSize({ animate: false })
    }

    map.whenReady(() => {
      syncSize()
      window.setTimeout(syncSize, 50)
      window.setTimeout(syncSize, 250)
      window.setTimeout(syncSize, 600)
      // Frame San Francisco city specifically (not the wider Bay Area).
      map.fitBounds(SF_VIEW_BOUNDS, {
        padding: [24, 24],
        maxZoom: 13,
        animate: false,
      })
    })

    map.setMaxBounds(getSfMaxBounds())
    // Softer on phones so the map doesn't feel locked/broken
    const isCoarsePointer =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(pointer: coarse)').matches
    map.options.maxBoundsViscosity = isCoarsePointer ? 0.55 : 0.85

    const resizeObserver =
      typeof ResizeObserver !== 'undefined'
        ? new ResizeObserver(() => syncSize())
        : null
    resizeObserver?.observe(container)

    const onViewportChange = () => syncSize()
    window.addEventListener('orientationchange', onViewportChange)
    window.addEventListener('resize', onViewportChange)
    window.visualViewport?.addEventListener('resize', onViewportChange)
    window.visualViewport?.addEventListener('scroll', onViewportChange)

    markerByIdRef.current = {}
    if (showProjectMarkers) {
      projects.forEach((project) => {
        const icon = L.divIcon({
          html: buildMarkerHtml(project, 'map'),
          className: 'project-marker-layer',
          iconSize: [44, 44],
          iconAnchor: [22, 22],
        })

        const marker = L.marker(getPointLatLng(project), {
          icon,
          zIndexOffset: project.status === 'locked' ? 900 : 1200,
          keyboard: true,
          riseOnHover: true,
        }).addTo(map)

        markerByIdRef.current[project.id] = marker
        marker.bindPopup(buildPopupHtml(project), {
          maxWidth: 320,
          className: 'project-popup',
          closeButton: true,
          autoPan: true,
          autoPanPadding: [48, 48],
        })
        marker.on('popupopen', () => {
          marker.setPopupContent(buildPopupHtml(project))
        })
      })
    }

    const onPopupAction = (event) => {
      const target = event.target
      if (!(target instanceof Element)) return
      const btn = target.closest('[data-open-detail]')
      if (!btn) return
      event.preventDefault()
      event.stopPropagation()
      openProjectDetailRef.current(btn.getAttribute('data-open-detail'))
    }
    container.addEventListener('click', onPopupAction)

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

    mapRef.current = map

    return () => {
      toneCancelled = true
      if (toneLayer) {
        map.removeLayer(toneLayer)
      }
      container.removeEventListener('click', onPopupAction)
      resizeObserver?.disconnect()
      window.removeEventListener('orientationchange', onViewportChange)
      window.removeEventListener('resize', onViewportChange)
      window.visualViewport?.removeEventListener('resize', onViewportChange)
      window.visualViewport?.removeEventListener('scroll', onViewportChange)
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

    const referenceLayer = L.imageOverlay(publicUrl('/map/reference.png'), bounds, {
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

    const onPopupAction = (event) => {
      const target = event.target
      if (!(target instanceof Element)) return
      const btn = target.closest('[data-open-detail]')
      if (!btn) return
      event.preventDefault()
      event.stopPropagation()
      openProjectDetailRef.current(btn.getAttribute('data-open-detail'))
    }
    container.addEventListener('click', onPopupAction)

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

    mapRef.current = map

    return () => {
      container.removeEventListener('click', onPopupAction)
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

    const duration = 0.35
    const openPopup = () => {
      marker.openPopup()
    }

    map.once('moveend', openPopup)

    if (isPixelMode && mapConfig) {
      const { height, tileSize } = mapConfig
      map.flyTo(toLatLng(project.gx, project.gy, height, tileSize), 2, {
        duration,
      })
    } else {
      // 14 keeps pin context without pulling as many high-zoom tiles as 15
      map.flyTo(getPointLatLng(project), 14, { duration })
    }

    // Fallback if flyTo is a no-op (already centered) or moveend is skipped
    window.setTimeout(() => {
      if (!marker.isPopupOpen()) openPopup()
    }, duration * 1000 + 60)
  }

  function openOnMap(id) {
    setSelectedLogId(id)
    setShowingList(false)
    window.setTimeout(() => {
      mapRef.current?.invalidateSize()
      jumpTo(id)
    }, 40)
  }

  function selectLogProject(id) {
    setSelectedLogId(id)
  }

  function dismissIntro(next = 'explore') {
    if (introLeaving || !showIntro) return

    setIntroLeaving(true)
    localStorage.setItem('atlas-intro-seen', '1')
    localStorage.setItem('map-visited', '1')

    window.setTimeout(() => {
      setShowIntro(false)
      setIntroLeaving(false)

      if (next === 'about') {
        navigate('/about')
        return
      }

      if (next === 'list') {
        setShowingList(true)
        return
      }

      setPinPulse(true)
      window.setTimeout(() => setPinPulse(false), 2400)
      setShowIdleHint(true)
      setIdleHintFaded(false)

      const featured =
        listProjects.find((project) => project.featured) ?? listProjects[0]
      if (featured) {
        jumpTo(featured.id)
      }
    }, 180)
  }

  function dismissIdleHint() {
    if (!showIdleHint || idleHintFaded) return
    setIdleHintFaded(true)
    window.setTimeout(() => setShowIdleHint(false), 280)
  }

  useEffect(() => {
    if (!showIdleHint || showingList) return undefined
    const map = mapRef.current
    if (!map) return undefined

    const onDismiss = () => {
      setIdleHintFaded((faded) => {
        if (faded) return faded
        window.setTimeout(() => setShowIdleHint(false), 280)
        return true
      })
    }
    map.on('movestart', onDismiss)
    map.on('zoomstart', onDismiss)
    map.on('popupclose', onDismiss)
    return () => {
      map.off('movestart', onDismiss)
      map.off('zoomstart', onDismiss)
      map.off('popupclose', onDismiss)
    }
  }, [showIdleHint, showingList])

  useEffect(() => {
    if (!detailProjectId) return undefined
    const onKey = (event) => {
      if (event.key === 'Escape') setDetailProjectId(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [detailProjectId])

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
        <div className="map-loading map-panel">Loading map…</div>
      </div>
    )
  }

  return (
    <div
      className={`map-root map-root--geo${mapFocusMode ? ' map-root--focus' : ''}${showingList ? ' map-root--list' : ''}${showIntro ? ' map-root--intro' : ''}${introLeaving ? ' map-root--intro-leaving' : ''}${pinPulse ? ' map-root--onboarding' : ''}${coordPickerMode ? ' map-root--coord-picker' : ''}`}
    >
      {!showingList && !showIntro && (
        <div className="map-hud">
          <p className="map-hud-tagline">Portfolio map</p>
          <p className="map-hud-count">
            {listProjects.length}{' '}
            {listProjects.length === 1 ? 'project' : 'projects'}
            {sealedCount > 0
              ? ` · ${sealedCount} coming soon`
              : ''}
          </p>
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
        {!showIntro && (
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
            onClick={() => {
              dismissIdleHint()
              setShowingList(true)
            }}
            aria-pressed={showingList}
          >
            List
          </button>
          </div>
        )}
        {!showingList && !showIntro && (
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
          <h2>Map tools</h2>
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

      {showIntro && hasProjects && (
        <div
          className={`map-intro${introLeaving ? ' is-leaving' : ''}`}
          role="dialog"
          aria-modal="true"
          aria-labelledby="map-intro-heading"
        >
          <div className="map-intro-card">
            <p className="map-intro-eyebrow">Personal site</p>
            <h1 id="map-intro-heading" className="map-intro-brand">
              Connor Ng
            </h1>
            <p className="map-intro-copy">
              I&apos;m a junior Informatics student at UC Irvine. This map is
              where I pin work I&apos;ve owned end to end — across San Francisco.
            </p>
            <ul className="map-intro-legend" aria-label="How to read the map">
              <li>
                <span className="map-intro-legend-mark map-intro-legend-mark--open" aria-hidden="true" />
                <span>
                  <strong>Open pins</strong> — projects you can explore now
                </span>
              </li>
              <li>
                <span className="map-intro-legend-mark map-intro-legend-mark--sealed" aria-hidden="true">
                  ?
                </span>
                <span>
                  <strong>Coming soon</strong> — placeholders for work still in progress
                </span>
              </li>
            </ul>
            <div className="map-intro-actions">
              <button
                type="button"
                className="map-intro-btn map-intro-btn--primary"
                onClick={() => dismissIntro('explore')}
              >
                Explore map
              </button>
              <button
                type="button"
                className="map-intro-btn map-intro-btn--ghost"
                onClick={() => dismissIntro('about')}
              >
                About me
              </button>
            </div>
          </div>
        </div>
      )}

      {showIdleHint && !showingList && !showIntro && (
        <div className={`map-idle-hint map-panel${idleHintFaded ? ' is-faded' : ''}`}>
          Click an open pin · ? means coming soon
        </div>
      )}

      {!showingList && !showIntro && (
        <p className="map-attribution">
          <a href="https://www.esri.com/" target="_blank" rel="noreferrer">
            Esri
          </a>
          {' · '}
          <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">
            OSM
          </a>
        </p>
      )}

      <div
        ref={mapContainerRef}
        className="map-container"
      />

      <div
        className={`map-list-view${showingList ? ' visible' : ''}`}
        aria-hidden={!showingList}
      >
        <aside className="mission-log" aria-label="Projects">
          <header className="mission-log-header">
            <p className="mission-log-eyebrow">Projects</p>
            <h2 className="mission-log-title">Selected work</h2>
            <p className="mission-log-intro">
              {hasProjects
                ? 'Each entry is pinned on the map — read more or jump to it.'
                : 'Projects will show up here once you add them to the map.'}
            </p>
          </header>

          {!hasProjects && (
            <div className="mission-log-empty">
              <p className="mission-log-empty-title">No projects yet</p>
              <p className="mission-log-empty-body">
                Add your first entry in <code>src/data/projects.js</code> and drop a
                mark in <code>public/projects/marks/</code>.
              </p>
            </div>
          )}

          <div className="mission-log-list" role="list">
            {listProjects.map((project) => {
              const tags = project.tags ?? project.stack ?? []
              const isSelected = selectedLogId === project.id
              const typeColor = getProjectTypeColor(project)
              const canReadMore = Boolean(
                project.motivation ||
                  project.built ||
                  project.outcome ||
                  project.description ||
                  project.screenshots?.length,
              )

              return (
                <article
                  key={project.id}
                  role="listitem"
                  className={`mission-card${isSelected ? ' is-selected' : ''}${project.featured ? ' is-featured' : ''}`}
                  style={{ '--mission-ring': typeColor }}
                  tabIndex={showingList ? 0 : -1}
                  aria-label={
                    canReadMore
                      ? `${project.title}. Read more.`
                      : `${project.title}. Open on map.`
                  }
                  onClick={() => {
                    dismissIdleHint()
                    if (canReadMore) {
                      openProjectDetailRef.current(project.id)
                    } else {
                      openOnMap(project.id)
                    }
                  }}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault()
                      dismissIdleHint()
                      if (canReadMore) {
                        openProjectDetailRef.current(project.id)
                      } else {
                        openOnMap(project.id)
                      }
                    }
                  }}
                  onFocus={() => selectLogProject(project.id)}
                  onMouseEnter={() => selectLogProject(project.id)}
                >
                  <div className="mission-card-mark" aria-hidden="true">
                    {project.mark ? (
                      <img src={publicUrl(project.mark)} alt="" />
                    ) : (
                      <span>{project.title.charAt(0)}</span>
                    )}
                  </div>

                  <div className="mission-card-body">
                    <h3 className="mission-card-title">{project.title}</h3>

                    {project.roleAndTimeframe && (
                      <p className="mission-card-role">{project.roleAndTimeframe}</p>
                    )}

                    {project.oneLinerProblem && (
                      <p className="mission-card-blurb">{project.oneLinerProblem}</p>
                    )}

                    {tags.length > 0 && (
                      <ul className="mission-card-tags">
                        {tags.map((tag) => (
                          <li key={tag}>{tag}</li>
                        ))}
                      </ul>
                    )}

                    <div className="mission-card-footer">
                      <div className="mission-card-actions">
                        {project.liveLink && (
                          <a
                            className="mission-card-live"
                            href={project.liveLink}
                            target="_blank"
                            rel="noreferrer"
                            onClick={(event) => event.stopPropagation()}
                            onKeyDown={(event) => event.stopPropagation()}
                          >
                            Live site →
                          </a>
                        )}
                        {canReadMore && (
                          <span className="mission-card-read">Read more</span>
                        )}
                        <button
                          type="button"
                          className="mission-card-map"
                          onClick={(event) => {
                            event.stopPropagation()
                            dismissIdleHint()
                            openOnMap(project.id)
                          }}
                        >
                          View on map
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        </aside>
      </div>

      {detailProject && (
        <ProjectDetailPanel
          key={detailProject.id}
          project={detailProject}
          onClose={() => setDetailProjectId(null)}
          onViewOnMap={() => {
            const id = detailProject.id
            setDetailProjectId(null)
            setShowingList(false)
            window.setTimeout(() => {
              mapRef.current?.invalidateSize()
              jumpTo(id)
            }, 40)
          }}
        />
      )}
    </div>
  )
}

export default Map
