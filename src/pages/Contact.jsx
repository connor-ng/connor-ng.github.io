import './Contact.css'

const contactLinks = [
  {
    id: 'email',
    label: 'Email',
    description: 'hello@example.com',
    href: 'mailto:hello@example.com',
    external: false,
    icon: (
      <svg className="contact-icon-svg contact-icon-svg--stroke" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 6h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1Z" />
        <path d="m4 7 8 6 8-6" />
      </svg>
    ),
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    description: 'linkedin.com/in/your-handle',
    href: 'https://www.linkedin.com/in/your-handle',
    external: true,
    icon: (
      <svg className="contact-icon-svg" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M6 9h3v9H6V9Zm1.5-4.5A1.75 1.75 0 1 1 6 6.25 1.75 1.75 0 0 1 7.5 4.5ZM10 9h2.9v1.24h.04a3.18 3.18 0 0 1 2.86-1.57c3.06 0 3.63 2 3.63 4.62V18H16.2v-4.1c0-.98-.02-2.24-1.36-2.24-1.4 0-1.61 1.09-1.61 2.22V18H10V9Z" />
      </svg>
    ),
  },
  {
    id: 'github',
    label: 'GitHub',
    description: 'github.com/your-handle',
    href: 'https://github.com/your-handle',
    external: true,
    icon: (
      <svg className="contact-icon-svg" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.15-1.1-1.46-1.1-1.46-.9-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.89 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02a9.56 9.56 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.69-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2Z" />
      </svg>
    ),
  },
  {
    id: 'resume',
    label: 'Resume',
    description: 'PDF download',
    href: '/resume.pdf',
    external: true,
    icon: (
      <svg className="contact-icon-svg contact-icon-svg--stroke" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6Z" />
        <path d="M14 2v6h6M8 13h8M8 17h8M8 9h2" />
      </svg>
    ),
  },
]

function Contact() {
  return (
    <main className="contact">
      <header className="contact-header">
        <h1>Contact</h1>
        <p>Reach out or grab my resume.</p>
      </header>

      <ul className="contact-list">
        {contactLinks.map((item) => (
          <li key={item.id}>
            <a
              className="contact-row"
              href={item.href}
              {...(item.external
                ? { target: '_blank', rel: 'noreferrer' }
                : {})}
            >
              <span className="contact-icon">{item.icon}</span>
              <span className="contact-meta">
                <span className="contact-label">{item.label}</span>
                <span className="contact-description">{item.description}</span>
              </span>
              <span className="contact-arrow" aria-hidden="true">
                →
              </span>
            </a>
          </li>
        ))}
      </ul>
    </main>
  )
}

export default Contact
