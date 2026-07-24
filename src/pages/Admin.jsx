import { useRef, useState } from 'react'
import { UploadCloud, Check, AlertCircle } from 'lucide-react'
import { SplitReveal } from '../components/Reveal.jsx'

// Uploads .glb/.stl files to Cloudflare R2 via the /api/upload-url serverless
// function (presigned PUT). Works on Vercel or `vercel dev`; plain `vite dev`
// has no /api routes, so a clear error is shown there.
export default function Admin() {
  const inputRef = useRef(null)
  const [status, setStatus] = useState('idle') // idle | uploading | done | error
  const [message, setMessage] = useState('')
  const [progress, setProgress] = useState(0)
  const [uploadedKey, setUploadedKey] = useState('')
  const [drag, setDrag] = useState(false)

  const upload = async (file) => {
    if (!file) return
    if (!/\.(glb|gltf|stl|obj|fbx|usdz)$/i.test(file.name)) {
      setStatus('error')
      setMessage('Only 3D model files: .glb, .gltf, .stl, .obj, .fbx, .usdz')
      return
    }
    setStatus('uploading')
    setMessage(file.name)
    setProgress(0)
    try {
      const res = await fetch('/api/upload-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename: file.name, contentType: file.type || 'application/octet-stream', size: file.size }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || `Server responded ${res.status}. Run with \`vercel dev\` or deploy to Vercel to enable uploads.`)
      }
      const { uploadUrl, key } = await res.json()

      await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.open('PUT', uploadUrl)
        xhr.upload.onprogress = (e) => e.lengthComputable && setProgress(Math.round((e.loaded / e.total) * 100))
        xhr.onload = () => (xhr.status >= 200 && xhr.status < 300 ? resolve() : reject(new Error(`Upload failed (${xhr.status})`)))
        xhr.onerror = () => reject(new Error('Network error during upload'))
        xhr.setRequestHeader('Content-Type', file.type || 'application/octet-stream')
        xhr.send(file)
      })

      setUploadedKey(key)
      setStatus('done')
      setMessage(`Uploaded as ${key}`)
    } catch (err) {
      setStatus('error')
      setMessage(err.message)
    }
  }

  return (
    <div className="page">
      <div className="container" style={{ paddingTop: 'clamp(30px, 5vw, 60px)', maxWidth: 820 }}>
        <p className="label" style={{ marginBottom: 12 }}>Studio tools</p>
        <h1 className="display" style={{ fontSize: 'clamp(2.2rem, 6vw, 4.5rem)', marginBottom: 14 }}>
          <SplitReveal text="Model" /> <span className="serif-accent"><SplitReveal text="uploads" delay={0.1} /></span>
        </h1>
        <p style={{ color: 'var(--ink-60)', maxWidth: '56ch', marginBottom: 40 }}>
          Upload product .glb files to Cloudflare R2 storage. After uploading, set the returned key as the product's
          <code style={{ background: 'var(--card)', padding: '2px 8px', borderRadius: 6, margin: '0 4px' }}>modelUrl</code>
          in <code style={{ background: 'var(--card)', padding: '2px 8px', borderRadius: 6 }}>src/data/products.js</code> and the
          viewer will render the real model instead of the placeholder.
        </p>

        <div
          onDragOver={(e) => { e.preventDefault(); setDrag(true) }}
          onDragLeave={() => setDrag(false)}
          onDrop={(e) => { e.preventDefault(); setDrag(false); upload(e.dataTransfer.files[0]) }}
          onClick={() => inputRef.current?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && inputRef.current?.click()}
          style={{
            border: '2px dashed',
            borderColor: drag ? '#000' : 'var(--ink-12)',
            borderRadius: 'var(--radius)',
            padding: 'clamp(40px, 8vw, 80px)',
            textAlign: 'center',
            cursor: 'pointer',
            background: drag ? 'var(--card)' : 'transparent',
            transition: 'all 0.3s',
          }}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".glb,.gltf,.stl,.obj,.fbx,.usdz"
            hidden
            onChange={(e) => upload(e.target.files[0])}
          />
          <UploadCloud size={40} strokeWidth={1.4} style={{ margin: '0 auto 16px', opacity: 0.6 }} />
          <p style={{ fontWeight: 600, marginBottom: 6 }}>Drop a 3D model here, or click to browse</p>
          <p style={{ fontSize: '0.82rem', color: 'var(--ink-60)' }}>.glb recommended · up to 100 MB</p>
        </div>

        {status !== 'idle' && (
          <div
            style={{
              marginTop: 24,
              padding: '18px 22px',
              borderRadius: 16,
              background: status === 'error' ? '#fdecea' : 'var(--card)',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              fontSize: '0.92rem',
            }}
          >
            {status === 'uploading' && (
              <>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 600, marginBottom: 8 }}>{message}</p>
                  <div style={{ height: 6, background: 'var(--ink-12)', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ width: `${progress}%`, height: '100%', background: '#000', transition: 'width 0.2s' }} />
                  </div>
                </div>
                <span style={{ fontWeight: 700 }}>{progress}%</span>
              </>
            )}
            {status === 'done' && (
              <>
                <Check size={20} />
                <div>
                  <p style={{ fontWeight: 600 }}>{message}</p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--ink-60)' }}>
                    Set <code>modelUrl: '{uploadedKey}'</code> on the product to use it.
                  </p>
                </div>
              </>
            )}
            {status === 'error' && (
              <>
                <AlertCircle size={20} color="#c0392b" />
                <p style={{ color: '#7a221a' }}>{message}</p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
