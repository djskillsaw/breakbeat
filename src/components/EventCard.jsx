import { ExternalLinkIcon } from './Icons';
import { S } from '../styles';

export default function EventCard({ show }) {
  return (
    <div style={S.card}>
      <div style={S.trackTitle}>{show.promoter}</div>
      <a href={show.venueUrl} target="_blank" rel="noreferrer" style={{ color: '#f97316', fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>
        {show.venue} <ExternalLinkIcon />
      </a>
      <div style={{ fontSize: 12, color: '#6b7280', marginTop: 3 }}>{show.address}</div>
      <div style={{ ...S.tags, marginTop: 8 }}>
        <span style={{ ...S.tag, background: '#1e3a5f' }}>{show.date}</span>
      </div>
      <div style={S.vibe}>{show.details}</div>
      <div style={S.btnRow}>
        <a href={show.instagram} target="_blank" rel="noreferrer" style={{ ...S.btn, background: '#7c3aed' }}>Instagram <ExternalLinkIcon /></a>
        <a href={show.tickets} target="_blank" rel="noreferrer" style={{ ...S.btn, background: '#0ea5e9' }}>Find Tickets <ExternalLinkIcon /></a>
      </div>
    </div>
  );
}
