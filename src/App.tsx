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

  // Category data with AI cartoon-style images and clearer names
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
      description: "Conferences, workshops, and hackathons",
      image: "https://images.unsplash.com/photo-1620712943543-5d823b5eb5db?w=400&h=300&fit=crop&crop=center&auto=format",
      color: "from-blue-600 to-cyan-600",
      navColor: "bg-gradient-to-r from-blue-500 to-cyan-500"
    },
    "Education": { 
      icon: <GraduationCap className="h-8 w-8" />, 
      title: "Education Events",
      description: "Career fairs, workshops, and learning",
      image: "https://images.unsplash.com/photo-1588286840104-8957b019727f?w=400&h=300&fit=crop&crop=center&auto=format",
      color: "from-purple-600 to-indigo-600",
      navColor: "bg-gradient-to-r from-purple-500 to-indigo-500"
    },
    "Business": { 
      icon: <Briefcase className="h-8 w-8" />, 
      title: "Business Events",
      description: "Networking, conferences, and trade shows",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop&crop=center&auto=format",
      color: "from-green-600 to-emerald-600",
      navColor: "bg-gradient-to-r from-green-500 to-emerald-500"
    },
    "Music": { 
      icon: <Music className="h-8 w-8" />, 
      title: "Music Events",
      description: "Live concerts, festivals, and performances",
      image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&h=300&fit=crop&crop=center&auto=format",
      color: "from-pink-600 to-rose-600",
      navColor: "bg-gradient-to-r from-pink-500 to-rose-500"
    },
    "Art": { 
      icon: <Palette className="h-8 w-8" />, 
      title: "Art Events",
      description: "Exhibitions, galleries, and creative workshops",
      image: "https://images.unsplash.com/photo-1536924940846-227afb31e2a5?w=400&h=300&fit=crop&crop=center&auto=format",
      color: "from-orange-600 to-red-600",
      navColor: "bg-gradient-to-r from-orange-500 to-red-500"
    },
    "Food": { 
      icon: <Utensils className="h-8 w-8" />, 
      title: "Food Events",
      description: "Food festivals, tastings, and dining",
      image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop&crop=center&auto=format",
      color: "from-yellow-600 to-amber-600",
      navColor: "bg-gradient-to-r from-yellow-500 to-amber-500"
    },
    "Sports": { 
      icon: <Trophy className="h-8 w-8" />, 
      title: "Sports Events",
      description: "Tournaments, marathons, and fitness",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop&crop=center&auto=format",
      color: "from-red-600 to-pink-600",
      navColor: "bg-gradient-to-r from-red-500 to-pink-500"
    },
    "Science": { 
      icon: <Microscope className="h-8 w-8" />, 
      title: "Science Events",
      description: "Innovation fairs, workshops, and research",
      image: "https://images.unsplash.com/photo-1532099436881-5291b1d6d0a?w=400&h=300&fit=crop&crop=center&auto=format",
      color: "from-teal-600 to-cyan-600",
      navColor: "bg-gradient-to-r from-teal-500 to-cyan-500"
    },
    "Gaming": { 
      icon: <Gamepad2 className="h-8 w-8" />, 
      title: "Gaming Events",
      description: "Tournaments, esports, and gaming",
      image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=300&fit=crop&crop=center&auto=format",
      color: "from-indigo-600 to-purple-600",
      navColor: "bg-gradient-to-r from-indigo-500 to-purple-500"
    },
    "Comedy": { 
      icon: <Sparkles className="h-8 w-8" />, 
      title: "Comedy Events",
      description: "Stand-up shows, open mics, and entertainment",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop&crop=center&auto=format",
      color: "from-yellow-400 to-orange-500",
      navColor: "bg-gradient-to-r from-yellow-400 to-orange-400"
    },
    "Fashion": { 
      icon: <Star className="h-8 w-8" />, 
      title: "Fashion Events",
      description: "Fashion shows, exhibitions, and style",
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop&crop=center&auto=format",
      color: "from-pink-500 to-purple-600",
      navColor: "bg-gradient-to-r from-pink-400 to-purple-400"
    },
    "Clubbing": { 
      icon: <Zap className="h-8 w-8" />, 
      title: "Nightlife Events",
      description: "Parties, clubs, and nightlife",
      image: "https://images.unsplash.com/photo-1516450360452-9312f51686ad?w=400&h=300&fit=crop&crop=center&auto=format",
      color: "from-purple-600 to-pink-600",
      navColor: "bg-gradient-to-r from-purple-500 to-pink-500"
    },
    "Theater": { 
      icon: <Theater className="h-8 w-8" />, 
      title: "Theater Events",
      description: "Plays, performances, and dramatic arts",
      image: "https://images.unsplash.com/photo-1503095487142-2f5e2cd5e44?w=400&h=300&fit=crop&crop=center&auto=format",
      color: "from-red-700 to-pink-700",
      navColor: "bg-gradient-to-r from-red-600 to-pink-600"
    }
  };

  if (loading && !selectedCategory) {
    return (
      <div className="min-h-screen bg-gray-500 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 mx-auto mb-6"
          >
            <div className="w-full h-full bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
          </motion.div>
          <motion.p
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-white text-lg font-medium"
          >
            Loading categories...
          </motion.p>
        </div>
      </div>
    );
  }

  if (error && !selectedCategory) {
    return (
      <div className="min-h-screen bg-gray-500 flex items-center justify-center">
        <div className="text-center">
          <Sparkles className="h-16 w-16 text-red-400 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-white mb-4">Oops!</h2>
          <p className="text-gray-200 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-300"
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
      <div className="min-h-screen bg-gray-500 flex flex-col">
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
                className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white to-gray-50 shadow-2xl hover:shadow-3xl transition-all duration-300 group border-2 border-gray-200"
              >
                <div className="relative h-64 w-full overflow-hidden">
                  <img
                    src={categoryInfo[category]?.image}
                    alt={category}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                  
                  {/* Category Icon */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm p-3 rounded-xl shadow-lg border border-white"
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
                  className="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 to-pink-500 p-2 rounded-full shadow-lg"
                >
                  <ArrowRight className="h-5 w-5 text-white" />
                </motion.div>

                {/* Event Count Badge */}
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 }}
                  className="absolute top-4 right-4 bg-gradient-to-r from-green-400 to-blue-500 px-2 py-1 rounded-full text-white text-xs font-bold shadow-lg"
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
    <div className="min-h-screen bg-gray-500 flex flex-col">
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
              placeholder={`Search ${categoryInfo[selectedCategory]?.title || selectedCategory}...`}
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
              className="w-16 h-16 mx-auto mb-6"
            >
              <div className="w-full h-full bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
            </motion.div>
            <motion.p
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-white text-lg font-medium"
            >
              Loading events...
            </motion.p>
          </div>
        ) : events.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <Sparkles className="h-16 w-16 text-gray-400 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-white mb-4">No events found</h3>
            <p className="text-gray-200">Try adjusting your search</p>
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
