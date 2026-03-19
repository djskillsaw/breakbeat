/**
 * Cross-platform link generator.
 * Given an artist + title, generates search/deep links for every major platform.
 */

function encode(str) {
  return encodeURIComponent(str);
}

function searchQuery(artist, title) {
  return `${artist} ${title}`;
}

export function generatePlatformLinks(artist, title) {
  const q = searchQuery(artist, title);
  const eq = encode(q);

  return {
    spotify: `https://open.spotify.com/search/${eq}`,
    appleMusic: `https://music.apple.com/us/search?term=${eq}`,
    beatport: `https://www.beatport.com/search?q=${eq}`,
    soundcloud: `https://soundcloud.com/search/sounds?q=${eq}`,
    youtube: `https://music.youtube.com/search?q=${eq}`,
    mixcloud: `https://www.mixcloud.com/search/?q=${eq}`,
    deezer: `https://www.deezer.com/search/${eq}`,
    tidal: `https://listen.tidal.com/search?q=${eq}`,
    bandcamp: `https://bandcamp.com/search?q=${eq}`,
  };
}

/**
 * Merge explicit links (from API data) with generated fallbacks.
 * Explicit links take priority.
 */
export function mergeLinks(explicit, artist, title) {
  const generated = generatePlatformLinks(artist, title);
  return { ...generated, ...explicit };
}

/**
 * Platform metadata for rendering buttons.
 */
export const PLATFORMS = {
  spotify: { label: 'Spotify', color: '#1db954' },
  appleMusic: { label: 'Apple Music', color: '#fb2d55' },
  beatport: { label: 'Beatport', color: '#f97316' },
  soundcloud: { label: 'SoundCloud', color: '#ff5500' },
  youtube: { label: 'YouTube Music', color: '#ff0000' },
  deezer: { label: 'Deezer', color: '#a238ff' },
  tidal: { label: 'Tidal', color: '#00ffff' },
  bandcamp: { label: 'Bandcamp', color: '#1da0c3' },
  mixcloud: { label: 'Mixcloud', color: '#5000ff' },
  lastfm: { label: 'Last.fm', color: '#d51007' },
};

/**
 * Default platforms to show on track cards (ordered by priority).
 */
export const DEFAULT_TRACK_PLATFORMS = [
  'spotify', 'appleMusic', 'beatport', 'soundcloud', 'youtube',
];
