export type Title = {
  id: string;
  title: string;
  type: "Movie" | "Series" | "Anime" | "Documentary" | "K-Drama";
  year: number;
  rating: number;
  match: number; // AI match %
  genres: string[];
  language: string;
  country: string;
  ott: string[];
  duration: string;
  cast: string[];
  director: string;
  synopsis: string;
  mood: string[];
  poster: string;
  backdrop: string;
  trailer?: string;
};

const img = (seed: string, w = 600, h = 900) =>
  `https://picsum.photos/seed/${encodeURIComponent(seed)}/${w}/${h}`;

const make = (
  id: string,
  title: string,
  type: Title["type"],
  year: number,
  rating: number,
  match: number,
  genres: string[],
  language: string,
  country: string,
  ott: string[],
  duration: string,
  director: string,
  cast: string[],
  mood: string[],
  synopsis: string,
): Title => ({
  id, title, type, year, rating, match, genres, language, country, ott, duration,
  director, cast, mood, synopsis,
  poster: img(id),
  backdrop: img(id + "-bd", 1600, 900),
});

export const titles: Title[] = [
  make("dune-2","Dune: Part Two","Movie",2024,8.8,97,["Sci-Fi","Adventure","Drama"],"English","USA",["HBO Max","Prime Video"],"2h 46m","Denis Villeneuve",["Timothée Chalamet","Zendaya","Austin Butler"],["Epic","Cinematic","Intense"],"Paul Atreides unites with the Fremen to wage war against House Harkonnen across the dunes of Arrakis."),
  make("oppenheimer","Oppenheimer","Movie",2023,8.5,93,["Biography","Drama","History"],"English","USA",["Peacock","Apple TV"],"3h 0m","Christopher Nolan",["Cillian Murphy","Emily Blunt","Robert Downey Jr."],["Intense","Thoughtful","Dark"],"The story of J. Robert Oppenheimer and the making of the atomic bomb."),
  make("everything-everywhere","Everything Everywhere All at Once","Movie",2022,8.1,90,["Sci-Fi","Comedy","Action"],"English","USA",["Prime Video"],"2h 19m","Daniels",["Michelle Yeoh","Ke Huy Quan","Jamie Lee Curtis"],["Trippy","Heartfelt","Wild"],"A laundromat owner discovers she must connect with parallel universe versions of herself."),
  make("rrr","RRR","Movie",2022,7.9,89,["Action","Drama","Musical"],"Telugu","India",["Netflix","ZEE5"],"3h 7m","S. S. Rajamouli",["N. T. Rama Rao Jr.","Ram Charan","Alia Bhatt"],["Epic","Energetic","Patriotic"],"Two revolutionaries forge a friendship that ignites a movement against British rule."),
  make("3-idiots","3 Idiots","Movie",2009,8.4,85,["Comedy","Drama"],"Hindi","India",["Prime Video","Netflix"],"2h 51m","Rajkumar Hirani",["Aamir Khan","R. Madhavan","Sharman Joshi"],["Feel-Good","Inspiring","Funny"],"Two friends search for their long-lost college companion who once challenged everything about education."),
  make("parasite","Parasite","Movie",2019,8.6,94,["Thriller","Drama","Dark Comedy"],"Korean","South Korea",["Hulu","Max"],"2h 12m","Bong Joon-ho",["Song Kang-ho","Lee Sun-kyun","Cho Yeo-jeong"],["Twisty","Dark","Brilliant"],"A poor family schemes to become employed by a wealthy household with shocking consequences."),
  make("squid-game","Squid Game","Series",2021,8.0,91,["Thriller","Drama","Survival"],"Korean","South Korea",["Netflix"],"S2 • 9 eps","Hwang Dong-hyuk",["Lee Jung-jae","Park Hae-soo","Wi Ha-jun"],["Tense","Dark","Bingeable"],"Hundreds of cash-strapped players accept a strange invitation to compete in deadly children's games."),
  make("crash-landing","Crash Landing on You","K-Drama",2019,8.7,92,["Romance","Comedy","Drama"],"Korean","South Korea",["Netflix"],"16 eps","Lee Jeong-hyo",["Hyun Bin","Son Ye-jin"],["Romantic","Heartwarming","Funny"],"A South Korean heiress paraglides into North Korea and falls for an army officer who hides her."),
  make("attack-on-titan","Attack on Titan","Anime",2013,9.0,96,["Action","Fantasy","Drama"],"Japanese","Japan",["Crunchyroll","Hulu"],"4 seasons","Tetsurō Araki",["Yuki Kaji","Yui Ishikawa","Marina Inoue"],["Epic","Dark","Intense"],"Humanity fights for survival against giant humanoid Titans behind massive walls."),
  make("spirited-away","Spirited Away","Anime",2001,8.6,88,["Animation","Fantasy","Family"],"Japanese","Japan",["Max"],"2h 5m","Hayao Miyazaki",["Rumi Hiiragi","Miyu Irino"],["Magical","Heartwarming","Whimsical"],"A girl wanders into a world ruled by gods and witches where humans are changed into beasts."),
  make("demon-slayer","Demon Slayer","Anime",2019,8.7,93,["Action","Fantasy"],"Japanese","Japan",["Crunchyroll","Netflix"],"4 seasons","Haruo Sotozaki",["Natsuki Hanae","Akari Kitō"],["Stylish","Emotional","Action"],"A young man becomes a demon slayer to save his sister and avenge his family."),
  make("succession","Succession","Series",2018,8.9,94,["Drama"],"English","USA",["HBO Max"],"4 seasons","Mark Mylod",["Brian Cox","Jeremy Strong","Sarah Snook"],["Sharp","Dark","Witty"],"The Roy family controls the largest media conglomerate as they consider their future."),
  make("the-bear","The Bear","Series",2022,8.7,91,["Drama","Comedy"],"English","USA",["Hulu","Disney+"],"3 seasons","Christopher Storer",["Jeremy Allen White","Ayo Edebiri"],["Tense","Intimate","Cathartic"],"A young chef returns home to run his late brother's chaotic sandwich shop."),
  make("wednesday","Wednesday","Series",2022,8.1,87,["Mystery","Comedy","Fantasy"],"English","USA",["Netflix"],"2 seasons","Tim Burton",["Jenna Ortega","Hunter Doohan"],["Quirky","Mysterious","Stylish"],"Wednesday Addams investigates a murderous spree at Nevermore Academy."),
  make("dark","Dark","Series",2017,8.8,95,["Sci-Fi","Mystery","Thriller"],"German","Germany",["Netflix"],"3 seasons","Baran bo Odar",["Louis Hofmann","Lisa Vicari"],["Mind-bending","Dark","Complex"],"A family saga with a supernatural twist set in a German town where the disappearance of children exposes time travel."),
  make("money-heist","Money Heist","Series",2017,8.2,89,["Crime","Thriller"],"Spanish","Spain",["Netflix"],"5 parts","Álex Pina",["Úrsula Corberó","Álvaro Morte"],["Bingeable","Tense","Stylish"],"A criminal mastermind plans the biggest heist in recorded history."),
  make("la-casa-de-papel","Elite","Series",2018,7.5,82,["Drama","Thriller"],"Spanish","Spain",["Netflix"],"8 seasons","Carlos Montero",["Itzan Escamilla","María Pedraza"],["Stylish","Dramatic","Steamy"],"At an exclusive Spanish school, the clash between rich and scholarship students leads to murder."),
  make("planet-earth-iii","Planet Earth III","Documentary",2023,9.1,90,["Nature","Documentary"],"English","UK",["BBC iPlayer","Max"],"8 eps","Mike Gunton",["David Attenborough"],["Inspiring","Beautiful","Calming"],"David Attenborough returns with a stunning portrait of life on our changing planet."),
  make("our-planet","Our Planet","Documentary",2019,9.3,91,["Nature","Documentary"],"English","UK",["Netflix"],"8 eps","Alastair Fothergill",["David Attenborough"],["Beautiful","Educational","Hopeful"],"Experience the planet's natural beauty and examine how climate change impacts all life."),
  make("the-last-dance","The Last Dance","Documentary",2020,9.1,88,["Sports","Documentary","Biography"],"English","USA",["Netflix","ESPN+"],"10 eps","Jason Hehir",["Michael Jordan","Scottie Pippen"],["Inspiring","Nostalgic","Gripping"],"Charts the rise of the 1990s Chicago Bulls, led by Michael Jordan."),
  make("blade-runner-2049","Blade Runner 2049","Movie",2017,8.0,92,["Sci-Fi","Drama","Mystery"],"English","USA",["Prime Video"],"2h 44m","Denis Villeneuve",["Ryan Gosling","Harrison Ford"],["Atmospheric","Cinematic","Slow-burn"],"A new blade runner unearths a long-buried secret that could plunge society into chaos."),
  make("interstellar","Interstellar","Movie",2014,8.7,95,["Sci-Fi","Adventure","Drama"],"English","USA",["Prime Video","Paramount+"],"2h 49m","Christopher Nolan",["Matthew McConaughey","Anne Hathaway"],["Epic","Emotional","Mind-bending"],"A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival."),
  make("the-wandering-earth","The Wandering Earth","Movie",2019,5.9,78,["Sci-Fi","Action"],"Mandarin","China",["Netflix"],"2h 5m","Frant Gwo",["Wu Jing","Qu Chuxiao"],["Epic","Spectacle"],"Humans propel Earth on a journey through space to find a new sun."),
  make("amelie","Amélie","Movie",2001,8.3,87,["Romance","Comedy"],"French","France",["Prime Video"],"2h 2m","Jean-Pierre Jeunet",["Audrey Tautou","Mathieu Kassovitz"],["Whimsical","Heartwarming","Quirky"],"A shy Parisian waitress decides to change the lives of those around her for the better."),
  make("cinema-paradiso","Cinema Paradiso","Movie",1988,8.5,89,["Drama","Romance"],"Italian","Italy",["Max","Mubi"],"2h 5m","Giuseppe Tornatore",["Philippe Noiret","Salvatore Cascio"],["Nostalgic","Heartwarming","Beautiful"],"A filmmaker recalls his childhood when falling in love with the pictures at the cinema."),
  make("jujutsu-kaisen","Jujutsu Kaisen","Anime",2020,8.6,92,["Action","Fantasy","Supernatural"],"Japanese","Japan",["Crunchyroll"],"2 seasons","Sunghoo Park",["Junya Enoki","Yuma Uchida"],["Stylish","Dark","Action"],"A boy swallows a cursed talisman and becomes cursed himself, joining a secret school of sorcerers."),
  make("your-name","Your Name","Anime",2016,8.4,90,["Animation","Romance","Drama"],"Japanese","Japan",["Crunchyroll"],"1h 46m","Makoto Shinkai",["Ryunosuke Kamiki","Mone Kamishiraishi"],["Romantic","Beautiful","Emotional"],"Two strangers find themselves linked in a bizarre way, swapping lives across time and space."),
  make("the-glory","The Glory","K-Drama",2022,8.1,86,["Thriller","Drama","Revenge"],"Korean","South Korea",["Netflix"],"2 parts","Ahn Gil-ho",["Song Hye-kyo","Lee Do-hyun"],["Dark","Tense","Cathartic"],"A woman dedicates her entire life to elaborate revenge against the bullies who tormented her."),
  make("vincenzo","Vincenzo","K-Drama",2021,8.4,88,["Crime","Comedy","Drama"],"Korean","South Korea",["Netflix"],"20 eps","Kim Hee-won",["Song Joong-ki","Jeon Yeo-been"],["Stylish","Funny","Slick"],"An Italian mafia consigliere of Korean descent returns to Seoul for a personal mission."),
  make("la-la-land","La La Land","Movie",2016,8.0,86,["Musical","Romance","Drama"],"English","USA",["Netflix"],"2h 8m","Damien Chazelle",["Ryan Gosling","Emma Stone"],["Romantic","Bittersweet","Stylish"],"A jazz pianist falls for an aspiring actress in Los Angeles."),
  make("inception","Inception","Movie",2010,8.8,94,["Sci-Fi","Action","Thriller"],"English","USA",["Netflix","Max"],"2h 28m","Christopher Nolan",["Leonardo DiCaprio","Joseph Gordon-Levitt"],["Mind-bending","Stylish","Intense"],"A thief who steals corporate secrets through dream-sharing technology is given an impossible task."),
];

