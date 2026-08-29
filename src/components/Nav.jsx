import { Link, NavLink } from 'react-router-dom'
import './Nav.css'

const navLinks = [
  { to: '/', label: 'Home', end: true },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
]

function Nav() {
  return (
    <nav className="nav" aria-label="Main">
      <Link to="/" className="nav-brand">
        Connor Ng
      </Link>

      <div className="nav-links">
        {navLinks.map(({ to, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              isActive ? 'nav-link nav-link--active' : 'nav-link'
            }
          >
            {label}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}

export default Nav
