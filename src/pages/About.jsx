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
          I work at the intersection of product and business — figuring out
          what to build, why it matters, and how to ship it. This map is a
          personal atlas of work I have owned end to end, starting with CFT,
          a training app I built to keep progressive overload on track through
          a busy internship.
        </p>
      </section>
    </main>
  )
}

export default About
