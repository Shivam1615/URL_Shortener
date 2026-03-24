import { useState } from 'react'
import { createLink } from '../api/client'

export default function CreateLinkForm({ onLinkCreated }) {
    const [targetUrl, setTargetUrl] = useState('')
    const [shortUrl, setShortUrl] = useState(null)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)
    const [copied, setCopied] = useState(false)

    const handleSubmit = async () => {
        setError(null)
        setShortUrl(null)


        if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
            setError('URL must start with http:// or https://')
            return
        }
        
        try {
            setLoading(true)
            const link = await createLink(targetUrl)
            setShortUrl(link.shortUrl)
            setTargetUrl('')
            onLinkCreated()
        } catch (err) {
            setError(err.response?.data?.targetUrl || 'Something went wrong')
        } finally {
            setLoading(false)
        }
    }

    const handleCopy = () => {
        navigator.clipboard.writeText(shortUrl)
        setCopied(true)
        setTimeout(() => setCopied(false), 1500)
    }

    return (
    <div style={styles.card}>
      <div style={styles.label}>Shorten a URL</div>
      <div style={styles.row}>
        <input
          style={{
            ...styles.input,
            borderColor: error ? '#ff5f5f' : '#2a2a2a'
          }}
          type="text"
          placeholder="https://your-long-url.com/goes/here"
          value={targetUrl}
          onChange={(e) => setTargetUrl(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
        />
        <button
          style={styles.btnPrimary}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? 'Shortening...' : 'Shorten →'}
        </button>
      </div>

      {error && <div style={styles.error}>⚠ {error}</div>}

      {shortUrl && (
        <div style={styles.successBanner}>
          <span style={styles.shortUrl}>{shortUrl}</span>
          <button style={styles.btnCopy} onClick={handleCopy}>
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      )}
    </div>
  )

}

const styles = {
  card: {
    background: '#1a1a1a',
    border: '1px solid #2a2a2a',
    borderRadius: 12,
    padding: 32,
    marginBottom: 48
  },
  label: {
    fontFamily: 'IBM Plex Mono, monospace',
    fontSize: 13,
    color: '#666',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 20
  },
  row: {
    display: 'flex',
    gap: 12
  },
  input: {
    flex: 1,
    background: '#0f0f0f',
    border: '1px solid #2a2a2a',
    borderRadius: 8,
    padding: '14px 16px',
    fontSize: 15,
    color: '#f0f0f0',
    outline: 'none',
    fontFamily: 'DM Sans, sans-serif'
  },
  btnPrimary: {
    background: '#d4f76e',
    color: '#0f0f0f',
    border: 'none',
    borderRadius: 8,
    padding: '14px 24px',
    fontSize: 15,
    fontWeight: 600,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    fontFamily: 'DM Sans, sans-serif'
  },
  error: {
    fontSize: 13,
    color: '#ff5f5f',
    marginTop: 10,
    fontFamily: 'IBM Plex Mono, monospace'
  },
  successBanner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    background: '#1a2a0a',
    border: '1px solid #3a5a10',
    borderRadius: 8,
    padding: '14px 18px',
    marginTop: 16,
    gap: 12
  },
  shortUrl: {
    fontFamily: 'IBM Plex Mono, monospace',
    fontSize: 14,
    color: '#d4f76e'
  },
  btnCopy: {
    background: 'transparent',
    border: '1px solid #d4f76e',
    color: '#d4f76e',
    borderRadius: 6,
    padding: '6px 14px',
    fontSize: 13,
    fontFamily: 'IBM Plex Mono, monospace',
    cursor: 'pointer',
    whiteSpace: 'nowrap'
  }
}