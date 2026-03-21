import { freshnessLevel, relativeTime } from '../services/formatters';

const config = {
  live:   { color: '#22c55e', label: 'Live' },
  recent: { color: '#eab308', label: null },  // shows relative time
  stale:  { color: '#6b7280', label: 'Stale' },
};

export default function FreshnessBadge({ date }) {
  if (!date) return null;

  const level = freshnessLevel(date);
  const { color, label } = config[level];
  const text = label || relativeTime(date);

  return (
    <span style={styles.badge}>
      {level === 'live' && <style>{`@keyframes pulse-live{0%,100%{opacity:1}50%{opacity:.4}}`}</style>}
      <span style={{ ...styles.dot, background: color, ...(level === 'live' ? { animation: 'pulse-live 2s ease-in-out infinite' } : {}) }} />
      {text}
    </span>
  );
}

const styles = {
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
    fontSize: 10,
    fontWeight: 600,
    color: '#9ca3af',
    padding: '2px 6px',
    borderRadius: 4,
    background: '#1f2937',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: '50%',
    flexShrink: 0,
  },
};
