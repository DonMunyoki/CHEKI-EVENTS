const express = require('express');
const router = express.Router();
const Database = require('better-sqlite3');

// Create shared in-memory database
const db = new Database(':memory:');
console.log(' Events: In-memory database created successfully');

// Initialize tables
db.exec(`
  CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    date TEXT NOT NULL,
    time TEXT NOT NULL,
    location TEXT NOT NULL,
    category TEXT NOT NULL,
    price TEXT NOT NULL,
    image TEXT NOT NULL,
    ticketLink TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Insert current Nairobi events this month
const currentEvents = [
  {
    title: "Nairobi International Trade Fair 2026",
    description: "The biggest agricultural and trade exhibition in East Africa featuring hundreds of exhibitors, innovation showcases, and business networking opportunities.",
    date: "March 5-15, 2026",
    time: "9:00 AM - 6:00 PM",
    location: "Jamhuri Showground, Nairobi",
    category: "Business",
    price: "KES 200",
    image: "https://images.unsplash.com/photo-1464207687429-7505649dae38?w=800&h=600&fit=crop&crop=center&auto=format",
    ticketLink: "https://ticketskenya.com/nairobi-international-trade-fair-2026"
  },
  {
    title: "Sauti Sol Live in Concert",
    description: "Kenya's award-winning band Sauti Sol performs their greatest hits in an electrifying live concert experience at KICC.",
    date: "March 8, 2026",
    time: "7:00 PM",
    location: "Kenyatta International Convention Centre (KICC)",
    category: "Music",
    price: "KES 3,500",
    image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&h=600&fit=crop&crop=center&auto=format",
    ticketLink: "https://ticketmaster.co.ke/sauti-sol-live-concert-2026"
  },
  {
    title: "Nairobi Tech Week 2026",
    description: "East Africa's premier technology conference featuring keynote speakers from Google, Microsoft, and local startups. Includes workshops and networking sessions.",
    date: "March 12-14, 2026",
    time: "8:00 AM - 5:00 PM",
    location: "Edge Convention Centre, Nairobi",
    category: "Technology",
    price: "KES 5,000",
    image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&h=600&fit=crop&crop=center&auto=format",
    ticketLink: "https://eventbrite.co.ke/e/nairobi-tech-week-2026-tickets"
  },
  {
    title: "AI & Machine Learning Summit",
    description: "Deep dive into artificial intelligence and machine learning with hands-on workshops, expert talks, and networking with AI professionals.",
    date: "March 18-19, 2026",
    time: "9:00 AM - 6:00 PM",
    location: "iHub, Nairobi",
    category: "Technology",
    price: "KES 3,000",
    image: "https://images.unsplash.com/photo-1677448608869-83e6b6e851f?w=800&h=600&fit=crop&crop=center&auto=format",
    ticketLink: "https://hubtickets.com/ai-ml-summit-2026"
  },
  {
    title: "Blockchain & Web3 Workshop",
    description: "Learn about blockchain technology, cryptocurrency, and Web3 development. Perfect for developers and tech enthusiasts.",
    date: "March 25, 2026",
    time: "10:00 AM - 4:00 PM",
    location: "Nailab, Nairobi",
    category: "Technology",
    price: "KES 1,500",
    image: "https://images.unsplash.com/photo-1639322533846-2b9be1b55b6?w=800&h=600&fit=crop&crop=center&auto=format",
    ticketLink: "https://nailab.io/blockchain-web3-workshop-2026"
  },
  {
    title: "Mobile App Development Bootcamp",
    description: "Intensive 3-day bootcamp covering React Native, Flutter, and cross-platform mobile development. Build real apps!",
    date: "March 22-24, 2026",
    time: "9:00 AM - 5:00 PM",
    location: "Moringa School, Nairobi",
    category: "Technology",
    price: "KES 4,000",
    image: "https://images.unsplash.com/photo-1512941970525-778782e5e6b?w=800&h=600&fit=crop&crop=center&auto=format",
    ticketLink: "https://moringa.school/mobile-bootcamp-2026"
  },
  {
    title: "Cybersecurity Conference",
    description: "Latest trends in cybersecurity, ethical hacking, and digital protection. Network with security professionals.",
    date: "March 30, 2026",
    time: "8:00 AM - 6:00 PM",
    location: "USIU, Nairobi",
    category: "Technology",
    price: "KES 2,500",
    image: "https://images.unsplash.com/photo-1563013544-824ae1a706d3?w=800&h=600&fit=crop&crop=center&auto=format",
    ticketLink: "https://usiu.ac.ke/cybersecurity-conference-2026"
  },
  {
    title: "University Career Fair 2026",
    description: "Connect with top employers, explore internship opportunities, and launch your career. Over 100 companies participating!",
    date: "March 15-16, 2026",
    time: "10:00 AM - 4:00 PM",
    location: "Kenyatta University, Nairobi",
    category: "Education",
    price: "Free",
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&h=600&fit=crop&crop=center&auto=format",
    ticketLink: "https://ku.ac.ke/career-fair-2026"
  },
  {
    title: "Study Abroad Information Session",
    description: "Learn about international study opportunities, scholarships, and application processes. Meet university representatives.",
    date: "March 20, 2026",
    time: "2:00 PM - 6:00 PM",
    location: "Strathmore University, Nairobi",
    category: "Education",
    price: "Free",
    image: "https://images.unsplash.com/photo-1523050854058-7f4a7046a00a?w=800&h=600&fit=crop&crop=center&auto=format",
    ticketLink: "https://strathmore.edu/study-abroad-session-2026"
  },
  {
    title: "Research Symposium 2026",
    description: "Academic research presentations, poster sessions, and networking with scholars from various universities.",
    date: "March 27-28, 2026",
    time: "9:00 AM - 5:00 PM",
    location: "University of Nairobi, Nairobi",
    category: "Education",
    price: "KES 500",
    image: "https://images.unsplash.com/photo-1434030256770-791f26fb840b?w=800&h=600&fit=crop&crop=center&auto=format",
    ticketLink: "https://uonbi.ac.ke/research-symposium-2026"
  },
  {
    title: "Coding Competition Finals",
    description: "Watch top student programmers compete in algorithm challenges and problem-solving. Exciting prizes and recognition!",
    date: "March 23, 2026",
    time: "1:00 PM - 6:00 PM",
    location: "JKUAT, Nairobi",
    category: "Education",
    price: "KES 300",
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f?w=800&h=600&fit=crop&crop=center&auto=format",
    ticketLink: "https://jkuat.ac.ke/coding-competition-2026"
  },
  {
    title: "Science Innovation Fair",
    description: "Showcase of innovative science projects, experiments, and discoveries by students and researchers.",
    date: "March 29-30, 2026",
    time: "10:00 AM - 4:00 PM",
    location: "Alliance High School, Nairobi",
    category: "Science",
    price: "KES 400",
    image: "https://images.unsplash.com/photo-1532099436881-5291b1d6d0a?w=800&h=600&fit=crop&crop=center&auto=format",
    ticketLink: "https://alliancehigh.science/science-fair-2026"
  },
  {
    title: "Robotics Workshop",
    description: "Hands-on robotics workshop covering Arduino, Raspberry Pi, and robot building. No experience required!",
    date: "March 17, 2026",
    time: "9:00 AM - 3:00 PM",
    location: "Nairobi Technical Institute, Nairobi",
    category: "Science",
    price: "KES 800",
    image: "https://images.unsplash.com/photo-1561557949-6682a84e00b7?w=800&h=600&fit=crop&crop=center&auto=format",
    ticketLink: "https://nti.ac.ke/robotics-workshop-2026"
  },
  {
    title: "Gaming Tournament 2026",
    description: "Epic gaming tournament with FIFA, Call of Duty, and Fortnite competitions. Amazing prizes for winners!",
    date: "March 26-27, 2026",
    time: "10:00 AM - 8:00 PM",
    location: "The Hub, Nairobi",
    category: "Gaming",
    price: "KES 600",
    image: "https://images.unsplash.com/photo-1542751371-fc94c4e36a77?w=800&h=600&fit=crop&crop=center&auto=format",
    ticketLink: "https://thehubnairobi.com/gaming-tournament-2026"
  },
  {
    title: "ESports Championship",
    description: "Professional esports competition featuring League of Legends, Valorant, and CS:GO teams from across East Africa.",
    date: "March 31 - April 1, 2026",
    time: "2:00 PM - 10:00 PM",
    location: "Kasarani Arena, Nairobi",
    category: "Gaming",
    price: "KES 1,200",
    image: "https://images.unsplash.com/photo-15115182236-0eecb9400b47?w=800&h=600&fit=crop&crop=center&auto=format",
    ticketLink: "https://esportskenya.com/championship-2026"
  },
  {
    title: "Comedy Night with Eric Omondi",
    description: "Kenya's top comedian Eric Omondi brings his latest stand-up comedy show to Nairobi with special guest performances.",
    date: "March 10, 2026",
    time: "8:00 PM",
    location: "Carnivore Restaurant, Nairobi",
    category: "Comedy",
    price: "KES 2,000",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop&crop=center&auto=format",
    ticketLink: "https://carnivore.co.ke/eric-omondi-comedy-2026"
  },
  {
    title: "Stand-up Comedy Open Mic",
    description: "Open mic night for aspiring comedians. Try your material and get feedback from the audience.",
    date: "Every Wednesday in March",
    time: "7:00 PM - 10:00 PM",
    location: "The Alchemist, Westlands",
    category: "Comedy",
    price: "KES 500",
    image: "https://images.unsplash.com/photo-1581833971eeb8f60c6b3516c6c5a0c8?w=800&h=600&fit=crop&crop=center&auto=format",
    ticketLink: "https://alchemistbar.com/open-mic-comedy-2026"
  },
  {
    title: "Nairobi Fashion Week",
    description: "Showcasing the best of Kenyan and African fashion designers with runway shows, exhibitions, and networking events.",
    date: "March 16-18, 2026",
    time: "6:00 PM - 10:00 PM",
    location: "Sarit Centre Expo Centre, Nairobi",
    category: "Fashion",
    price: "KES 1,500",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop&crop=center&auto=format",
    ticketLink: "https://nairobfashionweek.co.ke/tickets-2026"
  },
  {
    title: "Street Fashion Showcase",
    description: "Urban street fashion exhibition featuring local designers, live music, and pop-up shops.",
    date: "March 25, 2026",
    time: "12:00 PM - 8:00 PM",
    location: "Westgate Mall, Nairobi",
    category: "Fashion",
    price: "KES 800",
    image: "https://images.unsplash.com/photo-1445205170238-7e693166bb5e?w=800&h=600&fit=crop&crop=center&auto=format",
    ticketLink: "https://westgate.co.ke/fashion-showcase-2026"
  },
  {
    title: "Nairobi Marathon 2026",
    description: "Annual Nairobi Marathon featuring 42km, 21km, 10km, and 5km races. Join thousands of runners in Kenya's premier marathon event.",
    date: "March 23, 2026",
    time: "6:00 AM",
    location: "Uhuru Gardens, Nairobi",
    category: "Sports",
    price: "KES 1,000",
    image: "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=800&h=600&fit=crop&crop=center&auto=format",
    ticketLink: "https://nairobidistance.org/marathon-2026"
  },
  {
    title: "Basketball Tournament",
    description: "Inter-university basketball championship with teams from across Kenya competing for the championship title.",
    date: "March 28-30, 2026",
    time: "9:00 AM - 6:00 PM",
    location: "Kenyatta University Gymnasium, Nairobi",
    category: "Sports",
    price: "KES 300",
    image: "https://images.unsplash.com/photo-1546519638-68e1aa3d9e76?w=800&h=600&fit=crop&crop=center&auto=format",
    ticketLink: "https://kusports.ac.ke/basketball-tournament-2026"
  },
  {
    title: "Kenya Food Festival",
    description: "Celebrate Kenya's diverse culinary scene with food tastings, cooking demonstrations, and chef competitions from top restaurants.",
    date: "March 25-26, 2026",
    time: "10:00 AM - 8:00 PM",
    location: "KICC Grounds, Nairobi",
    category: "Food",
    price: "KES 800",
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop&crop=center&auto=format",
    ticketLink: "https://kenyafoodfestival.co.ke/tickets-2026"
  },
  {
    title: "Street Food Festival",
    description: "Experience Nairobi's vibrant street food scene with local vendors, live cooking, and cultural performances.",
    date: "March 18-19, 2026",
    time: "11:00 AM - 9:00 PM",
    location: "Ngong Racecourse, Nairobi",
    category: "Food",
    price: "KES 400",
    image: "https://images.unsplash.com/photo-1504674900247-087a2346ec7d?w=800&h=600&fit=crop&crop=center&auto=format",
    ticketLink: "https://ngongracecourse.com/street-food-festival-2026"
  },
  {
    title: "Nairobi Art Biennale",
    description: "Contemporary African art exhibition featuring works from over 50 artists across the continent. Includes workshops and artist talks.",
    date: "March 28-30, 2026",
    time: "10:00 AM - 6:00 PM",
    location: "National Museum of Kenya, Nairobi",
    category: "Art",
    price: "KES 500",
    image: "https://images.unsplash.com/photo-1536924940846-227afb31e2a5?w=800&h=600&fit=crop&crop=center&auto=format",
    ticketLink: "https://museums.co.ke/art-biennale-2026"
  },
  {
    title: "Digital Art Exhibition",
    description: "Cutting-edge digital art showcase featuring NFTs, VR experiences, and interactive installations.",
    date: "March 22-24, 2026",
    time: "11:00 AM - 7:00 PM",
    location: "Creatives Garage, Nairobi",
    category: "Art",
    price: "KES 600",
    image: "https://images.unsplash.com/photo-1633412802914-f474b0e3431?w=800&h=600&fit=crop&crop=center&auto=format",
    ticketLink: "https://creativesgarage.com/digital-art-2026"
  },
  {
    title: "Nairobi Jazz Festival",
    description: "Three-day jazz festival featuring international and local jazz artists, workshops, and jam sessions in the heart of Nairobi.",
    date: "March 31 - April 2, 2026",
    time: "5:00 PM - 11:00 PM",
    location: "Kilimani Primary School Grounds, Nairobi",
    category: "Music",
    price: "KES 2,500",
    image: "https://images.unsplash.com/photo-1463100095044-357583b65b7c?w=800&h=600&fit=crop&crop=center&auto=format",
    ticketLink: "https://nairobijazz.com/festival-2026"
  },
  {
    title: "Electronic Music Festival",
    description: "Two-day electronic music festival with international DJs, light shows, and an incredible atmosphere.",
    date: "March 29-30, 2026",
    time: "4:00 PM - 2:00 AM",
    location: "KICC Grounds, Nairobi",
    category: "Music",
    price: "KES 3,000",
    image: "https://images.unsplash.com/photo-1470225620780-dba8ba8b4996?w=800&h=600&fit=crop&crop=center&auto=format",
    ticketLink: "https://electronicfest.co.ke/nairobi-2026"
  },
  {
    title: "Friday Night Party at The Alchemist",
    description: "Experience Nairobi's hottest Friday night party at The Alchemist with top DJs playing Afrobeats, Amapiano, and international hits. Premium cocktails and vibrant atmosphere.",
    date: "Every Friday in March",
    time: "9:00 PM - 4:00 AM",
    location: "The Alchemist, Westlands",
    category: "Clubbing",
    price: "KES 1,000",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop&crop=center&auto=format",
    ticketLink: "https://alchemistbar.com/friday-night-2026"
  },
  {
    title: "Saturday Ladies Night at K1 Klub House",
    description: "Ladies night every Saturday at K1 Klub House with free entry for ladies, 2-for-1 drinks, and Nairobi's best DJs spinning the latest hits.",
    date: "Every Saturday in March",
    time: "10:00 PM - 5:00 AM",
    location: "K1 Klub House, Parklands",
    category: "Clubbing",
    price: "KES 500 (Gents), Free (Ladies)",
    image: "https://images.unsplash.com/photo-1544968347-9a1f61b1ad0a?w=800&h=600&fit=crop&crop=center&auto=format",
    ticketLink: "https://k1klubhouse.com/ladies-night-2026"
  },
  {
    title: "International DJ Night at B-Flat",
    description: "Special guest international DJ performance at B-Flat Nairobi's premier rooftop club. Featuring world-class electronic music and panoramic city views.",
    date: "March 15, 2026",
    time: "11:00 PM - 6:00 AM",
    location: "B-Flat, 14 Riverside",
    category: "Clubbing",
    price: "KES 2,000",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&crop=center&auto=format",
    ticketLink: "https://bflatnairobi.com/international-dj-2026"
  },
  {
    title: "Karaoke Night at Galileo Lounge",
    description: "Every Wednesday karaoke night at Galileo Lounge. Sing your heart out to your favorite hits with friends and enjoy special drink offers.",
    date: "Every Wednesday in March",
    time: "8:00 PM - 2:00 AM",
    location: "Galileo Lounge, Westlands",
    category: "Clubbing",
    price: "KES 300",
    image: "https://images.unsplash.com/photo-1516450360452-9312f51686ad?w=800&h=600&fit=crop&crop=center&auto=format",
    ticketLink: "https://galileolounge.com/karaoke-night-2026"
  },
  {
    title: "Urban Music Night at Changes Nairobi",
    description: "Urban music and hip-hop night at Changes Nairobi featuring local artists and DJs. Experience Nairobi's underground music scene.",
    date: "March 20, 2026",
    time: "10:00 PM - 4:00 AM",
    location: "Changes Nairobi, Kijabe Street",
    category: "Clubbing",
    price: "KES 800",
    image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&h=600&fit=crop&crop=center&auto=format",
    ticketLink: "https://changesnairobi.com/urban-music-2026"
  },
  {
    title: "Rooftop Party at The Lord Erroll",
    description: "Exclusive rooftop party at The Lord Erroll with sophisticated ambiance, premium cocktails, and Nairobi's elite crowd. Dress code: Smart casual.",
    date: "March 25, 2026",
    time: "9:00 PM - 3:00 AM",
    location: "The Lord Erroll, Runda",
    category: "Clubbing",
    price: "KES 3,000",
    image: "https://images.unsplash.com/photo-1511795406834-213e69c13f07?w=800&h=600&fit=crop&crop=center&auto=format",
    ticketLink: "https://lorderroll.com/rooftop-party-2026"
  },
  {
    title: "Latin Night at Havana Bar",
    description: "Dance the night away to Latin rhythms at Havana Bar. Salsa, bachata, and reggaeton with professional dancers and live percussion.",
    date: "Every Thursday in March",
    time: "9:00 PM - 3:00 AM",
    location: "Havana Bar, Westlands",
    category: "Clubbing",
    price: "KES 600",
    image: "https://images.unsplash.com/photo-1519675869491-65a383e27e6f?w=800&h=600&fit=crop&crop=center&auto=format",
    ticketLink: "https://havanabar.com/latin-night-2026"
  }
];

const insertEvent = db.prepare('INSERT INTO events (title, description, date, time, location, category, price, image, ticketLink) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');
currentEvents.forEach(event => {
  insertEvent.run(event.title, event.description, event.date, event.time, event.location, event.category, event.price, event.image, event.ticketLink);
});

console.log(' Events: Current Nairobi events inserted');

// Get all events
router.get('/', (req, res) => {
  try {
    console.log('🔍 Fetching events with query:', req.query);
    
    // Check if database is available
    if (!db || typeof db.prepare !== 'function') {
      console.error('❌ Database not properly initialized');
      return res.status(500).json({ error: 'Database not available' });
    }
    
    const { category, search } = req.query;
    
    let query = 'SELECT * FROM events';
    let params = [];
    
    if (category && category !== 'All') {
      query += ' WHERE category = ?';
      params.push(category);
    }
    
    if (search) {
      query += category && category !== 'All' 
        ? ' AND (title LIKE ? OR description LIKE ? OR location LIKE ?)'
        : ' WHERE (title LIKE ? OR description LIKE ? OR location LIKE ?)';
      const searchTerm = `%${search}%`;
      if (category && category !== 'All') {
        params.push(searchTerm, searchTerm, searchTerm);
      } else {
        params.push(searchTerm, searchTerm, searchTerm);
      }
    }
    
    query += ' ORDER BY date ASC';
    console.log('📝 Final query:', query);
    console.log('📝 Parameters:', params);
    
    const stmt = db.prepare(query);
    if (!stmt) {
      console.error('❌ Failed to prepare statement');
      return res.status(500).json({ error: 'Database query preparation failed' });
    }
    
    const rows = stmt.all(params);
    console.log('📊 Found events:', rows.length);
    
    // Transform rows to match frontend Event interface
    const events = rows.map(row => ({
      id: row.id.toString(),
      title: row.title,
      description: row.description,
      date: row.date,
      time: row.time,
      location: row.location,
      category: row.category,
      price: row.price,
      image: row.image,
      ticketLink: row.ticket_link,
      availableTickets: row.available_tickets
    }));
    
    console.log('✅ Sending events to frontend');
    res.json(events);
  } catch (err) {
    console.error('❌ Events route error:', err);
    console.error('❌ Stack trace:', err.stack);
    res.status(500).json({ error: 'Database error', details: err.message });
  }
});

// Get single event by ID
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params;
    
    const row = db.prepare('SELECT * FROM events WHERE id = ?').get([id]);
    
    if (!row) {
      return res.status(404).json({ error: 'Event not found' });
    }
    
    const event = {
      id: row.id.toString(),
      title: row.title,
      description: row.description,
      date: row.date,
      time: row.time,
      location: row.location,
      category: row.category,
      price: row.price,
      image: row.image,
      ticketLink: row.ticket_link,
      availableTickets: row.available_tickets
    };
    
    res.json(event);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Get all categories
router.get('/categories/list', (req, res) => {
  try {
    console.log('🔍 Fetching categories');
    
    // Check if database is available
    if (!db || typeof db.prepare !== 'function') {
      console.error('❌ Database not properly initialized');
      return res.status(500).json({ error: 'Database not available' });
    }
    
    const stmt = db.prepare('SELECT DISTINCT category FROM events ORDER BY category');
    if (!stmt) {
      console.error('❌ Failed to prepare categories statement');
      return res.status(500).json({ error: 'Database query preparation failed' });
    }
    
    const rows = stmt.all();
    console.log('📊 Found categories:', rows.length);
    const categories = rows.map(row => row.category);
    console.log('✅ Categories:', categories);
    res.json(categories);
  } catch (err) {
    console.error('❌ Categories route error:', err);
    console.error('❌ Stack trace:', err.stack);
    res.status(500).json({ error: 'Database error', details: err.message });
  }
});

// Create new event (admin only)
router.post('/', (req, res) => {
  const { title, description, date, time, location, category, price, image, ticket_link } = req.body;

  if (!title || !description || !date || !time || !location || !category || !price || !image || !ticket_link) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const query = `INSERT INTO events (title, description, date, time, location, category, price, image, ticket_link) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  db.prepare(query).run([title, description, date, time, location, category, price, image, ticket_link], function(err) {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database error' });
    }

    res.status(201).json({
      id: this.lastID.toString(),
      title,
      description,
      date,
      time,
      location,
      category,
      price,
      image,
      ticket_link: ticket_link
    });
  });
});

// Update event (admin only)
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { title, description, date, time, location, category, price, image, ticket_link } = req.body;

  const query = `UPDATE events 
                 SET title = ?, description = ?, date = ?, time = ?, location = ?, 
                     category = ?, price = ?, image = ?, ticket_link = ?, updated_at = CURRENT_TIMESTAMP
                 WHERE id = ?`;

  db.run(query, [title, description, date, time, location, category, price, image, ticket_link, id], function(err) {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database error' });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.json({ message: 'Event updated successfully' });
  });
});

// Delete event (admin only)
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  db.prepare('DELETE FROM events WHERE id = ?').run([id], function(err) {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database error' });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.json({ message: 'Event deleted successfully' });
  });
});

module.exports = router;