export type Mood = {
  id: string;
  label: string;
  emoji: string;
  match: string[];     // mood tag matches on titles
  genres: string[];    // genres that amplify this mood
  ott: string[];       // OTT platforms commonly carrying this vibe
  themes: string[];    // narrative themes that signal this mood
};

export const moods: Mood[] = [
  { id: "feel-good", label: "Feel-Good", emoji: "🌸",
    match: ["Feel-Good","Heartwarming","Romantic","Funny","Whimsical"],
    genres: ["Romance","Comedy","Musical","Animation","Family"],
    ott: ["Netflix","Prime Video","Disney+","Hulu"],
    themes: ["friendship","second chances","small joys","coming-of-age"] },
  { id: "mind-bending", label: "Mind-Bending", emoji: "🌀",
    match: ["Mind-bending","Twisty","Trippy","Complex"],
    genres: ["Sci-Fi","Mystery","Thriller","Drama"],
    ott: ["Netflix","HBO Max","Max","Prime Video"],
    themes: ["time loops","identity","parallel realities","unreliable narrators"] },
  { id: "epic", label: "Epic", emoji: "⚡",
    match: ["Epic","Cinematic","Spectacle"],
    genres: ["Action","Adventure","Sci-Fi","Fantasy","History"],
    ott: ["HBO Max","Prime Video","Disney+","Paramount+"],
    themes: ["rebellion","destiny","grand stakes","mythology"] },
  { id: "dark", label: "Dark & Tense", emoji: "🌑",
    match: ["Dark","Tense","Intense"],
    genres: ["Thriller","Crime","Mystery","Drama","Survival"],
    ott: ["Netflix","HBO Max","Hulu"],
    themes: ["moral ambiguity","obsession","revenge","power"] },
  { id: "romantic", label: "Romantic", emoji: "💞",
    match: ["Romantic","Heartwarming","Bittersweet"],
    genres: ["Romance","Drama","Comedy","Musical"],
    ott: ["Netflix","Prime Video","Hulu"],
    themes: ["yearning","missed connections","love across borders"] },
  { id: "chill", label: "Calm & Beautiful", emoji: "🌿",
    match: ["Calming","Beautiful","Nostalgic","Inspiring"],
    genres: ["Documentary","Nature","Animation","Drama"],
    ott: ["Netflix","BBC iPlayer","Max","Mubi"],
    themes: ["nature","memory","quiet wonder","slow living"] },
];

