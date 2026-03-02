import { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { EventCard, Event } from "./components/EventCard";
import { motion } from "framer-motion";
import { Code, Briefcase, Music, Palette, Utensils, Gamepad2, GraduationCap, Microscope, Trophy, Sparkles, Star, Zap, ArrowRight } from "lucide-react";
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
  }> = {
    "Technology": { 
      icon: <Code className="h-8 w-8" />, 
      title: "Technology",
      description: "Tech conferences, workshops, and hackathons",
      image: "https://images.unsplash.com/photo-1550745165-9bc0b252726a?w=400&h=300&fit=crop&crop=center&auto=format",
      color: "from-blue-600 to-cyan-600"
    },
    "Education": { 
      icon: <GraduationCap className="h-8 w-8" />, 
      title: "Education",
      description: "Career fairs, workshops, and academic events",
      image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=400&h=300&fit=crop&crop=center&auto=format",
      color: "from-purple-600 to-indigo-600"
    },
    "Business": { 
      icon: <Briefcase className="h-8 w-8" />, 
      title: "Business",
      description: "Networking, conferences, and trade shows",
      image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=400&h=300&fit=crop&crop=center&auto=format",
      color: "from-green-600 to-emerald-600"
    },
    "Music": { 
      icon: <Music className="h-8 w-8" />, 
      title: "Music",
      description: "Concerts, festivals, and live performances",
      image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&h=300&fit=crop&crop=center&auto=format",
      color: "from-pink-600 to-rose-600"
    },
    "Art": { 
      icon: <Palette className="h-8 w-8" />, 
      title: "Art",
      description: "Exhibitions, galleries, and creative workshops",
      image: "https://images.unsplash.com/photo-1536924940846-227afb31e2a5?w=400&h=300&fit=crop&crop=center&auto=format",
      color: "from-orange-600 to-red-600"
    },
    "Food": { 
      icon: <Utensils className="h-8 w-8" />, 
      title: "Food",
      description: "Food festivals, tastings, and culinary events",
      image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop&crop=center&auto=format",
      color: "from-yellow-600 to-amber-600"
    },
    "Sports": { 
      icon: <Trophy className="h-8 w-8" />, 
      title: "Sports",
      description: "Tournaments, marathons, and fitness events",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop&crop=center&auto=format",
      color: "from-red-600 to-pink-600"
    },
    "Science": { 
      icon: <Microscope className="h-8 w-8" />, 
      title: "Science",
      description: "Innovation fairs, workshops, and research",
      image: "https://images.unsplash.com/photo-1532099436881-5291b1d6d0a?w=400&h=300&fit=crop&crop=center&auto=format",
      color: "from-teal-600 to-cyan-600"
    },
    "Gaming": { 
      icon: <Gamepad2 className="h-8 w-8" />, 
      title: "Gaming",
      description: "Tournaments, esports, and gaming events",
      image: "https://images.unsplash.com/photo-1542751371-fc94c4e36a77?w=400&h=300&fit=crop&crop=center&auto=format",
      color: "from-indigo-600 to-purple-600"
    },
    "Comedy": { 
      icon: <Sparkles className="h-8 w-8" />, 
      title: "Comedy",
      description: "Stand-up shows, open mics, and comedy nights",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop&crop=center&auto=format",
      color: "from-yellow-400 to-orange-500"
    },
    "Fashion": { 
      icon: <Star className="h-8 w-8" />, 
      title: "Fashion",
      description: "Fashion shows, exhibitions, and style events",
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop&crop=center&auto=format",
      color: "from-pink-500 to-purple-600"
    },
    "Clubbing": { 
      icon: <Zap className="h-8 w-8" />, 
      title: "Clubbing",
      description: "Nightlife, parties, and club events",
      image: "https://images.unsplash.com/photo-1516450360452-9312f51686ad?w=400&h=300&fit=crop&crop=center&auto=format",
      color: "from-purple-600 to-pink-600"
    },
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
        
        <div className="flex-1 container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold text-white mb-4">Explore Events</h1>
            <p className="text-gray-200 text-lg">Choose a category to discover amazing events</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <motion.button
                key={category}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3)"
                }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(category)}
                className="relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-300 group"
              >
                <div className="relative h-48 w-full overflow-hidden">
                  <img
                    src={categoryInfo[category]?.image}
                    alt={category}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                  
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm p-3 rounded-full shadow-lg"
                  >
                    <div className={`text-${categoryInfo[category]?.color.split(' ')[0]}-600`}>
                      {categoryInfo[category]?.icon}
                    </div>
                  </motion.div>

                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-white font-bold text-lg mb-1">{categoryInfo[category]?.title}</h3>
                    <p className="text-gray-200 text-sm line-clamp-2">{categoryInfo[category]?.description}</p>
                  </div>
                </div>

                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <ArrowRight className="h-5 w-5 text-gray-700" />
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Top Navigation Bar */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="fixed top-16 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-gray-300 shadow-lg z-50"
        >
          <div className="container mx-auto px-4 py-3">
            <div className="flex justify-center gap-2 md:gap-4 overflow-x-auto">
              {categories.map((category) => (
                <motion.button
                  key={category}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedCategory(category)}
                  className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all duration-300 ${
                    selectedCategory === category
                      ? `bg-gradient-to-r ${categoryInfo[category]?.color} text-white shadow-lg`
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  <div className="h-5 w-5">
                    {categoryInfo[category]?.icon}
                  </div>
                  <span className="text-xs font-medium whitespace-nowrap">
                    {category}
                  </span>
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // Events View for Selected Category
  return (
    <div className="min-h-screen bg-gray-500 flex flex-col">
      <Header userName="Guest" onLogout={() => {}} />
      
      <div className="flex-1 container mx-auto px-4 py-8 pb-20">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          onClick={() => setSelectedCategory(null)}
          className="mb-6 flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow hover:shadow-lg transition-all duration-300"
        >
          <ArrowRight className="h-4 w-4 rotate-180" />
          <span className="font-medium">Back to Categories</span>
        </motion.button>

        {/* Category Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-3 mb-4">
            <div className={`p-3 rounded-full bg-gradient-to-r ${categoryInfo[selectedCategory]?.color} text-white shadow-lg`}>
              {categoryInfo[selectedCategory]?.icon}
            </div>
            <h1 className="text-3xl font-bold text-white">{categoryInfo[selectedCategory]?.title}</h1>
          </div>
          <p className="text-gray-200 text-lg">{categoryInfo[selectedCategory]?.description}</p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8"
        >
          <div className="max-w-2xl mx-auto">
            <input
              type="text"
              placeholder={`Search ${selectedCategory.toLowerCase()} events...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-6 py-4 bg-white/90 border border-gray-300 rounded-2xl text-gray-800 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
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
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {events.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3)"
                }}
              >
                <EventCard event={event} index={index} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Top Navigation Bar */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="fixed top-16 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-gray-300 shadow-lg z-50"
      >
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-center gap-2 md:gap-4 overflow-x-auto">
            {categories.map((category) => (
              <motion.button
                key={category}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(category)}
                className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all duration-300 ${
                  selectedCategory === category
                    ? `bg-gradient-to-r ${categoryInfo[category]?.color} text-white shadow-lg`
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <div className="h-5 w-5">
                  {categoryInfo[category]?.icon}
                </div>
                <span className="text-xs font-medium whitespace-nowrap">
                  {category}
                </span>
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
