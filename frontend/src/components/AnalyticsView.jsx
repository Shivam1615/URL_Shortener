import { useState, useEffect } from 'react'
import { getAnalytics } from '../api/client'

export default function AnalyticsView({ link, onBack }) {
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const data = await getAnalytics(link.id)
        setAnalytics(data)
      } catch (err) {
        setError('Failed to load analytics')
      } finally {
        setLoading(false)
      }
    }
    fetchAnalytics()
  }, [link.id])

  if (loading) return <div style={styles.message}>Loading analytics...</div>
  if (error) return <div style={styles.error}>{error}</div>

  return (
    <div>
      <button style={styles.backBtn} onClick={onBack}>← Back to links</button>

      <div style={styles.header}>
        <div style={styles.slug}>{link.shortUrl}</div>
        <div style={styles.target}>→ {link.targetUrl}</div>
      </div>

      <div style={styles.statsRow}>
        <div style={styles.statCard}>
          <div style={styles.statLabel}>Total Clicks</div>
          <div style={styles.statValue}>{analytics.totalClicks}</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statLabel}>Created</div>
          <div style={styles.statValueSmall}>
            {new Date(link.createdAt).toLocaleDateString()}
          </div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statLabel}>Last Click</div>
          <div style={styles.statValueSmall}>
            {analytics.clicksByDay.length > 0
              ? analytics.clicksByDay[0].day
              : 'No clicks yet'}
          </div>
        </div>
      </div>

      <div style={styles.sectionLabel}>Daily Breakdown</div>

      {analytics.clicksByDay.length === 0 ? (
        <div style={styles.emptyState}>No clicks recorded yet.</div>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Date</th>
              <th style={styles.th}>Clicks</th>
            </tr>
          </thead>
          <tbody>
            {analytics.clicksByDay.map((row) => (
              <tr key={row.day} style={styles.row}>
                <td style={styles.td}>{row.day}</td>
                <td style={styles.td}>{row.clicks}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

const styles = {
  message: {
    fontFamily: 'IBM Plex Mono, monospace',
    fontSize: 14,
    color: '#666',
    padding: '64px 0',
    textAlign: 'center'
  },
  error: {
    fontFamily: 'IBM Plex Mono, monospace',
    fontSize: 14,
    color: '#ff5f5f',
    padding: '64px 0',
    textAlign: 'center'
  },
  backBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    fontFamily: 'IBM Plex Mono, monospace',
    fontSize: 13,
    color: '#666',
    cursor: 'pointer',
    marginBottom: 32,
    background: 'none',
    border: 'none'
  },
  header: {
    marginBottom: 40
  },
  slug: {
    fontFamily: 'IBM Plex Mono, monospace',
    fontSize: 28,
    fontWeight: 600,
    color: '#d4f76e',
    marginBottom: 6
  },
  target: {
    fontSize: 14,
    color: '#666'
  },
  statsRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 16,
    marginBottom: 40
  },
  statCard: {
    background: '#1a1a1a',
    border: '1px solid #2a2a2a',
    borderRadius: 10,
    padding: 24
  },
  statLabel: {
    fontFamily: 'IBM Plex Mono, monospace',
    fontSize: 11,
    color: '#666',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 10
  },
  statValue: {
    fontFamily: 'IBM Plex Mono, monospace',
    fontSize: 32,
    fontWeight: 600,
    color: '#d4f76e'
  },
  statValueSmall: {
    fontFamily: 'IBM Plex Mono, monospace',
    fontSize: 18,
    fontWeight: 600,
    color: '#d4f76e',
    paddingTop: 8
  },
  sectionLabel: {
    fontFamily: 'IBM Plex Mono, monospace',
    fontSize: 13,
    color: '#666',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 16
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse'
  },
  th: {
    fontFamily: 'IBM Plex Mono, monospace',
    fontSize: 11,
    color: '#666',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    textAlign: 'left',
    padding: '0 16px 12px',
    borderBottom: '1px solid #2a2a2a'
  },
  row: {
    borderBottom: '1px solid #2a2a2a'
  },
  td: {
    padding: 16,
    fontFamily: 'IBM Plex Mono, monospace',
    fontSize: 13
  },
  emptyState: {
    textAlign: 'center',
    padding: '64px 0',
    color: '#666',
    fontFamily: 'IBM Plex Mono, monospace',
    fontSize: 14
  }
}