export type MoodScored = { title: Title; score: number; factors: string[] };

export function scoreByMood(moodId: string): MoodScored[] {
  const m = moods.find(x => x.id === moodId);
  if (!m) return [];
  return titles
    .map(t => {
      const factors: string[] = [];
      let score = 0;
      const moodHits = t.mood.filter(x => m.match.includes(x));
      if (moodHits.length) { score += moodHits.length * 3; factors.push(`Mood tags: ${moodHits.join(", ")}`); }
      const genreHits = t.genres.filter(g => m.genres.includes(g));
      if (genreHits.length) { score += genreHits.length * 2; factors.push(`Genre fit: ${genreHits.join(", ")}`); }
      const ottHits = t.ott.filter(o => m.ott.includes(o));
      if (ottHits.length) { score += ottHits.length; factors.push(`On ${ottHits.slice(0,2).join(", ")}`); }
      if (t.rating >= 8.3) { score += 1; factors.push(`Highly rated (${t.rating.toFixed(1)})`); }
      return { title: t, score, factors };
    })
    .filter(x => x.score > 0)
    .sort((a, b) => b.score - a.score);
}


export const otts = ["Netflix","Prime Video","HBO Max","Max","Disney+","Hulu","Apple TV","Crunchyroll","Peacock","Paramount+","BBC iPlayer","ZEE5","Mubi","ESPN+"];

