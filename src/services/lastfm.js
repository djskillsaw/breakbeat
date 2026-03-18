const BASE_URL = 'https://ws.audioscrobbler.com/2.0/';

function getApiKey() {
  return import.meta.env.VITE_LASTFM_API_KEY || '';
}

async function apiCall(params) {
  const apiKey = getApiKey();
  if (!apiKey) return null;

  const url = new URL(BASE_URL);
  url.searchParams.set('api_key', apiKey);
  url.searchParams.set('format', 'json');
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`Last.fm API error: ${res.status}`);
  return res.json();
}

function mapTrack(track, index, tag) {
  return {
    id: `lastfm-${tag}-${index}`,
    title: track.name || 'Unknown',
    artist: track.artist?.name || track.artist || 'Unknown',
    playcount: Number(track.playcount) || 0,
    listeners: Number(track.listeners) || 0,
    lastfmUrl: track.url || '',
    image: track.image?.find(i => i.size === 'large')?.['#text'] || '',
    source: 'Last.fm',
    rank: index + 1,
  };
}

export async function fetchGlobalTopTracks(limit = 10) {
  const data = await apiCall({ method: 'chart.gettoptracks', limit: String(limit) });
  if (!data?.tracks?.track) return [];
  return data.tracks.track.map((t, i) => mapTrack(t, i, 'global'));
}

export async function fetchGenreTopTracks(tag, limit = 10) {
  const data = await apiCall({ method: 'tag.gettoptracks', tag, limit: String(limit) });
  if (!data?.tracks?.track) return [];
  return data.tracks.track.map((t, i) => mapTrack(t, i, tag));
}

const GENRE_TAGS = {
  dnb: 'drum-and-bass',
  breakbeat: 'breakbeat',
  house: 'house',
  chill: 'downtempo',
  electronic: 'electronic',
};

export async function fetchAllCharts(limit = 10) {
  const results = {};
  const entries = Object.entries(GENRE_TAGS);

  // Fetch sequentially with small delay to respect rate limits
  for (let i = 0; i < entries.length; i++) {
    const [genreId, tag] = entries[i];
    try {
      results[genreId] = await fetchGenreTopTracks(tag, limit);
    } catch {
      results[genreId] = [];
    }
    // Small delay between requests (Last.fm allows 5 req/sec)
    if (i < entries.length - 1) {
      await new Promise(r => setTimeout(r, 250));
    }
  }

  return results;
}

export function hasApiKey() {
  return Boolean(getApiKey());
}
