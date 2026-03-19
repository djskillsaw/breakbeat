/**
 * Spotify integration.
 *
 * Spotify's token endpoint doesn't support CORS, so Client Credentials flow
 * can't run directly from the browser. Two modes:
 *
 * 1. If VITE_SPOTIFY_ACCESS_TOKEN is set (e.g., generated at build time or via
 *    a serverless function), we use it to fetch real Spotify chart/playlist data.
 *
 * 2. Otherwise, we generate search URLs for tracks (always available).
 *
 * Spotify editorial playlist IDs for our genres:
 *   DnB:        37i9dQZF1DX6GJXiuZRisr  (Drum and Bass)
 *   Breakbeat:  37i9dQZF1DWZtZ8vUCzche  (mint)
 *   House:      37i9dQZF1DX2TRYkJECvfC  (House Music)
 *   Chill:      37i9dQZF1DX4WYpdgoIcn6  (Chill Tracks)
 *   Electronic: 37i9dQZF1DX4pb3YBgKkoP  (Electronic Concentration)
 */

const SPOTIFY_API = 'https://api.spotify.com/v1';

// Genre → Spotify editorial playlist IDs (multiple per genre for breadth)
const GENRE_PLAYLISTS = {
  dnb: ['37i9dQZF1DX6GJXiuZRisr'],
  breakbeat: ['37i9dQZF1DWZtZ8vUCzche'],
  house: ['37i9dQZF1DX2TRYkJECvfC'],
  chill: ['37i9dQZF1DX4WYpdgoIcn6'],
  electronic: ['37i9dQZF1DX4pb3YBgKkoP'],
};

function getAccessToken() {
  return import.meta.env.VITE_SPOTIFY_ACCESS_TOKEN || '';
}

export function hasSpotifyToken() {
  return Boolean(getAccessToken());
}

function mapSpotifyTrack(item, index, genreId) {
  const track = item.track || item;
  return {
    id: `spotify-${genreId}-${index}`,
    title: track.name || 'Unknown',
    artist: track.artists?.map(a => a.name).join(', ') || 'Unknown',
    spotifyUrl: track.external_urls?.spotify || '',
    artworkUrl: track.album?.images?.[1]?.url || track.album?.images?.[0]?.url || '',
    previewUrl: track.preview_url || '',
    popularity: track.popularity || 0,
    source: 'Spotify',
    rank: index + 1,
  };
}

/**
 * Fetch tracks from a Spotify editorial playlist (requires access token).
 */
async function fetchPlaylist(playlistId, limit = 15) {
  const token = getAccessToken();
  if (!token) return [];

  try {
    const res = await fetch(
      `${SPOTIFY_API}/playlists/${playlistId}/tracks?limit=${limit}&fields=items(track(name,artists,album(images),external_urls,preview_url,popularity))`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.items || [];
  } catch {
    return [];
  }
}

/**
 * Fetch Spotify chart data for a genre.
 */
export async function fetchSpotifyCharts(genreId, limit = 10) {
  const playlistIds = GENRE_PLAYLISTS[genreId] || [];
  if (playlistIds.length === 0 || !hasSpotifyToken()) return [];

  const allTracks = [];
  for (const pid of playlistIds) {
    const items = await fetchPlaylist(pid, limit);
    allTracks.push(...items);
  }

  return allTracks
    .map((item, i) => mapSpotifyTrack(item, i, genreId))
    .slice(0, limit);
}

/**
 * Fetch Spotify charts for all genres.
 */
export async function fetchAllSpotifyCharts(limit = 10) {
  if (!hasSpotifyToken()) return {};

  const results = {};
  const genres = Object.keys(GENRE_PLAYLISTS);

  for (let i = 0; i < genres.length; i++) {
    const genreId = genres[i];
    try {
      results[genreId] = await fetchSpotifyCharts(genreId, limit);
    } catch {
      results[genreId] = [];
    }
    if (i < genres.length - 1) {
      await new Promise(r => setTimeout(r, 100));
    }
  }

  return results;
}
