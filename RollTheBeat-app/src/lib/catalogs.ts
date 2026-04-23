export interface SongList {
  id: string
  label: string
  emoji: string
  songs: string[]
}

export const PRESET_LISTS: SongList[] = [
  {
    id: 'videogames',
    label: 'Musiques de jeux vidéos',
    emoji: '🎮',
    songs: [
      'Super Mario Bros Theme', 'Zelda - Song of Storms', 'Tetris Theme',
      'Final Fantasy VII - One Winged Angel', 'Halo Theme', 'Minecraft - Sweden',
      'Pokemon - Route 1', 'Undertale - Megalovania', 'Animal Crossing - 3PM',
      'Sonic - Green Hill Zone', 'Street Fighter II - Guile Theme',
      "The Witcher 3 - Priscilla's Song", 'Skyrim - Dragonborn',
      'Doom - BFG Division', 'Celeste - Resurrections',
      'Chrono Trigger - Corridor of Time', 'Kirby - Gourmet Race',
      'Metal Gear Solid Theme', 'Donkey Kong Country - Aquatic Ambiance',
      'Portal - Still Alive',
    ],
  },
  {
    id: 'movies',
    label: 'Musiques de films',
    emoji: '🎬',
    songs: [
      'Star Wars - The Imperial March', 'Jurassic Park Theme',
      'The Lion King - Circle of Life', 'Titanic - My Heart Will Go On',
      'Pirates of the Caribbean Theme', "Harry Potter - Hedwig's Theme",
      'Indiana Jones Theme', 'Back to the Future Theme',
      'The Godfather Theme', "Schindler's List Theme",
      'Interstellar - No Time for Caution', 'Inception - Time',
      'The Dark Knight Theme', 'Forrest Gump - Feather Theme',
      "Dirty Dancing - I've Had the Time of My Life",
      'Grease - Summer Nights', 'Flashdance - What a Feeling',
      'Rocky - Eye of the Tiger', 'Top Gun - Danger Zone',
      'E.T. - Flying Theme',
    ],
  },
  {
    id: '70s',
    label: 'Musiques années 70',
    emoji: '🕺',
    songs: [
      'ABBA - Dancing Queen', 'Led Zeppelin - Stairway to Heaven',
      'Queen - Bohemian Rhapsody', 'Fleetwood Mac - Go Your Own Way',
      'Eagles - Hotel California', 'David Bowie - Heroes',
      'Bee Gees - Stayin Alive', 'Elton John - Rocket Man',
      'Pink Floyd - Wish You Were Here', 'The Rolling Stones - Angie',
      'John Lennon - Imagine', 'Stevie Wonder - Superstition',
      'Donna Summer - Hot Stuff', 'Gloria Gaynor - I Will Survive',
      'The Clash - London Calling', 'Bruce Springsteen - Born to Run',
      "Carole King - I Feel the Earth Move", 'James Brown - Get Up',
      "Al Green - Let's Stay Together", 'Cat Stevens - Wild World',
    ],
  },
  {
    id: '80s',
    label: 'Musiques années 80',
    emoji: '🎸',
    songs: [
      'Michael Jackson - Thriller', 'Madonna - Like a Virgin',
      'Prince - Purple Rain', 'Cyndi Lauper - Girls Just Want to Have Fun',
      "Guns N Roses - Sweet Child O Mine", "Bon Jovi - Livin on a Prayer",
      'A-ha - Take On Me', 'Toto - Africa',
      'The Police - Every Breath You Take', 'Depeche Mode - Personal Jesus',
      'New Order - Blue Monday', 'Eurythmics - Sweet Dreams',
      'Phil Collins - In the Air Tonight', 'U2 - With or Without You',
      'Whitney Houston - I Wanna Dance with Somebody',
      'Rick Astley - Never Gonna Give You Up',
      'George Michael - Careless Whisper', 'Wham - Wake Me Up Before You Go-Go',
      'Dire Straits - Money for Nothing', 'Tears for Fears - Everybody Wants to Rule the World',
    ],
  },
  {
    id: '90s',
    label: 'Musiques années 90',
    emoji: '💿',
    songs: [
      'Nirvana - Smells Like Teen Spirit', 'Oasis - Wonderwall',
      'Backstreet Boys - I Want It That Way', 'Spice Girls - Wannabe',
      'TLC - No Scrubs', "Destiny's Child - Say My Name",
      'Eminem - Lose Yourself', 'Dr. Dre - Still D.R.E.',
      'Alanis Morissette - You Oughta Know', 'Pearl Jam - Black',
      'Radiohead - Creep', 'The Verve - Bitter Sweet Symphony',
      'Blur - Song 2', 'Green Day - Basket Case',
      "No Doubt - Don't Speak", 'Ace of Base - The Sign',
      'Snap - The Power', 'Haddaway - What is Love',
      'Roxette - Listen to Your Heart', 'Cranberries - Zombie',
    ],
  },
  {
    id: '2000s',
    label: 'Musiques années 2000',
    emoji: '📀',
    songs: [
      'Beyonce - Crazy in Love', 'Nelly - Hot in Herre',
      'Justin Timberlake - Cry Me a River', 'OutKast - Hey Ya',
      'Amy Winehouse - Rehab', 'Coldplay - The Scientist',
      'White Stripes - Seven Nation Army', 'Gorillaz - Feel Good Inc.',
      'Daft Punk - One More Time', 'Kanye West - Gold Digger',
      'Jay-Z - 99 Problems', 'Norah Jones - Come Away with Me',
      'Kelly Clarkson - Since U Been Gone', 'Keane - Somewhere Only We Know',
      'The Killers - Mr. Brightside', 'Franz Ferdinand - Take Me Out',
      'Arctic Monkeys - I Bet You Look Good on the Dancefloor',
      'Black Eyed Peas - I Gotta Feeling', 'Lady Gaga - Just Dance',
      'Rihanna - Umbrella',
    ],
  },
  {
    id: 'current',
    label: 'Musiques actuelles',
    emoji: '🔥',
    songs: [
      'The Weeknd - Blinding Lights', 'Dua Lipa - Levitating',
      'Olivia Rodrigo - drivers license', 'Harry Styles - As It Was',
      'Bad Bunny - Dakiti', 'Billie Eilish - bad guy',
      'Doja Cat - Say So', 'Justin Bieber - Peaches',
      'Ariana Grande - positions', 'Taylor Swift - Anti-Hero',
      'SZA - Kill Bill', 'Miley Cyrus - Flowers',
      'Shakira - Bzrp Music Sessions 53', 'PinkPantheress - Boys a liar',
      'Ice Spice - Munch', 'Peso Pluma - Ella Baila Sola',
      'Sabrina Carpenter - Espresso', 'Kendrick Lamar - Not Like Us',
      'Chappell Roan - Good Luck Babe', 'Charli XCX - 360',
    ],
  },
]

export const DEFAULT_INSTRUMENTS = [
  'Guitare', 'Piano', 'Batterie', 'Basse', 'Voix', 'Violon', 'Saxophone', 'Flûte',
]

export const VIRTUAL_INSTRUMENTS = [
  { id: 'virt-drums', label: '🥁 Batterie virtuelle' },
  { id: 'virt-keyboard', label: '🎹 Clavier virtuel' },
  { id: 'virt-bass', label: '🎸 Basse virtuelle' },
  { id: 'virt-flute', label: '🪈 Flûte à coulisse' },
  { id: 'virt-otamatone', label: '🐙 Otamatone' },
]
