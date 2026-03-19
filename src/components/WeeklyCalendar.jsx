import { useState, useMemo } from 'react';
import { S } from '../styles';
import { ExternalLinkIcon } from './Icons';
import scrapedData from '../data/scraped-shows.json';
import { bluesVenues } from '../data/static-events';

function ShowRow({ show }) {
  const isFree = show.cover === 'Free';

  return (
    <div style={styles.showRow}>
      <div style={styles.showRowHeader}>
        <div>
          <span style={styles.showHeadliner}>{show.headliner}</span>
        </div>
        {show.cover && (
          <span style={{ ...styles.coverBadge, ...(isFree ? styles.coverFree : {}) }}>{show.cover}</span>
        )}
      </div>
      {show.opener && (
        <div style={styles.showOpener}>w/ {show.opener}</div>
      )}
      {show.doors && (
        <div style={styles.showMeta}>Doors {show.doors}</div>
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

function VenueDay({ venue, shows }) {
  if (shows.length === 0) return null;

  return (
    <div style={styles.venueDay}>
      <a href={venue.venueUrl} target="_blank" rel="noreferrer" style={styles.venueName}>
        {venue.venue} <ExternalLinkIcon />
      </a>
      <div style={styles.venueAddress}>{venue.address}</div>
      {shows.map((show, i) => (
        <ShowRow key={i} show={show} />
      ))}
    </div>
  );
}

// Build a lookup from venueId -> venue static info
const venueMap = Object.fromEntries(bluesVenues.map(v => [v.id, v]));

// Build a lookup from venueId -> shows grouped by date
function buildShowsByDate(scrapedVenues) {
  const byDate = {}; // { 'YYYY-MM-DD': { venueId: [shows] } }

  for (const sv of scrapedVenues) {
    for (const show of sv.shows) {
      if (!show.date) continue;
      if (!byDate[show.date]) byDate[show.date] = {};
      if (!byDate[show.date][sv.venueId]) byDate[show.date][sv.venueId] = [];
      byDate[show.date][sv.venueId].push(show);
    }
  }

  return byDate;
}

export default function WeeklyCalendar() {
  const hasData = scrapedData.scrapedAt && scrapedData.venues?.length > 0;

  // Generate the week dates (from scraped data, or compute from today)
  const weekDates = useMemo(() => {
    if (hasData && scrapedData.weekDates?.length > 0) {
      return scrapedData.weekDates;
    }
    // Fallback: generate from today
    const dates = [];
    const now = new Date();
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    for (let i = 0; i < 7; i++) {
      const d = new Date(now);
      d.setDate(d.getDate() + i);
      dates.push({
        iso: d.toISOString().slice(0, 10),
        display: `${days[d.getDay()]} ${months[d.getMonth()]} ${d.getDate()}`,
      });
    }
    return dates;
  }, [hasData]);

  const [selectedDay, setSelectedDay] = useState(0);

  const showsByDate = useMemo(() => {
    if (!hasData) return {};
    return buildShowsByDate(scrapedData.venues);
  }, [hasData]);

  const selectedIso = weekDates[selectedDay]?.iso;
  const dayShows = showsByDate[selectedIso] || {};

  // Count shows per day for the badges
  const showCounts = useMemo(() => {
    return weekDates.map(d => {
      const dayData = showsByDate[d.iso] || {};
      return Object.values(dayData).reduce((sum, arr) => sum + arr.length, 0);
    });
  }, [weekDates, showsByDate]);

  // Get venues that have shows on the selected day
  const venuesWithShows = Object.entries(dayShows)
    .map(([venueId, shows]) => ({ venue: venueMap[venueId], shows }))
    .filter(v => v.venue);

  const scrapedTime = scrapedData.scrapedAt
    ? new Date(scrapedData.scrapedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })
    : null;

  return (
    <div>
      {/* Day picker */}
      <div style={styles.dayPicker}>
        {weekDates.map((d, i) => {
          const parts = d.display.split(' ');
          const dayName = parts[0]; // "Thu"
          const dateNum = parts[2]; // "19"
          const isToday = i === 0;
          const isSelected = i === selectedDay;

          return (
            <button
              key={d.iso}
              onClick={() => setSelectedDay(i)}
              style={{
                ...styles.dayBtn,
                ...(isSelected ? styles.dayBtnActive : {}),
                ...(isToday && !isSelected ? styles.dayBtnToday : {}),
              }}
            >
              <div style={styles.dayName}>{dayName}</div>
              <div style={styles.dayNum}>{dateNum}</div>
              {showCounts[i] > 0 && (
                <div style={styles.showCount}>{showCounts[i]}</div>
              )}
            </button>
          );
        })}
      </div>

      {/* Scrape timestamp */}
      {scrapedTime && (
        <div style={styles.scrapeInfo}>
          Last scraped: {scrapedTime}
        </div>
      )}

      {/* Shows for selected day */}
      {!hasData ? (
        <div style={styles.noData}>
          <div style={styles.noDataTitle}>Waiting for first scrape</div>
          <div style={styles.noDataSub}>
            Show data is updated daily via automated scraping of venue calendars.
            Check the venue calendar links below for current listings.
          </div>
        </div>
      ) : venuesWithShows.length === 0 ? (
        <div style={styles.noData}>
          <div style={styles.noDataTitle}>No shows found for {weekDates[selectedDay]?.display}</div>
          <div style={styles.noDataSub}>
            Try another day, or check the venue calendars directly for the latest info.
          </div>
        </div>
      ) : (
        venuesWithShows.map(({ venue, shows }) => (
          <VenueDay key={venue.id} venue={venue} shows={shows} />
        ))
      )}
    </div>
  );
}

const styles = {
  dayPicker: {
    display: 'flex',
    gap: 6,
    marginBottom: 16,
    overflowX: 'auto',
    paddingBottom: 4,
  },
  dayBtn: {
    flex: '1 0 0',
    minWidth: 56,
    padding: '8px 4px',
    background: '#1a1610',
    border: '1px solid #2a2018',
    borderRadius: 8,
    cursor: 'pointer',
    textAlign: 'center',
    transition: 'all 0.15s',
    position: 'relative',
  },
  dayBtnActive: {
    background: '#2d1810',
    border: '1px solid #c2956b',
  },
  dayBtnToday: {
    borderColor: '#4b3a25',
  },
  dayName: {
    fontSize: 10,
    fontWeight: 700,
    color: '#8b7355',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  dayNum: {
    fontSize: 18,
    fontWeight: 800,
    color: '#e5e7eb',
    marginTop: 2,
  },
  showCount: {
    fontSize: 9,
    fontWeight: 700,
    background: '#c2956b',
    color: '#000',
    borderRadius: 8,
    padding: '1px 5px',
    marginTop: 4,
    display: 'inline-block',
  },
  scrapeInfo: {
    fontSize: 10,
    color: '#4b5563',
    textAlign: 'right',
    marginBottom: 12,
  },
  venueDay: {
    background: '#111210',
    border: '1px solid #2d1810',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
  },
  venueName: {
    fontSize: 16,
    fontWeight: 700,
    color: '#c2956b',
    textDecoration: 'none',
  },
  venueAddress: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 3,
    marginBottom: 10,
  },
  showRow: {
    background: '#1a1610',
    border: '1px solid #2a2018',
    borderRadius: 8,
    padding: '10px 12px',
    marginBottom: 8,
  },
  showRowHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  showHeadliner: {
    fontSize: 14,
    fontWeight: 700,
    color: '#f9fafb',
  },
  showOpener: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 2,
    fontStyle: 'italic',
  },
  showMeta: {
    fontSize: 11,
    color: '#6b7280',
    marginTop: 2,
  },
  coverBadge: {
    fontSize: 11,
    fontWeight: 700,
    background: '#92400e',
    color: '#fbbf24',
    borderRadius: 4,
    padding: '2px 8px',
    whiteSpace: 'nowrap',
  },
  coverFree: {
    background: '#065f46',
    color: '#6ee7b7',
  },
  noData: {
    textAlign: 'center',
    padding: '32px 16px',
  },
  noDataTitle: {
    fontSize: 14,
    fontWeight: 600,
    color: '#8b7355',
    marginBottom: 6,
  },
  noDataSub: {
    fontSize: 12,
    color: '#4b5563',
    lineHeight: 1.5,
  },
};
