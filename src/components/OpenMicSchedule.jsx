import { useState, useMemo } from 'react';
import { S } from '../styles';
import { ExternalLinkIcon } from './Icons';
import { bluesOpenMics } from '../data/static-events';

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const DAY_FULL = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const AREA_ORDER = ['North Austin', 'Central Austin', 'South Austin'];

function OpenMicCard({ mic }) {
  return (
    <div style={styles.card}>
      <div style={styles.cardHeader}>
        <div>
          <span style={styles.micName}>{mic.name}</span>
          {mic.host && <span style={styles.host}> — hosted by {mic.host}</span>}
        </div>
        <span style={styles.coverBadge}>{mic.cover}</span>
      </div>
      <a href={mic.venueUrl} target="_blank" rel="noreferrer" style={styles.venue}>
        {mic.venue} <ExternalLinkIcon />
      </a>
      <div style={styles.time}>{mic.time}</div>
      <div style={styles.details}>{mic.details}</div>
    </div>
  );
}

export default function OpenMicSchedule() {
  // Start on today's day of week
  const todayIndex = new Date().getDay();
  const [selectedDay, setSelectedDay] = useState(todayIndex);

  const micsByDay = useMemo(() => {
    const grouped = {};
    for (const mic of bluesOpenMics) {
      if (!grouped[mic.dayIndex]) grouped[mic.dayIndex] = [];
      grouped[mic.dayIndex].push(mic);
    }
    return grouped;
  }, []);

  const dayMics = micsByDay[selectedDay] || [];

  return (
    <div>
      {/* Day-of-week picker */}
      <div style={styles.dayPicker}>
        {DAY_NAMES.map((name, i) => {
          const count = (micsByDay[i] || []).length;
          const isSelected = i === selectedDay;
          const isToday = i === todayIndex;

          return (
            <button
              key={i}
              onClick={() => setSelectedDay(i)}
              style={{
                ...styles.dayBtn,
                ...(isSelected ? styles.dayBtnActive : {}),
                ...(isToday && !isSelected ? styles.dayBtnToday : {}),
              }}
            >
              <div style={styles.dayLabel}>{name}</div>
              {count > 0 && <div style={styles.countBadge}>{count}</div>}
            </button>
          );
        })}
      </div>

      {/* Open mics for selected day, grouped by area */}
      {dayMics.length === 0 ? (
        <div style={styles.noData}>
          <div style={styles.noDataTitle}>No open mics on {DAY_FULL[selectedDay]}s</div>
          <div style={styles.noDataSub}>Try another day — most jams are early in the week.</div>
        </div>
      ) : (
        AREA_ORDER.map(area => {
          const areaMics = dayMics.filter(m => m.area === area);
          if (areaMics.length === 0) return null;
          return (
            <div key={area}>
              <div style={styles.areaLabel}>{area}</div>
              {areaMics.map(mic => <OpenMicCard key={mic.id} mic={mic} />)}
            </div>
          );
        })
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
    minWidth: 44,
    padding: '8px 4px',
    background: '#1a1610',
    border: '1px solid #2a2018',
    borderRadius: 8,
    cursor: 'pointer',
    textAlign: 'center',
    transition: 'all 0.15s',
  },
  dayBtnActive: {
    background: '#2d1810',
    border: '1px solid #c2956b',
  },
  dayBtnToday: {
    borderColor: '#4b3a25',
  },
  dayLabel: {
    fontSize: 11,
    fontWeight: 700,
    color: '#8b7355',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  countBadge: {
    fontSize: 9,
    fontWeight: 700,
    background: '#c2956b',
    color: '#000',
    borderRadius: 8,
    padding: '1px 5px',
    marginTop: 4,
    display: 'inline-block',
  },
  areaLabel: {
    fontSize: 10,
    fontWeight: 700,
    color: '#6b7280',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    marginBottom: 8,
    marginTop: 12,
    paddingBottom: 4,
    borderBottom: '1px solid #1a1610',
  },
  card: {
    background: '#111210',
    border: '1px solid #2d1810',
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  micName: {
    fontSize: 14,
    fontWeight: 700,
    color: '#f9fafb',
  },
  host: {
    fontSize: 12,
    color: '#9ca3af',
    fontStyle: 'italic',
  },
  venue: {
    fontSize: 13,
    fontWeight: 600,
    color: '#c2956b',
    textDecoration: 'none',
  },
  time: {
    fontSize: 11,
    color: '#6b7280',
    marginTop: 3,
  },
  details: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 6,
    lineHeight: 1.4,
  },
  coverBadge: {
    fontSize: 11,
    fontWeight: 700,
    background: '#065f46',
    color: '#6ee7b7',
    borderRadius: 4,
    padding: '2px 8px',
    whiteSpace: 'nowrap',
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
