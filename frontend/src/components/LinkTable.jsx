import { useState } from 'react'

export default function LinkTable({ links, onViewAnalytics }) {
    if (links.length === 0) {
        return (
            <div style={styles.emptyState}>
                <div style={styles.emptyIcon}>🔗</div>
                <p style={styles.emptyText}>No links yet. Create your first one above.</p>
            </div>
        )
    }

    return (
        <div>
            <div style={styles.sectionLabel}>All Links</div>
            <table style={styles.table}>
                <thead>
                    <tr>
                        <th style={styles.th}>Short URL</th>
                        <th style={styles.th}>Target</th>
                        <th style={styles.th}>Created</th>
                        <th style={styles.th}></th>
                    </tr>
                </thead>
                <tbody>
                    {links.map((link) => (
                        <tr key={link.id} style={styles.row}>
                            <td style={styles.tdSlug}>
                                <a
                                    href={link.shortUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={styles.slugLink}
                                >
                                    {link.shortUrl}
                                </a>
                            </td>
                            <td style={styles.tdUrl}>{link.targetUrl}</td>
                            <td style={styles.tdDate}>
                                {new Date(link.createdAt).toLocaleDateString()}
                            </td>
                            <td style={styles.tdAction}>
                                <button
                                    style={styles.btnAnalytics}
                                    onClick={() => onViewAnalytics(link.id)}
                                >
                                    Analytics →
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

const styles = {
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
    tdSlug: {
        padding: 16,
        fontFamily: 'IBM Plex Mono, monospace',
        fontSize: 13
    },
    slugLink: {
        color: '#d4f76e',
        textDecoration: 'none'
    },
    tdUrl: {
        padding: 16,
        fontSize: 13,
        color: '#666',
        maxWidth: 280,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
    },
    tdDate: {
        padding: 16,
        fontFamily: 'IBM Plex Mono, monospace',
        fontSize: 12,
        color: '#666'
    },
    tdAction: {
        padding: 16
    },
    btnAnalytics: {
        background: 'transparent',
        border: '1px solid #2a2a2a',
        color: '#f0f0f0',
        borderRadius: 6,
        padding: '6px 14px',
        fontSize: 12,
        fontFamily: 'IBM Plex Mono, monospace',
        cursor: 'pointer'
    },
    emptyState: {
        textAlign: 'center',
        padding: '64px 0',
        color: '#666'
    },
    emptyIcon: {
        fontSize: 32,
        marginBottom: 12
    },
    emptyText: {
        fontSize: 14,
        fontFamily: 'IBM Plex Mono, monospace'
    }
}