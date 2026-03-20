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

  // Filtered Austin DJ mixes
  const filteredAtxMixes = useMemo(() => {
    if (atxMixGenreFilter === 'all') return austinDjMixes;
    return austinDjMixes.filter(m => m.genre === atxMixGenreFilter);
  }, [atxMixGenreFilter]);

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
