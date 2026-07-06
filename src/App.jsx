import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Compress from './pages/Compress'
import Convert from './pages/Convert'
import EditPDF from './pages/EditPDF'
import Organize from './pages/Organize'
import LockUnlock from './pages/LockUnlock'

function App() {
  const [darkMode, setDarkMode] = useState(false)

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev)
    document.documentElement.classList.toggle('dark')
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-300">
      <Navbar darkMode={darkMode} setDarkMode={toggleDarkMode} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/compress/*" element={<Compress />} />
        <Route path="/convert/*" element={<Convert />} />
        <Route path="/edit-pdf" element={<EditPDF />} />
        <Route path="/organize/*" element={<Organize />} />
        <Route path="/lock-unlock/*" element={<LockUnlock />} />
      </Routes>
      <Footer />
    </div>
  )
}

export default App