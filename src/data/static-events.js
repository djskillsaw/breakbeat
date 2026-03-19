export const shows = [
  { id: 1, promoter: 'Sanctuary ATX', venue: 'The Sunset Room', address: 'Austin, TX', date: 'Monthly — check Instagram', details: "Austin's most consistent curated d&b/breaks event. Books fresh foreign & domestic talent monthly. Running since 2021.", instagram: 'https://www.instagram.com/sanctuary_atx/', tickets: 'https://do512.com/search?q=sanctuary+atx', venueUrl: 'https://www.instagram.com/sanctuary_atx/' },
  { id: 2, promoter: 'Catalyst DNB', venue: 'Various — TOATS ATX / Monarca Ballroom', address: 'Austin, TX', date: 'Monthly — check Instagram', details: 'Hard d&b and jungle focus. Co-presented the World of Drum N Bass tour w/ Formation Records. Residents include Digital Monsterz and Korax.', instagram: 'https://www.instagram.com/catalystdnbatx/', tickets: 'https://do512.com/search?q=catalyst+dnb', venueUrl: 'https://www.facebook.com/catalystdnbatx/' },
  { id: 3, promoter: 'Lucid Drum & Bass', venue: 'Various — The Venue ATX / Higher Ground / Club Eternal', address: 'Austin, TX', date: 'Monthly — check Instagram', details: 'Liquid, funky, and minimal vibes. Hosts events at multiple venues including boat parties.', instagram: 'https://www.instagram.com/lucid.dnb/', tickets: 'https://www.luciddnb.com/', venueUrl: 'https://www.luciddnb.com/' },
  { id: 4, promoter: 'Sonar Drum & Bass', venue: 'Various — Austin, TX', address: 'Austin, TX', date: 'Tuesday nights — check Facebook', details: "Texas' longest-running d&b weekly. Residents include B1, dLo, Duhrdy, Mluna, Blang, Loki, and DJ Trademark.", instagram: 'https://www.facebook.com/SonarDnbATX/', tickets: 'https://www.facebook.com/SonarDnbATX/', venueUrl: 'https://www.facebook.com/SonarDnbATX/' },
  { id: 5, promoter: 'Drum & Bass Family ATX', venue: 'Various — Austin', address: 'Austin, TX', date: 'Ongoing — monthly meetups', details: 'Community of d&b lovers in Austin. Meetups, pre-parties, and production discussions.', instagram: 'https://www.meetup.com/austin-worlwide-drum-n-bass-events/', tickets: 'https://www.meetup.com/austin-worlwide-drum-n-bass-events/', venueUrl: 'https://www.meetup.com/austin-worlwide-drum-n-bass-events/' },
];

export const eventCalendars = [
  { label: '19hz — Texas Events', url: 'https://19hz.info/eventlisting_Texas.php' },
  { label: 'Do512 — D&B Austin', url: 'https://do512.com/search?q=drum+and+bass' },
  { label: 'Resident Advisor — Austin', url: 'https://ra.co/events/us/austin' },
];

