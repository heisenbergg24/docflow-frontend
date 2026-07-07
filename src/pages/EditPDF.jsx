import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import * as pdfjsLib from 'pdfjs-dist'
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url'

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker

function UploadZone({ isDragActive, getRootProps, getInputProps }) {
  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-2xl p-16 text-center cursor-pointer transition-all duration-300
        ${isDragActive
          ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950'
          : 'border-gray-200 dark:border-gray-700 hover:border-indigo-400 dark:hover:border-indigo-600 bg-gray-50 dark:bg-gray-900'
        }`}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <defs><linearGradient id="uz" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#6366f1" /><stop offset="100%" stopColor="#8b5cf6" /></linearGradient></defs>
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="url(#uz)" />
            <polyline points="17 8 12 3 7 8" stroke="url(#uz)" />
            <line x1="12" y1="3" x2="12" y2="15" stroke="url(#uz)" />
          </svg>
        </div>
        <div>
          <p className="text-gray-700 dark:text-gray-300 font-semibold text-lg">
            {isDragActive ? 'Drop it here!' : 'Drag & drop your PDF here'}
          </p>
          <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
            or <span className="text-indigo-500 font-medium">browse to upload</span>
          </p>
        </div>
        <p className="text-xs text-gray-400 dark:text-gray-500">PDF files only</p>
      </div>
    </div>
  )
}

function Toolbar({ activeTool, setActiveTool, onWatermarkClick, watermarkApplied, onRemoveWatermark, onImageToolClick, onSignatureToolClick }) {
  const tools = [
    {
      id: 'select', label: 'Select', icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z" />
        </svg>
      )
    },
    {
      id: 'text', label: 'Add Text', icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="4 7 4 4 20 4 20 7" />
          <line x1="9" y1="20" x2="15" y2="20" />
          <line x1="12" y1="4" x2="12" y2="20" />
        </svg>
      )
    },
    {
      id: 'image', label: 'Add Image', icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
        </svg>
      )
    },
    { id: 'signature', label: 'Signature', icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 17c2-1 3-3 5-3s2 2 4 2 3-3 5-2 2 3 4 1" />
        <line x1="3" y1="21" x2="21" y2="21" />
      </svg>
    )},
    {
      id: 'shape', label: 'Shapes', icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <circle cx="17" cy="6.5" r="3.5" />
        </svg>
      )
    },
  ]

  return (
    <div className="flex gap-1 bg-gray-100 dark:bg-gray-900 p-1.5 rounded-2xl mb-6 mx-auto overflow-x-auto max-w-full">
      {tools.map(tool => (
        <button
          key={tool.id}
          onClick={() => {
            if (tool.id === 'image') onImageToolClick()
            else if (tool.id === 'signature') onSignatureToolClick()
            else setActiveTool(tool.id)
          }}
          title={tool.label}
          className={`px-4 py-2.5 rounded-xl flex items-center gap-2 text-sm font-medium transition-all
            ${activeTool === tool.id
              ? 'bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
              : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
            }`}
        >
          {tool.icon}
          <span className="hidden sm:inline">{tool.label}</span>
        </button>
      ))}

      <div className="w-px bg-gray-200 dark:bg-gray-700 mx-1" />

      <button
        onClick={onWatermarkClick}
        title="Watermark"
        className={`px-4 py-2.5 rounded-xl flex items-center gap-2 text-sm font-medium transition-all
          ${watermarkApplied
            ? 'bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
            : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
          }`}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2L2 7l10 5 10-5-10-5z" />
          <path d="M2 17l10 5 10-5" />
          <path d="M2 12l10 5 10-5" />
        </svg>
        <span className="hidden sm:inline">Watermark</span>
      </button>

      {watermarkApplied && (
        <button
          onClick={onRemoveWatermark}
          title="Remove Watermark"
          className="px-3 py-2.5 rounded-xl flex items-center justify-center text-red-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950 transition-all"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      )}
    </div>
  )
}

function TextBox({ element, isEditing, isSelected, onUpdate, onDelete, onStartEdit, onStopEdit, onSelect }) {
  const [resizing, setResizing] = useState(false)
  const [size, setSize] = useState({ width: 150, height: 'auto' })
  const resizeStart = useRef({ width: 0, x: 0 })

  const handleResizeStart = (e) => {
    e.stopPropagation()
    e.preventDefault()
    setResizing(true)
    const clientX = e.touches ? e.touches[0].clientX : e.clientX
    resizeStart.current = { width: size.width, x: clientX }
  }

  useEffect(() => {
    if (!resizing) return
    const handleMove = (e) => {
      const clientX = e.touches ? e.touches[0].clientX : e.clientX
      const delta = clientX - resizeStart.current.x
      setSize(prev => ({ ...prev, width: Math.max(80, resizeStart.current.width + delta) }))
    }
    const handleEnd = () => setResizing(false)
    window.addEventListener('mousemove', handleMove)
    window.addEventListener('mouseup', handleEnd)
    window.addEventListener('touchmove', handleMove, { passive: false })
    window.addEventListener('touchend', handleEnd)
    return () => {
      window.removeEventListener('mousemove', handleMove)
      window.removeEventListener('mouseup', handleEnd)
      window.removeEventListener('touchmove', handleMove)
      window.removeEventListener('touchend', handleEnd)
    }
  }, [resizing])
  const inputRef = useRef(null)

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isEditing])

  const [dragging, setDragging] = useState(false)
  const dragOffset = useRef({ x: 0, y: 0 })

  const getPoint = (e) => {
    if (e.touches && e.touches.length > 0) {
      return { x: e.touches[0].clientX, y: e.touches[0].clientY }
    }
    return { x: e.clientX, y: e.clientY }
  }

  const handleDragStart = (e) => {
    if (isEditing) return
    e.stopPropagation()
    onSelect(element.id)
    setDragging(true)
    const point = getPoint(e)
    dragOffset.current = { x: point.x - element.x, y: point.y - element.y }
  }

  useEffect(() => {
    if (!dragging) return

    const handleDragMove = (e) => {
      const point = getPoint(e)
      onUpdate(element.id, {
        x: point.x - dragOffset.current.x,
        y: point.y - dragOffset.current.y
      })
    }
    const handleDragEnd = () => setDragging(false)

    window.addEventListener('mousemove', handleDragMove)
    window.addEventListener('mouseup', handleDragEnd)
    window.addEventListener('touchmove', handleDragMove, { passive: false })
    window.addEventListener('touchend', handleDragEnd)

    return () => {
      window.removeEventListener('mousemove', handleDragMove)
      window.removeEventListener('mouseup', handleDragEnd)
      window.removeEventListener('touchmove', handleDragMove)
      window.removeEventListener('touchend', handleDragEnd)
    }
  }, [dragging, element.id, onUpdate])

  const textStyle = {
    fontSize: element.fontSize,
    color: element.color,
    fontFamily: element.fontFamily,
    fontWeight: element.bold ? 'bold' : 'normal',
    fontStyle: element.italic ? 'italic' : 'normal',
    textDecoration: element.underline ? 'underline' : 'none'
  }

  return (
    <>
      {(isSelected || isEditing) && (
        <TextStyleBar element={element} onUpdate={onUpdate} />
      )}
      <div
        style={{ position: 'absolute', left: element.x, top: element.y, cursor: dragging ? 'grabbing' : 'grab' }}
        onMouseDown={handleDragStart}
        onTouchStart={handleDragStart}
        onClick={(e) => e.stopPropagation()}
        onDoubleClick={(e) => { e.stopPropagation(); onStartEdit(element.id) }}
        className="group"
      >
        {isEditing ? (
          <input
            ref={inputRef}
            value={element.text}
            onChange={(e) => onUpdate(element.id, { text: e.target.value })}
            onBlur={onStopEdit}
            onKeyDown={(e) => { if (e.key === 'Enter') onStopEdit() }}
            style={textStyle}
            className="bg-white border border-indigo-400 rounded px-2 py-1 outline-none min-w-[100px]"
            placeholder="Type here..."
          />
        ) : (
          <div style={{ ...textStyle, width: size.width }} className={`px-2 py-1 rounded relative border ${isSelected ? 'border-indigo-400' : 'border-transparent group-hover:border-indigo-300'}`}>
            {element.text || <span className="text-gray-300 italic">Empty text</span>}
            <button onClick={(e) => { e.stopPropagation(); onDelete(element.id) }}
              className={`absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-400 text-white text-xs flex items-center justify-center transition-opacity ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
              ×
            </button>
            {isSelected && (
              <div
                onMouseDown={handleResizeStart}
                onTouchStart={handleResizeStart}
                className="absolute -bottom-1.5 -right-1.5 w-5 h-5 rounded-full bg-indigo-500 border-2 border-white cursor-se-resize touch-none"
              />
            )}
          </div>
        )}
      </div>
    </>
  )
}

