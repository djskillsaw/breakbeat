import { useState, useEffect } from "react";
import { tracks } from "./data/tracks";
import { mixes } from "./data/mixes";
import { shows, eventLinks } from "./data/shows";
import { localDJs } from "./data/localDJs";

const STORAGE_KEY = "breakbeat_saved";

function StarIcon({ filled }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill={filled ? "#f59e0b" : "none"} stroke="#f59e0b" strokeWidth="2">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function ExternalLinkIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}

function TrackCard({ track, saved, onToggleSave }) {
  return (
    <div style={styles.card}>
      <div style={styles.cardHeader}>
        <div>
          <div style={styles.trackTitle}>{track.title}</div>
          <div style={styles.trackArtist}>{track.artist}</div>
        </div>
        <button onClick={() => onToggleSave(track.id)} style={styles.starBtn} aria-label="Save track">
          <StarIcon filled={saved} />
        </button>
      </div>
      <div style={styles.tags}>
        <span style={styles.tag}>{track.genre}</span>
        <span style={{ ...styles.tag, background: "#1e3a5f" }}>{track.bpm} BPM</span>
        <span style={{ ...styles.tag, background: "#1a2e1a" }}>{track.released}</span>
      </div>
      <div style={styles.vibe}>{track.vibe}</div>
      <div style={styles.btnRow}>
        <a href={track.beatportUrl} target="_blank" rel="noreferrer" style={{ ...styles.btn, background: "#f97316" }}>
          Beatport <ExternalLinkIcon />
        </a>
        <a href={track.appleMusicUrl} target="_blank" rel="noreferrer" style={{ ...styles.btn, background: "#fb2d55" }}>
          Apple Music <ExternalLinkIcon />
        </a>
      </div>
    </div>
  );
}

function MixCard({ mix }) {
  return (
    <div style={styles.card}>
      <div style={styles.cardHeader}>
        <div>
          <div style={styles.trackTitle}>{mix.title}</div>
          <div style={styles.trackArtist}>{mix.artist}</div>
        </div>
        <span style={styles.duration}>{mix.duration}</span>
      </div>
      <div style={styles.tags}>
        <span style={{ ...styles.tag, background: "#2d1b4e" }}>{mix.source}</span>
        <span style={{ ...styles.tag, background: "#1e3a5f" }}>{mix.rating}</span>
        <span style={{ ...styles.tag, background: "#1a2e1a" }}>{mix.date}</span>
      </div>
      <div style={styles.vibe}>{mix.vibe}</div>
      <div style={styles.btnRow}>
        <a href={mix.soundcloudUrl} target="_blank" rel="noreferrer" style={{ ...styles.btn, background: "#f97316" }}>
          SoundCloud <ExternalLinkIcon />
        </a>
        <a href={mix.youtubeUrl} target="_blank" rel="noreferrer" style={{ ...styles.btn, background: "#dc2626" }}>
          YouTube <ExternalLinkIcon />
        </a>
        <a href={mix.raUrl} target="_blank" rel="noreferrer" style={{ ...styles.btn, background: "#374151" }}>
          Source <ExternalLinkIcon />
        </a>
      </div>
    </div>
  );
}

function ShowCard({ show }) {
  return (
    <div style={styles.card}>
      <div style={styles.trackTitle}>{show.promoter}</div>
      <div style={styles.trackArtist}>{show.venue}</div>
      <div style={{ ...styles.tags, marginTop: 8 }}>
        <span style={{ ...styles.tag, background: "#1e3a5f" }}>{show.date}</span>
      </div>
      <div style={styles.vibe}>{show.details}</div>
      <div style={styles.btnRow}>
        <a href={show.instagram} target="_blank" rel="noreferrer" style={{ ...styles.btn, background: "#7c3aed" }}>
          Instagram <ExternalLinkIcon />
        </a>
        <a href={show.tickets} target="_blank" rel="noreferrer" style={{ ...styles.btn, background: "#0ea5e9" }}>
          Find Tickets <ExternalLinkIcon />
        </a>
      </div>
    </div>
  );
}

