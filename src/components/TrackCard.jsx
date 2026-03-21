import { StarIcon, ExternalLinkIcon } from './Icons';
import ChartPositionBadge from './ChartPositionBadge';
import { formatNumber } from '../services/formatters';
import { PLATFORMS, DEFAULT_TRACK_PLATFORMS } from '../services/links';
import { S } from '../styles';

export function CuratedTrackCard({ track, saved, onToggleSave }) {
  return (
    <div style={S.card}>
      <div style={S.cardHeader}>
        <div>
          <div style={S.trackTitle}>{track.title}</div>
          <div style={S.trackArtist}>{track.artist}</div>
        </div>
        <button onClick={() => onToggleSave(track.id)} style={S.starBtn} aria-label="Save track">
          <StarIcon filled={saved} />
        </button>
      </div>
      <div style={S.btnRow}>
        {track.beatportUrl && <a href={track.beatportUrl} target="_blank" rel="noreferrer" style={{ ...S.btn, background: '#f97316' }}>Beatport <ExternalLinkIcon /></a>}
        {track.spotifyUrl && <a href={track.spotifyUrl} target="_blank" rel="noreferrer" style={{ ...S.btn, background: '#1db954' }}>Spotify <ExternalLinkIcon /></a>}
        {track.appleMusicUrl && <a href={track.appleMusicUrl} target="_blank" rel="noreferrer" style={{ ...S.btn, background: '#fb2d55' }}>Apple Music <ExternalLinkIcon /></a>}
      </div>
    </div>
  );
}

export function LiveTrackCard({ track, rank, previousRank, saved, onToggleSave }) {
  const links = track.links || {};
  const sources = track.sources || [track.source || 'Last.fm'];

  return (
    <div style={{ ...S.card, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
      <ChartPositionBadge rank={rank} previousRank={previousRank} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={S.cardHeader}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={S.trackTitle}>{track.title}</div>
            <div style={S.trackArtist}>{track.artist}</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={styles.sourceTags}>
              {sources.map(src => (
                <span key={src} style={{ ...styles.sourceTag, ...sourceColor(src) }}>{src}</span>
              ))}
            </div>
            {onToggleSave && (
              <button onClick={() => onToggleSave(track)} style={S.starBtn} aria-label="Save track">
                <StarIcon filled={saved} />
              </button>
            )}
          </div>
        </div>

        {/* Stats row */}
        {(track.playcount > 0 || track.listeners > 0 || track.popularity > 0) && (
          <div style={styles.stats}>
            {track.playcount > 0 && <span>{formatNumber(track.playcount)} plays</span>}
            {track.listeners > 0 && <span>{formatNumber(track.listeners)} listeners</span>}
            {track.popularity > 0 && <span>Popularity: {track.popularity}</span>}
          </div>
        )}

        {/* Platform links — all of them */}
        <div style={S.btnRow}>
          {DEFAULT_TRACK_PLATFORMS.map(platformId => {
            const url = links[platformId];
            if (!url) return null;
            const platform = PLATFORMS[platformId];
            return (
              <a
                key={platformId}
                href={url}
                target="_blank"
                rel="noreferrer"
                style={{ ...S.btn, background: platform.color }}
              >
                {platform.label} <ExternalLinkIcon />
              </a>
            );
          })}
          {/* Last.fm link if available */}
          {links.lastfm && (
            <a href={links.lastfm} target="_blank" rel="noreferrer" style={{ ...S.btn, background: PLATFORMS.lastfm.color }}>
              Last.fm <ExternalLinkIcon />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

function sourceColor(source) {
  switch (source) {
    case 'Last.fm': return { color: '#d51007', borderColor: '#d51007' };
    case 'Apple Music': return { color: '#fb2d55', borderColor: '#fb2d55' };
    case 'Spotify': return { color: '#1db954', borderColor: '#1db954' };
    default: return { color: '#6b7280', borderColor: '#6b7280' };
  }
}

const styles = {
  sourceTags: {
    display: 'flex',
    gap: 4,
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
  },
  sourceTag: {
    fontSize: 9,
    fontWeight: 700,
    background: '#1a1610',
    borderRadius: 4,
    padding: '2px 6px',
    whiteSpace: 'nowrap',
    border: '1px solid transparent',
  },
  stats: {
    display: 'flex',
    gap: 12,
    fontSize: 11,
    color: '#8a7a65',
    marginBottom: 8,
  },
};
