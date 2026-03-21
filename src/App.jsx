import { useState, useCallback, useMemo } from 'react';
import { S } from './styles';
import { genreCategories } from './data/static-tracks';
import { allMixes, mixGenres } from './data/static-mixes';
import { austinDjMixes, austinMixGenres } from './data/static-austin-mixes';
import { shows, eventCalendars } from './data/static-events';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useChartData } from './hooks/useChartData';
import StatusBar from './components/StatusBar';
import { CuratedTrackCard, LiveTrackCard } from './components/TrackCard';
import MixCard from './components/MixCard';
import EventCard from './components/EventCard';
import { StarIcon, ExternalLinkIcon } from './components/Icons';

const TAB_NAMES = ['Hottest Tracks', 'Mixes', 'House & Chillout', 'Austin Shows', "Austin DJ's Mixes", 'Saved'];

export default function App() {
  const [tab, setTab] = useState(0);
  const [savedTracks, setSavedTracks] = useLocalStorage('bb-savedTracks', []);
  const [savedMixes, setSavedMixes] = useLocalStorage('bb-savedMixes', []);
  const [savedLiveTracks, setSavedLiveTracks] = useLocalStorage('bb-savedLiveTracks', []);
  const [mixGenreFilter, setMixGenreFilter] = useState('all');
  const [atxMixGenreFilter, setAtxMixGenreFilter] = useState('all');

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

  const isLiveTrackSaved = useCallback((track) => {
    return savedLiveTracks.some(t => t.title === track.title && t.artist === track.artist);
  }, [savedLiveTracks]);

  const toggleLiveTrack = useCallback((track) => {
    setSavedLiveTracks(prev => {
      const exists = prev.some(t => t.title === track.title && t.artist === track.artist);
      if (exists) return prev.filter(t => !(t.title === track.title && t.artist === track.artist));
      return [...prev, { title: track.title, artist: track.artist, links: track.links, sources: track.sources, playcount: track.playcount, listeners: track.listeners, popularity: track.popularity }];
    });
  }, [setSavedLiveTracks]);

  // Gather all tracks for saved tab
  const allStaticTracks = genreCategories.flatMap(c => c.tracks);
  const savedTrackObjects = allStaticTracks.filter(t => savedTracks.includes(t.id));
  const savedMixObjects = allMixes.filter(m => savedMixes.includes(m.id));
  const savedCount = savedTracks.length + savedMixes.length + savedLiveTracks.length;

  // Filtered mixes for the Mixes tab
  const filteredMixes = useMemo(() => {
    if (mixGenreFilter === 'all') return allMixes;
    return allMixes.filter(m => m.genre === mixGenreFilter);
  }, [mixGenreFilter]);

  // Filtered Austin DJ mixes
  const filteredAtxMixes = useMemo(() => {
    if (atxMixGenreFilter === 'all') return austinDjMixes;
    return austinDjMixes.filter(m => m.genre === atxMixGenreFilter);
  }, [atxMixGenreFilter]);

  return (
    <div style={S.container}>
      {/* Header — NOVA: close-up sideways digital mixer board */}
      <div style={{ ...S.header, padding: 0, overflow: 'hidden', position: 'relative' }}>
        <div style={{ width: '100%', position: 'relative' }}>
          <svg viewBox="0 0 680 160" style={{ width: '100%', height: 160, display: 'block' }}>
            <defs>
              {/* Noise / grain texture */}
              <filter id="mixerNoise" x="0%" y="0%" width="100%" height="100%">
                <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="4" stitchTiles="stitch" result="noise" />
                <feColorMatrix type="saturate" values="0" in="noise" result="grayNoise" />
                <feBlend in="SourceGraphic" in2="grayNoise" mode="multiply" />
              </filter>
              {/* Scanline effect */}
              <pattern id="scanlines" x="0" y="0" width="680" height="3" patternUnits="userSpaceOnUse">
                <rect x="0" y="0" width="680" height="1.5" fill="transparent" />
                <rect x="0" y="1.5" width="680" height="1.5" fill="#000" opacity="0.12" />
              </pattern>
              {/* LED glow */}
              <filter id="ledGlow">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
              {/* Hard edge blur for depth-of-field fuzzy effect */}
              <filter id="dofBlur">
                <feGaussianBlur stdDeviation="0.8" />
              </filter>
              {/* Orange glow wash */}
              <radialGradient id="mixerGlow" cx="35%" cy="60%" rx="50%" ry="45%">
                <stop offset="0%" stopColor="#f97316" stopOpacity="0.06" />
                <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
              </radialGradient>
              {/* Mixer surface gradient — dark brushed metal */}
              <linearGradient id="mixerSurface" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#141414" />
                <stop offset="50%" stopColor="#0c0c0c" />
                <stop offset="100%" stopColor="#080808" />
              </linearGradient>
            </defs>

            {/* Base surface — dark mixer faceplate */}
            <rect x="0" y="0" width="680" height="160" fill="url(#mixerSurface)" />

            {/* Perspective tilt — everything rotated ~8° for that sideways close-up angle */}
            <g transform="rotate(-8, 340, 80)" filter="url(#dofBlur)">

              {/* ══ CHANNEL STRIPS — vertical columns with faders, knobs, LEDs ══ */}

              {/* Channel strip borders — etched grooves */}
              {[45, 120, 195, 270, 345, 420, 495, 570].map((x, i) => (
                <g key={`ch${i}`}>
                  {/* Channel divider line */}
                  <rect x={x} y="-10" width="1" height="180" fill="#1a1a1a" />
                  <rect x={x + 1} y="-10" width="0.5" height="180" fill="#222" opacity="0.5" />
                </g>
              ))}

              {/* ── FADER SLOTS — long recessed channels ── */}
              {[60, 135, 210, 285, 360, 435, 510, 585].map((x, i) => {
                const faderY = 20 + (i % 3 === 0 ? 15 : i % 3 === 1 ? 35 : 25);
                const faderHeight = 85;
                const knobY = faderY + (faderHeight * [0.3, 0.55, 0.7, 0.4, 0.6, 0.2, 0.45, 0.65][i]);
                return (
                  <g key={`fader${i}`}>
                    {/* Fader slot recess */}
                    <rect x={x + 12} y={faderY} width="3" height={faderHeight} rx="1.5" fill="#050505" />
                    <rect x={x + 12.5} y={faderY} width="2" height={faderHeight} rx="1" fill="#0a0a0a" />
                    {/* Fader tick marks */}
                    {Array.from({ length: 8 }, (_, j) => (
                      <rect key={j} x={x + 8} y={faderY + j * (faderHeight / 8)} width="3" height="0.5" fill="#1a1a1a" />
                    ))}
                    {Array.from({ length: 8 }, (_, j) => (
                      <rect key={`r${j}`} x={x + 16} y={faderY + j * (faderHeight / 8)} width="3" height="0.5" fill="#1a1a1a" />
                    ))}
                    {/* Fader knob/cap */}
                    <rect x={x + 7} y={knobY - 5} width="13" height="10" rx="1.5" fill="#1c1c1c" />
                    <rect x={x + 9} y={knobY - 3} width="9" height="6" rx="1" fill="#252525" />
                    <rect x={x + 12} y={knobY - 1.5} width="3" height="3" rx="0.5" fill="#333" />
                  </g>
                );
              })}

              {/* ── ROTARY KNOBS — above faders ── */}
              {[60, 135, 210, 285, 360, 435, 510, 585].map((x, i) => {
                const ky = 8 + (i % 2) * 6;
                const rotation = [45, 120, -30, 80, 160, -60, 90, 200][i];
                return (
                  <g key={`knob${i}`}>
                    {/* Knob base ring */}
                    <circle cx={x + 13} cy={ky} r="7" fill="#0e0e0e" stroke="#1a1a1a" strokeWidth="0.5" />
                    <circle cx={x + 13} cy={ky} r="5.5" fill="#181818" />
                    <circle cx={x + 13} cy={ky} r="4" fill="#222" />
                    {/* Indicator line */}
                    <line
                      x1={x + 13} y1={ky}
                      x2={x + 13 + Math.cos(rotation * Math.PI / 180) * 3.5}
                      y2={ky + Math.sin(rotation * Math.PI / 180) * 3.5}
                      stroke="#f97316" strokeWidth="1" opacity="0.7"
                    />
                  </g>
                );
              })}

              {/* ── LED METERS — vertical VU strips beside each channel ── */}
              {[50, 125, 200, 275, 350, 425, 500, 575].map((x, i) => {
                const meterLevels = [6, 8, 5, 9, 7, 4, 8, 6][i];
                return (
                  <g key={`meter${i}`} filter="url(#ledGlow)">
                    {Array.from({ length: 10 }, (_, j) => {
                      const isLit = j >= (10 - meterLevels);
                      const isRed = j <= 1;
                      const isYellow = j === 2 || j === 3;
                      const color = isRed ? '#ff2020' : isYellow ? '#ffaa00' : '#00cc44';
                      return (
                        <rect
                          key={j}
                          x={x}
                          y={30 + j * 7}
                          width="4"
                          height="4"
                          rx="0.5"
                          fill={isLit ? color : '#0a0a0a'}
                          opacity={isLit ? 0.9 : 0.3}
                        />
                      );
                    })}
                  </g>
                );
              })}

              {/* ── CROSSFADER — large horizontal slider at bottom ── */}
              <rect x="180" y="130" width="320" height="4" rx="2" fill="#050505" />
              <rect x="180" y="130.5" width="320" height="3" rx="1.5" fill="#0a0a0a" />
              {/* Crossfader knob — offset to left */}
              <rect x="280" y="125" width="30" height="14" rx="2" fill="#1c1c1c" />
              <rect x="283" y="127" width="24" height="10" rx="1.5" fill="#252525" />
              <rect x="293" y="129" width="4" height="6" rx="1" fill="#333" />

              {/* ── CUE / PLAY BUTTONS — bottom section ── */}
              {[90, 165, 240, 315, 390, 465].map((x, i) => (
                <g key={`btn${i}`}>
                  <rect x={x} y="142" width="14" height="8" rx="1.5" fill={i === 1 || i === 4 ? '#f97316' : '#151515'} opacity={i === 1 || i === 4 ? 0.6 : 1} />
                  <rect x={x + 1} y="143" width="12" height="6" rx="1" fill={i === 1 || i === 4 ? '#f97316' : '#1a1a1a'} opacity={i === 1 || i === 4 ? 0.4 : 0.8} />
                </g>
              ))}

              {/* ── TINY LABELS — printed on faceplate ── */}
              {[60, 135, 210, 285, 360, 435, 510, 585].map((x, i) => (
                <text key={`lbl${i}`} x={x + 13} y="125" textAnchor="middle" fill="#1a1a1a" fontSize="3.5" fontFamily="monospace" fontWeight="700">
                  {['CH1', 'CH2', 'CH3', 'CH4', 'MAS', 'AUX', 'CUE', 'MON'][i]}
                </text>
              ))}

            </g>{/* end perspective tilt */}

            {/* Ambient orange glow wash */}
            <rect x="0" y="0" width="680" height="160" fill="url(#mixerGlow)" />

            {/* Scanline overlay */}
            <rect x="0" y="0" width="680" height="160" fill="url(#scanlines)" />

            {/* Grain / noise overlay */}
            <rect x="0" y="0" width="680" height="160" fill="#000" opacity="0.15" filter="url(#mixerNoise)" />

            {/* Vignette — dark edges */}
            <rect x="0" y="0" width="680" height="40" fill="url(#vigTop)" />
            <defs>
              <linearGradient id="vigTop" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#000" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#000" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="vigBot" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#000" stopOpacity="0" />
                <stop offset="100%" stopColor="#000" stopOpacity="0.5" />
              </linearGradient>
              <linearGradient id="vigLeft" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#000" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#000" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="vigRight" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#000" stopOpacity="0" />
                <stop offset="100%" stopColor="#000" stopOpacity="0.6" />
              </linearGradient>
            </defs>
            <rect x="0" y="120" width="680" height="40" fill="url(#vigBot)" />
            <rect x="0" y="0" width="100" height="160" fill="url(#vigLeft)" />
            <rect x="580" y="0" width="100" height="160" fill="url(#vigRight)" />

          </svg>
        </div>
        {/* Title overlay — positioned over the mixer image */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '0 24px 16px', background: 'linear-gradient(0deg, rgba(10,10,10,0.95) 0%, rgba(10,10,10,0.6) 60%, transparent 100%)' }}>
          <div style={S.logo}>{'\u26a1'} BREAKBEAT DIGEST</div>
          <div style={S.subtitle}>Realtime {'\u00b7'} Curated {'\u00b7'} Uncompromising</div>
        </div>
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
                        saved={isLiveTrackSaved(track)}
                        onToggleSave={toggleLiveTrack}
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
                        saved={isLiveTrackSaved(track)}
                        onToggleSave={toggleLiveTrack}
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

        {/* Tab 4: Austin DJ's Mixes */}
        {tab === 4 && (
          <>
            <div style={S.sectionLabel}>{'\ud83e\udd20'} Austin DJ's Mixes {'\u2014'} Local Talent, Live Sets & Residencies</div>

            {/* Genre filter chips */}
            <div style={S.filterBar}>
              {austinMixGenres.map(g => (
                <button
                  key={g.id}
                  onClick={() => setAtxMixGenreFilter(g.id)}
                  style={{
                    ...S.filterChip,
                    ...(atxMixGenreFilter === g.id ? S.filterChipActive : {}),
                  }}
                >
                  {g.label}
                </button>
              ))}
            </div>

            {filteredAtxMixes.length === 0 ? (
              <div style={S.empty}>No mixes in this genre yet. Check back soon.</div>
            ) : (
              filteredAtxMixes.map(mix => (
                <MixCard key={mix.id} mix={mix} saved={savedMixes.includes(mix.id)} onToggleSave={toggleMix} />
              ))
            )}
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
                {savedLiveTracks.length > 0 && (
                  <>
                    <div style={S.sectionLabel}>{'\u2b50'} Saved Chart Tracks</div>
                    {savedLiveTracks.map(track => (
                      <LiveTrackCard
                        key={`saved-${track.artist}-${track.title}`}
                        track={track}
                        saved
                        onToggleSave={toggleLiveTrack}
                      />
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
