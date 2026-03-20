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

              {/* UT Tower — architecturally accurate 4-section tiered tower */}
              {/* Section 1: Main Building base — wide rusticated limestone */}
              <rect x="15" y="75" width="70" height="20" fill="#c2956b" />
              {/* Base entrance portico suggestion */}
              <rect x="35" y="72" width="30" height="5" fill="#c2956b" />
              {/* Attic story / President's office with hipped roof */}
              <polygon points="22,75 25,70 75,70 78,75" fill="#c2956b" />
              <rect x="28" y="70" width="44" height="6" fill="#c2956b" />
              {/* Section 2: Tower shaft — 17 plain stories */}
              <rect x="38" y="30" width="24" height="42" fill="#c2956b" />
              {/* Subtle floor lines on shaft */}
              <rect x="38" y="40" width="24" height="0.8" fill="#0c0a08" opacity="0.15" />
              <rect x="38" y="48" width="24" height="0.8" fill="#0c0a08" opacity="0.15" />
              <rect x="38" y="56" width="24" height="0.8" fill="#0c0a08" opacity="0.15" />
              {/* Section 3: Clock level — wider with broken pediment frames */}
              <rect x="35" y="24" width="30" height="8" fill="#c2956b" />
              {/* Clock faces (circles on two visible sides) */}
              <circle cx="42" cy="28" r="2.5" fill="#0c0a08" opacity="0.25" />
              <circle cx="58" cy="28" r="2.5" fill="#0c0a08" opacity="0.25" />
              {/* Broken pediments above clocks */}
              <polygon points="37,24 42,20 44,24" fill="#c2956b" />
              <polygon points="56,24 58,20 63,24" fill="#c2956b" />
              {/* Section 4: Bell level with Doric columns */}
              <rect x="37" y="16" width="26" height="6" fill="#c2956b" />
              {/* Column gaps in bell level */}
              <rect x="40" y="16" width="1" height="5" fill="#0c0a08" opacity="0.3" />
              <rect x="44" y="16" width="1" height="5" fill="#0c0a08" opacity="0.3" />
              <rect x="48" y="16" width="1" height="5" fill="#0c0a08" opacity="0.3" />
              <rect x="52" y="16" width="1" height="5" fill="#0c0a08" opacity="0.3" />
              <rect x="56" y="16" width="1" height="5" fill="#0c0a08" opacity="0.3" />
              <rect x="60" y="16" width="1" height="5" fill="#0c0a08" opacity="0.3" />
              {/* Observation deck platform */}
              <rect x="34" y="14" width="32" height="3" fill="#c2956b" />
              {/* Corner turrets / finials */}
              <rect x="34" y="10" width="3" height="5" fill="#c2956b" />
              <rect x="63" y="10" width="3" height="5" fill="#c2956b" />
              {/* Gold leaf garland band */}
              <rect x="36" y="14" width="28" height="1" fill="#c2956b" />
              {/* Central finial spire */}
              <rect x="49" y="6" width="2" height="9" fill="#c2956b" />
              <polygon points="48,6 50,2 52,6" fill="#c2956b" />
              {/* Column suggestions on Main Building base */}
              <rect x="20" y="75" width="1.2" height="18" fill="#0c0a08" opacity="0.2" />
              <rect x="28" y="75" width="1.2" height="18" fill="#0c0a08" opacity="0.2" />
              <rect x="36" y="75" width="1.2" height="18" fill="#0c0a08" opacity="0.2" />
              <rect x="63" y="75" width="1.2" height="18" fill="#0c0a08" opacity="0.2" />
              <rect x="71" y="75" width="1.2" height="18" fill="#0c0a08" opacity="0.2" />
              <rect x="79" y="75" width="1.2" height="18" fill="#0c0a08" opacity="0.2" />

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

              {/* Texas State Capitol — architecturally accurate Italian Renaissance Revival */}
              {/* East wing (3 stories) */}
              <rect x="405" y="72" width="28" height="23" fill="#c2956b" />
              {/* West wing (3 stories) */}
              <rect x="467" y="72" width="28" height="23" fill="#c2956b" />
              {/* Central block (4 stories, taller than wings) */}
              <rect x="425" y="62" width="50" height="33" fill="#c2956b" />
              {/* Portico / front porch with pediment */}
              <polygon points="430,62 450,56 470,62" fill="#c2956b" />
              {/* Portico columns */}
              <rect x="434" y="62" width="1.2" height="15" fill="#0c0a08" opacity="0.25" />
              <rect x="440" y="62" width="1.2" height="15" fill="#0c0a08" opacity="0.25" />
              <rect x="446" y="62" width="1.2" height="15" fill="#0c0a08" opacity="0.25" />
              <rect x="452" y="62" width="1.2" height="15" fill="#0c0a08" opacity="0.25" />
              <rect x="458" y="62" width="1.2" height="15" fill="#0c0a08" opacity="0.25" />
              <rect x="464" y="62" width="1.2" height="15" fill="#0c0a08" opacity="0.25" />
              {/* Entablature / cornice above central block */}
              <rect x="423" y="60" width="54" height="2.5" fill="#c2956b" />
              {/* Rotunda drum — cylindrical base with Corinthian columns */}
              <rect x="435" y="48" width="30" height="13" fill="#c2956b" />
              {/* Drum column gaps */}
              <rect x="438" y="49" width="0.8" height="11" fill="#0c0a08" opacity="0.2" />
              <rect x="442" y="49" width="0.8" height="11" fill="#0c0a08" opacity="0.2" />
              <rect x="446" y="49" width="0.8" height="11" fill="#0c0a08" opacity="0.2" />
              <rect x="450" y="49" width="0.8" height="11" fill="#0c0a08" opacity="0.2" />
              <rect x="454" y="49" width="0.8" height="11" fill="#0c0a08" opacity="0.2" />
              <rect x="458" y="49" width="0.8" height="11" fill="#0c0a08" opacity="0.2" />
              <rect x="462" y="49" width="0.8" height="11" fill="#0c0a08" opacity="0.2" />
              {/* Drum balcony/cornice */}
              <rect x="434" y="47" width="32" height="2" fill="#c2956b" />
              {/* Dome — smooth hemispherical curve using path */}
              <path d="M436,48 Q436,34 450,30 Q464,34 464,48 Z" fill="#c2956b" />
              {/* Dome ribs suggestion */}
              <line x1="450" y1="30" x2="450" y2="48" stroke="#0c0a08" strokeWidth="0.5" opacity="0.12" />
              <line x1="443" y1="36" x2="440" y2="48" stroke="#0c0a08" strokeWidth="0.5" opacity="0.12" />
              <line x1="457" y1="36" x2="460" y2="48" stroke="#0c0a08" strokeWidth="0.5" opacity="0.12" />
              {/* Lantern / cupola — slender columned structure */}
              <rect x="446" y="24" width="8" height="7" fill="#c2956b" />
              {/* Lantern column gaps */}
              <rect x="448" y="25" width="0.6" height="5" fill="#0c0a08" opacity="0.25" />
              <rect x="451" y="25" width="0.6" height="5" fill="#0c0a08" opacity="0.25" />
              {/* Lantern cap */}
              <path d="M445,24 Q445,21 450,19 Q455,21 455,24 Z" fill="#c2956b" />
              {/* Goddess of Liberty statue */}
              {/* Body */}
              <rect x="449" y="13" width="2" height="6" fill="#c2956b" />
              {/* Head */}
              <circle cx="450" cy="12" r="1.5" fill="#c2956b" />
              {/* Upraised arm with star */}
              <line x1="450" y1="14" x2="452" y2="11" stroke="#c2956b" strokeWidth="1" />
              <polygon points="452,9 452.8,10.5 451.2,10.5" fill="#c2956b" />
              {/* Wing details on east/west wings */}
              <rect x="410" y="72" width="1" height="20" fill="#0c0a08" opacity="0.15" />
              <rect x="417" y="72" width="1" height="20" fill="#0c0a08" opacity="0.15" />
              <rect x="424" y="72" width="1" height="20" fill="#0c0a08" opacity="0.15" />
              <rect x="475" y="72" width="1" height="20" fill="#0c0a08" opacity="0.15" />
              <rect x="482" y="72" width="1" height="20" fill="#0c0a08" opacity="0.15" />
              <rect x="489" y="72" width="1" height="20" fill="#0c0a08" opacity="0.15" />

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