function LocalDJCard({ dj }) {
  return (
    <div style={styles.card}>
      <div style={styles.cardHeader}>
        <div>
          <div style={styles.trackTitle}>{dj.name}</div>
          <div style={styles.trackArtist}>{dj.genres}</div>
        </div>
        <a href={dj.instagram} target="_blank" rel="noreferrer" style={{ ...styles.btn, background: "#7c3aed", padding: "4px 10px" }}>
          IG <ExternalLinkIcon />
        </a>
      </div>
      <div style={styles.vibe}>{dj.bio}</div>

      <div style={{ fontSize: 11, fontWeight: 700, color: "#6b7280", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>
        Sets
      </div>
      {dj.sets.map((set, i) => (
        <div key={i} style={{ marginBottom: 10 }}>
          <div style={{ fontSize: 13, color: "#d1d5db", marginBottom: 6 }}>{set.title}</div>
          <div style={styles.btnRow}>
            <a href={set.soundcloudUrl} target="_blank" rel="noreferrer" style={{ ...styles.btn, background: "#f97316" }}>
              SoundCloud <ExternalLinkIcon />
            </a>
            <a href={set.youtubeUrl} target="_blank" rel="noreferrer" style={{ ...styles.btn, background: "#dc2626" }}>
              YouTube <ExternalLinkIcon />
            </a>
          </div>
        </div>
      ))}

      <div style={{ fontSize: 11, fontWeight: 700, color: "#6b7280", letterSpacing: "0.08em", textTransform: "uppercase", margin: "12px 0 8px" }}>
        Upcoming Shows
      </div>
      {dj.upcomingShows.map((show, i) => (
        <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
          <div>
            <span style={{ fontSize: 13, color: "#d1d5db" }}>{show.venue}</span>
            <span style={{ fontSize: 12, color: "#6b7280", marginLeft: 8 }}>{show.date}</span>
          </div>
          <a href={show.tickets} target="_blank" rel="noreferrer" style={{ ...styles.btn, background: "#0ea5e9", padding: "4px 10px" }}>
            Tickets <ExternalLinkIcon />
          </a>
        </div>
      ))}
    </div>
  );
}

const TABS = ["Hottest Tracks", "DJ Mixes", "Austin Shows", "Local DJs", "Saved"];

export default function BreakbeatDigest() {
  const [activeTab, setActiveTab] = useState(0);
  const [saved, setSaved] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
  }, [saved]);

  function toggleSave(id) {
    setSaved((prev) => prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]);
  }

  const savedTracks = tracks.filter((t) => saved.includes(t.id));

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.logo}>⚡ BREAKBEAT DIGEST</div>
        <div style={styles.subtitle}>Weekly · Curated · Uncompromising</div>
      </div>

      <div style={styles.tabBar}>
        {TABS.map((tab, i) => (
          <button
            key={tab}
            onClick={() => setActiveTab(i)}
            style={{ ...styles.tab, ...(activeTab === i ? styles.tabActive : {}) }}
          >
            {tab}
            {i === 4 && saved.length > 0 && (
              <span style={styles.badge}>{saved.length}</span>
            )}
          </button>
        ))}
      </div>

      <div style={styles.content}>
        {activeTab === 0 && (
          <>
            <div style={styles.sectionLabel}>🔥 March 2026 — Highest Rated Releases</div>
            {tracks.map((track) => (
              <TrackCard
                key={track.id}
                track={track}
                saved={saved.includes(track.id)}
                onToggleSave={toggleSave}
              />
            ))}
          </>
        )}

        {activeTab === 1 && (
          <>
            <div style={styles.sectionLabel}>🎧 Top-Rated Mixes — Sourced from RA, Bandcamp & Rate Your Music</div>
            {mixes.map((mix) => (
              <MixCard key={mix.id} mix={mix} />
            ))}
          </>
        )}

        {activeTab === 2 && (
          <>
            <div style={styles.sectionLabel}>🎤 Austin Promoters & Upcoming Shows</div>
            {shows.map((show) => (
              <ShowCard key={show.id} show={show} />
            ))}
            <div style={styles.sectionLabel} data-secondary>📅 Event Calendars</div>
            <div style={styles.btnRow}>
              {eventLinks.map((link) => (
                <a key={link.url} href={link.url} target="_blank" rel="noreferrer" style={{ ...styles.btn, background: "#374151" }}>
                  {link.label} <ExternalLinkIcon />
                </a>
              ))}
            </div>
          </>
        )}

        {activeTab === 3 && (
          <>
            <div style={styles.sectionLabel}>🎧 Austin Local DJs — Sets & Upcoming Shows</div>
            {localDJs.map((dj) => (
              <LocalDJCard key={dj.id} dj={dj} />
            ))}
          </>
        )}

        {activeTab === 4 && (
          <>
            <div style={styles.sectionLabel}>⭐ Your Saved Tracks</div>
            {savedTracks.length === 0 ? (
              <div style={styles.empty}>No saved tracks yet. Star tracks from the Hottest Tracks tab.</div>
            ) : (
              savedTracks.map((track) => (
                <TrackCard
                  key={track.id}
                  track={track}
                  saved
                  onToggleSave={toggleSave}
                />
              ))
            )}
          </>
        )}
      </div>

      <div style={styles.footer}>
        Updated weekly every Monday · Curated from Beatport, Resident Advisor, Bandcamp & Rate Your Music
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "#0a0a0a",
    color: "#e5e7eb",
    fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
    maxWidth: 680,
    margin: "0 auto",
    padding: "0 0 60px",
  },
  header: {
    padding: "32px 24px 20px",
    borderBottom: "1px solid #1f2937",
  },
  logo: {
    fontSize: 26,
    fontWeight: 800,
    letterSpacing: "0.05em",
    color: "#f97316",
  },
  subtitle: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 4,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
  },
  tabBar: {
    display: "flex",
    borderBottom: "1px solid #1f2937",
    overflowX: "auto",
  },
  tab: {
    padding: "12px 18px",
    background: "none",
    border: "none",
    color: "#6b7280",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    whiteSpace: "nowrap",
    borderBottom: "2px solid transparent",
    position: "relative",
  },
  tabActive: {
    color: "#f97316",
    borderBottom: "2px solid #f97316",
  },
  badge: {
    marginLeft: 6,
    background: "#f97316",
    color: "#000",
    borderRadius: 10,
    padding: "1px 6px",
    fontSize: 11,
    fontWeight: 700,
  },
  content: {
    padding: "20px 16px",
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: 700,
    color: "#6b7280",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    marginBottom: 16,
    marginTop: 8,
  },
  card: {
    background: "#111827",
    border: "1px solid #1f2937",
    borderRadius: 10,
    padding: "16px",
    marginBottom: 12,
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  trackTitle: {
    fontSize: 15,
    fontWeight: 700,
    color: "#f9fafb",
  },
  trackArtist: {
    fontSize: 13,
    color: "#9ca3af",
    marginTop: 2,
  },
  starBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: 4,
    lineHeight: 0,
  },
  duration: {
    fontSize: 12,
    color: "#6b7280",
    whiteSpace: "nowrap",
    paddingTop: 2,
  },
  tags: {
    display: "flex",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 10,
  },
  tag: {
    fontSize: 11,
    fontWeight: 600,
    background: "#1f2937",
    color: "#9ca3af",
    borderRadius: 4,
    padding: "2px 8px",
  },
  vibe: {
    fontSize: 12,
    color: "#6b7280",
    fontStyle: "italic",
    marginBottom: 12,
  },
  btnRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
  },
  btn: {
    display: "inline-flex",
    alignItems: "center",
    gap: 5,
    fontSize: 12,
    fontWeight: 600,
    color: "#fff",
    textDecoration: "none",
    padding: "6px 12px",
    borderRadius: 6,
  },
  empty: {
    color: "#4b5563",
    fontSize: 14,
    textAlign: "center",
    padding: "40px 0",
  },
  footer: {
    textAlign: "center",
    fontSize: 11,
    color: "#374151",
    padding: "24px 16px 0",
    borderTop: "1px solid #111827",
  },
};
