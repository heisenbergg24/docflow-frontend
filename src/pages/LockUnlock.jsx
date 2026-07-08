import React, { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import ErrorBanner from '../components/ErrorBanner'
import { getErrorMessage } from '../utils/errorUtils'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

// Wake Railway from sleep (free tier cold-starts can take 10-30s)
async function warmupServer(baseUrl) {
  try {
    await fetch(`${baseUrl}/api/ping`, { method: 'GET', signal: AbortSignal.timeout(25000) })
    await new Promise(r => setTimeout(r, 1500))
  } catch {
    // Best-effort; main request will retry on failure
  }
}

// Retry on network failures only, not server errors (4xx/5xx)
async function fetchWithNetworkRetry(url, options, retries = 3) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await fetch(url, options)
    } catch (networkErr) {
      if (attempt === retries) throw networkErr
      await new Promise(r => setTimeout(r, 3000 * attempt)) // 3s → 6s → 9s
    }
  }
}

function UploadZone({ onFileSelect, isDragActive, getRootProps, getInputProps }) {
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

function FilePreview({ file, onRemove }) {
  const displaySize = file.size > 1024 * 1024
    ? `${(file.size / (1024 * 1024)).toFixed(2)} MB`
    : `${(file.size / 1024).toFixed(1)} KB`

  return (
    <div className="flex items-center gap-4 p-4 rounded-2xl border border-indigo-100 dark:border-gray-800 bg-gradient-to-br from-white to-indigo-50 dark:bg-none dark:bg-gray-900">
      <div className="w-14 h-14 rounded-xl bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center flex-shrink-0">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <defs><linearGradient id="fp" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#6366f1" /><stop offset="100%" stopColor="#8b5cf6" /></linearGradient></defs>
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="url(#fp)" />
          <polyline points="14 2 14 8 20 8" stroke="url(#fp)" />
        </svg>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-800 dark:text-white truncate">{file.name}</p>
        <p className="text-xs text-gray-400 mt-0.5">Size: {displaySize}</p>
      </div>
      <button onClick={onRemove} className="text-gray-300 dark:text-gray-600 hover:text-red-400 transition-colors">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  )
}

function Result({ activeTab, onDownload, onReset }) {
  return (
    <div className="flex flex-col items-center gap-6 py-6">
      <div className="w-16 h-16 rounded-full bg-green-50 dark:bg-green-950 flex items-center justify-center">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
      <div className="text-center">
        <p className="text-2xl font-extrabold text-gray-900 dark:text-white">
          {activeTab === 'Lock PDF' ? 'PDF Locked!' : 'PDF Unlocked!'}
        </p>
        <p className="text-gray-400 text-sm mt-1">
          {activeTab === 'Lock PDF'
            ? 'Your PDF is now password protected.'
            : 'Password removed successfully.'}
        </p>
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
          onClick={onReset}
          className="font-semibold px-8 py-3 rounded-full text-sm transition-all hover:scale-105 bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300"
        >
          {activeTab === 'Lock PDF' ? 'Lock Another' : 'Unlock Another'}
        </button>
      </div>
    </div>
  )
}

export default function LockUnlock() {
  const [activeTab, setActiveTab] = useState('Lock PDF')
  const [file, setFile] = useState(null)
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const onDrop = useCallback(acceptedFiles => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0])
      setResult(null)
      setError(null)
      setPassword('')
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1
  })

  const handleTabChange = (tab) => {
    setActiveTab(tab)
    setFile(null)
    setResult(null)
    setError(null)
    setPassword('')
  }

  const handleReset = () => {
    setFile(null)
    setResult(null)
    setError(null)
    setPassword('')
  }

  const handleSubmit = async () => {
    if (!password.trim()) {
      setError({ type: 'unknown', title: 'Password Required', message: 'Please enter a password to continue.' })
      return
    }
    if (activeTab === 'Lock PDF' && password.length < 4) {
      setError({ type: 'unknown', title: 'Password Too Short', message: 'Password must be at least 4 characters.' })
      return
    }

    setProcessing(true)
    setError(null)

    // Wake Railway from sleep before the real request
    await warmupServer(API_BASE_URL)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('password', password)

      const endpoint = activeTab === 'Lock PDF'
        ? `${API_BASE_URL}/api/lock-pdf`
        : `${API_BASE_URL}/api/unlock-pdf`

      const res = await fetchWithNetworkRetry(endpoint, {
        method: 'POST',
        body: formData
      })

      if (res.status === 401) {
        setError({ type: 'unknown', title: 'Wrong Password', message: 'Incorrect password. Please try again.' })
        setProcessing(false)
        return
      }

      if (!res.ok) {
        const message = await res.text()
        setError(getErrorMessage(new Error('server'), message || 'Something went wrong. Please try again.'))
        setProcessing(false)
        return
      }

      const blob = await res.blob()
      setResult({ url: URL.createObjectURL(blob) })
    } catch (err) {
      console.error(err)
      setError(getErrorMessage(err, ''))
    } finally {
      setProcessing(false)
    }
  }

  const handleDownload = () => {
    const a = document.createElement('a')
    a.href = result.url
    a.download = `${activeTab === 'Lock PDF' ? 'locked' : 'unlocked'}_${file.name}`
    a.click()
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 pt-28 pb-16 px-6">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-3">
            Lock / Unlock PDF
          </h1>
          <p className="text-gray-400 dark:text-gray-500">
            Protect your PDF with a password or remove existing protection instantly.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 bg-gray-100 dark:bg-gray-900 p-1 rounded-full mb-8">
          {['Lock PDF', 'Unlock PDF'].map(tab => (
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

        {/* Upload */}
        {!file && !result && (
          <UploadZone
            onFileSelect={setFile}
            isDragActive={isDragActive}
            getRootProps={getRootProps}
            getInputProps={getInputProps}
          />
        )}

        {/* File + Password */}
        {file && !result && (
          <div className="flex flex-col gap-4">
            <FilePreview file={file} onRemove={handleReset} />

            {/* Password Input */}
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  setError(null)
                }}
                onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit() }}
                placeholder={activeTab === 'Lock PDF' ? 'Set a password...' : 'Enter PDF password...'}
                className="w-full px-5 py-3.5 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-white placeholder-gray-300 dark:placeholder-gray-600 text-sm outline-none focus:border-indigo-400 dark:focus:border-indigo-600 transition-colors pr-12"
              />
              <button
                onClick={() => setShowPassword(prev => !prev)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-500 transition-colors"
              >
                {showPassword ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>

            {/* Error */}
            {error && (
              <ErrorBanner
                type={error.type || 'unknown'}
                title={error.title || 'Error'}
                message={error.message || error}
                onDismiss={() => setError(null)}
              />
            )}

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={processing}
              className="w-full py-3.5 rounded-full text-white font-semibold text-sm hover:scale-105 transition-all disabled:opacity-70 disabled:scale-100"
              style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
            >
              {processing ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                  </svg>
                  {activeTab === 'Lock PDF' ? 'Locking...' : 'Unlocking...'}
                </span>
              ) : activeTab === 'Lock PDF' ? 'Lock PDF →' : 'Unlock PDF →'}
            </button>
          </div>
        )}

        {/* Result */}
        {result && (
          <Result
            activeTab={activeTab}
            onDownload={handleDownload}
            onReset={handleReset}
          />
        )}

      </div>
    </div>
  )
}