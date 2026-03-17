import { ExternalLinkIcon } from './Icons';
import { S } from '../styles';

export default function DjCard({ dj }) {
  return (
    <div style={S.card}>
      <div style={S.cardHeader}>
        <div>
          <div style={S.trackTitle}>{dj.name}</div>
          <div style={S.trackArtist}>{dj.genres}</div>
        </div>
        <a href={dj.instagram} target="_blank" rel="noreferrer" style={{ ...S.btn, background: '#7c3aed', padding: '4px 10px' }}>
          IG <ExternalLinkIcon />
        </a>
      </div>
      <div style={S.vibe}>{dj.bio}</div>

      <div style={styles.subLabel}>Streaming Mixes</div>
      {dj.sets.map((set, i) => (
        <div key={i} style={styles.setCard}>
          <div style={styles.setHeader}>
            <div style={styles.setTitle}>{set.title}</div>
            <span style={styles.setDuration}>{set.duration}</span>
          </div>
          <div style={S.btnRow}>
            <a href={set.soundcloudUrl} target="_blank" rel="noreferrer" style={{ ...S.btn, background: '#f97316' }}>SoundCloud <ExternalLinkIcon /></a>
            <a href={set.youtubeUrl} target="_blank" rel="noreferrer" style={{ ...S.btn, background: '#dc2626' }}>YouTube <ExternalLinkIcon /></a>
            <a href={set.mixcloudUrl} target="_blank" rel="noreferrer" style={{ ...S.btn, background: '#5000ff' }}>Mixcloud <ExternalLinkIcon /></a>
          </div>
        </div>
      ))}

      <div style={{ ...styles.subLabel, marginTop: 12 }}>Upcoming Shows</div>
      {dj.upcomingShows.map((show, i) => (
        <div key={i} style={styles.showRow}>
          <div>
            <span style={{ fontSize: 13, color: '#d1d5db' }}>{show.venue}</span>
            <span style={{ fontSize: 12, color: '#6b7280', marginLeft: 8 }}>{show.date}</span>
          </div>
          <a href={show.tickets} target="_blank" rel="noreferrer" style={{ ...S.btn, background: '#0ea5e9', padding: '4px 10px' }}>
            Tickets <ExternalLinkIcon />
          </a>
        </div>
      ))}
    </div>
  );
}

const styles = {
  subLabel: {
    fontSize: 11,
    fontWeight: 700,
    color: '#6b7280',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  setCard: {
    background: '#0d1117',
    borderRadius: 8,
    padding: '10px 12px',
    marginBottom: 8,
  },
  setHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  setTitle: {
    fontSize: 13,
    color: '#d1d5db',
    fontWeight: 600,
  },
  setDuration: {
    fontSize: 11,
    color: '#6b7280',
    whiteSpace: 'nowrap',
    marginLeft: 8,
  },
  showRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
};
