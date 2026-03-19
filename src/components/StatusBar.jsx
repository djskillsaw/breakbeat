import { useState, useEffect } from 'react';
import { relativeTime } from '../services/formatters';
import RefreshButton from './RefreshButton';
import FreshnessBadge from './FreshnessBadge';

export default function StatusBar({
  lastUpdated, isLoading, error, autoRefresh, refreshInterval,
  onRefresh, onToggleAutoRefresh, availableSources, activeSources,
}) {
  const [, forceUpdate] = useState(0);

  // Re-render every 30s to update relative time
  useEffect(() => {
    const id = setInterval(() => forceUpdate(n => n + 1), 30000);
    return () => clearInterval(id);
  }, []);

  const sourceList = (activeSources && activeSources.length > 0)
    ? activeSources
    : (availableSources || []);

  return (
    <div style={styles.bar}>
      <div style={styles.left}>
        {lastUpdated && <FreshnessBadge date={lastUpdated} />}
        <span style={styles.text}>
          {lastUpdated ? `Updated ${relativeTime(lastUpdated)}` : 'Fetching charts...'}
        </span>
        {sourceList.length > 0 && (
          <span style={styles.sources}>
            {sourceList.map((src, i) => (
              <span key={src}>
                <span style={{ ...styles.sourceDot, background: sourceColor(src) }} />
                {src}{i < sourceList.length - 1 ? '' : ''}
              </span>
            ))}
          </span>
        )}
        {error && <span style={styles.error}>{error}</span>}
      </div>
      <div style={styles.right}>
        <label style={styles.toggle}>
          <input
            type="checkbox"
            checked={autoRefresh}
            onChange={() => onToggleAutoRefresh(!autoRefresh)}
            style={styles.checkbox}
          />
          <span style={styles.toggleLabel}>
            Auto {autoRefresh ? `(${refreshInterval / 60000}m)` : 'off'}
          </span>
        </label>
        <RefreshButton onClick={onRefresh} isLoading={isLoading} />
      </div>
    </div>
  );
}

function sourceColor(source) {
  switch (source) {
    case 'Last.fm': return '#d51007';
    case 'Apple Music': return '#fb2d55';
    case 'Spotify': return '#1db954';
    default: return '#6b7280';
  }
}

const styles = {
  bar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px 16px',
    borderBottom: '1px solid #1f2937',
    background: '#0d1117',
    gap: 8,
    flexWrap: 'wrap',
  },
  left: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  right: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  text: {
    fontSize: 11,
    color: '#6b7280',
  },
  error: {
    fontSize: 11,
    color: '#ef4444',
  },
  sources: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    fontSize: 10,
    color: '#9ca3af',
    fontWeight: 600,
  },
  sourceDot: {
    display: 'inline-block',
    width: 6,
    height: 6,
    borderRadius: '50%',
    marginRight: 3,
    verticalAlign: 'middle',
  },
  toggle: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    cursor: 'pointer',
  },
  checkbox: {
    accentColor: '#f97316',
  },
  toggleLabel: {
    fontSize: 11,
    color: '#9ca3af',
    fontWeight: 600,
  },
};
