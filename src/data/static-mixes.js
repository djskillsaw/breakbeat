export const dnbMixes = [
  { id: 1, title: 'RA.1028', artist: 'DJ Plead', genre: 'breakbeat', duration: '1h+', date: 'Mar 2026', source: 'Resident Advisor Podcast', rating: 'RA Featured', vibe: 'Breaks, jungle, experimental club', soundcloudUrl: 'https://soundcloud.com/resident-advisor', youtubeUrl: 'https://www.youtube.com/results?search_query=DJ+Plead+RA+1028+mix', raUrl: 'https://ra.co/podcast/1047' },
  { id: 2, title: 'RA.1029', artist: 'Valentina Magaletti', genre: 'electronic', duration: '1h 16m', date: 'Mar 2026', source: 'Resident Advisor Podcast', rating: 'RA Featured', vibe: 'Free jazz, gqom, industrial, percussive', soundcloudUrl: 'https://soundcloud.com/resident-advisor/ra-1029-valentina-magaletti', youtubeUrl: 'https://www.youtube.com/results?search_query=Valentina+Magaletti+RA+1029', raUrl: 'https://ra.co/podcast/1048' },
  { id: 3, title: 'Metalheadz on Kool FM', artist: 'Doc Scott', genre: 'dnb', duration: '2h', date: 'Jan 2026', source: 'Metalheadz / Kool FM', rating: 'Verified Live', vibe: 'Dark, rolling, future d&b', soundcloudUrl: 'https://soundcloud.com/metalheadz/metalheadz-on-kool-fm-doc-scott-22-january-2026', youtubeUrl: 'https://www.youtube.com/results?search_query=Doc+Scott+Metalheadz+Kool+FM+2026', raUrl: 'https://www.rinse.fm/episodes/metalheadz-22-01-2026-2100' },
  { id: 4, title: 'Radio 1 Drum & Bass Mix', artist: 'Blossom', genre: 'dnb', duration: '30m', date: 'Feb 2026', source: 'BBC Radio 1', rating: 'BBC Featured', vibe: 'Fresh, energetic, liquid & heavy', soundcloudUrl: 'https://soundcloud.com/search/sounds?q=blossom%20radio%201%20drum%20bass%202026', youtubeUrl: 'https://www.youtube.com/results?search_query=Blossom+BBC+Radio+1+Drum+Bass+Mix+2026', raUrl: 'https://www.1001tracklists.com/tracklist/2hs14cmk/blossom-radio-1s-drum-bass-mix-2026-02-22.html' },
  { id: 5, title: 'Ghost Promises EP Launch', artist: 'Philth & Ella Sopp', genre: 'dnb', duration: '1h+', date: 'Mar 2026', source: 'Metalheadz', rating: 'Label Release', vibe: 'Atmospheric, emotional, heavy low-end', soundcloudUrl: 'https://soundcloud.com/metalheadz', youtubeUrl: 'https://www.youtube.com/results?search_query=Philth+Ella+Sopp+Ghost+Promises+Metalheadz', raUrl: 'https://metalheadz.bandcamp.com/album/ghost-promises-ep' },
  { id: 6, title: 'EATBRAIN Podcast #215', artist: 'Paimon', genre: 'dnb', duration: '1h+', date: 'Feb 2026', source: 'EATBRAIN', rating: 'Label Curated', vibe: 'Neurofunk, heavy, relentless', soundcloudUrl: 'https://soundcloud.com/eatbrain', youtubeUrl: 'https://www.youtube.com/results?search_query=Paimon+EATBRAIN+Podcast+215', raUrl: 'https://bassblog.pro/' },
];

export const houseMixes = [
  { id: 'hm1', title: 'RA.1026 — Detroit Love b3b', artist: 'Carl Craig, Moodymann & Mike Banks', genre: 'house', duration: '1h 53m', date: 'Feb 2026', source: 'Resident Advisor Podcast', rating: 'Legendary — Live from Movement', vibe: 'Detroit techno, house, gospel keys, electro', soundcloudUrl: 'https://soundcloud.com/resident-advisor/ra-1026-carl-craig-moodymann', youtubeUrl: 'https://www.youtube.com/results?search_query=Carl+Craig+Moodymann+Mike+Banks+RA+1026', mixcloudUrl: 'https://ra.co/podcast/1045' },
  { id: 'hm2', title: 'RA.1027', artist: 'JADALAREIGN', genre: 'house', duration: '1h 57m', date: 'Feb 2026', source: 'Resident Advisor Podcast', rating: 'RA Featured', vibe: 'Groove, texture, Black excellence, NYC house', soundcloudUrl: 'https://soundcloud.com/resident-advisor', youtubeUrl: 'https://www.youtube.com/results?search_query=JADALAREIGN+RA+1027+mix', mixcloudUrl: 'https://ra.co/podcast' },
  { id: 'hm3', title: 'RA.1030', artist: 'Main Phase', genre: 'house', duration: '2h+', date: 'Mar 2026', source: 'Resident Advisor Podcast', rating: 'RA Featured', vibe: 'UK garage, speed garage, deep cuts', soundcloudUrl: 'https://soundcloud.com/resident-advisor', youtubeUrl: 'https://www.youtube.com/results?search_query=Main+Phase+RA+1030+mix', mixcloudUrl: 'https://ra.co/podcast/1049' },
  { id: 'hm4', title: 'Most Rated 2026 Mix', artist: 'Various — Defected Records', genre: 'house', duration: '3h+', date: 'Mar 2026', source: 'Defected Records', rating: 'Label Curated', vibe: 'Peak-time house, CamelPhat, Martinez Bros, Armand Van Helden', soundcloudUrl: 'https://soundcloud.com/defaborern', youtubeUrl: 'https://www.youtube.com/results?search_query=Defected+Most+Rated+2026', mixcloudUrl: 'https://defected.com/music/releases/various-artists-defected-most-rated-compilation-2026/' },
];

export const allMixes = [...dnbMixes, ...houseMixes];

export const mixGenres = [
  { id: 'all', label: 'All' },
  { id: 'dnb', label: 'DnB & Jungle' },
  { id: 'breakbeat', label: 'Breakbeat' },
  { id: 'house', label: 'House' },
  { id: 'electronic', label: 'Electronic' },
  { id: 'chill', label: 'Chill & Downtempo' },
];
