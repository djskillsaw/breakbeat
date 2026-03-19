/**
 * Apple Music Charts via public RSS feeds + iTunes Search API.
 * No API key required. CORS-enabled.
 *
 * Apple Music genre IDs:
 *   2  = Blues
 *   7  = Electronic
 *   17 = Dance
 *   18 = Hip-Hop/Rap (for reference)
 */

const RSS_BASE = 'https://rss.applemarketingtools.com/api/v2/us/music/most-played';
const ITUNES_SEARCH = 'https://itunes.apple.com/search';

// Map our genre IDs to Apple Music genre IDs
const GENRE_MAP = {
  dnb: null,         // No direct Apple genre — use electronic + keyword filter
  breakbeat: null,   // Same — electronic + keyword filter
  house: 17,         // Dance
  chill: null,       // Electronic + filter
  electronic: 7,     // Electronic
  blues: 2,          // Blues
};

// Keywords for sub-genre filtering
const GENRE_KEYWORDS = {
  dnb: ['drum', 'bass', 'dnb', 'd&b', 'jungle', 'liquid', 'neurofunk', 'breakcore'],
  breakbeat: ['breakbeat', 'breaks', 'break', 'big beat', 'nu skool'],
  chill: ['chill', 'downtempo', 'ambient', 'lo-fi', 'lofi', 'trip-hop', 'trip hop'],
};

function matchesGenreKeywords(title, artist, genreId) {
  const keywords = GENRE_KEYWORDS[genreId];
  if (!keywords) return true; // No filter = accept all
  const haystack = `${title} ${artist}`.toLowerCase();
  return keywords.some(kw => haystack.includes(kw));
}

function mapAppleTrack(item, index, genreId) {
  return {
    id: `apple-${genreId}-${index}`,
    title: item.name || item.trackName || 'Unknown',
    artist: item.artistName || 'Unknown',
    appleMusicUrl: item.url || item.trackViewUrl || '',
    artworkUrl: item.artworkUrl100 || (item.artworkUrl100 ? item.artworkUrl100.replace('100x100', '200x200') : ''),
    source: 'Apple Music',
    rank: index + 1,
  };
}

/**
 * Fetch Apple Music top charts for a genre.
 * Falls back to Electronic charts if no specific genre mapped.
 */
export async function fetchAppleMusicCharts(genreId, limit = 25) {
  const appleGenreId = GENRE_MAP[genreId] || 7; // Default to Electronic

  try {
    const url = `${RSS_BASE}/${limit}/genre-${appleGenreId}.json`;
    const res = await fetch(url);
    if (!res.ok) return [];

    const data = await res.json();
    const results = data?.feed?.results || [];

    let tracks = results.map((item, i) => mapAppleTrack(item, i, genreId));

    // Apply sub-genre keyword filter for genres without direct Apple mapping
    if (!GENRE_MAP[genreId]) {
      tracks = tracks.filter(t => matchesGenreKeywords(t.title, t.artist, genreId));
    }

    return tracks.slice(0, limit);
  } catch {
    return [];
  }
}

/**
 * Look up a specific track on iTunes/Apple Music.
 * Returns the Apple Music URL if found.
 */
export async function lookupTrack(artist, title) {
  try {
    const query = encodeURIComponent(`${artist} ${title}`);
    const url = `${ITUNES_SEARCH}?term=${query}&media=music&entity=song&limit=3`;
    const res = await fetch(url);
    if (!res.ok) return null;

    const data = await res.json();
    const match = data.results?.[0];
    if (!match) return null;

    return {
      appleMusicUrl: match.trackViewUrl,
      artworkUrl: match.artworkUrl100?.replace('100x100', '300x300') || '',
      previewUrl: match.previewUrl || '',
      collectionName: match.collectionName || '',
    };
  } catch {
    return null;
  }
}

/**
 * Fetch charts for all our genres.
 */
export async function fetchAllAppleCharts(limit = 25) {
  const results = {};
  const genres = Object.keys(GENRE_MAP);

  for (let i = 0; i < genres.length; i++) {
    const genreId = genres[i];
    try {
      results[genreId] = await fetchAppleMusicCharts(genreId, limit);
    } catch {
      results[genreId] = [];
    }
    // Small delay between requests
    if (i < genres.length - 1) {
      await new Promise(r => setTimeout(r, 200));
    }
  }

  return results;
}