export const genres = Array.from(new Set(titles.flatMap(t => t.genres))).sort();

export const findById = (id: string) => titles.find(t => t.id === id);
export const similar = (t: Title) =>
  titles
    .filter(x => x.id !== t.id)
    .map(x => ({
      x,
      score:
        x.genres.filter(g => t.genres.includes(g)).length * 3 +
        (x.language === t.language ? 1 : 0) +
        (x.type === t.type ? 1 : 0) +
        x.mood.filter(m => t.mood.includes(m)).length * 2,
    }))
    .sort((a,b) => b.score - a.score)
    .slice(0, 8)
    .map(s => s.x);

export const trending = [...titles].sort((a,b) => b.rating - a.rating).slice(0, 12);
export const forYou = [...titles].sort((a,b) => b.match - a.match).slice(0, 12);
export const byType = (type: Title["type"]) => titles.filter(t => t.type === type);

export function similarWithReasons(t: Title) {
  return titles
    .filter(x => x.id !== t.id)
    .map(x => {
      const gShared = x.genres.filter(g => t.genres.includes(g));
      const mShared = x.mood.filter(m => t.mood.includes(m));
      const langSame = x.language === t.language;
      const typeSame = x.type === t.type;
      const ottShared = x.ott.filter(o => t.ott.includes(o));
      const score = gShared.length * 3 + mShared.length * 2 + (langSame ? 1 : 0) + (typeSame ? 1 : 0);
      const reasons: string[] = [];
      if (gShared.length) reasons.push(`Shares ${gShared.slice(0,2).join(" + ")}`);
      if (mShared.length) reasons.push(`Same vibe: ${mShared.slice(0,2).join(", ").toLowerCase()}`);
      if (typeSame) reasons.push(`Both ${t.type.toLowerCase()}s`);
      if (langSame) reasons.push(`${t.language} cinema`);
      if (ottShared.length) reasons.push(`Also on ${ottShared[0]}`);
      return { x, score, reasons };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 8);
}
