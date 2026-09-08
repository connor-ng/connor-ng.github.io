import { useEffect } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Nav from './components/Nav'
import Home from './pages/Home'
import About from './pages/About'
import { normalizePath } from './utils/path'

function App() {
  const { pathname } = useLocation()
  const path = normalizePath(pathname)
  const isLightPage = path === '/about' || path === '/contact'

  useEffect(() => {
    document.documentElement.classList.toggle('light-page', isLightPage)
    return () => {
      document.documentElement.classList.remove('light-page')
    }
  }, [isLightPage])

  return (
    <div className={`app${isLightPage ? ' app--light' : ''}`}>
      <Nav />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Navigate to="/about" replace />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
