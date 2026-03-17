export const shows = [
  { id: 1, promoter: 'Sanctuary ATX', venue: 'Mohawk Austin', address: '912 Red River St, Austin, TX 78701', date: 'Monthly \u2014 check Instagram', details: "Austin's most consistent curated d&b/breaks event. Books fresh foreign & domestic talent monthly.", instagram: 'https://www.instagram.com/sanctuary_atx/', tickets: 'https://do512.com/search?q=sanctuary+atx', venueUrl: 'https://mohawkaustin.com' },
  { id: 2, promoter: 'Catalyst DNB', venue: 'Empire Control Room', address: '606 E 7th St, Austin, TX 78701', date: 'Monthly \u2014 check Instagram', details: 'Local crew obsessed with substance, intensity, and pressure. Hard d&b and jungle focus.', instagram: 'https://www.instagram.com/catalystdnb/', tickets: 'https://do512.com/search?q=catalyst+dnb', venueUrl: 'https://www.empireaustin.com' },
  { id: 3, promoter: 'Lucid Drum & Bass', venue: 'Elysium', address: '705 Red River St, Austin, TX 78701', date: 'Monthly \u2014 check Instagram', details: 'Liquid, funky, and minimal vibes. Best spot for intelligent breakbeat in Austin.', instagram: 'https://www.instagram.com/search/top/?q=lucid%20drum%20bass%20austin', tickets: 'https://do512.com/search?q=lucid+drum+bass', venueUrl: 'https://www.elysiumonline.net' },
  { id: 4, promoter: 'Austin DNB Family', venue: 'Various \u2014 Red River Cultural District', address: 'Red River St, Austin, TX 78701', date: 'Ongoing \u2014 monthly meetups', details: 'Community meetups, pre-parties, and production discussions. Great for linking with the local scene.', instagram: 'https://www.instagram.com/search/top/?q=austin%20dnb%20family', tickets: 'https://do512.com/search?q=drum+bass+austin', venueUrl: 'https://do512.com/search?q=drum+bass+austin' },
];

export const eventCalendars = [
  { label: 'Do512 \u2014 D&B Austin', url: 'https://do512.com/search?q=drum+and+bass' },
  { label: 'Resident Advisor \u2014 Austin', url: 'https://ra.co/events/us/austin' },
  { label: 'Songkick \u2014 Austin', url: 'https://www.songkick.com/festivals/us/texas/austin' },
];

