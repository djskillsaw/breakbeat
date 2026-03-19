import { useState, useCallback } from 'react';
import { S } from './styles';
import { genreCategories } from './data/static-tracks';
import { bluesVenues, bluesCalendars } from './data/static-events';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useChartData } from './hooks/useChartData';
import StatusBar from './components/StatusBar';
import { CuratedTrackCard, LiveTrackCard } from './components/TrackCard';
import BluesVenueCard from './components/BluesVenueCard';
import { ExternalLinkIcon } from './components/Icons';

const TAB_NAMES = ['Charts', 'Venues', 'Saved'];

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
              {/* Congress Bridge */}
              <rect x="0" y="90" width="680" height="30" fill="#c2956b" />
              {/* Buildings */}
              <rect x="40" y="50" width="30" height="70" fill="#c2956b" />
              <rect x="80" y="35" width="25" height="85" fill="#c2956b" />
              <rect x="115" y="55" width="20" height="65" fill="#c2956b" />
              {/* Frost Tower */}
              <rect x="160" y="10" width="28" height="110" fill="#c2956b" />
              <polygon points="160,10 174,0 188,10" fill="#c2956b" />
              {/* The Austonian */}
              <rect x="200" y="15" width="22" height="105" fill="#c2956b" />
              {/* Capitol dome */}
              <rect x="260" y="45" width="50" height="75" fill="#c2956b" />
              <ellipse cx="285" cy="45" rx="20" ry="12" fill="#c2956b" />
              <rect x="282" y="28" width="6" height="17" fill="#c2956b" />
              {/* More buildings */}
              <rect x="330" y="40" width="20" height="80" fill="#c2956b" />
              <rect x="360" y="55" width="30" height="65" fill="#c2956b" />
              <rect x="400" y="30" width="24" height="90" fill="#c2956b" />
              <rect x="440" y="50" width="18" height="70" fill="#c2956b" />
              {/* Guitar silhouette */}
              <ellipse cx="540" cy="72" rx="18" ry="24" fill="#c2956b" />
              <ellipse cx="540" cy="50" rx="14" ry="18" fill="#c2956b" />
              <rect x="537" y="28" width="6" height="45" fill="#c2956b" />
              <rect x="535" y="18" width="10" height="14" fill="#c2956b" />
              {/* Boot */}
              <path d="M600,90 L600,65 L610,60 L620,65 L620,80 L640,85 L640,90 Z" fill="#c2956b" />
              {/* Bat silhouettes */}
              <path d="M150,85 Q155,78 160,85 Q165,78 170,85" fill="#c2956b" />
              <path d="M480,75 Q484,70 488,75 Q492,70 496,75" fill="#c2956b" />
              <path d="M510,68 Q513,63 516,68 Q519,63 522,68" fill="#c2956b" />
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
            <div style={BS.sectionLabel}>{'\ud83c\udfb6'} Austin Blues Venues & Upcoming Shows</div>
            {bluesVenues.map(venue => (
              <BluesVenueCard key={venue.id} venue={venue} />
            ))}
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

        {/* Tab 2: Saved */}
        {tab === 2 && (
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
  footer: { textAlign: 'center', fontSize: 11, color: '#374151', padding: '24px 16px 0', borderTop: '1px solid #1a1008' },
};
