import React, { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

const conversionOptions = [
  { name: 'Word', format: 'docx', icon: '📄', color: 'indigo' },
  { name: 'PowerPoint', format: 'pptx', icon: '📽️', color: 'orange' },
  { name: 'Image', format: 'jpg', icon: '🖼️', color: 'pink' }
]

function UploadZone({ onFileSelect }) {
  const onDrop = useCallback(acceptedFiles => {
    if (acceptedFiles.length > 0) onFileSelect(acceptedFiles[0])
  }, [onFileSelect])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
      'image/*': ['.jpg', '.jpeg', '.png', '.webp']
    },
    maxFiles: 1
  })

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
            {isDragActive ? 'Drop it here!' : 'Drag & drop your file here'}
          </p>
          <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
            or <span className="text-indigo-500 font-medium">browse to upload</span>
          </p>
        </div>
        <p className="text-xs text-gray-400 dark:text-gray-500">
          PDF, Word, PowerPoint, or Image supported
        </p>
      </div>
    </div>
  )
}

function FilePreview({ file, onRemove }) {
  const sizeMB = (file.size / (1024 * 1024)).toFixed(2)
  const sizeKB = (file.size / 1024).toFixed(1)
  const displaySize = file.size > 1024 * 1024 ? `${sizeMB} MB` : `${sizeKB} KB`

  const getIcon = () => {
    if (file.type.startsWith('image/')) return '🖼️'
    if (file.type.includes('pdf')) return '📄'
    if (file.type.includes('word')) return '📝'
    if (file.type.includes('presentation')) return '📽️'
    return '📎'
  }

  return (
    <div className="flex items-center gap-4 p-4 rounded-2xl border border-indigo-100 dark:border-gray-800 bg-gradient-to-br from-white to-indigo-50 dark:bg-none dark:bg-gray-900">
      <div className="w-14 h-14 rounded-xl bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center text-2xl flex-shrink-0">
        {getIcon()}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-800 dark:text-white truncate">{file.name}</p>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Size: {displaySize}</p>
      </div>
      <button
        onClick={onRemove}
        className="text-gray-300 dark:text-gray-600 hover:text-red-400 transition-colors"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  )
}

function ConversionOptions({ file, onSelect, onCancel }) {
  const isPDF = file.type.includes('pdf')

  return (
    <div className="flex flex-col gap-6">
      <FilePreview file={file} onRemove={onCancel} />

      {isPDF ? (
        <>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 font-medium">Convert PDF to:</p>
            <div className="grid grid-cols-2 gap-3">
              {conversionOptions.map(option => (
                <button
                  key={option.format}
                  onClick={() => onSelect(option)}
                  className="p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-indigo-400 dark:hover:border-indigo-600 hover:shadow-md transition-all hover:-translate-y-1 text-center group"
                >
                  <p className="text-2xl mb-2">{option.icon}</p>
                  <p className="text-sm font-semibold text-gray-800 dark:text-white">{option.name}</p>
                  <p className="text-xs text-gray-400 mt-1">.{option.format}</p>
                </button>
              ))}
            </div>
          </div>
        </>
      ) : (
        <button
          onClick={() => onSelect({ name: 'PDF', format: 'pdf' })}
          className="w-full py-3.5 rounded-full text-white font-semibold text-sm transition-all hover:scale-105"
          style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
        >
          Convert to PDF →
        </button>
      )}
    </div>
  )
}

function ConversionResult({ fromFormat, toFormat, onDownload, onConvertAnother }) {
  return (
    <div className="flex flex-col items-center gap-6 py-6">
      <div className="w-16 h-16 rounded-full bg-green-50 dark:bg-green-950 flex items-center justify-center">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
      <div className="text-center">
        <p className="text-2xl font-extrabold text-gray-900 dark:text-white">Converted!</p>
        <p className="text-gray-400 text-sm mt-2">{fromFormat.toUpperCase()} to {toFormat.toUpperCase()}</p>
      </div>
      <div className="flex gap-3">
        <button
          onClick={onDownload}
          className="text-white font-semibold px-8 py-3 rounded-full text-sm hover:scale-105 transition-all"
          style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
        >
          Download →
        </button>
        <button
          onClick={onConvertAnother}
          className="font-semibold px-8 py-3 rounded-full text-sm transition-all hover:scale-105 bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 hover:bg-indigo-200 dark:hover:bg-indigo-900"
        >
          Convert Another
        </button>
      </div>
    </div>
  )
}

