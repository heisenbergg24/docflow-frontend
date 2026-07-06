import React from 'react'
import { Link } from 'react-router-dom'

const tools = [
  // Compress
  {
    category: 'Compress',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="url(#g1)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <defs><linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#6366f1" /><stop offset="100%" stopColor="#8b5cf6" /></linearGradient></defs>
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="17 8 12 3 7 8" />
        <line x1="12" y1="3" x2="12" y2="15" />
      </svg>
    ),
    name: 'Compress Image',
    desc: 'Reduce image size without losing quality. Supports PNG, JPG, JPEG, WebP.',
    to: '/compress/image'
  },
  {
    category: 'Compress',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="url(#g2)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <defs><linearGradient id="g2" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#6366f1" /><stop offset="100%" stopColor="#8b5cf6" /></linearGradient></defs>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="9" y1="13" x2="15" y2="13" />
        <line x1="9" y1="17" x2="13" y2="17" />
      </svg>
    ),
    name: 'Compress PDF',
    desc: 'Shrink your PDF file size while keeping it crisp and readable.',
    to: '/compress/pdf'
  },

  // Convert
  {
    category: 'Convert',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="url(#g3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <defs><linearGradient id="g3" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#6366f1" /><stop offset="100%" stopColor="#8b5cf6" /></linearGradient></defs>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <path d="M9 13h6M9 17h4" />
        <path d="M17 13l2 2-2 2" strokeWidth="1.5" />
      </svg>
    ),
    name: 'PDF to Word',
    desc: 'Convert your PDF into an editable Word document instantly.',
    to: '/convert/pdf-to-word'
  },
  {
    category: 'Convert',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="url(#g4)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <defs><linearGradient id="g4" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#6366f1" /><stop offset="100%" stopColor="#8b5cf6" /></linearGradient></defs>
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <line x1="3" y1="9" x2="21" y2="9" />
        <line x1="3" y1="15" x2="21" y2="15" />
        <line x1="9" y1="3" x2="9" y2="21" />
        <line x1="15" y1="3" x2="15" y2="21" />
      </svg>
    ),
    name: 'PDF to Excel',
    desc: 'Extract tables and data from PDF straight into an Excel spreadsheet.',
    to: '/convert/pdf-to-excel'
  },
  {
    category: 'Convert',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="url(#g5)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <defs><linearGradient id="g5" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#6366f1" /><stop offset="100%" stopColor="#8b5cf6" /></linearGradient></defs>
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
        <line x1="6" y1="8" x2="18" y2="8" />
        <line x1="6" y1="12" x2="14" y2="12" />
      </svg>
    ),
    name: 'PDF to PPT',
    desc: 'Turn your PDF into a PowerPoint presentation in seconds.',
    to: '/convert/pdf-to-ppt'
  },
  {
    category: 'Convert',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="url(#g6)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <defs><linearGradient id="g6" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#6366f1" /><stop offset="100%" stopColor="#8b5cf6" /></linearGradient></defs>
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
      </svg>
    ),
    name: 'PDF to Image',
    desc: 'Convert PDF pages into high quality PNG or JPG images.',
    to: '/convert/pdf-to-image'
  },
  {
    category: 'Convert',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="url(#g7)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <defs><linearGradient id="g7" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#6366f1" /><stop offset="100%" stopColor="#8b5cf6" /></linearGradient></defs>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <path d="M9 13h6M9 17h4" />
      </svg>
    ),
    name: 'Word to PDF',
    desc: 'Convert Word documents to PDF format quickly and accurately.',
    to: '/convert/word-to-pdf'
  },
  {
    category: 'Convert',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="url(#g8)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <defs><linearGradient id="g8" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#6366f1" /><stop offset="100%" stopColor="#8b5cf6" /></linearGradient></defs>
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <line x1="3" y1="9" x2="21" y2="9" />
        <line x1="3" y1="15" x2="21" y2="15" />
        <line x1="9" y1="3" x2="9" y2="21" />
        <line x1="15" y1="3" x2="15" y2="21" />
      </svg>
    ),
    name: 'Excel to PDF',
    desc: 'Convert Excel spreadsheets to PDF without formatting issues.',
    to: '/convert/excel-to-pdf'
  },
  {
    category: 'Convert',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="url(#g9)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <defs><linearGradient id="g9" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#6366f1" /><stop offset="100%" stopColor="#8b5cf6" /></linearGradient></defs>
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
    name: 'PPT to PDF',
    desc: 'Save your PowerPoint presentations as PDF files effortlessly.',
    to: '/convert/ppt-to-pdf'
  },
  {
    category: 'Convert',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="url(#g10)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <defs><linearGradient id="g10" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#6366f1" /><stop offset="100%" stopColor="#8b5cf6" /></linearGradient></defs>
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
      </svg>
    ),
    name: 'Image to PDF',
    desc: 'Combine one or more images into a single PDF document.',
    to: '/convert/image-to-pdf'
  },

  // Edit
  {
    category: 'Edit',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="url(#g11)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <defs><linearGradient id="g11" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#6366f1" /><stop offset="100%" stopColor="#8b5cf6" /></linearGradient></defs>
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
      </svg>
    ),
    name: 'Edit PDF',
    desc: 'Add text, draw, annotate and edit your PDF directly in the browser.',
    to: '/edit-pdf'
  },

  // Organize
  {
    category: 'Organize',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="url(#g16)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <defs><linearGradient id="g16" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#6366f1" /><stop offset="100%" stopColor="#8b5cf6" /></linearGradient></defs>
        <path d="M8 6H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-4" />
        <rect x="8" y="2" width="8" height="8" rx="1" />
      </svg>
    ),
    name: 'Merge PDF',
    desc: 'Combine multiple PDF files into one single document easily.',
    to: '/organize/merge'
  },
  {
    category: 'Organize',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="url(#g17)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <defs><linearGradient id="g17" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#6366f1" /><stop offset="100%" stopColor="#8b5cf6" /></linearGradient></defs>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="9" y1="12" x2="15" y2="12" />
      </svg>
    ),
    name: 'Split PDF',
    desc: 'Split a large PDF into separate pages or custom page ranges.',
    to: '/organize/split'
  },
  {
    category: 'Organize',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="url(#g18)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <defs><linearGradient id="g18" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#6366f1" /><stop offset="100%" stopColor="#8b5cf6" /></linearGradient></defs>
        <polyline points="17 1 21 5 17 9" />
        <path d="M3 11V9a4 4 0 0 1 4-4h14" />
        <polyline points="7 23 3 19 7 15" />
        <path d="M21 13v2a4 4 0 0 1-4 4H3" />
      </svg>
    ),
    name: 'Reorder Pages',
    desc: 'Drag and drop to rearrange pages in your PDF document.',
    to: '/organize/reorder'
  },

  // Security
  {
    category: 'Security',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="url(#g12)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <defs><linearGradient id="g12" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#6366f1" /><stop offset="100%" stopColor="#8b5cf6" /></linearGradient></defs>
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
    name: 'Lock PDF',
    desc: 'Protect your PDF with a password to keep your data secure.',
    to: '/lock-unlock/lock'
  },
  {
    category: 'Security',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="url(#g13)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <defs><linearGradient id="g13" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#6366f1" /><stop offset="100%" stopColor="#8b5cf6" /></linearGradient></defs>
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 9.9-1" />
      </svg>
    ),
    name: 'Unlock PDF',
    desc: 'Remove password protection from your PDF files instantly.',
    to: '/lock-unlock/unlock'
  },
]