function TextStyleBar({ element, onUpdate }) {
  const fonts = [
    { label: 'Inter', value: '"Inter", sans-serif' },
    { label: 'Playfair Display', value: '"Playfair Display", serif' },
    { label: 'Merriweather', value: '"Merriweather", serif' },
    { label: 'Roboto Slab', value: '"Roboto Slab", serif' },
    { label: 'Lora', value: '"Lora", serif' }
  ]
  const barRef = useRef(null)

  const stop = (e) => {
    e.stopPropagation()
  }

  return (
    <div
      ref={barRef}
      onMouseDown={stop}
      onClick={stop}
      onPointerDown={stop}
      className="text-style-bar absolute z-50 flex items-center gap-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg px-2 py-1.5"
      style={{ left: element.x, top: element.y - 48 }}
    >
      <select
        value={element.fontFamily}
        onMouseDown={stop}
        onChange={(e) => { stop(e); onUpdate(element.id, { fontFamily: e.target.value }) }}
        className="text-xs bg-transparent outline-none text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-gray-700 pr-2 mr-1"
      >
        {fonts.map(f => <option key={f.value} value={f.value} className="bg-white text-gray-700">{f.label}</option>)}
      </select>
      <input
        type="number"
        min="8"
        max="72"
        value={element.fontSize}
        onMouseDown={stop}
        onChange={(e) => { stop(e); onUpdate(element.id, { fontSize: parseInt(e.target.value) || 16 }) }}
        className="w-12 text-xs bg-transparent outline-none text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-gray-700 pr-2 mr-1"
      />

      <button
        onMouseDown={stop}
        onClick={(e) => { stop(e); onUpdate(element.id, { bold: !element.bold }) }}
        className={`w-7 h-7 rounded-md flex items-center justify-center text-xs font-bold transition-colors ${element.bold ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400' : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
      >
        B
      </button>

      <button
        onMouseDown={stop}
        onClick={(e) => { stop(e); onUpdate(element.id, { italic: !element.italic }) }}
        className={`w-7 h-7 rounded-md flex items-center justify-center text-xs italic transition-colors ${element.italic ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400' : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
      >
        I
      </button>

      <button
        onMouseDown={stop}
        onClick={(e) => { stop(e); onUpdate(element.id, { underline: !element.underline }) }}
        className={`w-7 h-7 rounded-md flex items-center justify-center text-xs underline transition-colors ${element.underline ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400' : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
      >
        U
      </button>

      <input
        type="color"
        value={element.color}
        onMouseDown={stop}
        onChange={(e) => { stop(e); onUpdate(element.id, { color: e.target.value }) }}
        className="w-7 h-7 rounded-md cursor-pointer border-none outline-none ml-1"
      />
    </div>
  )
}

function WatermarkPanel({ watermark, setWatermark, onApply, onClose }) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-md mx-6 p-6 flex flex-col gap-5"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Add Watermark</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-red-400 transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Text */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Watermark Text</label>
          <input
            type="text"
            value={watermark.text}
            onChange={(e) => setWatermark(prev => ({ ...prev, text: e.target.value }))}
            placeholder="e.g. CONFIDENTIAL, DRAFT"
            className="px-4 py-2.5 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white text-sm outline-none focus:border-indigo-400 transition-colors"
          />
        </div>

        {/* Color + Font Size */}
        <div className="flex gap-4">
          <div className="flex flex-col gap-1.5 flex-1">
            <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Color</label>
            <input
              type="color"
              value={watermark.color}
              onChange={(e) => setWatermark(prev => ({ ...prev, color: e.target.value }))}
              className="w-full h-10 rounded-lg cursor-pointer border border-gray-200 dark:border-gray-700"
            />
          </div>
          <div className="flex flex-col gap-1.5 flex-1">
            <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Font Size</label>
            <input
              type="number"
              min="12"
              max="120"
              value={watermark.fontSize}
              onChange={(e) => setWatermark(prev => ({ ...prev, fontSize: parseInt(e.target.value) || 48 }))}
              className="px-4 py-2.5 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white text-sm outline-none focus:border-indigo-400 transition-colors"
            />
          </div>
        </div>

        {/* Opacity */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-gray-500 dark:text-gray-400">
            Opacity — {Math.round(watermark.opacity * 100)}%
          </label>
          <input
            type="range"
            min="0.05"
            max="1"
            step="0.05"
            value={watermark.opacity}
            onChange={(e) => setWatermark(prev => ({ ...prev, opacity: parseFloat(e.target.value) }))}
            className="w-full accent-indigo-500"
          />
        </div>

        {/* Rotation */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-gray-500 dark:text-gray-400">
            Rotation — {watermark.rotation}°
          </label>
          <input
            type="range"
            min="-90"
            max="90"
            step="5"
            value={watermark.rotation}
            onChange={(e) => setWatermark(prev => ({ ...prev, rotation: parseInt(e.target.value) }))}
            className="w-full accent-indigo-500"
          />
        </div>

        {/* Apply to all pages */}
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={watermark.applyToAll}
            onChange={(e) => setWatermark(prev => ({ ...prev, applyToAll: e.target.checked }))}
            className="w-4 h-4 accent-indigo-500"
          />
          <span className="text-sm text-gray-600 dark:text-gray-400">Apply to all pages</span>
        </label>

        {/* Apply button */}
        <button
          onClick={onApply}
          className="w-full py-3 rounded-full text-white font-semibold text-sm hover:scale-105 transition-all"
          style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
        >
          Apply Watermark →
        </button>
      </div>
    </div>
  )
}

function ImageBox({ element, isSelected, onUpdate, onDelete, onSelect }) {
  const [dragging, setDragging] = useState(false)
  const [resizing, setResizing] = useState(false)
  const dragOffset = useRef({ x: 0, y: 0 })
  const resizeStart = useRef({ width: 0, height: 0, x: 0, y: 0 })

  const getPoint = (e) => {
    if (e.touches && e.touches.length > 0) {
      return { x: e.touches[0].clientX, y: e.touches[0].clientY }
    }
    return { x: e.clientX, y: e.clientY }
  }

  const handleDragStart = (e) => {
    e.stopPropagation()
    onSelect(element.id)
    setDragging(true)
    const point = getPoint(e)
    dragOffset.current = { x: point.x - element.x, y: point.y - element.y }
  }

  const handleResizeStart = (e) => {
    e.stopPropagation()
    setResizing(true)
    const point = getPoint(e)
    resizeStart.current = { width: element.width, height: element.height, x: point.x, y: point.y }
  }

  useEffect(() => {
    if (!dragging && !resizing) return

    const handleMove = (e) => {
      const point = getPoint(e)
      if (dragging) {
        onUpdate(element.id, {
          x: point.x - dragOffset.current.x,
          y: point.y - dragOffset.current.y
        })
      } else if (resizing) {
        const deltaX = point.x - resizeStart.current.x
        const deltaY = point.y - resizeStart.current.y
        onUpdate(element.id, {
          width: Math.max(40, resizeStart.current.width + deltaX),
          height: Math.max(40, resizeStart.current.height + deltaY)
        })
      }
    }
    const handleEnd = () => {
      setDragging(false)
      setResizing(false)
    }

    window.addEventListener('mousemove', handleMove)
    window.addEventListener('mouseup', handleEnd)
    window.addEventListener('touchmove', handleMove, { passive: false })
    window.addEventListener('touchend', handleEnd)

    return () => {
      window.removeEventListener('mousemove', handleMove)
      window.removeEventListener('mouseup', handleEnd)
      window.removeEventListener('touchmove', handleMove)
      window.removeEventListener('touchend', handleEnd)
    }
  }, [dragging, resizing, element.id, onUpdate])

  return (
    <div
      style={{
        position: 'absolute',
        left: element.x,
        top: element.y,
        width: element.width,
        height: element.height,
        cursor: dragging ? 'grabbing' : 'grab'
      }}
      onMouseDown={handleDragStart}
      onTouchStart={handleDragStart}
      onClick={(e) => e.stopPropagation()}
      className={`group border-2 ${isSelected ? 'border-indigo-400' : 'border-transparent hover:border-indigo-300'}`}
    >
      <img
        src={element.src}
        alt="added"
        className="w-full h-full object-contain pointer-events-none select-none"
        draggable={false}
      />

      {/* Delete button */}
      <button
        onClick={(e) => { e.stopPropagation(); onDelete(element.id) }}
        className={`absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-400 text-white text-xs flex items-center justify-center transition-opacity
          ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
      >
        ×
      </button>

      {/* Resize handle - bottom right corner */}
      {isSelected && (
        <div
          onMouseDown={handleResizeStart}
          onTouchStart={handleResizeStart}
          className="absolute -bottom-1.5 -right-1.5 w-4 h-4 rounded-full bg-indigo-500 border-2 border-white cursor-se-resize"
        />
      )}
    </div>
  )
}



function SignaturePanel({ onCreate, onClose }) {
  const [tab, setTab] = useState('draw') // 'draw' | 'type' | 'upload'

  // Draw tab state
  const canvasRef = useRef(null)
  const isDrawingRef = useRef(false)
  const [hasDrawn, setHasDrawn] = useState(false)

 // Upload tab state
  const [uploadedSrc, setUploadedSrc] = useState(null)
  const [processedSrc, setProcessedSrc] = useState(null)
  const [removeBg, setRemoveBg] = useState(true)
  const [processing, setProcessing] = useState(false)
  const fileInputRef = useRef(null)

  const getPoint = (e, canvas) => {
    const rect = canvas.getBoundingClientRect()
    const point = e.touches && e.touches.length > 0
      ? { x: e.touches[0].clientX, y: e.touches[0].clientY }
      : { x: e.clientX, y: e.clientY }
    return { x: point.x - rect.left, y: point.y - rect.top }
  }

  const handleDrawStart = (e) => {
    e.preventDefault()
    isDrawingRef.current = true
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const point = getPoint(e, canvas)
    ctx.beginPath()
    ctx.moveTo(point.x, point.y)
    setHasDrawn(true)
  }

  const handleDrawMove = (e) => {
    if (!isDrawingRef.current) return
    e.preventDefault()
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const point = getPoint(e, canvas)
    ctx.lineTo(point.x, point.y)
    ctx.strokeStyle = '#1f2937'
    ctx.lineWidth = 2.5
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.stroke()
  }

  const handleDrawEnd = () => {
    isDrawingRef.current = false
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const onTouchStart = (e) => handleDrawStart(e)
    const onTouchMove = (e) => handleDrawMove(e)
    const onTouchEnd = () => handleDrawEnd()

    canvas.addEventListener('touchstart', onTouchStart, { passive: false })
    canvas.addEventListener('touchmove', onTouchMove, { passive: false })
    canvas.addEventListener('touchend', onTouchEnd, { passive: false })

    return () => {
      canvas.removeEventListener('touchstart', onTouchStart)
      canvas.removeEventListener('touchmove', onTouchMove)
      canvas.removeEventListener('touchend', onTouchEnd)
    }
  }, [])

  const clearDrawCanvas = () => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    setHasDrawn(false)
  }

  const handleUploadFile = async (e) => {
  const file = e.target.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = async (event) => {
    const src = event.target.result
    setUploadedSrc(src)
    if (removeBg) {
      setProcessing(true)
      const cleaned = await removeWhiteBackground(src)
      setProcessedSrc(cleaned)
      setProcessing(false)
    } else {
      setProcessedSrc(src)
    }
  }
  reader.readAsDataURL(file)
}

const handleToggleRemoveBg = async (checked) => {
  setRemoveBg(checked)
  if (!uploadedSrc) return
  if (checked) {
    setProcessing(true)
    const cleaned = await removeWhiteBackground(uploadedSrc)
    setProcessedSrc(cleaned)
    setProcessing(false)
  } else {
    setProcessedSrc(uploadedSrc)
  }
}

  const handleCreate = () => {
    if (tab === 'draw' && hasDrawn) {
      onCreate(canvasRef.current.toDataURL('image/png'))
    } else if (tab === 'upload' && uploadedSrc) {
      onCreate(processedSrc || uploadedSrc)
    }
  }

  const canSubmit = (tab === 'draw' && hasDrawn) || (tab === 'upload' && (processedSrc || uploadedSrc))

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-lg p-6 flex flex-col gap-5"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Create Signature</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-red-400 transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 bg-gray-100 dark:bg-gray-800 p-1 rounded-full">
          {[
            { id: 'draw', label: 'Draw' },
            { id: 'upload', label: 'Upload' }
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-1 py-2 rounded-full text-sm font-semibold transition-all
                ${tab === t.id
                  ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-gray-400'
                }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Draw tab */}
        {tab === 'draw' && (
          <div className="flex flex-col gap-2">
            <canvas
              ref={canvasRef}
              width={460}
              height={180}
              className="w-full border border-gray-200 dark:border-gray-700 rounded-xl bg-white touch-none"
              style={{ touchAction: 'none' }}
              onMouseDown={handleDrawStart}
              onMouseMove={handleDrawMove}
              onMouseUp={handleDrawEnd}
              onMouseLeave={handleDrawEnd}
            />
            <button
              onClick={clearDrawCanvas}
              className="self-end text-xs text-gray-400 hover:text-red-400 transition-colors"
            >
              Clear
            </button>
          </div>
        )}

        {/* Upload tab */}
        {tab === 'upload' && (
          <div className="flex flex-col items-center gap-3 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl p-8">
            <p className="text-xs text-gray-400 dark:text-gray-500 text-center -mt-2 mb-1">
              For best results, sign on a clean white sheet of paper, take a clear photo or scan, and upload it here.
            </p>
            {uploadedSrc ? (
              <div
                className="rounded-lg overflow-hidden"
                style={{
                  backgroundColor: '#ffffff',
                  backgroundImage: 'linear-gradient(45deg, #d1d5db 25%, transparent 25%), linear-gradient(-45deg, #d1d5db 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #d1d5db 75%), linear-gradient(-45deg, transparent 75%, #d1d5db 75%)',
                  backgroundSize: '16px 16px',
                  backgroundPosition: '0 0, 0 8px, 8px -8px, -8px 0px'
                }}
              >
                {processing ? (
                  <div className="w-48 h-32 flex items-center justify-center">
                    <div className="w-6 h-6 rounded-full border-2 border-indigo-200 border-t-indigo-500 animate-spin"/>
                  </div>
                ) : (
                  <img src={processedSrc || uploadedSrc} alt="signature" className="max-h-32 object-contain" />
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-400">No signature image selected</p>
            )}

            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleUploadFile} className="hidden" />

            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 text-sm font-semibold text-white px-5 py-2.5 rounded-full hover:scale-105 transition-all"
              style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="17 8 12 3 7 8"/>
                <line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
              Upload Image
            </button>

            <label className="flex items-center gap-2 cursor-pointer mt-1">
              <input
                type="checkbox"
                checked={removeBg}
                onChange={(e) => handleToggleRemoveBg(e.target.checked)}
                className="w-4 h-4 accent-indigo-500"
              />
              <span className="text-xs text-gray-500 dark:text-gray-400">Remove white background</span>
            </label>
          </div>
        )}
        {/* Actions */}
        <div className="flex gap-3 justify-end">
          <button onClick={onClose} className="px-5 py-2.5 rounded-full text-sm font-semibold text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all">
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={!canSubmit}
            className="px-6 py-2.5 rounded-full text-sm font-semibold text-white transition-all disabled:opacity-40"
            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  )
}

function removeWhiteBackground(imageSrc, threshold = 235) {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0)

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const data = imageData.data

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i]
        const g = data[i + 1]
        const b = data[i + 2]
        // If pixel is close to white, make it transparent
        if (r > threshold && g > threshold && b > threshold) {
          data[i + 3] = 0
        }
      }

      ctx.putImageData(imageData, 0, 0)
      resolve(canvas.toDataURL('image/png'))
    }
    img.src = imageSrc
  })
}

