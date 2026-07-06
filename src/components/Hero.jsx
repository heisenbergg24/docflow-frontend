import React from 'react'
import { Link } from 'react-router-dom'

function Hero() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950 px-6 pt-24 pb-16">
      <div className="max-w-7xl mx-auto text-center px-6">

        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 text-xs font-semibold px-4 py-1.5 rounded-full mb-6 tracking-wide uppercase">
          <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></span>
          Fast. Free. No Sign Up Required.
        </div>

        {/* Headline */}
        <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 dark:text-white leading-tight tracking-tight mb-6">
          All your files.
          <span className="block text-indigo-600 dark:text-indigo-400">
            One powerful tool.
          </span>
        </h1>

        {/* Subheadline */}
        <p className="text-lg md:text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          Compress, convert, edit and secure your PDFs and images — instantly in your browser. No waiting, no watermarks, no limits.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Link
            to="/compress"
            className="text-white font-semibold px-8 py-3.5 rounded-full transition-all text-sm shadow-lg hover:scale-105"
            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
          >
            Start Compressing →
          </Link>
          <Link
            to="/convert"
            className="text-white font-semibold px-8 py-3.5 rounded-full transition-all text-sm shadow-lg hover:scale-105"
            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
          >
            Convert a File →
          </Link>
        </div>

        {/* Stats Row */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-center">
          <div>
            <p className="text-3xl font-extrabold text-gray-900 dark:text-white">10+</p>
            <p className="text-sm text-gray-400 mt-1">File Formats</p>
          </div>
          <div className="hidden sm:block w-px h-10 bg-gray-200 dark:bg-gray-700"></div>
          <div>
            <p className="text-3xl font-extrabold text-gray-900 dark:text-white">100%</p>
            <p className="text-sm text-gray-400 mt-1">Free to Use</p>
          </div>
          <div className="hidden sm:block w-px h-10 bg-gray-200 dark:bg-gray-700"></div>
          <div>
            <p className="text-3xl font-extrabold text-gray-900 dark:text-white">0</p>
            <p className="text-sm text-gray-400 mt-1">Watermarks</p>
          </div>
          <div className="hidden sm:block w-px h-10 bg-gray-200 dark:bg-gray-700"></div>
          <div>
            <p className="text-3xl font-extrabold text-gray-900 dark:text-white">∞</p>
            <p className="text-sm text-gray-400 mt-1">No File Limits</p>
          </div>
        </div>

      </div>
    </section>
  )
}

export default Hero