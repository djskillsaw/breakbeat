#!/usr/bin/env node
/**
 * Daily scraper for Austin blues venue calendars.
 * Fetches upcoming shows from venue websites, parses them,
 * and writes a JSON file consumed by the Blues Digest page.
 *
 * Runs via GitHub Actions cron or manually: node scripts/scrape-blues.mjs
 */

import { writeFileSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import * as cheerio from 'cheerio';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_PATH = resolve(__dirname, '..', 'src', 'data', 'scraped-shows.json');

// Utility: fetch with timeout and retries
async function fetchPage(url, retries = 2) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000);
      const res = await fetch(url, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; BluesDigestBot/1.0; +https://github.com/djskillsaw/breakbeat)',
        },
      });
      clearTimeout(timeout);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.text();
    } catch (err) {
      if (attempt === retries) {
        console.warn(`  Failed to fetch ${url}: ${err.message}`);
        return null;
      }
      await new Promise(r => setTimeout(r, 2000 * (attempt + 1)));
    }
  }
  return null;
}

// Generate the 7-day window starting today
function getWeekDates() {
  const dates = [];
  const now = new Date();
  for (let i = 0; i < 7; i++) {
    const d = new Date(now);
    d.setDate(d.getDate() + i);
    dates.push(d);
  }
  return dates;
}

function formatDate(d) {
  return d.toISOString().slice(0, 10); // YYYY-MM-DD
}

function formatDisplay(d) {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${days[d.getDay()]} ${months[d.getMonth()]} ${d.getDate()}`;
}

// Helper: try to find a Spotify search URL for an artist
function spotifySearch(artist) {
  if (!artist) return null;
  return `https://open.spotify.com/search/${encodeURIComponent(artist)}`;
}

function youtubeSearch(artist) {
  if (!artist) return null;
  return `https://music.youtube.com/search?q=${encodeURIComponent(artist)}`;
}

// ─── Venue Scrapers ──────────────────────────────────────────────

/**
 * Antone's Nightclub - antonesnightclub.com
 * Their site typically uses structured event listings.
 */
