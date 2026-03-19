import { useState, useCallback, useMemo } from 'react';
import { S } from './styles';
import { genreCategories } from './data/static-tracks';
import { allMixes, mixGenres } from './data/static-mixes';
import { shows, eventCalendars, bluesVenues, bluesCalendars } from './data/static-events';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useChartData } from './hooks/useChartData';
import StatusBar from './components/StatusBar';
import { CuratedTrackCard, LiveTrackCard } from './components/TrackCard';
import MixCard from './components/MixCard';
import EventCard from './components/EventCard';
import { StarIcon, ExternalLinkIcon } from './components/Icons';

const TAB_NAMES = ['Hottest Tracks', 'Mixes', 'House & Chillout', 'Austin Shows', 'Austin Blues', 'Saved'];

export default function App() {
  const [tab, setTab] = useState(0);
  const [savedTracks, setSavedTracks] = useLocalStorage('bb-savedTracks', []);
  const [savedMixes, setSavedMixes] = useLocalStorage('bb-savedMixes', []);
  const [mixGenreFilter, setMixGenreFilter] = useState('all');

  const {
    liveCharts, lastUpdated, previousRanks, isLoading, error,
    autoRefresh, refreshInterval, refresh, setAutoRefresh,
    availableSources, activeSources,
  } = useChartData();

  const toggleTrack = useCallback((id) => {
    setSavedTracks(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  }, [setSavedTracks]);

  const toggleMix = useCallback((id) => {
    setSavedMixes(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  }, [setSavedMixes]);

  // Gather all tracks for saved tab
  const allStaticTracks = genreCategories.flatMap(c => c.tracks);
  const savedTrackObjects = allStaticTracks.filter(t => savedTracks.includes(t.id));
  const savedMixObjects = allMixes.filter(m => savedMixes.includes(m.id));
  const savedCount = savedTracks.length + savedMixes.length;

  // Filtered mixes for the Mixes tab
  const filteredMixes = useMemo(() => {
    if (mixGenreFilter === 'all') return allMixes;
    return allMixes.filter(m => m.genre === mixGenreFilter);
  }, [mixGenreFilter]);

  return (
    <div style={S.container}>
      {/* Header */}
      <div style={S.header}>
        <div style={S.logo}>{'\u26a1'} BREAKBEAT DIGEST</div>
        <div style={S.subtitle}>Realtime {'\u00b7'} Curated {'\u00b7'} Uncompromising</div>
      </div>

      {/* Tabs */}
      <div style={S.tabBar}>
        {TAB_NAMES.map((name, i) => (
          <button key={name} onClick={() => setTab(i)} style={{ ...S.tab, ...(tab === i ? S.tabActive : {}) }}>
            {name}
            {name === 'Saved' && savedCount > 0 && <span style={S.badge}>{savedCount}</span>}
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

        {/* Tab 0: Hottest Tracks (DnB + Breakbeat) */}
        {tab === 0 && (
          <>
            {genreCategories.filter(c => c.id === 'dnb' || c.id === 'breakbeat').map(category => (
              <div key={category.id}>
                <div style={S.sectionLabel}>{category.emoji} Top Charts {'\u2014'} {category.label}</div>

                {/* Live Last.fm tracks */}
                {liveCharts[category.id]?.length > 0 && (
                  <>
                    <div style={sectionSubLabel}>Live Charts</div>
                    {liveCharts[category.id].map(track => (
                      <LiveTrackCard
                        key={track.id}
                        track={track}
                        rank={track.rank}
                        previousRank={previousRanks[track.id]}
                        lastUpdated={lastUpdated}
                      />
                    ))}
                  </>
                )}

                {/* Curated tracks */}
                <div style={sectionSubLabel}>Curated Picks</div>
                {category.tracks.map(track => (
                  <CuratedTrackCard key={track.id} track={track} saved={savedTracks.includes(track.id)} onToggleSave={toggleTrack} />
                ))}
              </div>
            ))}
          </>
        )}

        {/* Tab 1: Mixes — All Genres */}
        {tab === 1 && (
          <>
            <div style={S.sectionLabel}>{'\ud83c\udfa7'} Mixes {'\u2014'} Sourced from RA, Bandcamp, Boiler Room & Rate Your Music</div>

            {/* Genre filter chips */}
            <div style={S.filterBar}>
              {mixGenres.map(g => (
                <button
                  key={g.id}
                  onClick={() => setMixGenreFilter(g.id)}
                  style={{
                    ...S.filterChip,
                    ...(mixGenreFilter === g.id ? S.filterChipActive : {}),
                  }}
                >
                  {g.label}
                </button>
              ))}
            </div>

            {filteredMixes.length === 0 ? (
              <div style={S.empty}>No mixes in this genre yet. Check back soon.</div>
            ) : (
              filteredMixes.map(mix => (
                <MixCard key={mix.id} mix={mix} saved={savedMixes.includes(mix.id)} onToggleSave={toggleMix} />
              ))
            )}
          </>
        )}

        {/* Tab 2: House & Chillout */}
        {tab === 2 && (
          <>
            {genreCategories.filter(c => c.id === 'house' || c.id === 'chill' || c.id === 'electronic').map(category => (
              <div key={category.id}>
                <div style={S.sectionLabel}>{category.emoji} Top Charts {'\u2014'} {category.label}</div>

                {liveCharts[category.id]?.length > 0 && (
                  <>
                    <div style={sectionSubLabel}>Live Charts</div>
                    {liveCharts[category.id].map(track => (
                      <LiveTrackCard
                        key={track.id}
                        track={track}
                        rank={track.rank}
                        previousRank={previousRanks[track.id]}
                        lastUpdated={lastUpdated}
                      />
                    ))}
                  </>
                )}

                <div style={sectionSubLabel}>Curated Picks</div>
                {category.tracks.map(track => (
                  <CuratedTrackCard key={track.id} track={track} saved={savedTracks.includes(track.id)} onToggleSave={toggleTrack} />
                ))}
              </div>
            ))}
          </>
        )}

        {/* Tab 3: Austin Shows */}
        {tab === 3 && (
          <>
            <div style={S.sectionLabel}>{'\ud83c\udfa4'} Austin Promoters & Upcoming Shows</div>
            {shows.map(show => (
              <EventCard key={show.id} show={show} />
            ))}
            <div style={{ ...S.sectionLabel, marginTop: 16 }}>{'\ud83d\udcc5'} Event Calendars</div>
            <div style={S.btnRow}>
              {eventCalendars.map(cal => (
                <a key={cal.url} href={cal.url} target="_blank" rel="noreferrer" style={{ ...S.btn, background: '#374151' }}>
                  {cal.label} <ExternalLinkIcon />
                </a>
              ))}
            </div>
          </>
        )}

        {/* Tab 4: Austin Blues */}
        {tab === 4 && (
          <>
            {/* Austin Hero Banner */}
            <div style={bluesHero}>
              <div style={bluesHeroSkyline}>
                {/* SVG Austin skyline silhouette with guitar */}
                <svg viewBox="0 0 680 120" style={{ width: '100%', height: 120, opacity: 0.15 }}>
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
              <div style={bluesHeroText}>AUSTIN BLUES</div>
              <div style={bluesHeroSub}>Live Music Capital of the World</div>
            </div>

            {/* Live Blues Charts */}
            {genreCategories.filter(c => c.id === 'blues').map(category => (
              <div key={category.id}>
                <div style={S.sectionLabel}>{category.emoji} Live Charts {'\u2014'} {category.label}</div>

                {liveCharts[category.id]?.length > 0 && (
                  <>
                    <div style={sectionSubLabel}>Live Charts</div>
                    {liveCharts[category.id].map(track => (
                      <LiveTrackCard
                        key={track.id}
                        track={track}
                        rank={track.rank}
                        previousRank={previousRanks[track.id]}
                        lastUpdated={lastUpdated}
                      />
                    ))}
                  </>
                )}

                <div style={sectionSubLabel}>Curated Picks</div>
                {category.tracks.map(track => (
                  <CuratedTrackCard key={track.id} track={track} saved={savedTracks.includes(track.id)} onToggleSave={toggleTrack} />
                ))}
              </div>
            ))}

            {/* Austin Blues Venues */}
            <div style={{ ...S.sectionLabel, marginTop: 24 }}>{'\ud83c\udfb6'} Austin Blues Venues & Live Music</div>
            {bluesVenues.map(show => (
              <EventCard key={show.id} show={show} />
            ))}
            <div style={{ ...S.sectionLabel, marginTop: 16 }}>{'\ud83d\udcc5'} Blues Event Calendars</div>
            <div style={S.btnRow}>
              {bluesCalendars.map(cal => (
                <a key={cal.url} href={cal.url} target="_blank" rel="noreferrer" style={{ ...S.btn, background: '#374151' }}>
                  {cal.label} <ExternalLinkIcon />
                </a>
              ))}
            </div>
          </>
        )}

        {/* Tab 5: Saved */}
        {tab === 5 && (
          <>
            {savedCount === 0 ? (
              <div style={S.empty}>Nothing saved yet. Star any track or mix to save it here.</div>
            ) : (
              <>
                {savedTrackObjects.length > 0 && (
                  <>
                    <div style={S.sectionLabel}>{'\u2b50'} Saved Tracks</div>
                    {savedTrackObjects.map(track => (
                      <CuratedTrackCard key={track.id} track={track} saved onToggleSave={toggleTrack} />
                    ))}
                  </>
                )}
                {savedMixObjects.length > 0 && (
                  <>
                    <div style={S.sectionLabel}>{'\u2b50'} Saved Mixes</div>
                    {savedMixObjects.map(mix => (
                      <MixCard key={mix.id} mix={mix} saved onToggleSave={toggleMix} />
                    ))}
                  </>
                )}
              </>
            )}
          </>
        )}
      </div>

      {/* Footer */}
      <div style={S.footer}>
        Realtime charts via Last.fm, Apple Music & Spotify {'\u00b7'} Stream on Beatport, SoundCloud, YouTube Music {'\u00b7'} Curated from RA, Bandcamp & RYM
      </div>
    </div>
  );
}

const sectionSubLabel = {
  fontSize: 10,
  fontWeight: 600,
  color: '#4b5563',
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  marginBottom: 8,
  marginTop: 4,
};

const bluesHero = {
  background: 'linear-gradient(180deg, #1a0e05 0%, #2d1810 40%, #0a0a0a 100%)',
  borderRadius: 12,
  padding: '0 0 20px',
  marginBottom: 20,
  overflow: 'hidden',
  border: '1px solid #3d2214',
  textAlign: 'center',
  position: 'relative',
};

const bluesHeroSkyline = {
  width: '100%',
  position: 'relative',
};

const bluesHeroText = {
  fontSize: 28,
  fontWeight: 900,
  color: '#c2956b',
  letterSpacing: '0.12em',
  marginTop: -8,
  fontFamily: "'Georgia', 'Times New Roman', serif",
};

const bluesHeroSub = {
  fontSize: 11,
  color: '#8b6914',
  letterSpacing: '0.2em',
  textTransform: 'uppercase',
  marginTop: 4,
};
