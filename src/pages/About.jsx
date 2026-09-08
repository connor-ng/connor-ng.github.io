import { publicUrl } from '../utils/publicUrl'
import './About.css'

const connectLinks = [
  {
    id: 'email',
    label: 'Email',
    detail: 'connorng1738@gmail.com',
    href: 'mailto:connorng1738@gmail.com',
    external: false,
    icon: (
      <svg className="connect-icon-svg connect-icon-svg--stroke" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 6h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1Z" />
        <path d="m4 7 8 6 8-6" />
      </svg>
    ),
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    detail: 'in/ngconnor',
    href: 'https://www.linkedin.com/in/ngconnor/',
    external: true,
    icon: (
      <svg className="connect-icon-svg" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M6 9h3v9H6V9Zm1.5-4.5A1.75 1.75 0 1 1 6 6.25 1.75 1.75 0 0 1 7.5 4.5ZM10 9h2.9v1.24h.04a3.18 3.18 0 0 1 2.86-1.57c3.06 0 3.63 2 3.63 4.62V18H16.2v-4.1c0-.98-.02-2.24-1.36-2.24-1.4 0-1.61 1.09-1.61 2.22V18H10V9Z" />
      </svg>
    ),
  },
  {
    id: 'github',
    label: 'GitHub',
    detail: 'gitraccd',
    href: 'https://github.com/gitraccd',
    external: true,
    icon: (
      <svg className="connect-icon-svg" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.15-1.1-1.46-1.1-1.46-.9-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.89 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02a9.56 9.56 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.69-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2Z" />
      </svg>
    ),
  },
  {
    id: 'beli',
    label: 'Beli',
    detail: 'Restaurants & cafes',
    href: 'https://beliapp.com/',
    external: true,
    icon: (
      <svg className="connect-icon-svg connect-icon-svg--stroke" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 21V10a2 2 0 0 1 2-2h1v13" />
        <path d="M7 8V4a1 1 0 0 1 1-1h0a1 1 0 0 1 1 1v4" />
        <path d="M12 21V3h1.2A2.8 2.8 0 0 1 16 5.8V21" />
        <path d="M19 21v-8h1a2 2 0 0 1 2 2v6" />
      </svg>
    ),
  },
  {
    id: 'resume',
    label: 'Resume',
    detail: 'PDF',
    href: publicUrl('/resume.pdf'),
    download: 'Connor_Ng_Resume_2028_P.pdf',
    external: false,
    icon: (
      <svg className="connect-icon-svg connect-icon-svg--stroke" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6Z" />
        <path d="M14 2v6h6M8 13h8M8 17h8M8 9h2" />
      </svg>
    ),
  },
]

function About() {
  return (
    <main className="about">
      <div className="about-inner">
        <section className="about-intro" aria-labelledby="about-heading">
          <img
            className="about-photo"
            src={publicUrl('/about/connor-about.jpg')}
            srcSet={`${publicUrl('/about/connor-about.jpg')} 1x, ${publicUrl('/about/connor-about-2x.jpg')} 2x`}
            alt="Connor Ng at the Golden Gate Bridge"
            width={240}
            height={300}
          />

          <div className="about-copy">
            <h1 id="about-heading">About me</h1>
            <p className="about-bio">
              I&apos;m a junior Informatics student at UC Irvine, from San
              Francisco. I&apos;m interested in product management and tech
              consulting. Figuring out what to build, why it matters, and how
              to ship it feels natural to me. I care a lot about efficiency,
              and about using AI and other technology to optimize how things
              get done.
            </p>
            <p className="about-bio">
              This past summer I worked in technology risk at EY. That
              experience connected directly to those interests: working through
              real problems with teams, and finding more efficient ways to get
              work done with AI and process.
            </p>
            <p className="about-bio">
              Outside of class and work I&apos;m a big Warriors and 49ers fan.
              I also love working out, trying different restaurants and cafes,
              and playing games.
            </p>
          </div>
        </section>

        <section className="connect" aria-labelledby="connect-heading">
          <h2 className="connect-heading" id="connect-heading">
            Connect
          </h2>

          <ul className="connect-grid">
            {connectLinks.map((item) => (
              <li key={item.id}>
                <a
                  className="connect-row"
                  href={item.href}
                  {...(item.download ? { download: item.download } : {})}
                  {...(item.external
                    ? { target: '_blank', rel: 'noreferrer' }
                    : {})}
                >
                  <span className="connect-icon">{item.icon}</span>
                  <span className="connect-meta">
                    <span className="connect-label">{item.label}</span>
                    <span className="connect-detail">{item.detail}</span>
                  </span>
                  <span className="connect-arrow" aria-hidden="true">
                    →
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  )
}

export default About