export const localDjs = [
  {
    id: 1, name: 'DJ Spinn ATX', genres: 'Jungle, Breaks, D&B',
    bio: "Austin's longest-running jungle/breaks selector. Resident at Sanctuary ATX.",
    sets: [
      { title: 'Sanctuary ATX Resident Mix \u2014 Feb 2026', duration: '1h 12m', soundcloudUrl: 'https://soundcloud.com/search?q=DJ+Spinn+ATX+mix', youtubeUrl: 'https://www.youtube.com/results?search_query=DJ+Spinn+ATX+mix', mixcloudUrl: 'https://www.mixcloud.com/search/?q=DJ+Spinn+ATX' },
      { title: 'Jungle Pressure Vol. 4 \u2014 Jan 2026', duration: '58m', soundcloudUrl: 'https://soundcloud.com/search?q=DJ+Spinn+ATX+jungle', youtubeUrl: 'https://www.youtube.com/results?search_query=DJ+Spinn+ATX+jungle+pressure', mixcloudUrl: 'https://www.mixcloud.com/search/?q=DJ+Spinn+ATX+jungle' },
      { title: 'Amen Break Sessions \u2014 Dec 2025', duration: '1h 05m', soundcloudUrl: 'https://soundcloud.com/search?q=DJ+Spinn+ATX+amen', youtubeUrl: 'https://www.youtube.com/results?search_query=DJ+Spinn+ATX+amen+break', mixcloudUrl: 'https://www.mixcloud.com/search/?q=DJ+Spinn+ATX+amen' },
    ],
    upcomingShows: [{ venue: 'Sanctuary ATX @ Mohawk', date: 'Mar 21, 2026', tickets: 'https://do512.com/search?q=sanctuary+atx' }],
    instagram: 'https://www.instagram.com/search/top/?q=djspinn%20austin', soundcloud: 'https://soundcloud.com/search?q=DJ+Spinn+ATX',
  },
  {
    id: 2, name: 'Catalyst Crew', genres: 'Hard D&B, Neurofunk, Techstep',
    bio: 'Local crew running Catalyst DNB events. Obsessed with pressure and intensity.',
    sets: [
      { title: 'Catalyst DNB Promo Mix \u2014 Mar 2026', duration: '1h 20m', soundcloudUrl: 'https://soundcloud.com/search?q=Catalyst+DNB+Austin+mix', youtubeUrl: 'https://www.youtube.com/results?search_query=Catalyst+DNB+Austin+mix', mixcloudUrl: 'https://www.mixcloud.com/search/?q=Catalyst+DNB+Austin' },
      { title: 'Neurofunk Sessions \u2014 Feb 2026', duration: '1h 08m', soundcloudUrl: 'https://soundcloud.com/search?q=Catalyst+DNB+neurofunk', youtubeUrl: 'https://www.youtube.com/results?search_query=Catalyst+DNB+neurofunk+Austin', mixcloudUrl: 'https://www.mixcloud.com/search/?q=Catalyst+DNB+neurofunk' },
      { title: 'Hard D&B Warmup \u2014 Jan 2026', duration: '45m', soundcloudUrl: 'https://soundcloud.com/search?q=Catalyst+DNB+hard+warmup', youtubeUrl: 'https://www.youtube.com/results?search_query=Catalyst+DNB+hard+warmup', mixcloudUrl: 'https://www.mixcloud.com/search/?q=Catalyst+DNB+Austin+hard' },
    ],
    upcomingShows: [{ venue: 'Catalyst DNB @ Empire Control Room', date: 'Apr 4, 2026', tickets: 'https://do512.com/search?q=catalyst+dnb' }],
    instagram: 'https://www.instagram.com/catalystdnb/', soundcloud: 'https://soundcloud.com/search?q=Catalyst+DNB+Austin',
  },
  {
    id: 3, name: 'Lucid Sound', genres: 'Liquid D&B, Intelligent Breaks, Minimal',
    bio: 'Head selector for Lucid Drum & Bass. Specializes in liquid and deep atmospheric sets.',
    sets: [
      { title: 'Lucid D&B Deep Mix \u2014 Feb 2026', duration: '1h 30m', soundcloudUrl: 'https://soundcloud.com/search?q=Lucid+Drum+Bass+Austin+deep', youtubeUrl: 'https://www.youtube.com/results?search_query=Lucid+Drum+Bass+Austin+deep+mix', mixcloudUrl: 'https://www.mixcloud.com/search/?q=Lucid+Drum+Bass+Austin' },
      { title: 'Liquid Vibes Vol. 7 \u2014 Jan 2026', duration: '1h 15m', soundcloudUrl: 'https://soundcloud.com/search?q=Lucid+Drum+Bass+liquid+vibes', youtubeUrl: 'https://www.youtube.com/results?search_query=Lucid+Drum+Bass+liquid+vibes+Austin', mixcloudUrl: 'https://www.mixcloud.com/search/?q=Lucid+Drum+Bass+liquid' },
      { title: 'Atmospheric D&B \u2014 Dec 2025', duration: '1h 00m', soundcloudUrl: 'https://soundcloud.com/search?q=Lucid+Drum+Bass+atmospheric', youtubeUrl: 'https://www.youtube.com/results?search_query=Lucid+Drum+Bass+atmospheric+2025', mixcloudUrl: 'https://www.mixcloud.com/search/?q=Lucid+Drum+Bass+atmospheric' },
    ],
    upcomingShows: [{ venue: 'Lucid D&B Monthly @ Elysium', date: 'Mar 28, 2026', tickets: 'https://do512.com/search?q=lucid+drum+bass' }],
    instagram: 'https://www.instagram.com/search/top/?q=lucid%20drum%20bass%20austin', soundcloud: 'https://soundcloud.com/search?q=Lucid+Drum+Bass+Austin',
  },
  {
    id: 4, name: 'Brokn Beatz', genres: 'Breakbeat, Hip-Hop Breaks, Lo-fi',
    bio: 'Austin-based producer and DJ blending classic breakbeat with modern hip-hop influence.',
    sets: [
      { title: 'Austin Session Vol. 3 \u2014 Feb 2026', duration: '52m', soundcloudUrl: 'https://soundcloud.com/search?q=Brokn+Beatz+Austin+session', youtubeUrl: 'https://www.youtube.com/results?search_query=Brokn+Beatz+Austin+session', mixcloudUrl: 'https://www.mixcloud.com/search/?q=Brokn+Beatz+Austin' },
      { title: 'Lo-fi Breaks & Chill \u2014 Jan 2026', duration: '1h 00m', soundcloudUrl: 'https://soundcloud.com/search?q=Brokn+Beatz+lofi+breaks', youtubeUrl: 'https://www.youtube.com/results?search_query=Brokn+Beatz+lofi+breaks', mixcloudUrl: 'https://www.mixcloud.com/search/?q=Brokn+Beatz+lofi' },
      { title: 'Hip-Hop Breaks Throwdown \u2014 Dec 2025', duration: '48m', soundcloudUrl: 'https://soundcloud.com/search?q=Brokn+Beatz+hip+hop+breaks', youtubeUrl: 'https://www.youtube.com/results?search_query=Brokn+Beatz+hip+hop+breaks', mixcloudUrl: 'https://www.mixcloud.com/search/?q=Brokn+Beatz+hip+hop' },
    ],
    upcomingShows: [{ venue: 'TBA \u2014 Austin', date: 'Check Instagram', tickets: 'https://do512.com/search?q=breakbeat+austin' }],
    instagram: 'https://www.instagram.com/search/top/?q=brokn%20beatz%20austin', soundcloud: 'https://soundcloud.com/search?q=Brokn+Beatz+Austin',
  },
  {
    id: 5, name: 'Austin DNB Family', genres: 'All Subgenres, Community Focused',
    bio: 'Collective of Austin producers and DJs. Monthly meetups, b2b sets, and community events.',
    sets: [
      { title: 'Community Mix Series Vol. 12 \u2014 Mar 2026', duration: '2h 10m', soundcloudUrl: 'https://soundcloud.com/search?q=Austin+DNB+Family+community+mix', youtubeUrl: 'https://www.youtube.com/results?search_query=Austin+DNB+Family+community+mix', mixcloudUrl: 'https://www.mixcloud.com/search/?q=Austin+DNB+Family' },
      { title: 'B2B Sessions \u2014 Feb 2026', duration: '1h 45m', soundcloudUrl: 'https://soundcloud.com/search?q=Austin+DNB+Family+b2b', youtubeUrl: 'https://www.youtube.com/results?search_query=Austin+DNB+Family+b2b', mixcloudUrl: 'https://www.mixcloud.com/search/?q=Austin+DNB+Family+b2b' },
      { title: 'All Styles Showcase \u2014 Jan 2026', duration: '1h 55m', soundcloudUrl: 'https://soundcloud.com/search?q=Austin+DNB+Family+all+styles', youtubeUrl: 'https://www.youtube.com/results?search_query=Austin+DNB+Family+all+styles', mixcloudUrl: 'https://www.mixcloud.com/search/?q=Austin+DNB+Family+all+styles' },
    ],
    upcomingShows: [{ venue: 'Various Austin Venues', date: 'Monthly', tickets: 'https://do512.com/search?q=drum+bass+austin' }],
    instagram: 'https://www.instagram.com/search/top/?q=austin%20dnb%20family', soundcloud: 'https://soundcloud.com/search?q=Austin+DNB+Family',
  },
];
