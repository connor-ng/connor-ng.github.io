import { useEffect, useState } from 'react'
import { publicUrl } from '../utils/publicUrl'
import { getProjectDistrict } from '../utils/districtUtils'
import './ProjectDetailPanel.css'

/**
 * Slide-over for fuller project story. Popup stays a teaser; this holds depth.
 */
function ProjectDetailPanel({ project, onClose, onViewOnMap }) {
  const gallery = project?.screenshots?.length
    ? project.screenshots
    : project?.screenshot
      ? [{ src: project.screenshot }]
      : []

  const [slide, setSlide] = useState(0)

  useEffect(() => {
    if (gallery.length < 2) return undefined
    const onKey = (event) => {
      if (event.key === 'ArrowRight') {
        setSlide((i) => (i + 1) % gallery.length)
      }
      if (event.key === 'ArrowLeft') {
        setSlide((i) => (i - 1 + gallery.length) % gallery.length)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [gallery.length])

  if (!project) return null

  const district = getProjectDistrict(project)
  const tags = project.tags ?? []
  const why = project.motivation || project.oneLinerProblem
  const built = project.built || project.description
  const outcome = project.outcome
  const active = gallery[slide] ?? gallery[0]

  function prevSlide() {
    setSlide((i) => (i - 1 + gallery.length) % gallery.length)
  }

  function nextSlide() {
    setSlide((i) => (i + 1) % gallery.length)
  }

  return (
    <div className="project-detail-root" role="presentation">
      <button
        type="button"
        className="project-detail-backdrop"
        aria-label="Close project details"
        onClick={onClose}
      />
      <aside
        className="project-detail-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-detail-title"
      >
        <header className="project-detail-header">
          <div className="project-detail-header-copy">
            {project.roleAndTimeframe && (
              <p className="project-detail-eyebrow">{project.roleAndTimeframe}</p>
            )}
            <h2 id="project-detail-title" className="project-detail-title">
              {project.title}
            </h2>
            {district && (
              <p className="project-detail-meta">{district.name}</p>
            )}
          </div>
          <button
            type="button"
            className="project-detail-close"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </header>

        <div className="project-detail-body">
          {active && (
            <div className="project-slideshow" aria-roledescription="carousel">
              <div className="project-slideshow-stage">
                <img
                  key={active.src}
                  className="project-slideshow-image"
                  src={publicUrl(active.src)}
                  alt={active.label ? `${project.title} — ${active.label}` : project.title}
                />
              </div>

              <div className="project-slideshow-bar">
                <p className="project-slideshow-label">
                  {active.label || 'Screenshot'}
                  {gallery.length > 1 && (
                    <span>
                      {' '}
                      · {slide + 1}/{gallery.length}
                    </span>
                  )}
                </p>

                {gallery.length > 1 && (
                  <div className="project-slideshow-controls">
                    <button
                      type="button"
                      className="project-slideshow-nav"
                      onClick={prevSlide}
                      aria-label="Previous screenshot"
                    >
                      ‹
                    </button>
                    <div className="project-slideshow-dots" role="tablist">
                      {gallery.map((shot, index) => (
                        <button
                          key={shot.src}
                          type="button"
                          role="tab"
                          aria-selected={index === slide}
                          aria-label={shot.label || `Screenshot ${index + 1}`}
                          className={`project-slideshow-dot${index === slide ? ' is-active' : ''}`}
                          onClick={() => setSlide(index)}
                        />
                      ))}
                    </div>
                    <button
                      type="button"
                      className="project-slideshow-nav"
                      onClick={nextSlide}
                      aria-label="Next screenshot"
                    >
                      ›
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {tags.length > 0 && (
            <ul className="project-detail-tags">
              {tags.map((tag) => (
                <li key={tag}>{tag}</li>
              ))}
            </ul>
          )}

          {why && (
            <section className="project-detail-section">
              <h3>Why I built it</h3>
              <p>{why}</p>
            </section>
          )}

          {built && (
            <section className="project-detail-section">
              <h3>What I built</h3>
              <p>{built}</p>
            </section>
          )}

          {outcome && (
            <section className="project-detail-section">
              <h3>Outcome</h3>
              <p>{outcome}</p>
            </section>
          )}
        </div>

        <footer className="project-detail-footer">
          {project.liveLink && (
            <a
              className="project-detail-live"
              href={project.liveLink}
              target="_blank"
              rel="noreferrer"
            >
              Live site →
            </a>
          )}
          {onViewOnMap && (
            <button
              type="button"
              className="project-detail-map"
              onClick={onViewOnMap}
            >
              View on map
            </button>
          )}
          <button type="button" className="project-detail-dismiss" onClick={onClose}>
            Close
          </button>
        </footer>
      </aside>
    </div>
  )
}

export default ProjectDetailPanel
