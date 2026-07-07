import React from 'react'
import { Link } from 'react-router-dom'

const features = [
  {
    to: '/compress',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <defs><linearGradient id="f1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#6366f1" /><stop offset="100%" stopColor="#8b5cf6" /></linearGradient></defs>
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" stroke="url(#f1)" />
        <polyline points="17 6 23 6 23 12" stroke="url(#f1)" />
      </svg>
    ),
    label: 'Compress',
    desc: 'Shrink images & PDFs',
  },
  {
    to: '/convert',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <defs><linearGradient id="f2" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#6366f1" /><stop offset="100%" stopColor="#8b5cf6" /></linearGradient></defs>
        <polyline points="17 1 21 5 17 9" stroke="url(#f2)" />
        <path d="M3 11V9a4 4 0 0 1 4-4h14" stroke="url(#f2)" />
        <polyline points="7 23 3 19 7 15" stroke="url(#f2)" />
        <path d="M21 13v2a4 4 0 0 1-4 4H3" stroke="url(#f2)" />
      </svg>
    ),
    label: 'Convert',
    desc: 'PDF ↔ Word, Image & more',
  },
  {
    to: '/edit-pdf',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <defs><linearGradient id="f3" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#6366f1" /><stop offset="100%" stopColor="#8b5cf6" /></linearGradient></defs>
        <path d="M12 20h9" stroke="url(#f3)" />
        <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" stroke="url(#f3)" />
      </svg>
    ),
    label: 'Edit PDF',
    desc: 'Add text, images & signs',
  },
  {
    to: '/organize',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <defs><linearGradient id="f4" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#6366f1" /><stop offset="100%" stopColor="#8b5cf6" /></linearGradient></defs>
        <rect x="3" y="3" width="7" height="7" stroke="url(#f4)" />
        <rect x="14" y="3" width="7" height="7" stroke="url(#f4)" />
        <rect x="14" y="14" width="7" height="7" stroke="url(#f4)" />
        <rect x="3" y="14" width="7" height="7" stroke="url(#f4)" />
      </svg>
    ),
    label: 'Organize',
    desc: 'Merge, split & reorder',
  },
  {
    to: '/lock-unlock',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <defs><linearGradient id="f5" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#6366f1" /><stop offset="100%" stopColor="#8b5cf6" /></linearGradient></defs>
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="url(#f5)" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="url(#f5)" />
      </svg>
    ),
    label: 'Lock / Unlock',
    desc: 'Password protect PDFs',
  },
]

const trustItems = [
  { icon: '🔒', text: 'Files never stored' },
  { icon: '⚡', text: 'Instant processing' },
  { icon: '🆓', text: '100% free' },
  { icon: '🚫', text: 'No watermarks' },
]

function Hero() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950 px-6 pt-24 pb-16">
      <div className="max-w-5xl mx-auto text-center px-6 w-full">

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
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
          <Link
            to="/compress"
            className="text-white font-semibold px-8 py-3.5 rounded-full transition-all text-sm shadow-lg hover:scale-105"
            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
          >
            Start Compressing →
          </Link>
          <Link
            to="/convert"
            className="text-gray-700 dark:text-gray-300 font-semibold px-8 py-3.5 rounded-full transition-all text-sm border border-gray-200 dark:border-gray-700 hover:border-indigo-400 dark:hover:border-indigo-600 hover:scale-105 bg-white dark:bg-gray-900"
          >
            Convert a File
          </Link>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mb-12">
          {features.map((f) => (
            <Link
              key={f.to}
              to={f.to}
              className="group flex flex-col items-center gap-2 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-md hover:-translate-y-1 transition-all duration-200"
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                {f.icon}
              </div>
              <p className="text-sm font-semibold text-gray-800 dark:text-white">{f.label}</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 leading-snug text-center">{f.desc}</p>
            </Link>
          ))}
        </div>

        {/* Trust strip */}
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          {trustItems.map((t) => (
            <div key={t.text} className="flex items-center gap-2 text-sm text-gray-400 dark:text-gray-500">
              <span>{t.icon}</span>
              <span>{t.text}</span>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}

export default Hero