async function scrapeAntones() {
  const venueId = 'blues-1';
  const venueName = "Antone's Nightclub";
  const shows = [];

  const html = await fetchPage('https://www.antonesnightclub.com/calendar');
  if (!html) return { venueId, venueName, shows, error: 'fetch_failed' };

  try {
    const $ = cheerio.load(html);

    // Look for common event patterns - event listing containers
    // Antone's uses various CMS layouts; try multiple selectors
    const selectors = [
      '.event-listing', '.event-item', '.eventWrapper', '.event',
      '[class*="event"]', '.shows-list li', '.entry', 'article',
    ];

    for (const sel of selectors) {
      $(sel).each((_, el) => {
        const $el = $(el);
        const text = $el.text().replace(/\s+/g, ' ').trim();
        if (text.length < 10) return;

        // Try to extract date
        const dateMatch = text.match(/(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\w*\s+\d{1,2}/i)
          || text.match(/\d{1,2}\/\d{1,2}/);

        // Try to extract time
        const timeMatch = text.match(/\d{1,2}(?::\d{2})?\s*(?:PM|AM)/i);

        // Try to extract price
        const priceMatch = text.match(/\$\d+/) || (text.toLowerCase().includes('free') ? ['Free'] : null);

        // Get the title/headliner (usually the most prominent text)
        const titleEl = $el.find('h2, h3, h4, .title, .event-title, .event-name, a[href*="event"]').first();
        const headliner = titleEl.text().trim() || null;

        if (headliner && headliner.length > 2 && headliner.length < 120) {
          shows.push({
            date: dateMatch ? dateMatch[0] : null,
            headliner,
            opener: null,
            cover: priceMatch ? priceMatch[0] : null,
            doors: timeMatch ? timeMatch[0] : null,
            ticketUrl: 'https://www.antonesnightclub.com/calendar',
            spotifyUrl: spotifySearch(headliner),
            youtubeUrl: youtubeSearch(headliner),
          });
        }
      });

      if (shows.length > 0) break;
    }
  } catch (err) {
    console.warn(`  Parse error for ${venueName}: ${err.message}`);
  }

  return { venueId, venueName, shows: shows.slice(0, 10), error: shows.length === 0 ? 'no_events_found' : null };
}

/**
 * C-Boy's Heart & Soul - cboysheartandsoul.com
 */
async function scrapeCboys() {
  const venueId = 'blues-2';
  const venueName = "C-Boy's Heart & Soul";
  const shows = [];

  const html = await fetchPage('https://www.cboysheartandsoul.com/calendar');
  if (!html) return { venueId, venueName, shows, error: 'fetch_failed' };

  try {
    const $ = cheerio.load(html);

    $('[class*="event"], .sqs-block-content .eventlist--upcoming .eventlist-event, article').each((_, el) => {
      const $el = $(el);
      const text = $el.text().replace(/\s+/g, ' ').trim();
      if (text.length < 10) return;

      const dateMatch = text.match(/(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\w*\s+\d{1,2}/i)
        || text.match(/(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun)\w*[,.]?\s+\w+\s+\d{1,2}/i);
      const timeMatch = text.match(/\d{1,2}(?::\d{2})?\s*(?:PM|AM)/i);
      const priceMatch = text.match(/\$\d+/) || (text.toLowerCase().includes('free') ? ['Free'] : null);

      const titleEl = $el.find('h1, h2, h3, .eventlist-title, .event-title').first();
      const headliner = titleEl.text().trim() || null;

      if (headliner && headliner.length > 2 && headliner.length < 120) {
        shows.push({
          date: dateMatch ? dateMatch[0] : null,
          headliner,
          opener: null,
          cover: priceMatch ? priceMatch[0] : null,
          doors: timeMatch ? timeMatch[0] : null,
          ticketUrl: 'https://www.cboysheartandsoul.com/calendar',
          spotifyUrl: spotifySearch(headliner),
          youtubeUrl: youtubeSearch(headliner),
        });
      }
    });
  } catch (err) {
    console.warn(`  Parse error for ${venueName}: ${err.message}`);
  }

  return { venueId, venueName, shows: shows.slice(0, 10), error: shows.length === 0 ? 'no_events_found' : null };
}

/**
 * Continental Club - continentalclub.com/austin
 */
async function scrapeContinentalClub() {
  const venueId = 'blues-3';
  const venueName = 'The Continental Club';
  const shows = [];

  const html = await fetchPage('https://www.continentalclub.com/austin');
  if (!html) return { venueId, venueName, shows, error: 'fetch_failed' };

  try {
    const $ = cheerio.load(html);

    $('[class*="event"], .schedule-item, article, .sqs-block-content li, tr').each((_, el) => {
      const $el = $(el);
      const text = $el.text().replace(/\s+/g, ' ').trim();
      if (text.length < 8) return;

      const dateMatch = text.match(/(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\w*\s+\d{1,2}/i)
        || text.match(/(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun)\w*[,.]?\s+/i);
      const timeMatch = text.match(/\d{1,2}(?::\d{2})?\s*(?:PM|AM|pm|am)/i);
      const priceMatch = text.match(/\$\d+/) || (text.toLowerCase().includes('free') ? ['Free'] : null);

      const titleEl = $el.find('h2, h3, h4, a, strong, b, .title').first();
      const headliner = (titleEl.text().trim() || text.slice(0, 60)).replace(/\s+/g, ' ');

      if (headliner && headliner.length > 2 && headliner.length < 120 && !headliner.match(/^(menu|contact|about|home|calendar)/i)) {
        shows.push({
          date: dateMatch ? dateMatch[0] : null,
          headliner,
          opener: null,
          cover: priceMatch ? priceMatch[0] : null,
          doors: timeMatch ? timeMatch[0] : null,
          ticketUrl: 'https://www.continentalclub.com/austin',
          spotifyUrl: spotifySearch(headliner),
          youtubeUrl: youtubeSearch(headliner),
        });
      }
    });
  } catch (err) {
    console.warn(`  Parse error for ${venueName}: ${err.message}`);
  }

  return { venueId, venueName, shows: shows.slice(0, 10), error: shows.length === 0 ? 'no_events_found' : null };
}

/**
 * Elephant Room - elephantroom.com
 */
async function scrapeElephantRoom() {
  const venueId = 'blues-4';
  const venueName = 'Elephant Room';
  const shows = [];

  const html = await fetchPage('https://www.elephantroom.com/');
  if (!html) return { venueId, venueName, shows, error: 'fetch_failed' };

  try {
    const $ = cheerio.load(html);

    $('[class*="event"], article, .entry, .show, tr, li').each((_, el) => {
      const $el = $(el);
      const text = $el.text().replace(/\s+/g, ' ').trim();
      if (text.length < 8 || text.length > 500) return;

      const dateMatch = text.match(/(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\w*\s+\d{1,2}/i)
        || text.match(/(?:Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)/i);
      const timeMatch = text.match(/\d{1,2}(?::\d{2})?\s*(?:PM|AM|pm|am)/i);
      const priceMatch = text.match(/\$\d+/) || (text.toLowerCase().includes('free') ? ['Free'] : null);

      const titleEl = $el.find('h2, h3, h4, strong, b, a, .title').first();
      const headliner = titleEl.text().trim() || null;

      if (headliner && headliner.length > 2 && headliner.length < 120 && !headliner.match(/^(menu|contact|about|home|reserv)/i)) {
        shows.push({
          date: dateMatch ? dateMatch[0] : null,
          headliner,
          opener: null,
          cover: priceMatch ? priceMatch[0] : null,
          doors: timeMatch ? timeMatch[0] : null,
          ticketUrl: 'https://www.elephantroom.com/',
          spotifyUrl: spotifySearch(headliner),
          youtubeUrl: youtubeSearch(headliner),
        });
      }
    });
  } catch (err) {
    console.warn(`  Parse error for ${venueName}: ${err.message}`);
  }

  return { venueId, venueName, shows: shows.slice(0, 10), error: shows.length === 0 ? 'no_events_found' : null };
}

/**
 * The Saxon Pub - thesaxonpub.com
 */
async function scrapeSaxonPub() {
  const venueId = 'blues-5';
  const venueName = 'The Saxon Pub';
  const shows = [];

  const html = await fetchPage('https://thesaxonpub.com/calendar/');
  if (!html) return { venueId, venueName, shows, error: 'fetch_failed' };

  try {
    const $ = cheerio.load(html);

    $('[class*="event"], article, .entry, .show, li, tr').each((_, el) => {
      const $el = $(el);
      const text = $el.text().replace(/\s+/g, ' ').trim();
      if (text.length < 8 || text.length > 500) return;

      const dateMatch = text.match(/(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\w*\s+\d{1,2}/i)
        || text.match(/(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun)\w*/i);
      const timeMatch = text.match(/\d{1,2}(?::\d{2})?\s*(?:PM|AM|pm|am)/i);
      const priceMatch = text.match(/\$\d+/) || (text.toLowerCase().includes('free') ? ['Free'] : null);

      const titleEl = $el.find('h2, h3, h4, strong, b, a, .title').first();
      const headliner = titleEl.text().trim() || null;

      if (headliner && headliner.length > 2 && headliner.length < 120 && !headliner.match(/^(menu|contact|about|home|drink)/i)) {
        shows.push({
          date: dateMatch ? dateMatch[0] : null,
          headliner,
          opener: null,
          cover: priceMatch ? priceMatch[0] : null,
          doors: timeMatch ? timeMatch[0] : null,
          ticketUrl: 'https://thesaxonpub.com/calendar/',
          spotifyUrl: spotifySearch(headliner),
          youtubeUrl: youtubeSearch(headliner),
        });
      }
    });
  } catch (err) {
    console.warn(`  Parse error for ${venueName}: ${err.message}`);
  }

  return { venueId, venueName, shows: shows.slice(0, 10), error: shows.length === 0 ? 'no_events_found' : null };
}

/**
 * Parker Jazz Club - parkerjazzclub.com/events
 */
async function scrapeParkerJazz() {
  const venueId = 'blues-6';
  const venueName = 'Parker Jazz Club';
  const shows = [];

  const html = await fetchPage('https://www.parkerjazzclub.com/events');
  if (!html) return { venueId, venueName, shows, error: 'fetch_failed' };

  try {
    const $ = cheerio.load(html);

    $('[class*="event"], article, .entry, .show, .summary-item').each((_, el) => {
      const $el = $(el);
      const text = $el.text().replace(/\s+/g, ' ').trim();
      if (text.length < 8 || text.length > 500) return;

      const dateMatch = text.match(/(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\w*\s+\d{1,2}/i);
      const timeMatch = text.match(/\d{1,2}(?::\d{2})?\s*(?:PM|AM|pm|am)/i);
      const priceMatch = text.match(/\$\d+/) || (text.toLowerCase().includes('free') ? ['Free'] : null);

      const titleEl = $el.find('h2, h3, h4, .summary-title, .event-title, a').first();
      const headliner = titleEl.text().trim() || null;

      if (headliner && headliner.length > 2 && headliner.length < 120 && !headliner.match(/^(menu|contact|about|home|private)/i)) {
        shows.push({
          date: dateMatch ? dateMatch[0] : null,
          headliner,
          opener: null,
          cover: priceMatch ? priceMatch[0] : null,
          doors: timeMatch ? timeMatch[0] : null,
          ticketUrl: 'https://www.parkerjazzclub.com/events',
          spotifyUrl: spotifySearch(headliner),
          youtubeUrl: youtubeSearch(headliner),
        });
      }
    });
  } catch (err) {
    console.warn(`  Parse error for ${venueName}: ${err.message}`);
  }

  return { venueId, venueName, shows: shows.slice(0, 10), error: shows.length === 0 ? 'no_events_found' : null };
}

// ─── Main ────────────────────────────────────────────────────────

async function main() {
  console.log('Austin Blues Digest — Daily Scraper');
  console.log(`Date: ${new Date().toISOString()}`);
  console.log('---');

  const weekDates = getWeekDates();
  console.log(`Week window: ${formatDisplay(weekDates[0])} → ${formatDisplay(weekDates[6])}`);
  console.log('');

  const scrapers = [
    { name: "Antone's", fn: scrapeAntones },
    { name: "C-Boy's", fn: scrapeCboys },
    { name: 'Continental Club', fn: scrapeContinentalClub },
    { name: 'Elephant Room', fn: scrapeElephantRoom },
    { name: 'The Saxon Pub', fn: scrapeSaxonPub },
    { name: 'Parker Jazz Club', fn: scrapeParkerJazz },
  ];

  const results = [];

  for (const scraper of scrapers) {
    console.log(`Scraping ${scraper.name}...`);
    const result = await scraper.fn();
    console.log(`  Found ${result.shows.length} shows${result.error ? ` (${result.error})` : ''}`);
    results.push(result);
    // Be polite between requests
    await new Promise(r => setTimeout(r, 1500));
  }

  const output = {
    scrapedAt: new Date().toISOString(),
    weekStart: formatDate(weekDates[0]),
    weekEnd: formatDate(weekDates[6]),
    weekDates: weekDates.map(d => ({ iso: formatDate(d), display: formatDisplay(d) })),
    venues: results,
  };

  const totalShows = results.reduce((sum, v) => sum + v.shows.length, 0);
  const failedVenues = results.filter(v => v.error).length;

  console.log('');
  console.log(`Total shows scraped: ${totalShows}`);
  console.log(`Venues with errors: ${failedVenues}/${results.length}`);

  mkdirSync(dirname(OUTPUT_PATH), { recursive: true });
  writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2) + '\n');
  console.log(`Written to: ${OUTPUT_PATH}`);
}

main().catch(err => {
  console.error('Scraper failed:', err);
  process.exit(1);
});
