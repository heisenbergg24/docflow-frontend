import React, { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import JSZip from 'jszip'
import { useEffect } from 'react'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

const tabs = ['Compress Image', 'Compress PDF']

const acceptedTypes = {
  'Compress Image': { 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] },
  'Compress PDF': { 'application/pdf': ['.pdf'] }
}

function UploadZone({ tab, onFileSelect }) {
  const onDrop = useCallback(acceptedFiles => {
    if (acceptedFiles.length > 0) onFileSelect(acceptedFiles)
  }, [onFileSelect])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedTypes[tab],
    multiple: true
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
          {tab === 'Compress Image' ? 'PNG, JPG, JPEG, WebP supported' : 'PDF files only'}
        </p>
      </div>
    </div>
  )
}

function FilePreview({ file, onRemove }) {
  const isImage = file.type.startsWith('image/')
  const sizeMB = (file.size / (1024 * 1024)).toFixed(2)
  const sizeKB = (file.size / 1024).toFixed(1)
  const displaySize = file.size > 1024 * 1024 ? `${sizeMB} MB` : `${sizeKB} KB`

  return (
    <div className="flex items-center gap-4 p-4 rounded-2xl border border-indigo-100 dark:border-gray-800 bg-gradient-to-br from-white to-indigo-50 dark:bg-none dark:bg-gray-900">
      <div className="w-14 h-14 rounded-xl bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center overflow-hidden flex-shrink-0">
        {isImage
          ? <img src={URL.createObjectURL(file)} alt="preview" className="w-full h-full object-cover rounded-xl" />
          : <svg width="28" height="28" viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <defs><linearGradient id="fp" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#6366f1" /><stop offset="100%" stopColor="#8b5cf6" /></linearGradient></defs>
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="url(#fp)" />
            <polyline points="14 2 14 8 20 8" stroke="url(#fp)" />
          </svg>
        }
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-800 dark:text-white truncate">{file.name}</p>
        <p className="text-xs text-gray-400 mt-0.5">Original size: {displaySize}</p>
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

function CompressResult({ originalSize, compressedSize, isMultiple, fileCount, perFile, onDownload, onReset }) {
  const saved = (((originalSize - compressedSize) / originalSize) * 100).toFixed(1)
  const formatSize = (bytes) => bytes > 1024 * 1024
    ? `${(bytes / (1024 * 1024)).toFixed(2)} MB`
    : `${(bytes / 1024).toFixed(1)} KB`

  return (
    <div className="flex flex-col items-center gap-6 py-6">
      <div className="w-16 h-16 rounded-full bg-green-50 dark:bg-green-950 flex items-center justify-center">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
      <div className="text-center">
        <p className="text-2xl font-extrabold text-gray-900 dark:text-white">Compressed!</p>
        <p className="text-gray-400 text-sm mt-1">Saved {saved}% across {isMultiple ? `${fileCount} files` : '1 file'}</p>
      </div>
      <div className="flex items-center gap-6 bg-indigo-50 dark:bg-gray-900 border border-indigo-100 dark:border-gray-800 rounded-2xl px-8 py-4">
        <div className="text-center">
          <p className="text-xs text-gray-400 mb-1">Total Original</p>
          <p className="font-bold text-gray-700 dark:text-gray-300">{formatSize(originalSize)}</p>
        </div>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round">
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="12 5 19 12 12 19" />
        </svg>
        <div className="text-center">
          <p className="text-xs text-gray-400 mb-1">Total Compressed</p>
          <p className="font-bold text-green-500">{formatSize(compressedSize)}</p>
        </div>
      </div>
      {isMultiple && (
        <>
          <div className="w-full flex flex-col gap-2">
            {perFile.map((f, i) => (
              <div key={i} className="flex items-center justify-between px-4 py-3 rounded-xl border border-indigo-100 dark:border-gray-800 bg-gradient-to-br from-white to-indigo-50 dark:bg-gray-900 dark:bg-none">
                <p className="text-xs text-gray-600 dark:text-gray-400 truncate max-w-[180px] font-medium">{f.name}</p>
                <div className="flex items-center gap-3 text-xs">
                  <span className="text-gray-400">{formatSize(f.originalSize)}</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                  <span className="text-green-500 font-semibold">{formatSize(f.compressedSize)}</span>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            Files will be downloaded as a <span className="text-indigo-500 font-medium">ZIP archive</span>
          </p>
        </>
      )}
      <div className="flex gap-3">
        <button
          onClick={onDownload}
          className="text-white font-semibold px-8 py-3 rounded-full text-sm hover:scale-105 transition-all"
          style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
        >
          Download →
        </button>
        <button
          onClick={onReset}
          className="font-semibold px-8 py-3 rounded-full text-sm transition-all hover:scale-105 bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 hover:bg-indigo-200 dark:hover:bg-indigo-900"
        >
          Compress Another
        </button>
      </div>
    </div>
  )
}

// Ping backend to wake it up from Railway sleep before actual request
async function warmupServer(baseUrl) {
  try {
    await fetch(`${baseUrl}/api/ping`, { method: 'GET', signal: AbortSignal.timeout(8000) })
  } catch {
    // Ignore — warmup is best-effort, actual request will retry itself
  }
}

export default function Compress() {
  const [activeTab, setActiveTab] = useState('Compress Image')
  const [files, setFiles] = useState([])
  const [compressing, setCompressing] = useState(false)
  const [compressStatus, setCompressStatus] = useState('')
  const [result, setResult] = useState(null)

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Enter' && files.length > 0 && !result && !compressing) {
        handleCompress()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [files, result, compressing])

  const handleFileSelect = (f) => {
    setFiles(f)
    setResult(null)
  }

  const handleRemove = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
    setResult(null)
  }

  const handleReset = () => {
    setFiles([])
    setResult(null)
  }

  const handleTabChange = (tab) => {
    setActiveTab(tab)
    setFiles([])
    setResult(null)
  }

  const handleCompress = async () => {
    setCompressing(true)
    setCompressStatus('Waking up server...')

    // Ping server first to wake Railway from sleep (free tier goes idle)
    await warmupServer(API_BASE_URL)
    setCompressStatus('Compressing...')

    try {
      if (activeTab === 'Compress Image') {
        const compressedResults = []
        const compressedBlobs = []

        for (const file of files) {
          const formData = new FormData()
          formData.append('file', file)
          formData.append('quality', '0.5')

          const res = await fetch(`${API_BASE_URL}/api/compress/image`, {
            method: 'POST',
            body: formData
          })

          if (!res.ok) throw new Error('Compression failed on server')

          const blob = await res.blob()
          compressedBlobs.push({ name: file.name, blob })
          compressedResults.push({
            name: file.name,
            originalSize: file.size,
            compressedSize: blob.size
          })
        }

        const totalOriginal = files.reduce((acc, f) => acc + f.size, 0)
        const totalCompressed = compressedResults.reduce((acc, r) => acc + r.compressedSize, 0)

        setResult({
          originalSize: totalOriginal,
          compressedSize: totalCompressed,
          isMultiple: files.length > 1,
          url: URL.createObjectURL(compressedBlobs[0].blob),
          fileName: compressedBlobs[0].name,
          perFile: compressedResults,
          blobs: compressedBlobs
        })
      } else {
        // PDF compression via Spring Boot backend
        const compressedResults = []
        const compressedBlobs = []

        for (const pdfFile of files) {
          const formData = new FormData()
          formData.append('file', pdfFile)
          formData.append('quality', '0.3')

          const res = await fetch(`${API_BASE_URL}/api/compress/pdf`, {
            method: 'POST',
            body: formData
          })

          if (!res.ok) {
            const errorText = await res.text()
            throw new Error(errorText || 'PDF compression failed on server')
          }

          const blob = await res.blob()
          compressedBlobs.push({ name: pdfFile.name, blob })
          compressedResults.push({
            name: pdfFile.name,
            originalSize: pdfFile.size,
            compressedSize: blob.size
          })
        }

        const totalOriginal = files.reduce((acc, f) => acc + f.size, 0)
        const totalCompressed = compressedResults.reduce((acc, r) => acc + r.compressedSize, 0)

        setResult({
          originalSize: totalOriginal,
          compressedSize: totalCompressed,
          isMultiple: files.length > 1,
          url: URL.createObjectURL(compressedBlobs[0].blob),
          fileName: compressedBlobs[0].name,
          perFile: compressedResults,
          blobs: compressedBlobs
        })
      }
    } catch (err) {
      console.error(err)
      alert('Compression failed. Please try again in a few seconds.')
    } finally {
      setCompressing(false)
      setCompressStatus('')
    }
  }

  const handleDownload = async () => {
    if (result.isMultiple) {
      const zip = new JSZip()
      if (result.blobs) {
        // Real compressed image blobs from backend
        result.blobs.forEach(({ name, blob }) => {
          zip.file(`compressed_${name}`, blob)
        })
      } else {
        // Fallback for still-simulated PDF compression
        files.forEach((f) => {
          zip.file(`compressed_${f.name}`, f)
        })
      }
      const blob = await zip.generateAsync({ type: 'blob' })
      const a = document.createElement('a')
      a.href = URL.createObjectURL(blob)
      a.download = 'compressed_files.zip'
      a.click()
    } else {
      const a = document.createElement('a')
      a.href = result.url
      a.download = `compressed_${result.fileName}`
      a.click()
    }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 pt-28 pb-16 px-6">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-3">
            Compress Files
          </h1>
          <p className="text-gray-400 dark:text-gray-500">
            Reduce file size instantly — no quality loss, no watermarks.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 bg-gray-100 dark:bg-gray-900 p-1 rounded-full mb-8 cursor-pointer">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={`flex-1 py-2.5 rounded-full text-sm font-semibold transition-all duration-300
                ${activeTab === tab
                  ? 'bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content */}
        {files.length === 0 && !result && (
          <UploadZone tab={activeTab} onFileSelect={handleFileSelect} />
        )}

        {files.length > 0 && !result && (
          <div className="flex flex-col gap-4">
            {files.map((file, index) => (
              <FilePreview key={index} file={file} onRemove={() => handleRemove(index)} />
            ))}
            <button
              onClick={handleCompress}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !compressing) {
                  handleCompress()
                }
              }}
              disabled={compressing}
              className="w-full py-3.5 rounded-full text-white font-semibold text-sm hover:scale-105 transition-all disabled:opacity-70 disabled:scale-100"
              style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
            >
              {compressing ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                  </svg>
                  {compressStatus || 'Compressing...'}
                </span>
              ) : `Compress ${activeTab === 'Compress Image' ? 'Image' : 'PDF'} →`}
            </button>
          </div>
        )}

        {result && (
          <CompressResult
            originalSize={result.originalSize}
            compressedSize={result.compressedSize}
            isMultiple={result.isMultiple}
            fileCount={files.length}
            perFile={result.perFile}
            onDownload={handleDownload}
            onReset={handleReset}
          />
        )}

      </div>
    </div>
  )
}