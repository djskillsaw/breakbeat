import { StarIcon, ExternalLinkIcon } from './Icons';
import { S, genreAccent } from '../styles';
import { mixGenres } from '../data/static-mixes';

export default function MixCard({ mix, saved, onToggleSave }) {
  return (
    <div style={S.card}>
      <div style={S.cardHeader}>
        <div>
          <div style={S.trackTitle}>{mix.title}</div>
          <div style={S.trackArtist}>{mix.artist}</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={S.duration}>{mix.duration}</span>
          {onToggleSave && (
            <button onClick={() => onToggleSave(mix.id)} style={S.starBtn} aria-label="Save mix">
              <StarIcon filled={saved} />
            </button>
          )}
        </div>
      </div>
      <div style={S.tags}>
        {mix.genre && (
          <span style={{ ...S.tag, background: genreAccent[mix.genre] || '#1f2937', color: '#d1d5db' }}>
            {(mixGenres.find(g => g.id === mix.genre) || {}).label || mix.genre}
          </span>
        )}
        <span style={{ ...S.tag, background: '#2d1b4e' }}>{mix.source}</span>
        <span style={{ ...S.tag, background: '#1e3a5f' }}>{mix.rating}</span>
        <span style={{ ...S.tag, background: '#1a2e1a' }}>{mix.date}</span>
      </div>
      <div style={S.vibe}>{mix.vibe}</div>
      <div style={S.btnRow}>
        <a href={mix.soundcloudUrl} target="_blank" rel="noreferrer" style={{ ...S.btn, background: '#f97316' }}>SoundCloud <ExternalLinkIcon /></a>
        <a href={mix.youtubeUrl} target="_blank" rel="noreferrer" style={{ ...S.btn, background: '#dc2626' }}>YouTube <ExternalLinkIcon /></a>
        {mix.raUrl && <a href={mix.raUrl} target="_blank" rel="noreferrer" style={{ ...S.btn, background: '#374151' }}>Source <ExternalLinkIcon /></a>}
        {mix.mixcloudUrl && <a href={mix.mixcloudUrl} target="_blank" rel="noreferrer" style={{ ...S.btn, background: '#5000ff' }}>Mixcloud <ExternalLinkIcon /></a>}
      </div>
    </div>
  );
}
