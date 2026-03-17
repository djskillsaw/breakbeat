import { StarIcon, ExternalLinkIcon } from './Icons';
import ChartPositionBadge from './ChartPositionBadge';
import { formatNumber } from '../services/formatters';
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
        <a href={track.beatportUrl} target="_blank" rel="noreferrer" style={{ ...S.btn, background: '#f97316' }}>Beatport <ExternalLinkIcon /></a>
        {track.spotifyUrl && <a href={track.spotifyUrl} target="_blank" rel="noreferrer" style={{ ...S.btn, background: '#1db954' }}>Spotify <ExternalLinkIcon /></a>}
        <a href={track.appleMusicUrl} target="_blank" rel="noreferrer" style={{ ...S.btn, background: '#fb2d55' }}>Apple Music <ExternalLinkIcon /></a>
      </div>
    </div>
  );
}

export function LiveTrackCard({ track, rank, previousRank, lastUpdated }) {
  return (
    <div style={{ ...S.card, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
      <ChartPositionBadge rank={rank} previousRank={previousRank} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={S.cardHeader}>
          <div>
            <div style={S.trackTitle}>{track.title}</div>
            <div style={S.trackArtist}>{track.artist}</div>
          </div>
          <span style={styles.sourceTag}>Last.fm</span>
        </div>
        {(track.playcount > 0 || track.listeners > 0) && (
          <div style={styles.stats}>
            {track.playcount > 0 && <span>{formatNumber(track.playcount)} plays</span>}
            {track.listeners > 0 && <span>{formatNumber(track.listeners)} listeners</span>}
          </div>
        )}
        {track.lastfmUrl && (
          <div style={S.btnRow}>
            <a href={track.lastfmUrl} target="_blank" rel="noreferrer" style={{ ...S.btn, background: '#d51007' }}>Last.fm <ExternalLinkIcon /></a>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  sourceTag: {
    fontSize: 10,
    fontWeight: 700,
    color: '#d51007',
    background: '#1f2937',
    borderRadius: 4,
    padding: '2px 6px',
    whiteSpace: 'nowrap',
  },
  stats: {
    display: 'flex',
    gap: 12,
    fontSize: 11,
    color: '#6b7280',
    marginBottom: 8,
  },
};
