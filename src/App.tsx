import { useState, useMemo, useEffect } from "react";
import { Header } from "./components/Header";
import { FilterBar } from "./components/FilterBar";
import { EventCard, Event } from "./components/EventCard";
import { motion } from "framer-motion";
import { CalendarDays, Code, Briefcase, Music, Palette, Utensils, Gamepad2, GraduationCap, Microscope, Trophy, Sparkles, Zap, Star, Rocket } from "lucide-react";
import { apiService } from "./services/api";

export default function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [events, setEvents] = useState<Event[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load events and categories on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [eventsData, categoriesData] = await Promise.all([
          apiService.getEvents(),
          apiService.getCategories()
        ]);
        setEvents(eventsData);
        setCategories(['All', ...categoriesData]);
        setError(null);
      } catch (err) {
        setError('Failed to load events');
        console.error('Error loading data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Reload events when filters change
  useEffect(() => {
    const loadFilteredEvents = async () => {
      try {
        setLoading(true);
        // When "All" is selected, don't pass category filter to API
        const categoryFilter = selectedCategory === "All" ? undefined : selectedCategory;
        const searchFilter = searchQuery || undefined;
        
        const eventsData = await apiService.getEvents(categoryFilter, searchFilter);
        setEvents(eventsData);
        setError(null);
      } catch (err) {
        setError('Failed to load events');
        console.error('Error loading filtered events:', err);
      } finally {
        setLoading(false);
      }
    };

    // Always load events when filters change
    loadFilteredEvents();
  }, [searchQuery, selectedCategory]);

  // Filter events based on search and category
  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           event.location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "All" || event.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [events, searchQuery, selectedCategory]);

  // Group events by category for dashboard sections
  const eventsByCategory = useMemo(() => {
    const grouped: Record<string, Event[]> = {};
    filteredEvents.forEach(event => {
      if (!grouped[event.category]) {
        grouped[event.category] = [];
      }
      grouped[event.category].push(event);
    });
    return grouped;
  }, [filteredEvents]);

  // Category icons and colors for dashboard
  const categoryInfo: Record<string, { icon: React.ReactNode; color: string; bgGradient: string; shadow: string }> = {
    "Technology": { icon: <Code className="h-6 w-6" />, color: "text-blue-600", bgGradient: "from-blue-500 via-cyan-400 to-teal-500", shadow: "shadow-blue-500/50" },
    "Education": { icon: <GraduationCap className="h-6 w-6" />, color: "text-purple-600", bgGradient: "from-purple-500 via-pink-500 to-indigo-600", shadow: "shadow-purple-500/50" },
    "Business": { icon: <Briefcase className="h-6 w-6" />, color: "text-green-600", bgGradient: "from-green-500 via-emerald-400 to-teal-600", shadow: "shadow-green-500/50" },
    "Music": { icon: <Music className="h-6 w-6" />, color: "text-pink-600", bgGradient: "from-pink-500 via-rose-400 to-red-600", shadow: "shadow-pink-500/50" },
    "Art": { icon: <Palette className="h-6 w-6" />, color: "text-orange-600", bgGradient: "from-orange-500 via-yellow-400 to-red-600", shadow: "shadow-orange-500/50" },
    "Food": { icon: <Utensils className="h-6 w-6" />, color: "text-yellow-600", bgGradient: "from-yellow-500 via-orange-400 to-amber-600", shadow: "shadow-yellow-500/50" },
    "Sports": { icon: <Trophy className="h-6 w-6" />, color: "text-red-600", bgGradient: "from-red-500 via-pink-400 to-rose-600", shadow: "shadow-red-500/50" },
    "Science": { icon: <Microscope className="h-6 w-6" />, color: "text-teal-600", bgGradient: "from-teal-500 via-cyan-400 to-blue-600", shadow: "shadow-teal-500/50" },
    "Gaming": { icon: <Gamepad2 className="h-6 w-6" />, color: "text-indigo-600", bgGradient: "from-indigo-500 via-purple-400 to-pink-600", shadow: "shadow-indigo-500/50" },
    "Comedy": { icon: <Sparkles className="h-6 w-6" />, color: "text-yellow-600", bgGradient: "from-yellow-400 via-orange-300 to-pink-500", shadow: "shadow-yellow-500/50" },
    "Fashion": { icon: <Star className="h-6 w-6" />, color: "text-pink-600", bgGradient: "from-pink-500 via-purple-400 to-indigo-600", shadow: "shadow-pink-500/50" },
    "Clubbing": { icon: <Zap className="h-6 w-6" />, color: "text-purple-600", bgGradient: "from-purple-600 via-pink-500 to-rose-600", shadow: "shadow-purple-500/50" },
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center overflow-hidden">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur-3xl opacity-50 animate-pulse"></div>
          <div className="relative text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-20 h-20 mx-auto mb-6"
            >
              <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <Rocket className="h-10 w-10 text-white" />
              </div>
            </motion.div>
            <motion.p
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-white text-xl font-bold"
            >
              🚀 Launching Amazing Events...
            </motion.p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900 via-pink-900 to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <CalendarDays className="h-24 w-24 text-red-400 mx-auto mb-6" />
          </motion.div>
          <h2 className="text-4xl font-bold text-white mb-4">Oops!</h2>
          <p className="text-gray-300 mb-6 text-lg">{error}</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.location.reload()}
            className="px-8 py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-xl hover:shadow-2xl transition-all duration-300 font-bold shadow-red-500/50"
          >
            🔄 Try Again
          </motion.button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      <Header userName="Guest" onLogout={() => {}} />
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, type: "spring" }}
          className="text-center mb-16"
        >
          <motion.h1
            animate={{ 
              textShadow: ["0 0 20px rgba(147, 51, 234, 0.5)", "0 0 40px rgba(147, 51, 234, 0.8)", "0 0 20px rgba(147, 51, 234, 0.5)"]
            }}
            transition={{ duration: 3, repeat: Infinity }}
            className="text-7xl font-black bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-6"
          >
            CHEKI EVENTS
          </motion.h1>
          <motion.p
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="text-2xl text-gray-300 mb-8"
          >
            🎪 Discover Epic Events in Nairobi 🌟
          </motion.p>
          
          {/* Floating Elements */}
          <div className="flex justify-center gap-8 mb-8">
            {[Sparkles, Zap, Star, Rocket].map((Icon, index) => (
              <motion.div
                key={index}
                animate={{ 
                  y: [0, -20, 0],
                  rotate: [0, 10, -10, 0]
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity, 
                  delay: index * 0.5,
                  type: "spring"
                }}
              >
                <Icon className="h-8 w-8 text-yellow-400" />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 30, rotateX: -15 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 0.6, delay: 0.3, type: "spring" }}
          className="mb-12"
        >
          <FilterBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            categories={categories}
          />
        </motion.div>

        {/* Dashboard Sections */}
        {selectedCategory === "All" && Object.keys(eventsByCategory).length > 0 ? (
          <div className="space-y-16">
            {Object.entries(eventsByCategory).map(([category, categoryEvents], index) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, x: -100, rotateY: -15 }}
                animate={{ opacity: 1, x: 0, rotateY: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2, type: "spring" }}
                className="perspective-1000"
              >
                {/* Section Header with 3D Effect */}
                <motion.div
                  whileHover={{ 
                    scale: 1.05,
                    rotateY: 5,
                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)"
                  }}
                  className="flex items-center gap-6 mb-8 p-6 bg-white/10 backdrop-blur-md rounded-3xl border border-white/20"
                >
                  <motion.div
                    animate={{ 
                      rotate: [0, 360],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    className={`p-4 rounded-3xl bg-gradient-to-r ${categoryInfo[category]?.bgGradient || 'from-gray-500 to-gray-700'} text-white shadow-2xl ${categoryInfo[category]?.shadow || ''}`}
                  >
                    {categoryInfo[category]?.icon || <CalendarDays className="h-8 w-8" />}
                  </motion.div>
                  <div>
                    <motion.h2
                      animate={{ textShadow: ["0 0 10px currentColor", "0 0 30px currentColor", "0 0 10px currentColor"] }}
                      transition={{ duration: 3, repeat: Infinity }}
                      className="text-4xl font-black text-white mb-2"
                    >
                      {category}
                    </motion.h2>
                    <p className="text-gray-300 text-lg">{categoryEvents.length} epic events available</p>
                  </div>
                  <motion.div
                    animate={{ 
                      x: [0, 10, 0],
                      opacity: [0.5, 1, 0.5]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="ml-auto"
                  >
                    <Sparkles className="h-8 w-8 text-yellow-400" />
                  </motion.div>
                </motion.div>

                {/* Events Grid with 3D Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {categoryEvents.map((event, eventIndex) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, y: 50, rotateX: 15 }}
                      animate={{ opacity: 1, y: 0, rotateX: 0 }}
                      transition={{ duration: 0.6, delay: eventIndex * 0.1, type: "spring" }}
                      whileHover={{
                        scale: 1.1,
                        rotateY: 5,
                        z: 50,
                        boxShadow: "0 35px 60px -15px rgba(0, 0, 0, 0.3)"
                      }}
                      className="preserve-3d"
                    >
                      <EventCard event={event} index={eventIndex} />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          /* Single Category View */
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, type: "spring" }}
            className="mt-12"
          >
            {filteredEvents.length === 0 ? (
              <div className="text-center py-20">
                <motion.div
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, 10, -10, 0]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <CalendarDays className="h-24 w-24 text-gray-400 mx-auto mb-6" />
                </motion.div>
                <h3 className="text-3xl font-bold text-white mb-4">No events found</h3>
                <p className="text-gray-300 text-lg">Try adjusting your search or filters</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {filteredEvents.map((event, index) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 50, rotateX: 15 }}
                    animate={{ opacity: 1, y: 0, rotateX: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1, type: "spring" }}
                    whileHover={{
                      scale: 1.1,
                      rotateY: 5,
                      z: 50,
                      boxShadow: "0 35px 60px -15px rgba(0, 0, 0, 0.3)"
                    }}
                    className="preserve-3d"
                  >
                    <EventCard event={event} index={index} />
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .perspective-1000 {
          perspective: 1000px;
        }
        .preserve-3d {
          transform-style: preserve-3d;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}} />
    </div>
  );
}