export const bluesVenues = [
  {
    id: 'blues-1',
    venue: 'Antone\'s Nightclub',
    address: '305 E 5th St, Austin, TX 78701',
    details: 'Austin\'s legendary home of the blues since 1975. Hosted Stevie Ray Vaughan, Buddy Guy, B.B. King, and countless greats.',
    instagram: 'https://www.instagram.com/antonesnightclub/',
    venueUrl: 'https://www.antonesnightclub.com/',
    calendarUrl: 'https://www.antonesnightclub.com/calendar',
    upcomingShows: [
      { date: 'Fri Mar 20', headliner: 'Jimmie Vaughan', opener: 'The Mighty Orq', cover: '$25', doors: '8 PM', ticketUrl: 'https://www.antonesnightclub.com/calendar', spotifyUrl: 'https://open.spotify.com/search/Jimmie%20Vaughan', youtubeUrl: 'https://music.youtube.com/search?q=Jimmie%20Vaughan' },
      { date: 'Sat Mar 21', headliner: 'Sue Foley', opener: 'Eve Monsees & Mike Buck', cover: '$20', doors: '9 PM', ticketUrl: 'https://www.antonesnightclub.com/calendar', spotifyUrl: 'https://open.spotify.com/search/Sue%20Foley', youtubeUrl: 'https://music.youtube.com/search?q=Sue%20Foley' },
      { date: 'Thu Mar 26', headliner: 'W.C. Clark Blues Revue', opener: 'TD Bell Legacy Band', cover: '$15', doors: '8 PM', ticketUrl: 'https://www.antonesnightclub.com/calendar', spotifyUrl: 'https://open.spotify.com/search/W.C.%20Clark', youtubeUrl: 'https://music.youtube.com/search?q=W.C.%20Clark%20blues' },
    ],
  },
  {
    id: 'blues-2',
    venue: 'C-Boy\'s Heart & Soul',
    address: '2008 S Congress Ave, Austin, TX 78704',
    details: 'South Congress staple. Blues, soul, and R&B every night. Home of the Monday night residency and Tuesday Soul Night.',
    instagram: 'https://www.instagram.com/cboyshtandsoul/',
    venueUrl: 'https://www.cboysheartandsoul.com/',
    calendarUrl: 'https://www.cboysheartandsoul.com/calendar',
    upcomingShows: [
      { date: 'Mon Mar 23', headliner: 'Mike Flanigin Trio', opener: null, cover: 'Free', doors: '9:30 PM', ticketUrl: 'https://www.cboysheartandsoul.com/calendar', spotifyUrl: 'https://open.spotify.com/search/Mike%20Flanigin', youtubeUrl: 'https://music.youtube.com/search?q=Mike%20Flanigin' },
      { date: 'Tue Mar 24', headliner: 'Soul Man Sam & The SMS Band', opener: null, cover: 'Free', doors: '9:30 PM', ticketUrl: 'https://www.cboysheartandsoul.com/calendar', spotifyUrl: 'https://open.spotify.com/search/Soul%20Man%20Sam', youtubeUrl: 'https://music.youtube.com/search?q=Soul%20Man%20Sam%20SMS' },
      { date: 'Fri Mar 27', headliner: 'Peterson Brothers', opener: 'Kiko Villamizar', cover: '$10', doors: '9 PM', ticketUrl: 'https://www.cboysheartandsoul.com/calendar', spotifyUrl: 'https://open.spotify.com/search/Peterson%20Brothers%20blues', youtubeUrl: 'https://music.youtube.com/search?q=Peterson%20Brothers%20blues' },
    ],
  },
  {
    id: 'blues-3',
    venue: 'The Continental Club',
    address: '1315 S Congress Ave, Austin, TX 78704',
    details: 'Austin institution since 1955. Blues, rockabilly, country, and roots music. Two stages, seven nights a week.',
    instagram: 'https://www.instagram.com/continentalclub/',
    venueUrl: 'https://www.continentalclub.com/austin',
    calendarUrl: 'https://www.continentalclub.com/austin',
    upcomingShows: [
      { date: 'Fri Mar 20', headliner: 'Tia Carrera', opener: 'Jon Dee Graham', cover: '$10', doors: '10 PM', ticketUrl: 'https://www.continentalclub.com/austin', spotifyUrl: 'https://open.spotify.com/search/Tia%20Carrera%20austin', youtubeUrl: 'https://music.youtube.com/search?q=Tia%20Carrera%20austin' },
      { date: 'Sat Mar 21', headliner: 'Casper Rawls', opener: 'Ramsay Midwood', cover: '$10', doors: '10 PM', ticketUrl: 'https://www.continentalclub.com/austin', spotifyUrl: 'https://open.spotify.com/search/Casper%20Rawls', youtubeUrl: 'https://music.youtube.com/search?q=Casper%20Rawls' },
      { date: 'Sun Mar 22', headliner: 'James McMurtry', opener: null, cover: '$10', doors: '8 PM', ticketUrl: 'https://www.continentalclub.com/austin', spotifyUrl: 'https://open.spotify.com/search/James%20McMurtry', youtubeUrl: 'https://music.youtube.com/search?q=James%20McMurtry%20live' },
    ],
  },
  {
    id: 'blues-4',
    venue: 'Elephant Room',
    address: '315 Congress Ave, Austin, TX 78701',
    details: 'Underground jazz and blues club on Congress Ave. Intimate basement setting. Live music every night, two sets.',
    instagram: 'https://www.instagram.com/elephantroom/',
    venueUrl: 'https://www.elephantroom.com/',
    calendarUrl: 'https://www.elephantroom.com/',
    upcomingShows: [
      { date: 'Thu Mar 20', headliner: 'Ephraim Owens Quartet', opener: null, cover: '$10', doors: '9 PM', ticketUrl: 'https://www.elephantroom.com/', spotifyUrl: 'https://open.spotify.com/search/Ephraim%20Owens', youtubeUrl: 'https://music.youtube.com/search?q=Ephraim%20Owens%20trumpet' },
      { date: 'Fri Mar 21', headliner: 'Red Young & Friends', opener: null, cover: '$12', doors: '9:30 PM', ticketUrl: 'https://www.elephantroom.com/', spotifyUrl: 'https://open.spotify.com/search/Red%20Young%20piano', youtubeUrl: 'https://music.youtube.com/search?q=Red%20Young%20piano%20blues' },
      { date: 'Sat Mar 22', headliner: 'Elias Haslanger Quintet', opener: null, cover: '$12', doors: '9:30 PM', ticketUrl: 'https://www.elephantroom.com/', spotifyUrl: 'https://open.spotify.com/search/Elias%20Haslanger', youtubeUrl: 'https://music.youtube.com/search?q=Elias%20Haslanger' },
    ],
  },
  {
    id: 'blues-5',
    venue: 'Skylark Lounge',
    address: '2039 Airport Blvd, Austin, TX 78722',
    details: 'East Austin dive bar with serious blues cred. Free live music most nights. Blues jams, soul revues, and surprise sit-ins.',
    instagram: 'https://www.instagram.com/skylarkaustin/',
    venueUrl: 'https://skylarkaustin.com/',
    calendarUrl: 'https://skylarkaustin.com/',
    upcomingShows: [
      { date: 'Wed Mar 19', headliner: 'Blues Jam (open)', opener: null, cover: 'Free', doors: '9 PM', ticketUrl: 'https://skylarkaustin.com/', spotifyUrl: null, youtubeUrl: null },
      { date: 'Fri Mar 21', headliner: 'Oscar Ornelas Band', opener: 'Li\'l Cap\'n Travis', cover: 'Free', doors: '9 PM', ticketUrl: 'https://skylarkaustin.com/', spotifyUrl: 'https://open.spotify.com/search/Oscar%20Ornelas', youtubeUrl: 'https://music.youtube.com/search?q=Oscar%20Ornelas%20blues' },
      { date: 'Sat Mar 22', headliner: 'The Nightowls', opener: 'Nether Hour', cover: '$5', doors: '9:30 PM', ticketUrl: 'https://skylarkaustin.com/', spotifyUrl: 'https://open.spotify.com/search/The%20Nightowls%20austin', youtubeUrl: 'https://music.youtube.com/search?q=The%20Nightowls%20austin' },
    ],
  },
  {
    id: 'blues-6',
    venue: 'Parker Jazz Club',
    address: '117 W 4th St #107, Austin, TX 78701',
    details: 'Upscale downtown jazz and blues room. Seated shows with cocktail service. National touring acts and top Austin talent.',
    instagram: 'https://www.instagram.com/parkerjazzclub/',
    venueUrl: 'https://www.parkerjazzclub.com/',
    calendarUrl: 'https://www.parkerjazzclub.com/events',
    upcomingShows: [
      { date: 'Thu Mar 20', headliner: 'Kris Kimura Quartet', opener: null, cover: '$20', doors: '7:30 PM', ticketUrl: 'https://www.parkerjazzclub.com/events', spotifyUrl: 'https://open.spotify.com/search/Kris%20Kimura%20jazz', youtubeUrl: 'https://music.youtube.com/search?q=Kris%20Kimura%20jazz' },
      { date: 'Fri Mar 21', headliner: 'Kat Edmonson', opener: 'Devin James Fry', cover: '$30', doors: '7:30 PM', ticketUrl: 'https://www.parkerjazzclub.com/events', spotifyUrl: 'https://open.spotify.com/search/Kat%20Edmonson', youtubeUrl: 'https://music.youtube.com/search?q=Kat%20Edmonson%20live' },
      { date: 'Sat Mar 22', headliner: 'Jonathan Scales Fourchestra', opener: null, cover: '$25', doors: '7:30 PM', ticketUrl: 'https://www.parkerjazzclub.com/events', spotifyUrl: 'https://open.spotify.com/search/Jonathan%20Scales%20Fourchestra', youtubeUrl: 'https://music.youtube.com/search?q=Jonathan%20Scales%20Fourchestra' },
    ],
  },
];

export const bluesCalendars = [
  { label: 'Antone\'s — Calendar', url: 'https://www.antonesnightclub.com/calendar' },
  { label: 'Do512 — Blues Austin', url: 'https://do512.com/search?q=blues' },
  { label: 'Austin Chronicle — Music', url: 'https://www.austinchronicle.com/events/music/' },
];
