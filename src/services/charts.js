/**
 * Unified chart aggregator.
 * Fetches from all available sources, merges, deduplicates, and ranks.
 */

import { fetchAllCharts as fetchLastfmCharts, hasApiKey as hasLastfmKey } from './lastfm';
import { fetchAllAppleCharts } from './apple-music';
import { fetchAllSpotifyCharts, hasSpotifyToken } from './spotify';
import { mergeLinks } from './links';

const GENRE_IDS = ['dnb', 'breakbeat', 'house', 'chill', 'electronic', 'blues'];

/**
 * Normalize a string for deduplication matching.
 */
function normalize(str) {
  return (str || '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .replace(/feat.*$/, '')
    .replace(/remix.*$/, '')
    .trim();
}

/**
 * Check if two tracks are likely the same.
 */
function isSameTrack(a, b) {
  const titleA = normalize(a.title);
  const titleB = normalize(b.title);
  const artistA = normalize(a.artist);
  const artistB = normalize(b.artist);

  // Exact match
  if (titleA === titleB && artistA === artistB) return true;

  // One contains the other (handles feat. variations)
  if (titleA && titleB && artistA && artistB) {
    const titleMatch = titleA.includes(titleB) || titleB.includes(titleA);
    const artistMatch = artistA.includes(artistB) || artistB.includes(artistA);
    if (titleMatch && artistMatch) return true;
  }

  return false;
}

/**
 * Merge tracks from multiple sources for a single genre.
 * Deduplicates and combines metadata.
 */
function mergeGenreTracks(sourceTracks) {
  const merged = [];

  for (const tracks of sourceTracks) {
    for (const track of tracks) {
      const existing = merged.find(m => isSameTrack(m, track));

      if (existing) {
        // Merge sources and links
        if (!existing.sources.includes(track.source)) {
          existing.sources.push(track.source);
        }
        // Keep best artwork
        if (!existing.artworkUrl && track.artworkUrl) {
          existing.artworkUrl = track.artworkUrl;
        }
        // Merge explicit URLs
        if (track.spotifyUrl) existing.links.spotify = track.spotifyUrl;
        if (track.appleMusicUrl) existing.links.appleMusic = track.appleMusicUrl;
        if (track.lastfmUrl) existing.links.lastfm = track.lastfmUrl;
        if (track.previewUrl && !existing.previewUrl) existing.previewUrl = track.previewUrl;
        // Boost score for appearing on multiple charts
        existing.chartScore += 10;
        // Keep best stats
        if (track.playcount) existing.playcount = Math.max(existing.playcount || 0, track.playcount);
        if (track.listeners) existing.listeners = Math.max(existing.listeners || 0, track.listeners);
        if (track.popularity) existing.popularity = Math.max(existing.popularity || 0, track.popularity);
      } else {
        // New track — generate all platform links
        const links = mergeLinks(
          {
            ...(track.spotifyUrl ? { spotify: track.spotifyUrl } : {}),
            ...(track.appleMusicUrl ? { appleMusic: track.appleMusicUrl } : {}),
            ...(track.lastfmUrl ? { lastfm: track.lastfmUrl } : {}),
          },
          track.artist,
          track.title
        );

        merged.push({
          id: track.id,
          title: track.title,
          artist: track.artist,
          sources: [track.source],
          links,
          artworkUrl: track.artworkUrl || track.image || '',
          previewUrl: track.previewUrl || '',
          playcount: track.playcount || 0,
          listeners: track.listeners || 0,
          popularity: track.popularity || 0,
          chartScore: track.rank ? (11 - Math.min(track.rank, 10)) : 5, // Higher rank = higher score
          rank: track.rank || 99,
        });
      }
    }
  }

  // Sort by chart score (multi-source tracks float up), then by original rank
  merged.sort((a, b) => b.chartScore - a.chartScore || a.rank - b.rank);

  // Re-rank
  return merged.map((track, i) => ({ ...track, rank: i + 1 }));
}

/**
 * Fetch and aggregate charts from all available sources.
 * Returns { [genreId]: Track[], sources: string[] }
 */
export async function fetchAggregatedCharts(limit = 10) {
  const activeSources = [];
  const promises = [];

  // Last.fm
  if (hasLastfmKey()) {
    activeSources.push('Last.fm');
    promises.push(fetchLastfmCharts(limit).catch(() => ({})));
  } else {
    promises.push(Promise.resolve({}));
  }

  // Apple Music (always available — no key needed)
  activeSources.push('Apple Music');
  promises.push(fetchAllAppleCharts(25).catch(() => ({})));

  // Spotify (only if token available)
  if (hasSpotifyToken()) {
    activeSources.push('Spotify');
    promises.push(fetchAllSpotifyCharts(limit).catch(() => ({})));
  } else {
    promises.push(Promise.resolve({}));
  }

  const [lastfmData, appleData, spotifyData] = await Promise.all(promises);

  const results = {};
  for (const genreId of GENRE_IDS) {
    const sourceTracks = [
      lastfmData[genreId] || [],
      appleData[genreId] || [],
      spotifyData[genreId] || [],
    ].filter(arr => arr.length > 0);

    if (sourceTracks.length > 0) {
      results[genreId] = mergeGenreTracks(sourceTracks).slice(0, limit);
    } else {
      results[genreId] = [];
    }
  }

  return { charts: results, sources: activeSources };
}

/**
 * Check which sources are available.
 */
export function getAvailableSources() {
  const sources = [];
  if (hasLastfmKey()) sources.push('Last.fm');
  sources.push('Apple Music'); // Always available
  if (hasSpotifyToken()) sources.push('Spotify');
  return sources;
}