function ShapeOptionsBar({ shapeType, setShapeType, shapeColor, setShapeColor }) {
  const shapes = [
    { id: 'rectangle', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="5" width="18" height="14" rx="1"/></svg> },
    { id: 'circle', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9"/></svg> },
    { id: 'line', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="4" y1="20" x2="20" y2="4"/></svg> },
    { id: 'arrow', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="19" x2="19" y2="5"/><polyline points="9 5 19 5 19 15"/></svg> },
    { id: 'checkmark', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg> },
    { id: 'cross', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg> },
  ]

  return (
    <div className="flex items-center justify-center gap-3 mb-4 -mt-2 flex-wrap">
      <div className="flex items-center gap-1.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-full px-3 py-2 shadow-sm flex-wrap justify-center">
        {shapes.map(s => (
          <button
            key={s.id}
            onClick={() => setShapeType(s.id)}
            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${shapeType === s.id ? 'bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400' : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
          >
            {s.icon}
          </button>
        ))}

        <div className="w-px h-5 bg-gray-200 dark:bg-gray-700 mx-1" />

        <input
          type="color"
          value={shapeColor}
          onChange={(e) => setShapeColor(e.target.value)}
          className="w-7 h-7 rounded-md cursor-pointer border-none outline-none"
          title="Pick a color"
        />
      </div>
    </div>
  )
}

function ShapeBox({ element, isSelected, onUpdate, onDelete, onSelect }) {
  const [dragging, setDragging] = useState(false)
  const [resizing, setResizing] = useState(false)
  const [rotating, setRotating] = useState(false)
  const dragOffset = useRef({ x: 0, y: 0 })
  const resizeStart = useRef({ width: 0, height: 0, x: 0, y: 0 })
  const rotateStart = useRef({ angle: 0, centerX: 0, centerY: 0 })
  const boxRef = useRef(null)

  const getPoint = (e) => {
    if (e.touches && e.touches.length > 0) {
      return { x: e.touches[0].clientX, y: e.touches[0].clientY }
    }
    return { x: e.clientX, y: e.clientY }
  }

  const handleDragStart = (e) => {
    e.stopPropagation()
    onSelect(element.id)
    setDragging(true)
    const point = getPoint(e)
    dragOffset.current = { x: point.x - element.x, y: point.y - element.y }
  }

  const handleResizeStart = (e) => {
    e.stopPropagation()
    setResizing(true)
    const point = getPoint(e)
    resizeStart.current = { width: element.width, height: element.height, x: point.x, y: point.y }
  }

  const handleRotateStart = (e) => {
    e.stopPropagation()
    setRotating(true)
    const rect = boxRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const point = getPoint(e)
    const startAngle = Math.atan2(point.y - centerY, point.x - centerX) * (180 / Math.PI)
    rotateStart.current = { angle: startAngle - element.rotation, centerX, centerY }
  }

  useEffect(() => {
    if (!dragging && !resizing && !rotating) return

    const handleMove = (e) => {
      const point = getPoint(e)
      if (dragging) {
        onUpdate(element.id, {
          x: point.x - dragOffset.current.x,
          y: point.y - dragOffset.current.y
        })
      } else if (resizing) {
        const deltaX = point.x - resizeStart.current.x
        const deltaY = point.y - resizeStart.current.y
        onUpdate(element.id, {
          width: Math.max(20, resizeStart.current.width + deltaX),
          height: Math.max(20, resizeStart.current.height + deltaY)
        })
      } else if (rotating) {
        const { centerX, centerY, angle: angleOffset } = rotateStart.current
        const currentAngle = Math.atan2(point.y - centerY, point.x - centerX) * (180 / Math.PI)
        onUpdate(element.id, { rotation: currentAngle - angleOffset })
      }
    }
    const handleEnd = () => {
      setDragging(false)
      setResizing(false)
      setRotating(false)
    }

    window.addEventListener('mousemove', handleMove)
    window.addEventListener('mouseup', handleEnd)
    window.addEventListener('touchmove', handleMove, { passive: false })
    window.addEventListener('touchend', handleEnd)

    return () => {
      window.removeEventListener('mousemove', handleMove)
      window.removeEventListener('mouseup', handleEnd)
      window.removeEventListener('touchmove', handleMove)
      window.removeEventListener('touchend', handleEnd)
    }
  }, [dragging, resizing, rotating, element.id, onUpdate])

  const renderShape = () => {
    const { type, width, height, color, strokeWidth, flipY } = element
    const props = { stroke: color, strokeWidth, fill: 'none', strokeLinecap: 'round', strokeLinejoin: 'round' }

    if (type === 'rectangle') return <rect x={strokeWidth} y={strokeWidth} width={width - strokeWidth * 2} height={height - strokeWidth * 2} {...props} />
    if (type === 'circle') return <ellipse cx={width / 2} cy={height / 2} rx={width / 2 - strokeWidth} ry={height / 2 - strokeWidth} {...props} />

    if (type === 'line' || type === 'arrow') {
      const midY = height / 2
      const x1 = strokeWidth
      const x2 = width - strokeWidth

      if (type === 'line') {
        return <line x1={x1} y1={midY} x2={x2} y2={midY} {...props} />
      }

      const headSize = Math.min(width * 0.15, 14)
      return (
        <g {...props}>
          <line x1={x1} y1={midY} x2={x2} y2={midY} />
          <polyline points={`${x2 - headSize},${midY - headSize * 0.6} ${x2},${midY} ${x2 - headSize},${midY + headSize * 0.6}`} />
        </g>
      )
    }

    if (type === 'checkmark') return <polyline points={`${width * 0.1},${height * 0.5} ${width * 0.4},${height * 0.85} ${width * 0.9},${height * 0.15}`} {...props} strokeWidth={strokeWidth * 1.3} />
    if (type === 'cross') return (
      <g {...props}>
        <line x1={strokeWidth} y1={strokeWidth} x2={width - strokeWidth} y2={height - strokeWidth} />
        <line x1={width - strokeWidth} y1={strokeWidth} x2={strokeWidth} y2={height - strokeWidth} />
      </g>
    )
    return null
  }

  return (
    <div
      ref={boxRef}
      style={{
        position: 'absolute',
        left: element.x,
        top: element.y,
        width: element.width,
        height: element.height,
        cursor: dragging ? 'grabbing' : 'grab',
        transform: `rotate(${element.rotation || 0}deg)`,
        transformOrigin: 'center center'
      }}
      onMouseDown={handleDragStart}
      onTouchStart={handleDragStart}
      onClick={(e) => e.stopPropagation()}
      className={`group border-2 ${isSelected ? 'border-indigo-400 border-dashed' : 'border-transparent hover:border-indigo-200 hover:border-dashed'}`}
    >
      <svg width="100%" height="100%" viewBox={`0 0 ${element.width} ${element.height}`} className="overflow-visible">
        {renderShape()}
      </svg>

      <button
        onClick={(e) => { e.stopPropagation(); onDelete(element.id) }}
        className={`absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-400 text-white text-xs flex items-center justify-center transition-opacity
          ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
      >
        ×
      </button>

      {isSelected && (
        <>
          <div
            onMouseDown={handleResizeStart}
            onTouchStart={handleResizeStart}
            className="absolute -bottom-1.5 -right-1.5 w-4 h-4 rounded-full bg-indigo-500 border-2 border-white cursor-se-resize"
          />
          {/* Rotate handle - floats above the box */}
          <div
            onMouseDown={handleRotateStart}
            onTouchStart={handleRotateStart}
            className="absolute -top-7 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-green-500 border-2 border-white cursor-grab flex items-center justify-center"
            title="Drag to rotate"
          >
            <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round">
              <path d="M21 12a9 9 0 11-3-6.7"/>
              <polyline points="21 3 21 9 15 9"/>
            </svg>
          </div>
          {/* Connector line from box to rotate handle */}
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-px h-3.5 bg-green-400" />
        </>
      )}
    </div>
  )
}

// Separate component so we can attach touchmove with { passive: false } via useEffect
// This prevents the "Unable to preventDefault inside passive event listener" console error
function ShapeCaptureSVG({ activeTool, shapeColor, drawingShape, onShapeStart, onShapeMove, onShapeEnd }) {
  const svgRef = useRef(null)

  useEffect(() => {
    const el = svgRef.current
    if (!el) return
    const handleTouchMove = (e) => {
      if (activeTool === 'shape') {
        e.preventDefault()
        onShapeMove(e)
      }
    }
    el.addEventListener('touchmove', handleTouchMove, { passive: false })
    return () => el.removeEventListener('touchmove', handleTouchMove)
  }, [activeTool, onShapeMove])

  return (
    <svg
      ref={svgRef}
      className="absolute inset-0 w-full h-full"
      style={{
        pointerEvents: activeTool === 'shape' ? 'auto' : 'none',
        touchAction: activeTool === 'shape' ? 'none' : 'auto',
        zIndex: 26
      }}
      onMouseDown={onShapeStart}
      onMouseMove={onShapeMove}
      onMouseUp={onShapeEnd}
      onMouseLeave={onShapeEnd}
      onTouchStart={onShapeStart}
      onTouchEnd={onShapeEnd}
    >
      {drawingShape && (
        <rect
          x={drawingShape.x}
          y={drawingShape.y}
          width={drawingShape.width}
          height={drawingShape.height}
          stroke={shapeColor}
          strokeWidth={2}
          strokeDasharray="4"
          fill="none"
        />
      )}
    </svg>
  )
}

export default function EditPDF() {
  const [file, setFile] = useState(null)
  const [pdfDoc, setPdfDoc] = useState(null)
  const [numPages, setNumPages] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [activeTool, setActiveTool] = useState('select') // 'select' | 'text' | 'image' | 'draw' | 'shape'
  const [textElements, setTextElements] = useState({}) // { pageNum: [{ id, x, y, text, fontSize, color }] }
  const [imageElements, setImageElements] = useState({}) // { pageNum: [{ id, x, y, width, height, src }] }
  const [selectedImageId, setSelectedImageId] = useState(null)
  const [signatureElements, setSignatureElements] = useState({}) // { pageNum: [{ id, x, y, width, height, src }] }
  const [selectedSignatureId, setSelectedSignatureId] = useState(null)
  const [shapeElements, setShapeElements] = useState({}) // { pageNum: [{ id, type, x, y, width, height, color, strokeWidth }] }
  const [selectedShapeId, setSelectedShapeId] = useState(null)
  const [shapeType, setShapeType] = useState('rectangle') // 'rectangle' | 'circle'
  const [shapeColor, setShapeColor] = useState('#6366f1')
  const [drawingShape, setDrawingShape] = useState(null) // shape being drawn live
  const [deletedPages, setDeletedPages] = useState([])
  const [showSignaturePanel, setShowSignaturePanel] = useState(false)
  const [pendingSignatureSrc, setPendingSignatureSrc] = useState(null)
  const [editingTextId, setEditingTextId] = useState(null)
  const [selectedTextId, setSelectedTextId] = useState(null)
  const [showWatermarkPanel, setShowWatermarkPanel] = useState(false)
  const [watermarkPages, setWatermarkPages] = useState([]) // array of page numbers with watermark applied

  const [watermark, setWatermark] = useState({
    text: 'CONFIDENTIAL',
    color: '#6366f1',
    opacity: 0.25,
    fontSize: 48,
    rotation: -45,
    applyToAll: true
  })

  const canvasRef = useRef(null)

  const handleCanvasClick = (e) => {
    if (e.target.closest('.text-style-bar')) return

    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    if (activeTool === 'text') {
      const newId = `text-${Date.now()}`
      const newText = { id: newId, x, y, text: '', fontSize: 16, color: '#1f2937', fontFamily: '"Inter", sans-serif', bold: false, italic: false, underline: false }
      setTextElements(prev => ({
        ...prev,
        [currentPage]: [...(prev[currentPage] || []), newText]
      }))
      setEditingTextId(newId)
      setActiveTool('select')
      return
    }

    if (activeTool === 'image' && pendingImageSrc) {
      const newId = `image-${Date.now()}`
      const newImage = { id: newId, x, y, width: 150, height: 150, src: pendingImageSrc }
      setImageElements(prev => ({
        ...prev,
        [currentPage]: [...(prev[currentPage] || []), newImage]
      }))
      setPendingImageSrc(null)
      setActiveTool('select')
      return
    }

    if (activeTool === 'signature' && pendingSignatureSrc) {
      const newId = `signature-${Date.now()}`
      const newSignature = { id: newId, x, y, width: 180, height: 70, src: pendingSignatureSrc }
      setSignatureElements(prev => ({
        ...prev,
        [currentPage]: [...(prev[currentPage] || []), newSignature]
      }))
      setPendingSignatureSrc(null)
      setActiveTool('select')
      return
    }

    setSelectedTextId(null)
    setSelectedImageId(null)
    setSelectedSignatureId(null)
    setSelectedShapeId(null)
  }

  const updateTextElement = (id, updates) => {
    setTextElements(prev => ({
      ...prev,
      [currentPage]: prev[currentPage].map(el =>
        el.id === id ? { ...el, ...updates } : el
      )
    }))
  }

  const deleteTextElement = (id) => {
    setTextElements(prev => ({
      ...prev,
      [currentPage]: prev[currentPage].filter(el => el.id !== id)
    }))
  }

  const updateImageElement = (id, updates) => {
    setImageElements(prev => ({
      ...prev,
      [currentPage]: prev[currentPage].map(el =>
        el.id === id ? { ...el, ...updates } : el
      )
    }))
  }

  const deleteImageElement = (id) => {
    setImageElements(prev => ({
      ...prev,
      [currentPage]: prev[currentPage].filter(el => el.id !== id)
    }))
  }

  const onDrop = useCallback(async (acceptedFiles) => {
    if (acceptedFiles.length === 0) return
    const selectedFile = acceptedFiles[0]
    setFile(selectedFile)
    setLoading(true)

    const arrayBuffer = await selectedFile.arrayBuffer()
    const loadedPdf = await pdfjsLib.getDocument({
      data: arrayBuffer,
      wasmUrl: '/pdf-wasm/',
    }).promise

    setPdfDoc(loadedPdf)
    setNumPages(loadedPdf.numPages)
    setCurrentPage(1)
    setLoading(false)
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1
  })

  const handleApplyWatermark = () => {
    setShowWatermarkPanel(false)
    if (watermark.applyToAll) {
      setWatermarkPages(Array.from({ length: numPages }, (_, i) => i + 1))
    } else {
      setWatermarkPages(prev => prev.includes(currentPage) ? prev : [...prev, currentPage])
    }
  }

  const handleRemoveWatermark = () => {
    if (watermark.applyToAll) {
      setWatermarkPages([])
    } else {
      setWatermarkPages(prev => prev.filter(p => p !== currentPage))
    }
  }

  const imageInputRef = useRef(null)
  const [pendingImageSrc, setPendingImageSrc] = useState(null)

  const handleImageToolClick = () => {
    imageInputRef.current?.click()
  }

  const handleImageFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      setPendingImageSrc(event.target.result)
      setActiveTool('image')
    }
    reader.readAsDataURL(file)
    e.target.value = '' // reset so same file can be picked again later
  }

  const handleSignatureToolClick = () => {
    setShowSignaturePanel(true)
  }

  const handleSignatureCreate = (src) => {
    setPendingSignatureSrc(src)
    setShowSignaturePanel(false)
    setActiveTool('signature')
  }

  const updateSignatureElement = (id, updates) => {
    setSignatureElements(prev => ({
      ...prev,
      [currentPage]: prev[currentPage].map(el =>
        el.id === id ? { ...el, ...updates } : el
      )
    }))
  }

  const deleteSignatureElement = (id) => {
    setSignatureElements(prev => ({
      ...prev,
      [currentPage]: prev[currentPage].filter(el => el.id !== id)
    }))
  }

  const handleExportPDF = async () => {
    const { PDFDocument, rgb, degrees } = await import('pdf-lib')

    const arrayBuffer = await file.arrayBuffer()
    const pdfLibDoc = await PDFDocument.load(arrayBuffer)
    const pages = pdfLibDoc.getPages()

    // Helper to convert hex color to pdf-lib rgb()
    const hexToRgb = (hex) => {
      const r = parseInt(hex.slice(1, 3), 16) / 255
      const g = parseInt(hex.slice(3, 5), 16) / 255
      const b = parseInt(hex.slice(5, 7), 16) / 255
      return rgb(r, g, b)
    }

    // Remove deleted pages first, from highest index to lowest to avoid index shifting issues
    const sortedDeleted = [...deletedPages].sort((a, b) => b - a)
    for (const pageNum of sortedDeleted) {
      pdfLibDoc.removePage(pageNum - 1)
    }

    const remainingPages = pdfLibDoc.getPages()

    for (let i = 0; i < remainingPages.length; i++) {
      // Map back to original page number since some pages were removed
      const originalPageNumbers = Array.from({ length: numPages }, (_, idx) => idx + 1)
        .filter(p => !deletedPages.includes(p))
      const pageNum = originalPageNumbers[i]
      const pdfPage = remainingPages[i]
      const { width: pdfWidth, height: pdfHeight } = pdfPage.getSize()

      // Get the PDF.js page to know the zoomed render size we used on screen
      const jsPage = await pdfDoc.getPage(pageNum)
      const baseViewport = jsPage.getViewport({ scale: 1 })
      const renderedScale = (canvasWrapperRef.current && window.innerWidth < 768)
        ? (canvasWrapperRef.current.clientWidth - 16) / baseViewport.width
        : 1.5

      // Convert a screen pixel coordinate (top-left origin) to PDF point coordinate (bottom-left origin)
      const toPdfX = (x) => x / renderedScale
      const toPdfY = (y) => pdfHeight - (y / renderedScale)

      // Draw text elements
      const pageTexts = textElements[pageNum] || []
      for (const t of pageTexts) {
        if (!t.text) continue
        const font = await pdfLibDoc.embedFont('Helvetica')
        pdfPage.drawText(t.text, {
          x: toPdfX(t.x),
          y: toPdfY(t.y) - (t.fontSize / renderedScale), // shift down since drawText anchors at baseline
          size: t.fontSize / renderedScale,
          font,
          color: hexToRgb(t.color)
        })
      }

      // Draw image elements
      const pageImages = imageElements[pageNum] || []
      for (const img of pageImages) {
        const imgBytes = await fetch(img.src).then(r => r.arrayBuffer())
        const isPng = img.src.startsWith('data:image/png')
        const embeddedImg = isPng
          ? await pdfLibDoc.embedPng(imgBytes)
          : await pdfLibDoc.embedJpg(imgBytes)

        const w = img.width / renderedScale
        const h = img.height / renderedScale
        pdfPage.drawImage(embeddedImg, {
          x: toPdfX(img.x),
          y: toPdfY(img.y) - h,
          width: w,
          height: h
        })
      }

      // Draw signature elements (same as images, just a different data source)
      const pageSignatures = signatureElements[pageNum] || []
      for (const sig of pageSignatures) {
        const sigBytes = await fetch(sig.src).then(r => r.arrayBuffer())
        const embeddedSig = await pdfLibDoc.embedPng(sigBytes)

        const w = sig.width / renderedScale
        const h = sig.height / renderedScale
        pdfPage.drawImage(embeddedSig, {
          x: toPdfX(sig.x),
          y: toPdfY(sig.y) - h,
          width: w,
          height: h
        })
      }

      // Draw watermark
      if (watermarkPages.includes(pageNum)) {
        const font = await pdfLibDoc.embedFont('Helvetica-Bold')
        const textWidth = font.widthOfTextAtSize(watermark.text, watermark.fontSize)
        pdfPage.drawText(watermark.text, {
          x: pdfWidth / 2 - textWidth / 2,
          y: pdfHeight / 2,
          size: watermark.fontSize,
          font,
          color: hexToRgb(watermark.color),
          opacity: watermark.opacity,
          rotate: degrees(watermark.rotation)
        })
      }

      // Draw shapes
      const pageShapes = shapeElements[pageNum] || []
      for (const shape of pageShapes) {
        const w = shape.width / renderedScale
        const h = shape.height / renderedScale
        const x = toPdfX(shape.x)
        const yTop = toPdfY(shape.y) // top edge in PDF space
        const borderColor = hexToRgb(shape.color)
        const borderWidth = shape.strokeWidth / renderedScale

        if (shape.type === 'rectangle') {
          pdfPage.drawRectangle({
            x, y: yTop - h, width: w, height: h, borderColor, borderWidth,
            rotate: degrees(shape.rotation || 0)
          })
        } else if (shape.type === 'circle') {
          pdfPage.drawEllipse({
            x: x + w / 2, y: yTop - h / 2, xScale: w / 2, yScale: h / 2, borderColor, borderWidth,
            rotate: degrees(shape.rotation || 0)
          })
        }
         else if (shape.type === 'line') {
          pdfPage.drawLine({
            start: { x, y: yTop - h },
            end: { x: x + w, y: yTop },
            color: borderColor,
            thickness: borderWidth
          })
        } else if (shape.type === 'arrow') {
          pdfPage.drawLine({ start: { x, y: yTop - h }, end: { x: x + w, y: yTop }, color: borderColor, thickness: borderWidth })
          pdfPage.drawLine({ start: { x: x + w * 0.55, y: yTop }, end: { x: x + w, y: yTop }, color: borderColor, thickness: borderWidth })
          pdfPage.drawLine({ start: { x: x + w, y: yTop }, end: { x: x + w, y: yTop - h * 0.45 }, color: borderColor, thickness: borderWidth })
        } else if (shape.type === 'checkmark') {
          pdfPage.drawLine({ start: { x: x + w * 0.1, y: yTop - h * 0.5 }, end: { x: x + w * 0.4, y: yTop - h * 0.85 }, color: borderColor, thickness: borderWidth * 1.3 })
          pdfPage.drawLine({ start: { x: x + w * 0.4, y: yTop - h * 0.85 }, end: { x: x + w * 0.9, y: yTop - h * 0.15 }, color: borderColor, thickness: borderWidth * 1.3 })
        } else if (shape.type === 'cross') {
          pdfPage.drawLine({ start: { x, y: yTop }, end: { x: x + w, y: yTop - h }, color: borderColor, thickness: borderWidth })
          pdfPage.drawLine({ start: { x: x + w, y: yTop }, end: { x, y: yTop - h }, color: borderColor, thickness: borderWidth })
        }
      }
    }

    const pdfBytes = await pdfLibDoc.save()
    const blob = new Blob([pdfBytes], { type: 'application/pdf' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `edited_${file.name}`
    a.click()
    URL.revokeObjectURL(url)
  }

  const getShapePoint = (e, container) => {
    const rect = container.getBoundingClientRect()
    const point = e.touches && e.touches.length > 0
      ? { x: e.touches[0].clientX, y: e.touches[0].clientY }
      : { x: e.clientX, y: e.clientY }
    return { x: point.x - rect.left, y: point.y - rect.top }
  }

  const handleShapeStart = (e) => {
    if (activeTool !== 'shape') return
    e.preventDefault()
    const point = getShapePoint(e, e.currentTarget)
    setDrawingShape({ startX: point.x, startY: point.y, x: point.x, y: point.y, width: 0, height: 0 })
  }

  const handleShapeMove = (e) => {
    if (activeTool !== 'shape' || !drawingShape) return
    e.preventDefault()
    const point = getShapePoint(e, e.currentTarget)
    const x = Math.min(point.x, drawingShape.startX)
    const y = Math.min(point.y, drawingShape.startY)
    const width = Math.abs(point.x - drawingShape.startX)
    const height = Math.abs(point.y - drawingShape.startY)
    setDrawingShape(prev => ({ ...prev, x, y, width, height, endX: point.x, endY: point.y }))
  }

  const handleShapeEnd = () => {
    if (!drawingShape) {
      setDrawingShape(null)
      return
    }

    const isLineType = shapeType === 'line' || shapeType === 'arrow'
    const minSize = isLineType ? 8 : 5

    if (drawingShape.width < minSize && drawingShape.height < minSize) {
      setDrawingShape(null)
      return
    }

    const newId = `shape-${Date.now()}`
    let newShape

    if (isLineType) {
      // Preserve actual drag direction instead of forcing a diagonal
      newShape = {
        id: newId,
        type: shapeType,
        x: drawingShape.x,
        y: drawingShape.y,
        width: drawingShape.width,
        height: drawingShape.height,
        color: shapeColor,
        strokeWidth: 3,
        rotation: 0,
        flipY: drawingShape.endY < drawingShape.startY // dragged upward?
      }
    } else {
      newShape = {
        id: newId,
        type: shapeType,
        x: drawingShape.x,
        y: drawingShape.y,
        width: drawingShape.width,
        height: drawingShape.height,
        color: shapeColor,
        strokeWidth: 3,
        rotation: 0
      }
    }

    setShapeElements(prev => ({
      ...prev,
      [currentPage]: [...(prev[currentPage] || []), newShape]
    }))
    setDrawingShape(null)
    setActiveTool('select')
  }

  const deleteShapeElement = (id) => {
    setShapeElements(prev => ({
      ...prev,
      [currentPage]: prev[currentPage].filter(el => el.id !== id)
    }))
  }

  const handleDeletePage = (pageNum) => {
    if (numPages <= 1) return // don't allow deleting the last page

    setDeletedPages(prev => [...prev, pageNum])

    // If currently viewing the deleted page, jump to nearest remaining page
    if (currentPage === pageNum) {
      const remaining = Array.from({ length: numPages }, (_, i) => i + 1)
        .filter(p => !deletedPages.includes(p) && p !== pageNum)
      if (remaining.length > 0) {
        setCurrentPage(remaining[0])
      }
    }
  }

  // Render the current page onto canvas whenever pdfDoc or currentPage changes
  const canvasWrapperRef = useRef(null)

  useEffect(() => {
    if (!pdfDoc) return

    const renderPage = async () => {
      const page = await pdfDoc.getPage(currentPage)

      const isMobile = window.innerWidth < 768
      let scale = 1.5

      if (isMobile && canvasWrapperRef.current) {
        const baseViewport = page.getViewport({ scale: 1 })
        const containerWidth = canvasWrapperRef.current.clientWidth - 16
        scale = containerWidth / baseViewport.width
      }

      const viewport = page.getViewport({ scale })
      const dpr = window.devicePixelRatio || 1

      const canvas = canvasRef.current
      const context = canvas.getContext('2d', { alpha: false })

      // Set the canvas backing-store size to physical pixels
      canvas.width = Math.floor(viewport.width * dpr)
      canvas.height = Math.floor(viewport.height * dpr)

      // Set the CSS display size to logical pixels so layout is correct
      canvas.style.width = `${viewport.width}px`
      canvas.style.height = `${viewport.height}px`

      // Scale context so pdfjs renders at full device resolution
      context.setTransform(dpr, 0, 0, dpr, 0, 0)

      // Paint white background so transparent PDFs don't render on a black canvas
      context.fillStyle = '#ffffff'
      context.fillRect(0, 0, viewport.width, viewport.height)

      await page.render({ canvasContext: context, viewport }).promise
    }

    renderPage()
  }, [pdfDoc, currentPage])

  useEffect(() => {
    const handleResize = () => {
      if (pdfDoc) {
        // Trigger re-render by toggling currentPage state minimally
        setCurrentPage(p => p)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [pdfDoc])

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 pt-28 pb-16 px-3 sm:px-6">
      <div className="max-w-5xl mx-auto">

        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-3">
            Edit PDF
          </h1>
          <p className="text-gray-400 dark:text-gray-500">
            Add text, images, drawings and shapes directly to your PDF.
          </p>
        </div>

        {!file && (
          <div className="max-w-2xl mx-auto">
            <UploadZone
              isDragActive={isDragActive}
              getRootProps={getRootProps}
              getInputProps={getInputProps}
            />
          </div>
        )}

        {file && loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 rounded-full border-4 border-indigo-200 dark:border-indigo-800 border-t-indigo-500 animate-spin mb-4" />
            <p className="text-gray-600 dark:text-gray-400 font-medium">Loading PDF...</p>
          </div>
        )}

        {file && !loading && pdfDoc && (
          <>
            <Toolbar
              activeTool={activeTool}
              setActiveTool={setActiveTool}
              onWatermarkClick={() => setShowWatermarkPanel(true)}
              watermarkApplied={watermarkPages.includes(currentPage)}
              onRemoveWatermark={handleRemoveWatermark}
              onImageToolClick={handleImageToolClick}
              onSignatureToolClick={handleSignatureToolClick}
            />

            {showSignaturePanel && (
              <SignaturePanel
                onCreate={handleSignatureCreate}
                onClose={() => setShowSignaturePanel(false)}
              />
            )}
            <div className="flex justify-center mb-6 -mt-2">
              <button
                onClick={handleExportPDF}
                className="flex items-center gap-2 text-white font-semibold px-8 py-3 rounded-full text-sm hover:scale-105 transition-all"
                style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                Download Edited PDF
              </button>
            </div>
            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageFileChange}
              className="hidden"
            />

            {activeTool === 'signature' && pendingSignatureSrc && (
              <div className="flex items-center justify-center gap-2 mb-4 -mt-2">
                <div className="flex items-center gap-2 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 text-sm font-medium px-4 py-2 rounded-full">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="16" x2="12" y2="12"/>
                    <line x1="12" y1="8" x2="12.01" y2="8"/>
                  </svg>
                  Click anywhere on the PDF to place your signature
                </div>
              </div>
            )}

            {activeTool === 'shape' && (
              <>
                <ShapeOptionsBar
                  shapeType={shapeType}
                  setShapeType={setShapeType}
                  shapeColor={shapeColor}
                  setShapeColor={setShapeColor}
                />
                <div className="flex items-center justify-center gap-2 mb-4 -mt-2">
                  <div className="flex items-center gap-2 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 text-sm font-medium px-4 py-2 rounded-full">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"/>
                      <line x1="12" y1="16" x2="12" y2="12"/>
                      <line x1="12" y1="8" x2="12.01" y2="8"/>
                    </svg>
                    Click and drag anywhere on the PDF to draw your shape
                  </div>
                </div>
              </>
            )}

            {activeTool === 'text' && (
              <div className="flex items-center justify-center gap-2 mb-4 -mt-2">
                <div className="flex items-center gap-2 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 text-sm font-medium px-4 py-2 rounded-full">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="16" x2="12" y2="12"/>
                    <line x1="12" y1="8" x2="12.01" y2="8"/>
                  </svg>
                  Click anywhere on the PDF to add a text box
                </div>
              </div>
            )}
            {showWatermarkPanel && (
              <WatermarkPanel
                watermark={watermark}
                setWatermark={setWatermark}
                onApply={handleApplyWatermark}
                onClose={() => setShowWatermarkPanel(false)}
              />
            )}

            <div className="flex gap-6 relative">
              {/* Sidebar - page navigation, hidden on mobile */}
              <div className="hidden md:block w-20 flex-shrink-0">
                <div className="flex flex-col gap-2">
                  {Array.from({ length: numPages }, (_, i) => i + 1)
                    .filter(pageNum => !deletedPages.includes(pageNum))
                    .map(pageNum => (
                      <div key={pageNum} className="relative group">
                        <button
                          onClick={() => setCurrentPage(pageNum)}
                          className={`w-16 h-20 rounded-lg border-2 text-xs font-semibold transition-all
                            ${currentPage === pageNum
                              ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400'
                              : 'border-gray-200 dark:border-gray-800 text-gray-400 hover:border-indigo-300'
                            }`}
                        >
                          {pageNum}
                        </button>
                        {numPages - deletedPages.length > 1 && (
                          <button
                            onClick={(e) => { e.stopPropagation(); handleDeletePage(pageNum) }}
                            className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-400 text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            ×
                          </button>
                        )}
                      </div>
                    ))}
                </div>
              </div>

              {/* Main canvas area */}
              <div ref={canvasWrapperRef} className="flex-1 w-full overflow-x-hidden pb-4">
                <div
                  className="relative block w-full border border-gray-200 dark:border-gray-800 rounded-lg shadow-sm"
                  style={{ cursor: activeTool === 'text' ? 'text' : 'default' }}
                  onClick={handleCanvasClick}
                >
                  <canvas ref={canvasRef} className="block max-w-full" />

                  {/* Shape drawing capture layer - only active while drawing a new shape */}
                  <ShapeCaptureSVG
                    activeTool={activeTool}
                    shapeColor={shapeColor}
                    drawingShape={drawingShape}
                    onShapeStart={handleShapeStart}
                    onShapeMove={handleShapeMove}
                    onShapeEnd={handleShapeEnd}
                  />

                  {/* Placed shapes - draggable, resizable, deletable */}
                  {(shapeElements[currentPage] || []).map(shape => (
                    <ShapeBox
                      key={shape.id}
                      element={shape}
                      isSelected={selectedShapeId === shape.id}
                      onUpdate={(id, updates) => {
                        setShapeElements(prev => ({
                          ...prev,
                          [currentPage]: prev[currentPage].map(el => el.id === id ? { ...el, ...updates } : el)
                        }))
                      }}
                      onDelete={deleteShapeElement}
                      onSelect={setSelectedShapeId}
                    />
                  ))}

                  {/* Watermark preview */}
                  {watermarkPages.includes(currentPage) && (
                    <div
                      className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
                      style={{ zIndex: 30 }}
                    >
                      <span
                        style={{
                          color: watermark.color,
                          opacity: watermark.opacity,
                          fontSize: watermark.fontSize,
                          transform: `rotate(${watermark.rotation}deg)`,
                          fontWeight: 700,
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {watermark.text}
                      </span>
                    </div>
                  )}

                  {/* Text elements overlay */}
                  {(textElements[currentPage] || []).map(el => (
                    <TextBox
                      key={el.id}
                      element={el}
                      isEditing={editingTextId === el.id}
                      isSelected={selectedTextId === el.id}
                      onUpdate={updateTextElement}
                      onDelete={deleteTextElement}
                      onStartEdit={setEditingTextId}
                      onStopEdit={() => setEditingTextId(null)}
                      onSelect={setSelectedTextId}
                    />
                  ))}

                  {/* Image elements overlay */}
                  {(imageElements[currentPage] || []).map(el => (
                    <ImageBox
                      key={el.id}
                      element={el}
                      isSelected={selectedImageId === el.id}
                      onUpdate={updateImageElement}
                      onDelete={deleteImageElement}
                      onSelect={setSelectedImageId}
                    />
                  ))} 

                  {/* Signature elements overlay - reuses ImageBox */}
                  {(signatureElements[currentPage] || []).map(el => (
                    <ImageBox
                      key={el.id}
                      element={el}
                      isSelected={selectedSignatureId === el.id}
                      onUpdate={updateSignatureElement}
                      onDelete={deleteSignatureElement}
                      onSelect={setSelectedSignatureId}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Floating page navigator - mobile only */}
            <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-3 bg-gray-900/90 dark:bg-gray-800/95 backdrop-blur-md rounded-full px-4 py-2.5 shadow-xl">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="text-white disabled:opacity-30 transition-opacity"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>
              <span className="text-white text-sm font-semibold min-w-[50px] text-center">
                {currentPage} / {numPages}
              </span>
              <button
                onClick={() => setCurrentPage(p => Math.min(numPages, p + 1))}
                disabled={currentPage === numPages}
                className="text-white disabled:opacity-30 transition-opacity"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

