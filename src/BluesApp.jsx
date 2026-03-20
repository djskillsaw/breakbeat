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
              {/* Lady Bird Lake / ground */}
              <rect x="0" y="100" width="680" height="20" fill="#c2956b" />
              {/* Congress Ave Bridge arches */}
              <rect x="0" y="95" width="680" height="6" fill="#c2956b" />
              <ellipse cx="85" cy="95" rx="30" ry="6" fill="#0c0a08" />
              <ellipse cx="170" cy="95" rx="30" ry="6" fill="#0c0a08" />
              <ellipse cx="255" cy="95" rx="30" ry="6" fill="#0c0a08" />
              <ellipse cx="340" cy="95" rx="30" ry="6" fill="#0c0a08" />
              <ellipse cx="425" cy="95" rx="30" ry="6" fill="#0c0a08" />
              <ellipse cx="510" cy="95" rx="30" ry="6" fill="#0c0a08" />
              <ellipse cx="595" cy="95" rx="30" ry="6" fill="#0c0a08" />

              {/* UT Tower — wide base building with iconic tiered tower */}
              {/* Main Building base (wide) */}
              <rect x="20" y="72" width="60" height="23" fill="#c2956b" />
              {/* Tower shaft rising from center of base */}
              <rect x="40" y="32" width="20" height="42" fill="#c2956b" />
              {/* Observation deck / balcony ledge */}
              <rect x="37" y="32" width="26" height="3" fill="#c2956b" />
              {/* Upper tier narrows */}
              <rect x="43" y="22" width="14" height="12" fill="#c2956b" />
              <rect x="41" y="22" width="18" height="2" fill="#c2956b" />
              {/* Clock / lantern top section */}
              <rect x="46" y="14" width="8" height="10" fill="#c2956b" />
              {/* Finial spire */}
              <rect x="49" y="8" width="2" height="7" fill="#c2956b" />
              {/* Columns suggestion on base */}
              <rect x="25" y="72" width="2" height="20" fill="#0c0a08" opacity="0.3" />
              <rect x="33" y="72" width="2" height="20" fill="#0c0a08" opacity="0.3" />
              <rect x="65" y="72" width="2" height="20" fill="#0c0a08" opacity="0.3" />
              <rect x="73" y="72" width="2" height="20" fill="#0c0a08" opacity="0.3" />

              {/* Small building cluster left of center */}
              <rect x="82" y="62" width="18" height="33" fill="#c2956b" />
              <rect x="106" y="55" width="14" height="40" fill="#c2956b" />

              {/* The Independent (Jenga tower) — tallest, offset stacking */}
              <rect x="138" y="12" width="22" height="83" fill="#c2956b" />
              <rect x="135" y="12" width="28" height="6" fill="#c2956b" />
              <rect x="140" y="22" width="24" height="6" fill="#c2956b" />
              <rect x="136" y="34" width="26" height="6" fill="#c2956b" />
              <rect x="141" y="46" width="22" height="6" fill="#c2956b" />

              {/* 360 Condos — tall glass slab */}
              <rect x="178" y="22" width="20" height="73" fill="#c2956b" />

              {/* One Congress Plaza — stepped profile */}
              <rect x="210" y="50" width="28" height="45" fill="#c2956b" />
              <rect x="214" y="42" width="20" height="10" fill="#c2956b" />
              <rect x="218" y="36" width="12" height="8" fill="#c2956b" />

              {/* The Austonian — tall elliptical tower on Congress */}
              <ellipse cx="270" cy="55" rx="11" ry="42" fill="#c2956b" />
              <rect x="259" y="70" width="22" height="25" fill="#c2956b" />

              {/* Frost Bank Tower — iconic jagged crown */}
              <rect x="300" y="28" width="24" height="67" fill="#c2956b" />
              <polygon points="300,28 312,10 324,28" fill="#c2956b" />
              <polygon points="300,28 306,18 312,28" fill="#c2956b" />
              <polygon points="312,28 318,18 324,28" fill="#c2956b" />

              {/* Mid-rise filler buildings */}
              <rect x="336" y="52" width="16" height="43" fill="#c2956b" />
              <rect x="358" y="45" width="14" height="50" fill="#c2956b" />
              <rect x="380" y="58" width="20" height="37" fill="#c2956b" />

              {/* Texas State Capitol — wide wings, rotunda, dome, statue */}
              {/* East and West wings */}
              <rect x="408" y="68" width="84" height="27" fill="#c2956b" />
              {/* Central section rises higher */}
              <rect x="428" y="58" width="44" height="37" fill="#c2956b" />
              {/* Entablature / cornice line */}
              <rect x="426" y="56" width="48" height="3" fill="#c2956b" />
              {/* Rotunda drum */}
              <rect x="436" y="46" width="28" height="12" fill="#c2956b" />
              {/* Lower dome curve */}
              <ellipse cx="450" cy="46" rx="16" ry="8" fill="#c2956b" />
              {/* Upper dome */}
              <ellipse cx="450" cy="40" rx="11" ry="7" fill="#c2956b" />
              {/* Dome lantern / cupola */}
              <rect x="447" y="30" width="6" height="10" fill="#c2956b" />
              {/* Goddess of Liberty statue */}
              <rect x="449" y="22" width="2" height="9" fill="#c2956b" />
              <ellipse cx="450" cy="21" rx="2" ry="3" fill="#c2956b" />
              {/* Star at very top */}
              <polygon points="450,16 451,18 453,18 451.5,19.5 452,22 450,20.5 448,22 448.5,19.5 447,18 449,18" fill="#c2956b" />
              {/* Column suggestions on facade */}
              <rect x="432" y="58" width="1.5" height="14" fill="#0c0a08" opacity="0.3" />
              <rect x="440" y="58" width="1.5" height="14" fill="#0c0a08" opacity="0.3" />
              <rect x="448" y="58" width="1.5" height="14" fill="#0c0a08" opacity="0.3" />
              <rect x="456" y="58" width="1.5" height="14" fill="#0c0a08" opacity="0.3" />
              <rect x="464" y="58" width="1.5" height="14" fill="#0c0a08" opacity="0.3" />

              {/* Right-side office towers */}
              <rect x="488" y="48" width="18" height="47" fill="#c2956b" />
              <rect x="514" y="40" width="16" height="55" fill="#c2956b" />
              <rect x="538" y="55" width="20" height="40" fill="#c2956b" />
              <rect x="566" y="50" width="14" height="45" fill="#c2956b" />
              <rect x="590" y="60" width="18" height="35" fill="#c2956b" />
              <rect x="618" y="65" width="14" height="30" fill="#c2956b" />
              <rect x="642" y="70" width="18" height="25" fill="#c2956b" />

              {/* Congress Ave Bridge bats */}
              <path d="M180,18 Q185,11 190,18 Q195,11 200,18" fill="#c2956b" />
              <path d="M350,12 Q354,6 358,12 Q362,6 366,12" fill="#c2956b" />
              <path d="M520,15 Q523,9 526,15 Q529,9 532,15" fill="#c2956b" />
              <path d="M440,8 Q443,3 446,8 Q449,3 452,8" fill="#c2956b" />
              <path d="M270,6 Q272,2 274,6 Q276,2 278,6" fill="#c2956b" />
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
