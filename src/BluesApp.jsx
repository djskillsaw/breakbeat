import { useState, useCallback } from 'react';
import { S } from './styles';
import { genreCategories } from './data/static-tracks';
import { bluesVenues, bluesCalendars } from './data/static-events';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useChartData } from './hooks/useChartData';
import StatusBar from './components/StatusBar';
import { CuratedTrackCard, LiveTrackCard } from './components/TrackCard';
import WeeklyCalendar from './components/WeeklyCalendar';
import OpenMicSchedule from './components/OpenMicSchedule';
import { ExternalLinkIcon } from './components/Icons';

const TAB_NAMES = ['Charts', 'Venues', 'Open Mics', 'Saved'];

const bluesCategory = genreCategories.find(c => c.id === 'blues');

export default function BluesApp() {
  const [tab, setTab] = useState(0);
  const [savedTracks, setSavedTracks] = useLocalStorage('blues-savedTracks', []);

  const {
    liveCharts, lastUpdated, previousRanks, isLoading, error,
    autoRefresh, refreshInterval, refresh, setAutoRefresh,
    availableSources, activeSources,
  } = useChartData();

  const toggleTrack = useCallback((id) => {
    setSavedTracks(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  }, [setSavedTracks]);

  const savedTrackObjects = bluesCategory ? bluesCategory.tracks.filter(t => savedTracks.includes(t.id)) : [];
  const savedCount = savedTracks.length;

  return (
    <div style={BS.container}>
      {/* Header */}
      <div style={BS.header}>
        {/* Austin Hero Banner */}
        <div style={BS.hero}>
          <div style={BS.heroSkyline}>
            <svg viewBox="0 0 680 120" style={{ width: '100%', height: 120, opacity: 0.18 }}>
              {/* Ground / Congress Bridge */}
              <rect x="0" y="95" width="680" height="25" fill="#c2956b" />

              {/* — Left cluster — */}
              <rect x="30" y="52" width="28" height="68" fill="#c2956b" />
              <rect x="65" y="38" width="22" height="82" fill="#c2956b" />
              <rect x="95" y="58" width="18" height="62" fill="#c2956b" />

              {/* Frost Tower */}
              <rect x="135" y="12" width="26" height="108" fill="#c2956b" />
              <polygon points="135,12 148,0 161,12" fill="#c2956b" />

              {/* The Austonian */}
              <rect x="175" y="18" width="20" height="102" fill="#c2956b" />

              {/* Guitar neck as a tall building, body fades into roofline */}
              <rect x="210" y="8" width="8" height="62" fill="#c2956b" />
              <rect x="206" y="4" width="16" height="10" rx="2" fill="#c2956b" />
              <ellipse cx="214" cy="82" rx="16" ry="20" fill="#c2956b" />
              <ellipse cx="214" cy="62" rx="12" ry="14" fill="#c2956b" />
              {/* Sound hole */}
              <ellipse cx="214" cy="82" rx="5" ry="5" fill="#0c0a08" />

              {/* Capitol dome */}
              <rect x="260" y="48" width="48" height="72" fill="#c2956b" />
              <ellipse cx="284" cy="48" rx="19" ry="11" fill="#c2956b" />
              <rect x="281" y="32" width="6" height="16" fill="#c2956b" />

              {/* Mid buildings */}
              <rect x="325" y="42" width="20" height="78" fill="#c2956b" />
              <rect x="355" y="56" width="28" height="64" fill="#c2956b" />
              <rect x="395" y="34" width="22" height="86" fill="#c2956b" />

              {/* Boot integrated as a building / water tower shape */}
              <rect x="435" y="50" width="14" height="65" fill="#c2956b" />
              <path d="M432,50 L432,44 Q442,36 452,44 L452,50" fill="#c2956b" />
              <path d="M435,95 L435,88 Q442,84 449,88 L449,95 L462,95 L462,100 L432,100 L432,95 Z" fill="#c2956b" />

              {/* Right cluster */}
              <rect x="480" y="45" width="18" height="75" fill="#c2956b" />
              <rect x="508" y="55" width="24" height="65" fill="#c2956b" />
              <rect x="545" y="40" width="20" height="80" fill="#c2956b" />
              <rect x="575" y="60" width="16" height="60" fill="#c2956b" />
              <rect x="605" y="50" width="22" height="70" fill="#c2956b" />
              <rect x="640" y="62" width="18" height="58" fill="#c2956b" />

              {/* Bat silhouettes scattered above skyline */}
              <path d="M150,30 Q155,23 160,30 Q165,23 170,30" fill="#c2956b" />
              <path d="M380,20 Q384,14 388,20 Q392,14 396,20" fill="#c2956b" />
              <path d="M520,25 Q523,19 526,25 Q529,19 532,25" fill="#c2956b" />
              <path d="M280,18 Q283,13 286,18 Q289,13 292,18" fill="#c2956b" />
            </svg>
          </div>
          <div style={BS.heroTitle}>AUSTIN BLUES DIGEST</div>
          <div style={BS.heroSub}>Live Music Capital of the World</div>
        </div>
      </div>

      {/* Tabs */}
      <div style={BS.tabBar}>
        {TAB_NAMES.map((name, i) => (
          <button key={name} onClick={() => setTab(i)} style={{ ...BS.tab, ...(tab === i ? BS.tabActive : {}) }}>
            {name}
            {name === 'Saved' && savedCount > 0 && <span style={BS.badge}>{savedCount}</span>}
          </button>
        ))}
      </div>

      {/* Status Bar */}
      <StatusBar
        lastUpdated={lastUpdated}
        isLoading={isLoading}
        error={error}
        autoRefresh={autoRefresh}
        refreshInterval={refreshInterval}
        onRefresh={refresh}
        onToggleAutoRefresh={setAutoRefresh}
        availableSources={availableSources}
        activeSources={activeSources}
      />

      {/* Content */}
      <div style={S.content}>

        {/* Tab 0: Charts */}
        {tab === 0 && (
          <>
            {/* Live Charts */}
            {liveCharts.blues?.length > 0 && (
              <div>
                <div style={BS.sectionLabel}>{'\ud83c\udfb5'} Live Blues Charts</div>
                {liveCharts.blues.map(track => (
                  <LiveTrackCard
                    key={track.id}
                    track={track}
                    rank={track.rank}
                    previousRank={previousRanks[track.id]}
                    lastUpdated={lastUpdated}
                  />
                ))}
              </div>
            )}

            {/* Curated Picks */}
            {bluesCategory && (
              <div>
                <div style={BS.sectionLabel}>{'\ud83c\udfb8'} Curated Picks</div>
                {bluesCategory.tracks.map(track => (
                  <CuratedTrackCard key={track.id} track={track} saved={savedTracks.includes(track.id)} onToggleSave={toggleTrack} />
                ))}
              </div>
            )}
          </>
        )}

        {/* Tab 1: Venues & Shows */}
        {tab === 1 && (
          <>
            <div style={BS.sectionLabel}>{'\ud83c\udfb6'} This Week in Austin Blues</div>
            <WeeklyCalendar />

            {/* Venue directory */}
            <div style={{ ...BS.sectionLabel, marginTop: 24 }}>{'\ud83d\udccd'} Venue Directory</div>
            {['North Austin', 'Central Austin', 'South Austin'].map(area => {
              const areaVenues = bluesVenues.filter(v => v.area === area);
              if (areaVenues.length === 0) return null;
              return (
                <div key={area}>
                  <div style={BS.areaLabel}>{area}</div>
                  {areaVenues.map(venue => (
                    <div key={venue.id} style={venueInfoCard}>
                      <a href={venue.venueUrl} target="_blank" rel="noreferrer" style={{ fontSize: 15, fontWeight: 700, color: '#c2956b', textDecoration: 'none' }}>
                        {venue.venue} <ExternalLinkIcon />
                      </a>
                      <div style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>{venue.address}</div>
                      <div style={{ fontSize: 12, color: '#6b7280', fontStyle: 'italic', marginTop: 4, marginBottom: 8 }}>{venue.details}</div>
                      <div style={S.btnRow}>
                        <a href={venue.instagram} target="_blank" rel="noreferrer" style={{ ...S.btn, background: '#7c3aed', fontSize: 11 }}>Instagram <ExternalLinkIcon /></a>
                        <a href={venue.calendarUrl} target="_blank" rel="noreferrer" style={{ ...S.btn, background: '#374151', fontSize: 11 }}>Full Calendar <ExternalLinkIcon /></a>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })}

            <div style={{ ...BS.sectionLabel, marginTop: 16 }}>{'\ud83d\udcc5'} Blues Event Calendars</div>
            <div style={S.btnRow}>
              {bluesCalendars.map(cal => (
                <a key={cal.url} href={cal.url} target="_blank" rel="noreferrer" style={{ ...S.btn, background: '#374151' }}>
                  {cal.label} <ExternalLinkIcon />
                </a>
              ))}
            </div>
          </>
        )}

        {/* Tab 2: Open Mics */}
        {tab === 2 && (
          <>
            <div style={BS.sectionLabel}>{'\ud83c\udf99\ufe0f'} Open Mic & Jam Nights</div>
            <OpenMicSchedule />
          </>
        )}

        {/* Tab 3: Saved */}
        {tab === 3 && (
          <>
            {savedCount === 0 ? (
              <div style={S.empty}>Nothing saved yet. Star any track to save it here.</div>
            ) : (
              <>
                <div style={BS.sectionLabel}>{'\u2b50'} Saved Tracks</div>
                {savedTrackObjects.map(track => (
                  <CuratedTrackCard key={track.id} track={track} saved onToggleSave={toggleTrack} />
                ))}
              </>
            )}
          </>
        )}
      </div>

      {/* Footer */}
      <div style={BS.footer}>
        Blues charts via Last.fm, Apple Music & Spotify {'\u00b7'} Austin venue guide {'\u00b7'} <a href="." style={{ color: '#c2956b', textDecoration: 'none' }}>Breakbeat Digest</a>
      </div>
    </div>
  );
}

const venueInfoCard = {
  background: '#111210',
  border: '1px solid #2d1810',
  borderRadius: 10,
  padding: 14,
  marginBottom: 10,
};

// Blues-specific styles (warm copper/leather palette)
const BS = {
  container: { minHeight: '100vh', background: '#0a0908', color: '#e5e7eb', fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif", maxWidth: 680, margin: '0 auto', padding: '0 0 60px' },
  header: { borderBottom: '1px solid #2d1810' },
  hero: { background: 'linear-gradient(180deg, #1a0e05 0%, #2d1810 40%, #0a0908 100%)', padding: '0 0 24px', textAlign: 'center', overflow: 'hidden' },
  heroSkyline: { width: '100%' },
  heroTitle: { fontSize: 28, fontWeight: 900, color: '#c2956b', letterSpacing: '0.12em', marginTop: -8, fontFamily: "'Georgia', 'Times New Roman', serif" },
  heroSub: { fontSize: 11, color: '#8b6914', letterSpacing: '0.2em', textTransform: 'uppercase', marginTop: 4 },
  tabBar: { display: 'flex', borderBottom: '1px solid #2d1810', overflowX: 'auto' },
  tab: { padding: '12px 18px', background: 'none', border: 'none', color: '#6b7280', fontSize: 13, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap', borderBottom: '2px solid transparent', position: 'relative' },
  tabActive: { color: '#c2956b', borderBottom: '2px solid #c2956b' },
  badge: { marginLeft: 6, background: '#c2956b', color: '#000', borderRadius: 10, padding: '1px 6px', fontSize: 11, fontWeight: 700 },
  sectionLabel: { fontSize: 11, fontWeight: 700, color: '#8b7355', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 16, marginTop: 8 },
  areaLabel: { fontSize: 10, fontWeight: 700, color: '#6b7280', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8, marginTop: 12, paddingBottom: 4, borderBottom: '1px solid #1a1610' },
  footer: { textAlign: 'center', fontSize: 11, color: '#374151', padding: '24px 16px 0', borderTop: '1px solid #1a1008' },
};
