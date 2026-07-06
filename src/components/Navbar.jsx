import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useEffect, useRef } from 'react'

function Navbar({ darkMode, setDarkMode }) {
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    if (!menuOpen) return

    const handleClick = () => {
      setMenuOpen(false)
    }

    const timer = setTimeout(() => {
      document.addEventListener('click', handleClick)
    }, 100)

    return () => {
      clearTimeout(timer)
      document.removeEventListener('click', handleClick)
    }
  }, [menuOpen])

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between relative">

        {/* Logo */}
        <div className="flex-1">
          <Link to="/" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: '21px', letterSpacing: '-1px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <defs>
                <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
              <polygon points="12 2 2 7 12 12 22 7 12 2" stroke="url(#logoGrad)" />
              <polyline points="2 17 12 22 22 17" stroke="url(#logoGrad)" />
              <polyline points="2 12 12 17 22 12" stroke="url(#logoGrad)" />
            </svg>
            <span style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              DocFlow
            </span>
          </Link>
        </div>


        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600 dark:text-gray-300 absolute left-1/2 -translate-x-1/2">
          <Link to="/compress" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Compress</Link>
          <Link to="/convert" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Convert</Link>
          <Link to="/edit-pdf" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Edit PDF</Link>
          <Link to="/organize" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Organize</Link>
          <Link to="/lock-unlock" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Lock / Unlock</Link>
        </div>

        <div className="flex-1 hidden md:flex items-center justify-end gap-2">
          {/* Dark Mode Toggle */}
          <button
            onClick={() => setDarkMode()}
            className="w-10 h-10 rounded-full flex items-center justify-center text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            {darkMode ? (
              // Sun icon
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
              </svg>
            ) : (
              // Moon icon
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
              </svg>
            )}
          </button>

          {/* CTA Button */}
          <Link
            to="/compress"
            className="bg-indigo-600 text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-indigo-700 transition-colors"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden text-gray-600 dark:text-gray-300 focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {menuOpen
              ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            }
          </svg>
        </button>
      </div>

      {/* Mobile Menu Overlay & Menu */}
      {menuOpen && (
        <div className="md:hidden relative z-50 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 px-6 py-4 flex flex-col gap-4 text-sm font-medium text-gray-600 dark:text-gray-300">
          <Link to="/compress" onClick={() => setMenuOpen(false)} className="hover:text-indigo-600">Compress</Link>
          <Link to="/convert" onClick={() => setMenuOpen(false)} className="hover:text-indigo-600">Convert</Link>
          <Link to="/edit-pdf" onClick={() => setMenuOpen(false)} className="hover:text-indigo-600">Edit PDF</Link>
          <Link to="/organize" onClick={() => setMenuOpen(false)} className="hover:text-indigo-600">Organize</Link>
          <Link to="/lock-unlock" onClick={() => setMenuOpen(false)} className="hover:text-indigo-600">Lock / Unlock</Link>
          <button
            onClick={() => { setDarkMode(); setMenuOpen(false) }}
            className="text-left text-gray-600 dark:text-gray-300 hover:text-indigo-600"
          >
            {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
          </button>
        </div>
      )}
    </nav>
  )
}

export default Navbar