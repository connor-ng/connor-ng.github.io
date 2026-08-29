import projects from '../data/projects'
import './Home.css'

function Home() {
  return (
    <main className="home">
      <h1>Portfolio</h1>
      <p>Welcome to my personal portfolio site.</p>

      <section className="projects">
        <h2>Projects</h2>
        {projects.length === 0 ? (
          <p>No projects yet.</p>
        ) : (
          <ul>
            {projects.map((project) => (
              <li key={project.id}>
                <h3>{project.title}</h3>
                <p>{project.description}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  )
}

export default Home
