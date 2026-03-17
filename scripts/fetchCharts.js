/**
 * fetchCharts.js
 * Pulls top tracks per genre from Last.fm, enriches with BPM + Spotify URL
 * via the Spotify audio features API, then writes src/data/chartTracks.js.
 *
 * Usage:
 *   npm run fetch-charts
 *
 * Required .env keys:
 *   LASTFM_API_KEY
 *   SPOTIFY_CLIENT_ID
 *   SPOTIFY_CLIENT_SECRET
 */

import { writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import "dotenv/config";

const __dirname = dirname(fileURLToPath(import.meta.url));

const LASTFM_KEY = process.env.LASTFM_API_KEY;
const SPOTIFY_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_SECRET = process.env.SPOTIFY_CLIENT_SECRET;

const GENRE_TAGS = [
  { id: "dnb",        label: "Drum & Bass", emoji: "🥁", tag: "drum-and-bass",  accentColor: "#1e3a5f" },
  { id: "breakbeat",  label: "Breakbeat",   emoji: "⚡", tag: "breakbeat",       accentColor: "#3b1a0a" },
  { id: "chill",      label: "Chill",       emoji: "😌", tag: "downtempo",       accentColor: "#0d2b1a" },
  { id: "house",      label: "House",       emoji: "🏠", tag: "house",           accentColor: "#1a1035" },
  { id: "electronic", label: "Electronic",  emoji: "🎛️", tag: "electronic",      accentColor: "#2d1b00" },
];

const TRACKS_PER_GENRE = 5;

// ── Spotify ──────────────────────────────────────────────────────────────────

async function getSpotifyToken() {
  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: "Basic " + Buffer.from(`${SPOTIFY_ID}:${SPOTIFY_SECRET}`).toString("base64"),
    },
    body: "grant_type=client_credentials",
  });
  const data = await res.json();
  if (!data.access_token) throw new Error("Spotify token fetch failed: " + JSON.stringify(data));
  return data.access_token;
}

async function spotifyEnrich(token, artist, title) {
  const q = encodeURIComponent(`track:${title} artist:${artist}`);
  const searchRes = await fetch(
    `https://api.spotify.com/v1/search?q=${q}&type=track&limit=1`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  const searchData = await searchRes.json();
  const track = searchData.tracks?.items?.[0];
  if (!track) return null;

  const featRes = await fetch(
    `https://api.spotify.com/v1/audio-features/${track.id}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  const feat = await featRes.json();

  return {
    bpm: feat.tempo ? Math.round(feat.tempo) : null,
    spotifyUrl: track.external_urls.spotify,
    releaseYear: track.album?.release_date?.slice(0, 4) ?? null,
    vibe: buildVibe(feat),
  };
}

function buildVibe(feat) {
  const parts = [];

  if (feat.energy > 0.8)      parts.push("high-energy");
  else if (feat.energy > 0.5) parts.push("mid-tempo");
  else                        parts.push("laid-back");

  if (feat.valence > 0.7)      parts.push("euphoric");
  else if (feat.valence > 0.4) parts.push("melodic");
  else                         parts.push("dark");

  if (feat.danceability > 0.75) parts.push("dancefloor-ready");
  else if (feat.acousticness > 0.5) parts.push("organic");

  return parts.join(", ");
}

// ── Last.fm ───────────────────────────────────────────────────────────────────

async function getLastFmTopTracks(tag, limit) {
  const url =
    `https://ws.audioscrobbler.com/2.0/?method=tag.gettoptracks` +
    `&tag=${encodeURIComponent(tag)}&limit=${limit}` +
    `&api_key=${LASTFM_KEY}&format=json`;
  const res = await fetch(url);
  const data = await res.json();
  return data.tracks?.track ?? [];
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  if (!LASTFM_KEY || !SPOTIFY_ID || !SPOTIFY_SECRET) {
    console.error(
      "❌  Missing env vars. Copy .env.example → .env and fill in your keys."
    );
    process.exit(1);
  }

  console.log("🔑  Getting Spotify token…");
  const spotifyToken = await getSpotifyToken();

  const genres = [];

  for (const genre of GENRE_TAGS) {
    console.log(`\n🎵  Last.fm top tracks — ${genre.tag}`);
    const lastfmTracks = await getLastFmTopTracks(genre.tag, TRACKS_PER_GENRE);

    const tracks = [];
    for (const t of lastfmTracks) {
      const artist = t.artist.name;
      const title = t.name;
      process.stdout.write(`   ↳ ${artist} — ${title} … `);

      const spotify = await spotifyEnrich(spotifyToken, artist, title);

      console.log(spotify ? `${spotify.bpm} BPM` : "not found on Spotify");

      tracks.push({
        id: `ct-${genre.id}-${tracks.length + 1}`,
        title,
        artist,
        bpm: spotify?.bpm ?? null,
        released: spotify?.releaseYear ?? "—",
        vibe: spotify?.vibe ?? "",
        beatportUrl: `https://www.beatport.com/search?q=${encodeURIComponent(`${artist} ${title}`)}`,
        appleMusicUrl: `https://music.apple.com/us/search?term=${encodeURIComponent(`${artist} ${title}`)}`,
        spotifyUrl: spotify?.spotifyUrl ?? null,
      });

      // Respect Spotify rate limits
      await new Promise((r) => setTimeout(r, 250));
    }

    genres.push({ ...genre, tracks });
  }

  const now = new Date().toUTCString();
  const output =
    `// Auto-generated by scripts/fetchCharts.js\n` +
    `// Last updated: ${now}\n` +
    `// Re-run with: npm run fetch-charts\n\n` +
    `export const chartGenres = ${JSON.stringify(genres, null, 2)};\n`;

  const outPath = resolve(__dirname, "../src/data/chartTracks.js");
  writeFileSync(outPath, output);
  console.log(`\n✅  Written to src/data/chartTracks.js`);
  console.log(`    Run 'npm run build' to publish the updated charts.`);
}

main().catch((err) => {
  console.error("❌", err.message);
  process.exit(1);
});
