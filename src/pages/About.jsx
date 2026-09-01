import './About.css'

function About() {
  return (
    <main className="about">
      <section className="about-content" aria-labelledby="about-heading">
        <img
          className="about-photo"
          src="/about/placeholder-portrait.svg"
          alt="Portrait of Connor"
          width={160}
          height={160}
        />
        <h1 id="about-heading">About Connor</h1>
        <p className="about-role">Product &amp; business</p>
        <p className="about-bio">
          A showcase of work across product, strategy, and execution — the
          kinds of problems I like to own end to end. Replace this with your
          background, what you have shipped, and what you are looking for next.
        </p>
      </section>
    </main>
  )
}

export default About
