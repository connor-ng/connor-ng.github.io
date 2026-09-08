import { publicUrl } from '../utils/publicUrl'
import { getProjectDistrict } from '../utils/districtUtils'
import './ProjectDetailPanel.css'

/**
 * Slide-over for fuller project story. Popup stays a teaser; this holds depth.
 */
function ProjectDetailPanel({ project, onClose }) {
  if (!project) return null

  const district = getProjectDistrict(project)
  const tags = project.tags ?? []
  const why = project.motivation || project.oneLinerProblem
  const built = project.built || project.description
  const outcome = project.outcome

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
          {(() => {
            const gallery = project.screenshots?.length
              ? project.screenshots
              : project.screenshot
                ? [{ src: project.screenshot }]
                : []
            if (!gallery.length) return null
            return (
              <div className="project-detail-gallery">
                {gallery.map((shot) => (
                  <figure key={shot.src} className="project-detail-gallery-item">
                    <img src={publicUrl(shot.src)} alt="" />
                    {shot.label && <figcaption>{shot.label}</figcaption>}
                  </figure>
                ))}
              </div>
            )
          })()}

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
          <button type="button" className="project-detail-dismiss" onClick={onClose}>
            Back to map
          </button>
        </footer>
      </aside>
    </div>
  )
}

export default ProjectDetailPanel
