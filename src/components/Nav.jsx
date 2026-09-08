import { Link, NavLink, useLocation } from 'react-router-dom'
import { normalizePath } from '../utils/path'
import './Nav.css'

const navLinks = [
  { to: '/', label: 'Home', end: true },
  { to: '/about', label: 'About' },
]

function Nav() {
  const { pathname } = useLocation()
  const path = normalizePath(pathname)
  const isMapHome = path === '/'
  const isLightPage = path === '/about' || path === '/contact'

  return (
    <nav
      className={`nav${isMapHome ? ' nav--map' : ''}${isLightPage ? ' nav--light' : ''}`}
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
