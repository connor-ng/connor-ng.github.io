import { publicUrl } from '../utils/publicUrl'
import './About.css'

function About() {
  return (
    <main className="about">
      <section className="about-content" aria-labelledby="about-heading">
        <img
          className="about-photo"
          src={publicUrl('/about/connor-about.jpg')}
          srcSet={`${publicUrl('/about/connor-about.jpg')} 1x, ${publicUrl('/about/connor-about-2x.jpg')} 2x`}
          alt="Connor Ng at the Golden Gate Bridge"
          width={240}
          height={300}
        />
        <h1 id="about-heading">About me</h1>
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
