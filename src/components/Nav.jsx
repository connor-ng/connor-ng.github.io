import { Link, NavLink, useLocation } from 'react-router-dom'
import './Nav.css'

const navLinks = [
  { to: '/', label: 'Home', end: true },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
]

function Nav() {
  const { pathname } = useLocation()
  const onMap = pathname === '/'

  return (
    <nav
      className={`nav ${onMap ? 'nav--on-map' : 'nav--default'}`}
      aria-label="Main"
    >
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
