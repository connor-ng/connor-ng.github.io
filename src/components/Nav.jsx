import { Link, NavLink, useLocation } from 'react-router-dom'
import './Nav.css'

const navLinks = [
  { to: '/', label: 'Home', end: true },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
]

function Nav() {
  const { pathname } = useLocation()
  const isMapHome = pathname === '/'
  const isLightPage = pathname === '/about' || pathname === '/contact'

  return (
    <nav
      className={`nav${isMapHome ? ' nav--map' : ''}${isLightPage ? ' nav--light' : ''}`}
      aria-label="Main"
    >
      <Link to="/" className="nav-brand">
        <span className="nav-brand-mark" aria-hidden="true" />
        <span className="nav-brand-name">Connor Ng</span>
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
