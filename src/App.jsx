import { Routes, Route, useLocation } from 'react-router-dom'
import Nav from './components/Nav'
import Home from './pages/Home'
import About from './pages/About'
import Contact from './pages/Contact'

function App() {
  const { pathname } = useLocation()
  const isLightPage = pathname === '/about' || pathname === '/contact'

  return (
    <div className={`app${isLightPage ? ' app--light' : ''}`}>
      <Nav />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
