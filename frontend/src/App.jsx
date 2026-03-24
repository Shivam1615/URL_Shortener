import { useState, useEffect } from 'react'
import { getAllLinks } from './api/client'
import CreateLinkForm from './components/CreateLinkForm'
import LinkTable from './components/LinkTable'
import AnalyticsView from './components/AnalyticsView'

export default function App() {
  const [links, setLinks] = useState([])
  const [selectedLink, setSelectedLink] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchLinks = async () => {
    try {
      const data = await getAllLinks()
      setLinks(data)
    } catch (err) {
      setError('Failed to load links')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLinks()
  }, [])

  const handleViewAnalytics = (linkId) => {
    const link = links.find((l) => l.id === linkId)
    setSelectedLink(link)
  }

  const handleBack = () => {
    setSelectedLink(null)
  }

  return (
    <div style={styles.page}>
      <nav style={styles.nav}>
        
        <div style={styles.navLabel}>URL Shortener</div>
      </nav>

      <div style={styles.content}>
        {selectedLink ? (
          <AnalyticsView link={selectedLink} onBack={handleBack} />
        ) : (
          <>
            <CreateLinkForm onLinkCreated={fetchLinks} />
            {loading && (
              <div style={styles.message}>Loading links...</div>
            )}
            {error && (
              <div style={styles.error}>{error}</div>
            )}
            {!loading && !error && (
              <LinkTable
                links={links}
                onViewAnalytics={handleViewAnalytics}
              />
            )}
          </>
        )}
      </div>
    </div>
  )
}

const styles = {
  page: {
    minHeight: '100vh',
    padding: '0 24px 80px'
  },
  nav: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '24px 0 48px',
    borderBottom: '1px solid #2a2a2a',
    marginBottom: 48
  },
  logo: {
    fontFamily: 'IBM Plex Mono, monospace',
    fontSize: 20,
    fontWeight: 600,
    color: '#d4f76e',
    letterSpacing: -0.5
  },
  logoDim: {
    color: '#666'
  },
  navLabel: {
    fontFamily: 'IBM Plex Mono, monospace',
    fontSize: 12,
    color: '#666'
  },
  content: {
    maxWidth: 860,
    margin: '0 auto'
  },
  message: {
    fontFamily: 'IBM Plex Mono, monospace',
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    padding: '64px 0'
  },
  error: {
    fontFamily: 'IBM Plex Mono, monospace',
    fontSize: 14,
    color: '#ff5f5f',
    textAlign: 'center',
    padding: '64px 0'
  }
}
