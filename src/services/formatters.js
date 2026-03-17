export function relativeTime(date) {
  if (!date) return '';
  const now = Date.now();
  const diff = now - new Date(date).getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return new Date(date).toLocaleDateString();
}

export function freshnessLevel(date) {
  if (!date) return 'stale';
  const diff = Date.now() - new Date(date).getTime();
  const minutes = diff / 60000;
  if (minutes < 5) return 'live';
  if (minutes < 1440) return 'recent'; // < 24h
  return 'stale';
}

export function formatNumber(num) {
  if (!num && num !== 0) return '';
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return String(num);
}

export function positionDelta(current, previous) {
  if (previous == null) return { direction: 'new', delta: 0 };
  if (current < previous) return { direction: 'up', delta: previous - current };
  if (current > previous) return { direction: 'down', delta: current - previous };
  return { direction: 'same', delta: 0 };
}
