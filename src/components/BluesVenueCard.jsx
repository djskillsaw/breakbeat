import { ExternalLinkIcon } from './Icons';
import { S } from '../styles';

function ShowRow({ show }) {
  const isFree = show.cover === 'Free';

  return (
    <div style={showRow}>
      <div style={showRowHeader}>
        <div>
          <span style={showDate}>{show.date}</span>
          <span style={showDoors}>Doors {show.doors}</span>
        </div>
        <span style={{ ...coverBadge, ...(isFree ? coverFree : {}) }}>{show.cover}</span>
      </div>
      <div style={showHeadliner}>{show.headliner}</div>
      {show.opener && (
        <div style={showOpener}>w/ {show.opener}</div>
      )}
      <div style={{ ...S.btnRow, marginTop: 8 }}>
        <a href={show.ticketUrl} target="_blank" rel="noreferrer" style={{ ...S.btn, background: '#92400e', fontSize: 11 }}>
          Tickets <ExternalLinkIcon />
        </a>
        {show.spotifyUrl && (
          <a href={show.spotifyUrl} target="_blank" rel="noreferrer" style={{ ...S.btn, background: '#1db954', fontSize: 11 }}>
            Spotify <ExternalLinkIcon />
          </a>
        )}
        {show.youtubeUrl && (
          <a href={show.youtubeUrl} target="_blank" rel="noreferrer" style={{ ...S.btn, background: '#cc0000', fontSize: 11 }}>
            YouTube <ExternalLinkIcon />
          </a>
        )}
      </div>
    </div>
  );
}

export default function BluesVenueCard({ venue }) {
  return (
    <div style={venueCard}>
      {/* Venue header */}
      <div style={venueHeader}>
        <div>
          <a href={venue.venueUrl} target="_blank" rel="noreferrer" style={venueName}>
            {venue.venue} <ExternalLinkIcon />
          </a>
          <div style={venueAddress}>{venue.address}</div>
        </div>
      </div>
      <div style={S.vibe}>{venue.details}</div>

      {/* Upcoming shows */}
      {venue.upcomingShows?.length > 0 && (
        <div style={showsSection}>
          <div style={showsSectionLabel}>UPCOMING SHOWS</div>
          {venue.upcomingShows.map((show, i) => (
            <ShowRow key={i} show={show} />
          ))}
        </div>
      )}

      {/* Venue links */}
      <div style={{ ...S.btnRow, marginTop: 12 }}>
        <a href={venue.instagram} target="_blank" rel="noreferrer" style={{ ...S.btn, background: '#7c3aed' }}>Instagram <ExternalLinkIcon /></a>
        <a href={venue.calendarUrl} target="_blank" rel="noreferrer" style={{ ...S.btn, background: '#374151' }}>Full Calendar <ExternalLinkIcon /></a>
      </div>
    </div>
  );
}

const venueCard = {
  background: '#111210',
  border: '1px solid #2d1810',
  borderRadius: 10,
  padding: 16,
  marginBottom: 16,
};

const venueHeader = {
  marginBottom: 8,
};

const venueName = {
  fontSize: 16,
  fontWeight: 700,
  color: '#c2956b',
  textDecoration: 'none',
};

const venueAddress = {
  fontSize: 12,
  color: '#6b7280',
  marginTop: 3,
};

const showsSection = {
  borderTop: '1px solid #1f1812',
  marginTop: 8,
  paddingTop: 10,
};

const showsSectionLabel = {
  fontSize: 10,
  fontWeight: 700,
  color: '#6b5b3e',
  letterSpacing: '0.1em',
  marginBottom: 10,
};

const showRow = {
  background: '#1a1610',
  border: '1px solid #2a2018',
  borderRadius: 8,
  padding: '10px 12px',
  marginBottom: 8,
};

const showRowHeader = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 4,
};

const showDate = {
  fontSize: 11,
  fontWeight: 700,
  color: '#8b7355',
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
};

const showDoors = {
  fontSize: 11,
  color: '#4b5563',
  marginLeft: 10,
};

const coverBadge = {
  fontSize: 11,
  fontWeight: 700,
  background: '#92400e',
  color: '#fbbf24',
  borderRadius: 4,
  padding: '2px 8px',
};

const coverFree = {
  background: '#065f46',
  color: '#6ee7b7',
};

const showHeadliner = {
  fontSize: 14,
  fontWeight: 700,
  color: '#f9fafb',
};

const showOpener = {
  fontSize: 12,
  color: '#9ca3af',
  marginTop: 2,
  fontStyle: 'italic',
};
