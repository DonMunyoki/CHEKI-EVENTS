import { useState, useMemo, useEffect } from "react";
import { Header } from "./components/Header";
import { EventCard, Event } from "./components/EventCard";
import { motion } from "framer-motion";
import { Code, Briefcase, Music, Palette, Utensils, Gamepad2, GraduationCap, Microscope, Trophy, Sparkles, Star, Zap } from "lucide-react";
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

  // Category icons and colors
  const categoryInfo: Record<string, { 
    icon: React.ReactNode; 
    color: string;
    bgGradient: string;
    borderColor: string;
  }> = {
    "Technology": { 
      icon: <Code className="h-5 w-5" />, 
      color: "text-sky-400",
      bgGradient: "from-sky-600 to-blue-600",
      borderColor: "border-sky-500"
    },
    "Education": { 
      icon: <GraduationCap className="h-5 w-5" />, 
      color: "text-blue-400",
      bgGradient: "from-blue-600 to-navy-600",
      borderColor: "border-blue-500"
    },
    "Business": { 
      icon: <Briefcase className="h-5 w-5" />, 
      color: "text-sky-300",
      bgGradient: "from-sky-500 to-blue-500",
      borderColor: "border-sky-400"
    },
    "Music": { 
      icon: <Music className="h-5 w-5" />, 
      color: "text-blue-300",
      bgGradient: "from-blue-500 to-sky-500",
      borderColor: "border-blue-400"
    },
    "Art": { 
      icon: <Palette className="h-5 w-5" />, 
      color: "text-sky-400",
      bgGradient: "from-sky-600 to-blue-600",
      borderColor: "border-sky-500"
    },
    "Food": { 
      icon: <Utensils className="h-5 w-5" />, 
      color: "text-blue-400",
      bgGradient: "from-blue-600 to-navy-600",
      borderColor: "border-blue-500"
    },
    "Sports": { 
      icon: <Trophy className="h-5 w-5" />, 
      color: "text-sky-500",
      bgGradient: "from-sky-500 to-blue-500",
      borderColor: "border-sky-400"
    },
    "Science": { 
      icon: <Microscope className="h-5 w-5" />, 
      color: "text-blue-400",
      bgGradient: "from-blue-600 to-sky-600",
      borderColor: "border-blue-500"
    },
    "Gaming": { 
      icon: <Gamepad2 className="h-5 w-5" />, 
      color: "text-sky-300",
      bgGradient: "from-sky-500 to-blue-500",
      borderColor: "border-sky-400"
    },
    "Comedy": { 
      icon: <Sparkles className="h-5 w-5" />, 
      color: "text-blue-400",
      bgGradient: "from-blue-600 to-navy-600",
      borderColor: "border-blue-500"
    },
    "Fashion": { 
      icon: <Star className="h-5 w-5" />, 
      color: "text-sky-500",
      bgGradient: "from-sky-500 to-blue-500",
      borderColor: "border-sky-400"
    },
    "Clubbing": { 
      icon: <Zap className="h-5 w-5" />, 
      color: "text-blue-400",
      bgGradient: "from-blue-600 to-sky-600",
      borderColor: "border-blue-500"
    },
    "All": { 
      icon: <Sparkles className="h-5 w-5" />, 
      color: "text-sky-400",
      bgGradient: "from-sky-600 to-blue-600",
      borderColor: "border-sky-500"
    },
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-blue-950 to-black flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 mx-auto mb-6"
          >
            <div className="w-full h-full bg-gradient-to-r from-sky-500 to-blue-600 rounded-full flex items-center justify-center">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
          </motion.div>
          <motion.p
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-sky-400 text-lg font-medium"
          >
            Loading events...
          </motion.p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-blue-950 to-black flex items-center justify-center">
        <div className="text-center">
          <Sparkles className="h-16 w-16 text-red-400 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-white mb-4">Oops!</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-gradient-to-r from-sky-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all duration-300"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-blue-950 to-black flex flex-col">
      <Header userName="Guest" onLogout={() => {}} />
      
      <div className="flex-1 container mx-auto px-4 py-8 pb-24">
        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="max-w-2xl mx-auto">
            <input
              type="text"
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-6 py-4 bg-black/50 border border-sky-800/50 rounded-2xl text-white placeholder-sky-400 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 transition-all duration-300"
            />
          </div>
        </motion.div>

        {/* Events Grid */}
        {filteredEvents.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <Sparkles className="h-16 w-16 text-gray-600 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-white mb-4">No events found</h3>
            <p className="text-gray-400">Try adjusting your search</p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {filteredEvents.map((event, index) => (
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

      {/* Bottom Category Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-lg border-t border-sky-800/50"
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-center gap-2 md:gap-4 overflow-x-auto">
            {categories.map((category) => (
              <motion.button
                key={category}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(category)}
                className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all duration-300 ${
                  selectedCategory === category
                    ? `bg-gradient-to-r ${categoryInfo[category]?.bgGradient} ${categoryInfo[category]?.borderColor} text-white shadow-lg shadow-sky-500/50`
                    : 'bg-black/50 border border-sky-800/50 text-sky-400 hover:border-sky-600 hover:text-sky-300'
                }`}
              >
                <div className={selectedCategory === category ? 'text-white' : categoryInfo[category]?.color}>
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
