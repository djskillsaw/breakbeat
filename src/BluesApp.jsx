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
            <svg viewBox="0 -10 680 145" style={{ width: '100%', height: 140 }}>
              <defs>
                {/* Vertical fade mask — buildings emerge from nothing at top, full strength at skyline edge */}
                <linearGradient id="skyFade" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="white" stopOpacity="0.28" />
                  <stop offset="50%" stopColor="white" stopOpacity="0.32" />
                  <stop offset="100%" stopColor="white" stopOpacity="0.38" />
                </linearGradient>
                <mask id="skyMask">
                  <rect x="0" y="-10" width="680" height="145" fill="url(#skyFade)" />
                </mask>
                {/* Warm horizon glow behind skyline */}
                <radialGradient id="horizonGlow" cx="50%" cy="78%" rx="55%" ry="18%">
                  <stop offset="0%" stopColor="#c2956b" stopOpacity="0.08" />
                  <stop offset="100%" stopColor="#c2956b" stopOpacity="0" />
                </radialGradient>
                {/* Reflection fade — strong at waterline, vanishes below */}
                <linearGradient id="reflFade" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="white" stopOpacity="0.06" />
                  <stop offset="100%" stopColor="white" stopOpacity="0" />
                </linearGradient>
                <mask id="reflMask">
                  <rect x="0" y="100" width="680" height="35" fill="url(#reflFade)" />
                </mask>
              </defs>

              {/* Horizon glow layer */}
              <rect x="0" y="-10" width="680" height="145" fill="url(#horizonGlow)" />

              {/* === SKYLINE GROUP — masked for atmospheric fade === */}
              <g mask="url(#skyMask)">

                {/* ═══ BACKGROUND LAYER — far buildings, receded tone ═══ */}
                {/* Right-side office towers — atmospheric perspective (farthest = lightest) */}
                <rect x="538" y="55" width="20" height="40" fill="#8b6540" />
                <rect x="590" y="60" width="18" height="35" fill="#8b6540" />
                <rect x="618" y="65" width="14" height="30" fill="#8b6540" />
                <rect x="642" y="70" width="18" height="25" fill="#8b6540" />
                {/* Mid-rise filler buildings — background depth */}
                <rect x="380" y="58" width="20" height="37" fill="#8b6540" />

                {/* ═══ MIDGROUND LAYER — mid-distance tone ═══ */}
                {/* Small building cluster left of center */}
                <rect x="82" y="62" width="18" height="33" fill="#a07850" />
                <rect x="106" y="55" width="14" height="40" fill="#a07850" />
                {/* Mid-rise filler buildings — midground */}
                <rect x="336" y="52" width="16" height="43" fill="#a07850" />
                <rect x="358" y="45" width="14" height="50" fill="#a07850" />
                {/* 360 Condos — tall glass slab */}
                <rect x="178" y="22" width="20" height="73" fill="#a07850" />
                {/* One Congress Plaza — stepped profile */}
                <rect x="210" y="50" width="28" height="45" fill="#a07850" />
                <rect x="214" y="42" width="20" height="10" fill="#a07850" />
                <rect x="218" y="36" width="12" height="8" fill="#a07850" />
                {/* Right-side mid-distance towers */}
                <rect x="488" y="48" width="18" height="47" fill="#a07850" />
                <rect x="566" y="50" width="14" height="45" fill="#a07850" />

                {/* ═══ FOREGROUND LAYER — hero landmarks, full copper ═══ */}

                {/* The Austonian — tall elliptical tower on Congress */}
                <ellipse cx="270" cy="55" rx="11" ry="42" fill="#c2956b" />
                <rect x="259" y="70" width="22" height="25" fill="#c2956b" />

                {/* The Independent (Jenga tower) — tallest, offset stacking with rotation */}
                <rect x="138" y="12" width="22" height="83" fill="#c2956b" />
                <rect x="135" y="12" width="28" height="6" fill="#c2956b" transform="rotate(1.5, 149, 15)" />
                <rect x="140" y="22" width="24" height="6" fill="#c2956b" transform="rotate(-1.5, 152, 25)" />
                <rect x="136" y="34" width="26" height="6" fill="#c2956b" transform="rotate(2, 149, 37)" />
                <rect x="141" y="46" width="22" height="6" fill="#c2956b" transform="rotate(-1, 152, 49)" />
                <rect x="137" y="58" width="25" height="6" fill="#c2956b" transform="rotate(1.5, 149, 61)" />

                {/* Frost Bank Tower — iconic owl-face crown */}
                <rect x="300" y="28" width="24" height="67" fill="#c2956b" />
                <polygon points="300,28 312,10 324,28" fill="#c2956b" />
                <polygon points="300,28 306,18 312,28" fill="#c2956b" />
                <polygon points="312,28 318,18 324,28" fill="#c2956b" />
                {/* Central spine — owl-face geometry */}
                <line x1="312" y1="10" x2="312" y2="28" stroke="#0c0a08" strokeWidth="0.8" opacity="0.25" />
                {/* Window grid suggestion */}
                <rect x="304" y="35" width="2" height="3" fill="#0c0a08" opacity="0.15" />
                <rect x="310" y="35" width="2" height="3" fill="#0c0a08" opacity="0.15" />
                <rect x="316" y="35" width="2" height="3" fill="#0c0a08" opacity="0.15" />
                <rect x="304" y="42" width="2" height="3" fill="#0c0a08" opacity="0.12" />
                <rect x="310" y="42" width="2" height="3" fill="#0c0a08" opacity="0.12" />
                <rect x="316" y="42" width="2" height="3" fill="#0c0a08" opacity="0.12" />

                {/* 514 Congress — foreground slab */}
                <rect x="514" y="40" width="16" height="55" fill="#c2956b" />

                {/* ── UT Tower — slender spire on broad base, correct 1:5 proportions ── */}
                {/* Center of composition at x=50. Base=90px wide, shaft=16px wide */}

                {/* Section 1: Main Building base — broad classical limestone, 3 stories */}
                <rect x="5" y="76" width="90" height="19" fill="#c2956b" />
                {/* Cornice / string course at roofline */}
                <rect x="5" y="75" width="90" height="1.5" fill="#c2956b" opacity="0.9" />
                {/* Terracotta roof hint */}
                <rect x="5" y="73" width="90" height="3" fill="#c2956b" opacity="0.7" />
                {/* Central entrance portico */}
                <rect x="35" y="72" width="20" height="4" fill="#c2956b" />
                {/* Balustrade above portico */}
                <rect x="32" y="71" width="26" height="1.2" fill="#c2956b" />
                {/* Window grid — 10 bays across the wide base */}
                <rect x="10" y="80" width="2.5" height="3.5" fill="#0c0a08" opacity="0.18" />
                <rect x="18" y="80" width="2.5" height="3.5" fill="#0c0a08" opacity="0.18" />
                <rect x="26" y="80" width="2.5" height="3.5" fill="#0c0a08" opacity="0.18" />
                <rect x="34" y="80" width="2.5" height="3.5" fill="#0c0a08" opacity="0.18" />
                <rect x="42" y="80" width="2.5" height="3.5" fill="#0c0a08" opacity="0.18" />
                <rect x="54" y="80" width="2.5" height="3.5" fill="#0c0a08" opacity="0.18" />
                <rect x="62" y="80" width="2.5" height="3.5" fill="#0c0a08" opacity="0.18" />
                <rect x="70" y="80" width="2.5" height="3.5" fill="#0c0a08" opacity="0.18" />
                <rect x="78" y="80" width="2.5" height="3.5" fill="#0c0a08" opacity="0.18" />
                <rect x="86" y="80" width="2.5" height="3.5" fill="#0c0a08" opacity="0.18" />
                {/* Second floor windows */}
                <rect x="10" y="87" width="2.5" height="3.5" fill="#0c0a08" opacity="0.13" />
                <rect x="18" y="87" width="2.5" height="3.5" fill="#0c0a08" opacity="0.13" />
                <rect x="26" y="87" width="2.5" height="3.5" fill="#0c0a08" opacity="0.13" />
                <rect x="34" y="87" width="2.5" height="3.5" fill="#0c0a08" opacity="0.13" />
                <rect x="42" y="87" width="2.5" height="3.5" fill="#0c0a08" opacity="0.13" />
                <rect x="54" y="87" width="2.5" height="3.5" fill="#0c0a08" opacity="0.13" />
                <rect x="62" y="87" width="2.5" height="3.5" fill="#0c0a08" opacity="0.13" />
                <rect x="70" y="87" width="2.5" height="3.5" fill="#0c0a08" opacity="0.13" />
                <rect x="78" y="87" width="2.5" height="3.5" fill="#0c0a08" opacity="0.13" />
                <rect x="86" y="87" width="2.5" height="3.5" fill="#0c0a08" opacity="0.13" />
                {/* Column suggestions on base facade */}
                <rect x="8" y="76" width="1" height="18" fill="#0c0a08" opacity="0.12" />
                <rect x="32" y="76" width="1" height="18" fill="#0c0a08" opacity="0.12" />
                <rect x="57" y="76" width="1" height="18" fill="#0c0a08" opacity="0.12" />
                <rect x="82" y="76" width="1" height="18" fill="#0c0a08" opacity="0.12" />
                <rect x="93" y="76" width="1" height="18" fill="#0c0a08" opacity="0.12" />

                {/* Attic / transition story — narrower step before tower */}
                <rect x="28" y="68" width="34" height="6" fill="#c2956b" />
                <rect x="27" y="67" width="36" height="1.5" fill="#c2956b" opacity="0.85" />

                {/* Section 2: Tower shaft — SLENDER, 16px wide, 55px tall */}
                <rect x="42" y="14" width="16" height="54" fill="#c2956b" />
                {/* Setback ledge at shaft base */}
                <rect x="40" y="66" width="20" height="2" fill="#c2956b" />
                {/* Window columns — 2 bays across (narrow shaft), 8 floors */}
                <rect x="44.5" y="18" width="2" height="3" fill="#0c0a08" opacity="0.2" />
                <rect x="53.5" y="18" width="2" height="3" fill="#0c0a08" opacity="0.2" />
                <rect x="44.5" y="24" width="2" height="3" fill="#0c0a08" opacity="0.19" />
                <rect x="53.5" y="24" width="2" height="3" fill="#0c0a08" opacity="0.19" />
                <rect x="44.5" y="30" width="2" height="3" fill="#0c0a08" opacity="0.18" />
                <rect x="53.5" y="30" width="2" height="3" fill="#0c0a08" opacity="0.18" />
                <rect x="44.5" y="36" width="2" height="3" fill="#0c0a08" opacity="0.16" />
                <rect x="53.5" y="36" width="2" height="3" fill="#0c0a08" opacity="0.16" />
                <rect x="44.5" y="42" width="2" height="3" fill="#0c0a08" opacity="0.15" />
                <rect x="53.5" y="42" width="2" height="3" fill="#0c0a08" opacity="0.15" />
                <rect x="44.5" y="48" width="2" height="3" fill="#0c0a08" opacity="0.13" />
                <rect x="53.5" y="48" width="2" height="3" fill="#0c0a08" opacity="0.13" />
                <rect x="44.5" y="54" width="2" height="3" fill="#0c0a08" opacity="0.12" />
                <rect x="53.5" y="54" width="2" height="3" fill="#0c0a08" opacity="0.12" />
                <rect x="44.5" y="60" width="2" height="3" fill="#0c0a08" opacity="0.1" />
                <rect x="53.5" y="60" width="2" height="3" fill="#0c0a08" opacity="0.1" />

                {/* Section 3: Clock level — same width as shaft, clean rectangle */}
                <rect x="42" y="8" width="16" height="6" fill="#c2956b" />
                {/* Thin cornice line above clock */}
                <rect x="41.5" y="7.5" width="17" height="1" fill="#c2956b" />
                {/* Clock face — single centered circle */}
                <circle cx="50" cy="11.5" r="2" fill="#0c0a08" opacity="0.3" />
                <circle cx="50" cy="11.5" r="1.4" fill="#0c0a08" opacity="0.12" />

                {/* Section 4: Colonnade gallery — narrower than shaft */}
                <rect x="43" y="2.5" width="14" height="5.5" fill="#c2956b" />
                {/* Arched openings — tall narrow colonnade */}
                <rect x="44.5" y="3.5" width="2" height="3.5" rx="0.8" fill="#0c0a08" opacity="0.3" />
                <rect x="47.5" y="3.5" width="2" height="3.5" rx="0.8" fill="#0c0a08" opacity="0.3" />
                <rect x="50.5" y="3.5" width="2" height="3.5" rx="0.8" fill="#0c0a08" opacity="0.3" />
                <rect x="53.5" y="3.5" width="2" height="3.5" rx="0.8" fill="#0c0a08" opacity="0.3" />

                {/* Flat cap / cornice — clean top edge */}
                <rect x="42.5" y="1.5" width="15" height="1.5" fill="#c2956b" />

                {/* Single small finial / spire — centered, no turrets */}
                <rect x="49.2" y="-2" width="1.6" height="4" fill="#c2956b" />
                <polygon points="49,-2 50,-4.5 51,-2" fill="#c2956b" />

                {/* ── Texas State Capitol — Italian Renaissance Revival ── */}
                {/* East wing */}
                <rect x="405" y="72" width="28" height="23" fill="#c2956b" />
                {/* West wing */}
                <rect x="467" y="72" width="28" height="23" fill="#c2956b" />
                {/* Central block */}
                <rect x="425" y="62" width="50" height="33" fill="#c2956b" />
                {/* Portico pediment */}
                <polygon points="430,62 450,56 470,62" fill="#c2956b" />
                {/* Portico columns */}
                <rect x="434" y="62" width="1.2" height="15" fill="#0c0a08" opacity="0.25" />
                <rect x="440" y="62" width="1.2" height="15" fill="#0c0a08" opacity="0.25" />
                <rect x="446" y="62" width="1.2" height="15" fill="#0c0a08" opacity="0.25" />
                <rect x="452" y="62" width="1.2" height="15" fill="#0c0a08" opacity="0.25" />
                <rect x="458" y="62" width="1.2" height="15" fill="#0c0a08" opacity="0.25" />
                <rect x="464" y="62" width="1.2" height="15" fill="#0c0a08" opacity="0.25" />
                {/* Entablature */}
                <rect x="423" y="60" width="54" height="2.5" fill="#c2956b" />
                {/* Rotunda drum */}
                <rect x="435" y="48" width="30" height="13" fill="#c2956b" />
                <rect x="438" y="49" width="0.8" height="11" fill="#0c0a08" opacity="0.2" />
                <rect x="442" y="49" width="0.8" height="11" fill="#0c0a08" opacity="0.2" />
                <rect x="446" y="49" width="0.8" height="11" fill="#0c0a08" opacity="0.2" />
                <rect x="450" y="49" width="0.8" height="11" fill="#0c0a08" opacity="0.2" />
                <rect x="454" y="49" width="0.8" height="11" fill="#0c0a08" opacity="0.2" />
                <rect x="458" y="49" width="0.8" height="11" fill="#0c0a08" opacity="0.2" />
                <rect x="462" y="49" width="0.8" height="11" fill="#0c0a08" opacity="0.2" />
                <rect x="434" y="47" width="32" height="2" fill="#c2956b" />
                {/* Dome */}
                <path d="M436,48 Q436,34 450,30 Q464,34 464,48 Z" fill="#c2956b" />
                <line x1="450" y1="30" x2="450" y2="48" stroke="#0c0a08" strokeWidth="0.5" opacity="0.12" />
                <line x1="443" y1="36" x2="440" y2="48" stroke="#0c0a08" strokeWidth="0.5" opacity="0.12" />
                <line x1="457" y1="36" x2="460" y2="48" stroke="#0c0a08" strokeWidth="0.5" opacity="0.12" />
                {/* Lantern */}
                <rect x="446" y="24" width="8" height="7" fill="#c2956b" />
                <rect x="448" y="25" width="0.6" height="5" fill="#0c0a08" opacity="0.25" />
                <rect x="451" y="25" width="0.6" height="5" fill="#0c0a08" opacity="0.25" />
                <path d="M445,24 Q445,21 450,19 Q455,21 455,24 Z" fill="#c2956b" />
                {/* Goddess of Liberty */}
                <rect x="449" y="13" width="2" height="6" fill="#c2956b" />
                <circle cx="450" cy="12" r="1.5" fill="#c2956b" />
                <line x1="450" y1="14" x2="452" y2="11" stroke="#c2956b" strokeWidth="1" />
                <polygon points="452,9 452.8,10.5 451.2,10.5" fill="#c2956b" />
                {/* Wing window details */}
                <rect x="410" y="72" width="1" height="20" fill="#0c0a08" opacity="0.15" />
                <rect x="417" y="72" width="1" height="20" fill="#0c0a08" opacity="0.15" />
                <rect x="424" y="72" width="1" height="20" fill="#0c0a08" opacity="0.15" />
                <rect x="475" y="72" width="1" height="20" fill="#0c0a08" opacity="0.15" />
                <rect x="482" y="72" width="1" height="20" fill="#0c0a08" opacity="0.15" />
                <rect x="489" y="72" width="1" height="20" fill="#0c0a08" opacity="0.15" />

                {/* ── Congress Ave Bridge — constrained to realistic span ── */}
                <rect x="200" y="95" width="280" height="5" fill="#c2956b" />
                {/* Bridge arches */}
                <ellipse cx="230" cy="95" rx="18" ry="5" fill="#0c0a08" />
                <ellipse cx="270" cy="95" rx="18" ry="5" fill="#0c0a08" />
                <ellipse cx="310" cy="95" rx="18" ry="5" fill="#0c0a08" />
                <ellipse cx="350" cy="95" rx="18" ry="5" fill="#0c0a08" />
                <ellipse cx="390" cy="95" rx="18" ry="5" fill="#0c0a08" />
                <ellipse cx="430" cy="95" rx="18" ry="5" fill="#0c0a08" />
                <ellipse cx="460" cy="95" rx="18" ry="5" fill="#0c0a08" />

              </g>{/* end skyline mask group */}

              {/* ═══ LADY BIRD LAKE — water surface ═══ */}
              <rect x="0" y="100" width="680" height="35" fill="#0c0a08" opacity="0.6" />

              {/* ═══ LAKE REFLECTION — mirrored skyline silhouette ═══ */}
              <g mask="url(#reflMask)" transform="translate(0, 200) scale(1, -1)">
                {/* Simplified silhouette of major landmarks — flipped */}
                <rect x="5" y="76" width="90" height="19" fill="#c2956b" />
                <rect x="42" y="14" width="16" height="54" fill="#c2956b" />
                <rect x="138" y="12" width="22" height="83" fill="#c2956b" />
                <rect x="178" y="22" width="20" height="73" fill="#c2956b" />
                <rect x="210" y="50" width="28" height="45" fill="#c2956b" />
                <ellipse cx="270" cy="60" rx="11" ry="35" fill="#c2956b" />
                <rect x="300" y="28" width="24" height="67" fill="#c2956b" />
                <rect x="336" y="52" width="16" height="43" fill="#c2956b" />
                <rect x="358" y="45" width="14" height="50" fill="#c2956b" />
                <rect x="405" y="62" width="90" height="33" fill="#c2956b" />
                <rect x="488" y="48" width="18" height="47" fill="#c2956b" />
                <rect x="514" y="40" width="16" height="55" fill="#c2956b" />
                <rect x="538" y="55" width="20" height="40" fill="#c2956b" />
                <rect x="566" y="50" width="14" height="45" fill="#c2956b" />
              </g>

              {/* ═══ BATS — clustered near bridge flight path, upper sky ═══ */}
              <g opacity="0.22">
                <path d="M240,8 Q244,2 248,8 Q252,2 256,8" fill="#c2956b" />
                <path d="M290,5 Q293,0 296,5 Q299,0 302,5" fill="#c2956b" />
                <path d="M350,10 Q354,4 358,10 Q362,4 366,10" fill="#c2956b" />
                <path d="M310,15 Q313,10 316,15 Q319,10 322,15" fill="#c2956b" />
                <path d="M400,7 Q403,2 406,7 Q409,2 412,7" fill="#c2956b" />
                <path d="M270,18 Q272,14 274,18 Q276,14 278,18" fill="#c2956b" />
                <path d="M330,3 Q332,0 334,3 Q336,0 338,3" fill="#c2956b" />
              </g>
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
  hero: { background: 'linear-gradient(180deg, #1a0e05 0%, #0a0908 100%)', padding: '16px 0 24px', textAlign: 'center', overflow: 'hidden' },
  heroSkyline: { width: '100%', marginBottom: -4 },
  heroTitle: { fontSize: 28, fontWeight: 900, color: '#c2956b', letterSpacing: '0.18em', marginTop: -2, fontFamily: "'Playfair Display', 'Georgia', serif", textShadow: '0 1px 8px rgba(194,149,107,.12)' },
  heroSub: { fontSize: 11, color: '#8b6914', letterSpacing: '0.22em', textTransform: 'uppercase', marginTop: 6, fontWeight: 500 },
  tabBar: { display: 'flex', borderBottom: '1px solid #2d1810', overflowX: 'auto' },
  tab: { padding: '12px 18px', background: 'none', border: 'none', color: '#6b7280', fontSize: 13, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap', borderBottom: '2px solid transparent', position: 'relative' },
  tabActive: { color: '#c2956b', borderBottom: '2px solid #c2956b' },
  badge: { marginLeft: 6, background: '#c2956b', color: '#000', borderRadius: 10, padding: '1px 6px', fontSize: 11, fontWeight: 700 },
  sectionLabel: { fontSize: 11, fontWeight: 700, color: '#8b7355', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 16, marginTop: 8 },
  areaLabel: { fontSize: 10, fontWeight: 700, color: '#6b7280', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8, marginTop: 12, paddingBottom: 4, borderBottom: '1px solid #1a1610' },
  footer: { textAlign: 'center', fontSize: 11, color: '#374151', padding: '24px 16px 0', borderTop: '1px solid #1a1008' },
};
