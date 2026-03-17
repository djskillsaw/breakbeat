import { positionDelta } from '../services/formatters';

const rankColors = {
  1: '#f59e0b',  // gold
  2: '#94a3b8',  // silver
  3: '#cd7f32',  // bronze
};

export default function ChartPositionBadge({ rank, previousRank }) {
  if (rank == null) return null;

  const { direction, delta } = positionDelta(rank, previousRank);
  const bg = rankColors[rank] || '#374151';

  return (
    <div style={styles.container}>
      <div style={{ ...styles.rank, background: bg }}>
        {rank}
      </div>
      {direction === 'new' && (
        <span style={styles.new}>NEW</span>
      )}
      {direction === 'up' && (
        <span style={styles.up}>{'\u25b2'}{delta}</span>
      )}
      {direction === 'down' && (
        <span style={styles.down}>{'\u25bc'}{delta}</span>
      )}
      {direction === 'same' && (
        <span style={styles.same}>{'\u2014'}</span>
      )}
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 2,
    minWidth: 36,
    flexShrink: 0,
  },
  rank: {
    width: 28,
    height: 28,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 12,
    fontWeight: 800,
    color: '#000',
  },
  new: {
    fontSize: 8,
    fontWeight: 700,
    color: '#22c55e',
    letterSpacing: '0.05em',
  },
  up: {
    fontSize: 9,
    fontWeight: 700,
    color: '#22c55e',
  },
  down: {
    fontSize: 9,
    fontWeight: 700,
    color: '#ef4444',
  },
  same: {
    fontSize: 9,
    color: '#6b7280',
  },
};
