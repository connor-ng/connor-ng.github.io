import './About.css'

function BridgeIllustration() {
  return (
    <svg
      className="about-bridge-svg"
      viewBox="0 0 800 320"
      role="img"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="bridge-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8fa4b8" />
          <stop offset="100%" stopColor="#c5d0da" />
        </linearGradient>
        <linearGradient id="bridge-water" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5f7f96" />
          <stop offset="100%" stopColor="#3d5a6e" />
        </linearGradient>
      </defs>

      <rect width="800" height="200" fill="url(#bridge-sky)" />
      <rect y="200" width="800" height="120" fill="url(#bridge-water)" />

      <path
        d="M0 210 Q200 195 400 205 T800 210 L800 320 L0 320 Z"
        fill="#4a6275"
        opacity="0.55"
      />

      <line x1="0" y1="118" x2="800" y2="118" stroke="#b84a3a" strokeWidth="3" />
      <line x1="0" y1="128" x2="800" y2="128" stroke="#c45a48" strokeWidth="5" />

      <line x1="120" y1="128" x2="80" y2="42" stroke="#9a9a9a" strokeWidth="2" />
      <line x1="120" y1="128" x2="160" y2="42" stroke="#9a9a9a" strokeWidth="2" />
      <rect x="108" y="28" width="24" height="100" fill="#c45a48" />
      <rect x="100" y="20" width="40" height="14" fill="#a83f32" />

      <line x1="680" y1="128" x2="640" y2="42" stroke="#9a9a9a" strokeWidth="2" />
      <line x1="680" y1="128" x2="720" y2="42" stroke="#9a9a9a" strokeWidth="2" />
      <rect x="668" y="28" width="24" height="100" fill="#c45a48" />
      <rect x="660" y="20" width="40" height="14" fill="#a83f32" />

      {Array.from({ length: 18 }, (_, i) => {
        const x = 180 + i * 26
        const sag = 18 + Math.sin((i / 17) * Math.PI) * 10
        return (
          <path
            key={x}
            d={`M${x} 42 Q${x + 13} ${42 + sag} ${x + 26} 42`}
            fill="none"
            stroke="#8a8a8a"
            strokeWidth="1.5"
          />
        )
      })}

      <line x1="160" y1="42" x2="640" y2="42" stroke="#7a7a7a" strokeWidth="2.5" />
      <line x1="0" y1="128" x2="108" y2="128" stroke="#b84a3a" strokeWidth="4" />
      <line x1="692" y1="128" x2="800" y2="128" stroke="#b84a3a" strokeWidth="4" />
    </svg>
  )
}

function About() {
  return (
    <main className="about">
      <div className="about-scene">
        <div className="about-bridge" aria-hidden="true">
          <BridgeIllustration />
        </div>

        <section className="about-content" aria-labelledby="about-heading">
          <img
            className="about-photo"
            src="/about/placeholder-portrait.svg"
            alt="Portrait of Connor"
            width={160}
            height={160}
          />
          <h1 id="about-heading">About Connor</h1>
          <p className="about-role">Designer &amp; developer</p>
          <p className="about-bio">
            I build thoughtful digital products at the intersection of craft and
            clarity. This is placeholder copy — replace it with your real bio,
            background, and what you are looking for next.
          </p>
        </section>
      </div>
    </main>
  )
}

export default About
