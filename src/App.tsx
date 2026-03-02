import { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { EventCard, Event } from "./components/EventCard";
import { motion } from "framer-motion";
import { Code, Briefcase, Music, Palette, Utensils, Gamepad2, GraduationCap, Microscope, Trophy, Sparkles, Star, Zap, ArrowRight, Theater, Calendar, MapPin, Users, TrendingUp } from "lucide-react";
import { apiService } from "./services/api";

export default function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load categories on component mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true);
        const categoriesData = await apiService.getCategories();
        setCategories(categoriesData);
        setError(null);
      } catch (err) {
        setError('Failed to load categories');
        console.error('Error loading categories:', err);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  // Load events when category is selected
  useEffect(() => {
    if (selectedCategory) {
      const loadEvents = async () => {
        try {
          setLoading(true);
          const eventsData = await apiService.getEvents(selectedCategory, searchQuery);
          setEvents(eventsData);
          setError(null);
        } catch (err) {
          setError('Failed to load events');
          console.error('Error loading events:', err);
        } finally {
          setLoading(false);
        }
      };

      loadEvents();
    }
  }, [selectedCategory, searchQuery]);

  // Category data with images and descriptions
  const categoryInfo: Record<string, { 
    icon: React.ReactNode; 
    title: string;
    description: string;
    image: string;
    color: string;
    navColor: string;
  }> = {
    "Technology": { 
      icon: <Code className="h-8 w-8" />, 
      title: "Tech Events",
      description: "Tech conferences, workshops, and hackathons",
      image: "https://images.unsplash.com/photo-1550745165-9bc0b252726a?w=400&h=300&fit=crop&crop=center&auto=format",
      color: "from-blue-600 to-cyan-600",
      navColor: "bg-gradient-to-r from-blue-500 to-cyan-500"
    },
    "Education": { 
      icon: <GraduationCap className="h-8 w-8" />, 
      title: "Education & Learning",
      description: "Career fairs, workshops, and academic events",
      image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=400&h=300&fit=crop&crop=center&auto=format",
      color: "from-purple-600 to-indigo-600",
      navColor: "bg-gradient-to-r from-purple-500 to-indigo-500"
    },
    "Business": { 
      icon: <Briefcase className="h-8 w-8" />, 
      title: "Business & Networking",
      description: "Networking, conferences, and trade shows",
      image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=400&h=300&fit=crop&crop=center&auto=format",
      color: "from-green-600 to-emerald-600",
      navColor: "bg-gradient-to-r from-green-500 to-emerald-500"
    },
    "Music": { 
      icon: <Music className="h-8 w-8" />, 
      title: "Music & Concerts",
      description: "Live concerts, festivals, and performances",
      image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&h=300&fit=crop&crop=center&auto=format",
      color: "from-pink-600 to-rose-600",
      navColor: "bg-gradient-to-r from-pink-500 to-rose-500"
    },
    "Art": { 
      icon: <Palette className="h-8 w-8" />, 
      title: "Art & Culture",
      description: "Exhibitions, galleries, and creative workshops",
      image: "https://images.unsplash.com/photo-1536924940846-227afb31e2a5?w=400&h=300&fit=crop&crop=center&auto=format",
      color: "from-orange-600 to-red-600",
      navColor: "bg-gradient-to-r from-orange-500 to-red-500"
    },
    "Food": { 
      icon: <Utensils className="h-8 w-8" />, 
      title: "Food & Dining",
      description: "Food festivals, tastings, and culinary events",
      image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop&crop=center&auto=format",
      color: "from-yellow-600 to-amber-600",
      navColor: "bg-gradient-to-r from-yellow-500 to-amber-500"
    },
    "Sports": { 
      icon: <Trophy className="h-8 w-8" />, 
      title: "Sports & Fitness",
      description: "Tournaments, marathons, and fitness events",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop&crop=center&auto=format",
      color: "from-red-600 to-pink-600",
      navColor: "bg-gradient-to-r from-red-500 to-pink-500"
    },
    "Science": { 
      icon: <Microscope className="h-8 w-8" />, 
      title: "Science & Innovation",
      description: "Innovation fairs, workshops, and research",
      image: "https://images.unsplash.com/photo-1532099436881-5291b1d6d0a?w=400&h=300&fit=crop&crop=center&auto=format",
      color: "from-teal-600 to-cyan-600",
      navColor: "bg-gradient-to-r from-teal-500 to-cyan-500"
    },
    "Gaming": { 
      icon: <Gamepad2 className="h-8 w-8" />, 
      title: "Gaming & Esports",
      description: "Tournaments, esports, and gaming events",
      image: "https://images.unsplash.com/photo-1542751371-fc94c4e36a77?w=400&h=300&fit=crop&crop=center&auto=format",
      color: "from-indigo-600 to-purple-600",
      navColor: "bg-gradient-to-r from-indigo-500 to-purple-500"
    },
    "Comedy": { 
      icon: <Sparkles className="h-8 w-8" />, 
      title: "Comedy & Entertainment",
      description: "Stand-up shows, open mics, and comedy nights",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop&crop=center&auto=format",
      color: "from-yellow-400 to-orange-500",
      navColor: "bg-gradient-to-r from-yellow-400 to-orange-400"
    },
    "Fashion": { 
      icon: <Star className="h-8 w-8" />, 
      title: "Fashion & Style",
      description: "Fashion shows, exhibitions, and style events",
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop&crop=center&auto=format",
      color: "from-pink-500 to-purple-600",
      navColor: "bg-gradient-to-r from-pink-400 to-purple-400"
    },
    "Clubbing": { 
      icon: <Zap className="h-8 w-8" />, 
      title: "Nightlife & Parties",
      description: "Nightlife, parties, and club events",
      image: "https://images.unsplash.com/photo-1516450360452-9312f51686ad?w=400&h=300&fit=crop&crop=center&auto=format",
      color: "from-purple-600 to-pink-600",
      navColor: "bg-gradient-to-r from-purple-500 to-pink-500"
    },
    "Theater": { 
      icon: <Theater className="h-8 w-8" />, 
      title: "Theater & Drama",
      description: "Theater performances, plays, and dramatic arts",
      image: "https://images.unsplash.com/photo-1503095487142-2f5e2cd5e44?w=400&h=300&fit=crop&crop=center&auto=format",
      color: "from-red-700 to-pink-700",
      navColor: "bg-gradient-to-r from-red-600 to-pink-600"
    }
  };

  if (loading && !selectedCategory) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-20 h-20 mx-auto mb-8"
          >
            <div className="w-full h-full bg-gradient-to-r from-yellow-400 to-pink-500 rounded-full flex items-center justify-center shadow-2xl">
              <Sparkles className="h-10 w-10 text-white" />
            </div>
          </motion.div>
          <motion.h1
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-4xl font-bold text-white mb-4"
          >
            Welcome to CHEKI EVENTS
          </motion.h1>
          <motion.p
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-white text-xl font-medium"
          >
            Discover Amazing Events in Nairobi
          </motion.p>
        </div>
      </div>
    );
  }

  if (error && !selectedCategory) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 flex items-center justify-center">
        <div className="text-center">
          <Sparkles className="h-20 w-20 text-red-400 mx-auto mb-8" />
          <h2 className="text-4xl font-bold text-white mb-6">Oops!</h2>
          <p className="text-white text-xl mb-8">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-8 py-4 bg-gradient-to-r from-yellow-400 to-pink-500 text-white rounded-full text-lg font-bold hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Category Menu View
  if (!selectedCategory) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 flex flex-col">
        <Header userName="Guest" onLogout={() => {}} />
        
        {/* Colorful Top Navigation Bar */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="fixed top-16 left-0 right-0 bg-white/95 backdrop-blur-lg border-t-2 border-white shadow-2xl z-50"
        >
          <div className="container mx-auto px-4 py-4">
            <div className="flex justify-center gap-3 md:gap-6 overflow-x-auto">
              {categories.map((category) => (
                <motion.button
                  key={category}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedCategory(category)}
                  className={`flex flex-col items-center gap-2 px-4 py-3 rounded-2xl transition-all duration-300 shadow-lg ${
                    selectedCategory === category
                      ? `${categoryInfo[category]?.navColor} text-white shadow-2xl transform scale-110`
                      : 'bg-white text-gray-700 hover:bg-gray-100 border-2 border-gray-200'
                  }`}
                >
                  <div className="h-6 w-6">
                    {categoryInfo[category]?.icon}
                  </div>
                  <span className="text-xs font-bold whitespace-nowrap">
                    {categoryInfo[category]?.title || category}
                  </span>
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>
        
        <div className="flex-1 container mx-auto px-4 py-8 pt-24">
          {/* Welcome Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <motion.h1 
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="text-6xl font-bold text-white mb-6 drop-shadow-2xl"
            >
              🎉 Welcome to CHEKI EVENTS 🎉
            </motion.h1>
            <motion.p 
              animate={{ opacity: [0.8, 1, 0.8] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-2xl text-white mb-8 drop-shadow-lg"
            >
              Discover Amazing Events in Nairobi - Your Gateway to Entertainment!
            </motion.p>
            
            {/* Stats */}
            <div className="flex justify-center gap-8 mb-12">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                className="text-center"
              >
                <div className="text-4xl font-bold text-yellow-400">30+</div>
                <div className="text-white font-medium">Events</div>
              </motion.div>
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                className="text-center"
              >
                <div className="text-4xl font-bold text-pink-400">13</div>
                <div className="text-white font-medium">Categories</div>
              </motion.div>
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: 1.5 }}
                className="text-center"
              >
                <div className="text-4xl font-bold text-cyan-400">24/7</div>
                <div className="text-white font-medium">Access</div>
              </motion.div>
            </div>
          </motion.div>

          {/* Category Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {categories.map((category, index) => (
              <motion.button
                key={category}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ 
                  scale: 1.08,
                  boxShadow: "0 25px 50px rgba(0, 0, 0, 0.4)",
                  y: -5
                }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(category)}
                className="relative overflow-hidden rounded-3xl bg-white shadow-2xl hover:shadow-3xl transition-all duration-300 group"
              >
                <div className="relative h-64 w-full overflow-hidden">
                  <img
                    src={categoryInfo[category]?.image}
                    alt={category}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                  
                  {/* Category Icon */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm p-4 rounded-2xl shadow-xl"
                  >
                    <div className={`text-${categoryInfo[category]?.color.split(' ')[0]}-600`}>
                      {categoryInfo[category]?.icon}
                    </div>
                  </motion.div>

                  {/* Category Name - CLEAR AND VISIBLE */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-6">
                    <h3 className="text-white font-bold text-2xl mb-2 drop-shadow-lg">
                      {categoryInfo[category]?.title || category}
                    </h3>
                    <p className="text-gray-200 text-sm line-clamp-2 drop-shadow-md">
                      {categoryInfo[category]?.description}
                    </p>
                  </div>
                </div>

                {/* Hover Arrow */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileHover={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 to-pink-500 p-3 rounded-full shadow-xl"
                >
                  <ArrowRight className="h-6 w-6 text-white" />
                </motion.div>

                {/* Event Count Badge */}
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 }}
                  className="absolute top-4 right-4 bg-gradient-to-r from-green-400 to-blue-500 px-3 py-1 rounded-full text-white text-xs font-bold shadow-lg"
                >
                  {Math.floor(Math.random() * 5) + 2} Events
                </motion.div>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Events View for Selected Category
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 flex flex-col">
      <Header userName="Guest" onLogout={() => {}} />
      
      {/* Colorful Top Navigation Bar */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="fixed top-16 left-0 right-0 bg-white/95 backdrop-blur-lg border-t-2 border-white shadow-2xl z-50"
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-center gap-3 md:gap-6 overflow-x-auto">
            {categories.map((category) => (
              <motion.button
                key={category}
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(category)}
                className={`flex flex-col items-center gap-2 px-4 py-3 rounded-2xl transition-all duration-300 shadow-lg ${
                  selectedCategory === category
                    ? `${categoryInfo[category]?.navColor} text-white shadow-2xl transform scale-110`
                    : 'bg-white text-gray-700 hover:bg-gray-100 border-2 border-gray-200'
                }`}
              >
                <div className="h-6 w-6">
                  {categoryInfo[category]?.icon}
                </div>
                <span className="text-xs font-bold whitespace-nowrap">
                  {categoryInfo[category]?.title || category}
                </span>
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>
      
      <div className="flex-1 container mx-auto px-4 py-8 pb-20 pt-24">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          onClick={() => setSelectedCategory(null)}
          className="mb-6 flex items-center gap-3 px-6 py-3 bg-white rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
        >
          <ArrowRight className="h-5 w-5 rotate-180" />
          <span className="font-bold text-gray-800">Back to Categories</span>
        </motion.button>

        {/* Category Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-4 mb-6">
            <div className={`p-4 rounded-full bg-gradient-to-r ${categoryInfo[selectedCategory]?.color} text-white shadow-2xl`}>
              {categoryInfo[selectedCategory]?.icon}
            </div>
            <h1 className="text-4xl font-bold text-white drop-shadow-2xl">{categoryInfo[selectedCategory]?.title || selectedCategory}</h1>
          </div>
          <p className="text-xl text-white drop-shadow-lg">{categoryInfo[selectedCategory]?.description}</p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-12"
        >
          <div className="max-w-2xl mx-auto">
            <input
              type="text"
              placeholder={`Search ${categoryInfo[selectedCategory]?.title || selectedCategory} events...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-8 py-4 bg-white/95 border-2 border-white rounded-full text-gray-800 placeholder-gray-500 focus:outline-none focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/20 transition-all duration-300 shadow-xl"
            />
          </div>
        </motion.div>

        {/* Events Grid */}
        {loading ? (
          <div className="text-center py-20">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-20 h-20 mx-auto mb-8"
            >
              <div className="w-full h-full bg-gradient-to-r from-yellow-400 to-pink-500 rounded-full flex items-center justify-center shadow-2xl">
                <Sparkles className="h-10 w-10 text-white" />
              </div>
            </motion.div>
            <motion.p
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-white text-xl font-medium"
            >
              Loading amazing events...
            </motion.p>
          </div>
        ) : events.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <Sparkles className="h-20 w-20 text-yellow-400 mx-auto mb-8" />
            <h3 className="text-3xl font-bold text-white mb-6">No events found</h3>
            <p className="text-xl text-white">Try adjusting your search</p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
          >
            {events.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 25px 50px rgba(0, 0, 0, 0.4)"
                }}
              >
                <EventCard event={event} index={index} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
