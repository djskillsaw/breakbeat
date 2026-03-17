# Breakbeat Digest — Opus Handoff

## What This Is

A React + Vite single-page app deployed to GitHub Pages at `https://djskillsaw.github.io/breakbeat`. It's a personal music digest focused on breakbeat, D&B, jungle, house, and Austin TX local scene.

## Stack

- React 19, Vite, inline styles (no CSS framework)
- GitHub Actions: daily deploy that runs `node scripts/fetchCharts.js` → `npm run build` → pushes to `gh-pages` branch
- Last.fm API (key stored as GitHub secret `LASTFM_API_KEY`) for live chart data

---

## Current Tab Structure

| Tab | Content |
|-----|---------|
| 0 — Breaks / DnB | `chartGenres` filtered to `dnb` + `breakbeat` from Last.fm |
| 1 — Mixes | Manual `mixes.js` (breakbeat/dnb mixes, sourced from RA, SoundCloud, YouTube) |
| 2 — House & Chill | `chartGenres` filtered to `house` + `chill` + `electronic` from Last.fm + manual `houseMixes` |
| 3 — Austin Shows | Manual `shows.js` (4 Austin venues) + event calendar links |
| 4 — Local DJs | Manual `localDJs.js` (5 Austin DJ profiles with sets + upcoming shows) |
| 5 — Saved | LocalStorage-saved tracks and mixes |

---

## Data Architecture

### Auto-generated (via `npm run fetch-charts` / GitHub Actions daily)
- **`src/data/chartTracks.js`** — exports `chartGenres[]` — 5 genres × 5 tracks from Last.fm tag search
  - Each track: `id`, `title`, `artist`, `beatportUrl`, `appleMusicUrl`, `spotifyUrl`

### Manual / static
- **`src/data/mixes.js`** — curated D&B/breakbeat mixes
- **`src/data/houseChillout.js`** — exports `houseMixes` (used), `houseTracks` + `chilloutTracks` (no longer rendered — orphaned)
- **`src/data/shows.js`** — Austin venues and event links
- **`src/data/localDJs.js`** — Austin DJ profiles
- **`src/data/tracks.js`** — exports `tracksMonth` + `tracks[]` — **orphaned, not imported by anything**

---

## Known Issues / Things Needing Attention

### 1. Data quality — Last.fm tag results are poor for these genres
The Last.fm `tag.gettoptracks` endpoint returns very generic/mainstream results for tags like `breakbeat`, `drum-and-bass`, `house`. Current breakbeat chart shows PinkPantheress and Lorde. Current D&B chart shows mostly unknown/niche acts. These are real Last.fm results but they do not reflect actual genre-authentic top tracks. Consider:
- Switching to `artist.gettoptracks` for a curated list of known artists per genre
- Using multiple tags and merging/deduping
- Supplementing or replacing with a different data source (Beatport API, Spotify API, manual curation)

### 2. `houseChillout.js` — partly orphaned
`houseTracks` and `chilloutTracks` arrays (static artist "Browse Latest Releases" cards) are defined and exported but no longer imported or rendered anywhere. `houseMixes` is still used in tab 2. Either clean up the unused exports or restore them if the owner wants curated artist cards back.

### 3. `tracks.js` — fully orphaned
Was previously the "Hottest Tracks" section but was replaced by `chartGenres`. File still exists with `tracksMonth` and `tracks` exports. Nothing imports it. Safe to delete or repurpose.

### 4. `TrackCard` component — partially vestigial
`TrackCard` was updated to handle both old static format (bpm, vibe, released fields) and new Last.fm format. Since all static tracks are gone, the conditional logic for `bpm`, `released`, `vibe` is dead code. The component is only used in the Saved tab now (for saved chart tracks) via `savedTracks` — but `savedTracks` now only contains `ChartTrackCard`-format data, so it should probably use `ChartTrackCard` there too. Check whether `TrackCard` is needed at all.

### 5. Saved tab uses `TrackCard` for all saved tracks
`savedTracks` is now sourced entirely from `allChartTracks` (Last.fm data). But the Saved tab renders them with `TrackCard` instead of `ChartTrackCard`. `TrackCard` shows artist as the header and genre as sub-text — for Last.fm tracks, `title` and `artist` are separate fields. The saved tab will likely display track titles in the wrong slot.

### 6. Section labels in tab 2 are hardcoded with old dates
Tab 2 used to show "House — March 2026 Top Picks" but now shows live chart sections. The labels now come from `chartGenres` dynamically — this is fine. But `houseMixes` section label is still hardcoded as a string in JSX. Minor.

### 7. `houseChillout.js` still imported
`houseMixes` is imported from `./data/houseChillout` for tab 2's mixes section. This is correct and still working. Just noting it's the last remaining use of that file.

---

## What's Working Well

- GitHub Actions daily deploy pipeline is solid — fetches Last.fm → builds → deploys automatically
- Tab structure is clean after recent reorganization (no more duplicate genre sections)
- LocalStorage save/unsave works across all card types
- Streaming links (Beatport, Spotify, Apple Music) are generated correctly from Last.fm artist+title
- Austin shows and local DJ data is detailed and well-structured

---

## File Map

```
breakbeat/
├── src/
│   ├── BreakbeatDigest.jsx     # Main component — all tabs, all cards
│   ├── App.jsx                 # Root wrapper (trivial)
│   ├── main.jsx                # React entry point
│   ├── index.css               # Global reset only
│   └── data/
│       ├── chartTracks.js      # AUTO-GENERATED daily — do not hand-edit
│       ├── tracks.js           # ORPHANED — not imported anywhere
│       ├── mixes.js            # Manual — D&B/breakbeat mixes
│       ├── houseChillout.js    # Manual — houseMixes (used), houseTracks/chilloutTracks (orphaned)
│       ├── shows.js            # Manual — Austin venues + event links
│       └── localDJs.js         # Manual — Austin DJ profiles
├── scripts/
│   └── fetchCharts.js          # Node script: Last.fm → chartTracks.js
├── .github/workflows/
│   └── deploy.yml              # Daily: fetch → build → deploy to gh-pages
├── vite.config.js              # base: "/breakbeat/"
└── package.json                # scripts: dev, build, fetch-charts, deploy
```

---

## Suggested Priorities for Opus Pass

1. **Fix saved tab card mismatch** — saved chart tracks should render with `ChartTrackCard`, not `TrackCard`
2. **Remove orphaned files/exports** — `tracks.js`, `houseTracks`, `chilloutTracks`
3. **Improve Last.fm data quality** — the genre tag results are not genre-authentic; explore better query strategy
4. **Clean up `TrackCard`** — strip out dead conditional logic for bpm/vibe/released if static tracks are truly gone
5. **Assess whether static curated content** (artist browse cards) should be restored alongside live chart data, or fully replaced by it
