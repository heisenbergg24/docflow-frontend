import React from 'react'

/**
 * ErrorBanner — inline, dismissible error message shown inside the page
 * (replaces browser alert() calls).
 *
 * Props:
 *   type    — 'network' | 'server' | 'unknown'
 *   title   — short heading (e.g. "Network Error")
 *   message — longer explanation for the user
 *   onDismiss — called when user clicks ✕
 */
export default function ErrorBanner({ type, title, message, onDismiss }) {
  if (!message) return null

  const icons = {
    network: (
      // Wifi-off style icon
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="1" y1="1" x2="23" y2="23" />
        <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55" />
        <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39" />
        <path d="M10.71 5.05A16 16 0 0 1 22.56 9" />
        <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88" />
        <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
        <line x1="12" y1="20" x2="12.01" y2="20" strokeWidth="3" />
      </svg>
    ),
    server: (
      // Server / database icon
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
        <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
        <line x1="6" y1="6" x2="6.01" y2="6" strokeWidth="3" />
        <line x1="6" y1="18" x2="6.01" y2="18" strokeWidth="3" />
      </svg>
    ),
    unknown: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" strokeWidth="3" />
      </svg>
    ),
  }

  const colors = {
    network: {
      bg: 'bg-amber-50 dark:bg-amber-950/40',
      border: 'border-amber-200 dark:border-amber-800',
      icon: 'text-amber-500',
      title: 'text-amber-800 dark:text-amber-300',
      msg: 'text-amber-700 dark:text-amber-400',
      dismiss: 'text-amber-400 hover:text-amber-600 dark:hover:text-amber-200',
    },
    server: {
      bg: 'bg-red-50 dark:bg-red-950/40',
      border: 'border-red-200 dark:border-red-800',
      icon: 'text-red-500',
      title: 'text-red-800 dark:text-red-300',
      msg: 'text-red-700 dark:text-red-400',
      dismiss: 'text-red-300 hover:text-red-500 dark:hover:text-red-300',
    },
    unknown: {
      bg: 'bg-red-50 dark:bg-red-950/40',
      border: 'border-red-200 dark:border-red-800',
      icon: 'text-red-500',
      title: 'text-red-800 dark:text-red-300',
      msg: 'text-red-700 dark:text-red-400',
      dismiss: 'text-red-300 hover:text-red-500 dark:hover:text-red-300',
    },
  }

  const c = colors[type] || colors.unknown
  const icon = icons[type] || icons.unknown

  return (
    <div
      className={`flex items-start gap-3 p-4 rounded-2xl border ${c.bg} ${c.border} animate-fade-in`}
      role="alert"
    >
      {/* Icon */}
      <div className={`flex-shrink-0 mt-0.5 ${c.icon}`}>
        {icon}
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-semibold mb-0.5 ${c.title}`}>{title}</p>
        <p className={`text-xs leading-relaxed ${c.msg}`}>{message}</p>
      </div>

      {/* Dismiss */}
      {onDismiss && (
        <button
          onClick={onDismiss}
          className={`flex-shrink-0 transition-colors ${c.dismiss}`}
          aria-label="Dismiss error"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      )}
    </div>
  )
}