const categories = ['Compress', 'Convert', 'Edit', 'Organize', 'Security']

function ToolsGrid() {
  return (
    <section className="bg-white dark:bg-gray-950 px-6 py-20">
      <div className="max-w-7xl mx-auto">

        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-4">
            Everything you need
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-lg max-w-xl mx-auto">
            All your file tools in one place — no switching between apps ever again.
          </p>
        </div>

        {/* Categories */}
        {categories.map(category => (
          <div key={category} className="mb-14">
            <h3 className="text-xs font-bold uppercase tracking-widest text-indigo-500 mb-6">
              {category}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {tools
                .filter(tool => tool.category === category)
                .map(tool => (
                  <Link
                    key={tool.name}
                    to={tool.to}
                    className="group p-5 rounded-2xl border border-gray-200 dark:border-gray-800 bg-gradient-to-br from-white to-indigo-50 dark:bg-none dark:bg-gray-900 hover:border-indigo-400 dark:hover:border-indigo-700 hover:shadow-xl hover:shadow-indigo-100 dark:hover:shadow-indigo-950 hover:-translate-y-1 transition-all duration-300"
                    style={{ textDecoration: 'none' }}
                  >
                    <div className="mb-4 w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      {tool.icon}
                    </div>
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                      {tool.name}
                    </h4>
                    <p className="text-xs text-gray-400 dark:text-gray-500 leading-relaxed">
                      {tool.desc}
                    </p>
                  </Link>
                ))}
            </div>
          </div>
        ))}

      </div>
    </section>
  )
}

export default ToolsGrid