export default function Convert() {
  const [file, setFile] = useState(null)
  const [selectedConversion, setSelectedConversion] = useState(null)
  const [converting, setConverting] = useState(false)
  const [result, setResult] = useState(null)

  const handleFileSelect = (f) => {
    setFile(f)
    setSelectedConversion(null)
    setResult(null)
  }

  const handleCancel = () => {
    setFile(null)
    setSelectedConversion(null)
    setResult(null)
  }

  const handleConversionSelect = async (option) => {
    setSelectedConversion(option)
    setConverting(true)

    try {
      const isPdf = file.type.includes('pdf')
      const isPdfToImage = isPdf && option.format === 'jpg'

      if (isPdfToImage) {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('format', 'png')

        const res = await fetch(`${API_BASE_URL}/api/convert/pdf-to-image`, {
          method: 'POST',
          body: formData
        })

        if (!res.ok) throw new Error('Conversion failed on server')

        const blob = await res.blob()
        const isZip = res.headers.get('content-type')?.includes('zip')

        setResult({
          fromFormat: 'pdf',
          toFormat: isZip ? 'zip' : 'png',
          url: URL.createObjectURL(blob),
          isZip
        })

      } else if (!isPdf && file.type.startsWith('image/')) {
        const formData = new FormData()
        formData.append('files', file)

        const res = await fetch(`${API_BASE_URL}/api/convert/image-to-pdf`, {
          method: 'POST',
          body: formData
        })

        if (!res.ok) throw new Error('Conversion failed on server')

        const blob = await res.blob()
        setResult({
          fromFormat: file.name.split('.').pop(),
          toFormat: 'pdf',
          url: URL.createObjectURL(blob)
        })

      } else if (isPdf && option.format === 'docx') {
        const formData = new FormData()
        formData.append('file', file)

        const res = await fetch(`${API_BASE_URL}/api/convert/pdf-to-word`, {
          method: 'POST',
          body: formData
        })

        if (!res.ok) throw new Error(await res.text())

        const blob = await res.blob()
        setResult({ fromFormat: 'pdf', toFormat: 'docx', url: URL.createObjectURL(blob) })

      } else if (isPdf && option.format === 'pptx') {
        const formData = new FormData()
        formData.append('file', file)

        const res = await fetch(`${API_BASE_URL}/api/convert/pdf-to-ppt`, {
          method: 'POST',
          body: formData
        })

        if (!res.ok) throw new Error(await res.text())

        const blob = await res.blob()
        setResult({ fromFormat: 'pdf', toFormat: 'pptx', url: URL.createObjectURL(blob) })

      } else if (!isPdf && option.format === 'pdf') {
        const formData = new FormData()
        formData.append('file', file)

        const res = await fetch(`${API_BASE_URL}/api/convert/office-to-pdf`, {
          method: 'POST',
          body: formData
        })

        if (!res.ok) throw new Error(await res.text())

        const blob = await res.blob()
        setResult({
          fromFormat: file.name.split('.').pop(),
          toFormat: 'pdf',
          url: URL.createObjectURL(blob)
        })

      } else {
        throw new Error('Unsupported conversion')
      }
    } catch (err) {
      console.error(err)
      alert('Something went wrong during conversion. Make sure the backend is running.\n\n' + err.message)
    } finally {
      setConverting(false)
    }
  }

  const handleDownload = () => {
    const a = document.createElement('a')
    a.href = result.url
    const extension = result.isZip ? 'zip' : result.toFormat
    a.download = `converted_${file.name.split('.')[0]}.${extension}`
    a.click()
  }

  const handleConvertAnother = () => {
    setFile(null)
    setSelectedConversion(null)
    setResult(null)
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 pt-28 pb-16 px-6">
      <div className="max-w-2xl mx-auto">

        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-3">
            Convert Files
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Convert between PDF, Word, PowerPoint, and images instantly.
          </p>
        </div>

        {!file && !result && (
          <UploadZone onFileSelect={handleFileSelect} />
        )}

        {file && !selectedConversion && !result && (
          <ConversionOptions
            file={file}
            onSelect={handleConversionSelect}
            onCancel={handleCancel}
          />
        )}

        {selectedConversion && converting && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-12 h-12 rounded-full border-4 border-indigo-200 dark:border-indigo-800 border-t-indigo-500 animate-spin mb-4" />
            <p className="text-gray-600 dark:text-gray-400 font-medium">Converting your file...</p>
          </div>
        )}

        {result && (
          <ConversionResult
            fromFormat={file.type.includes('pdf') ? 'pdf' : file.name.split('.').pop()}
            toFormat={result.toFormat}
            onDownload={handleDownload}
            onConvertAnother={handleConvertAnother}
          />
        )}

      </div>
    </div>
  )
}