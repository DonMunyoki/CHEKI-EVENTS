import { useState, useMemo, useEffect } from "react";
import { Header } from "./components/Header";
import { FilterBar } from "./components/FilterBar";
import { EventCard, Event } from "./components/EventCard";
import { motion } from "framer-motion";
import { CalendarDays, Code, Briefcase, Music, Palette, Utensils, Gamepad2, GraduationCap, Microscope, Trophy, Sparkles, Zap, Star, Rocket, TrendingUp, Users, MapPin, Clock, Ticket } from "lucide-react";
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

  // Category info with better icons and colors
  const categoryInfo: Record<string, { 
    icon: React.ReactNode; 
    primaryColor: string; 
    secondaryColor: string; 
    bgGradient: string; 
    borderColor: string;
    description: string;
  }> = {
    "Technology": { 
      icon: <Code className="h-6 w-6" />, 
      primaryColor: "text-blue-600", 
      secondaryColor: "text-cyan-500",
      bgGradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      borderColor: "border-blue-500",
      description: "Tech conferences, workshops, and hackathons"
    },
    "Education": { 
      icon: <GraduationCap className="h-6 w-6" />, 
      primaryColor: "text-purple-600", 
      secondaryColor: "text-indigo-500",
      bgGradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      borderColor: "border-purple-500",
      description: "Academic events, career fairs, and workshops"
    },
    "Business": { 
      icon: <Briefcase className="h-6 w-6" />, 
      primaryColor: "text-green-600", 
      secondaryColor: "text-emerald-500",
      bgGradient: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
      borderColor: "border-green-500",
      description: "Networking, conferences, and trade shows"
    },
    "Music": { 
      icon: <Music className="h-6 w-6" />, 
      primaryColor: "text-pink-600", 
      secondaryColor: "text-rose-500",
      bgGradient: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
      borderColor: "border-pink-500",
      description: "Concerts, festivals, and live performances"
    },
    "Art": { 
      icon: <Palette className="h-6 w-6" />, 
      primaryColor: "text-orange-600", 
      secondaryColor: "text-yellow-500",
      bgGradient: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
      borderColor: "border-orange-500",
      description: "Exhibitions, galleries, and creative workshops"
    },
    "Food": { 
      icon: <Utensils className="h-6 w-6" />, 
      primaryColor: "text-yellow-600", 
      secondaryColor: "text-amber-500",
      bgGradient: "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)",
      borderColor: "border-yellow-500",
      description: "Food festivals, tastings, and culinary events"
    },
    "Sports": { 
      icon: <Trophy className="h-6 w-6" />, 
      primaryColor: "text-red-600", 
      secondaryColor: "text-rose-500",
      bgGradient: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
      borderColor: "border-red-500",
      description: "Competitions, tournaments, and fitness events"
    },
    "Science": { 
      icon: <Microscope className="h-6 w-6" />, 
      primaryColor: "text-teal-600", 
      secondaryColor: "text-cyan-500",
      bgGradient: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
      borderColor: "border-teal-500",
      description: "Research, innovation, and scientific events"
    },
    "Gaming": { 
      icon: <Gamepad2 className="h-6 w-6" />, 
      primaryColor: "text-indigo-600", 
      secondaryColor: "text-purple-500",
      bgGradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      borderColor: "border-indigo-500",
      description: "Gaming tournaments and esports competitions"
    },
    "Comedy": { 
      icon: <Sparkles className="h-6 w-6" />, 
      primaryColor: "text-yellow-600", 
      secondaryColor: "text-orange-500",
      bgGradient: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
      borderColor: "border-yellow-500",
      description: "Stand-up comedy and entertainment shows"
    },
    "Fashion": { 
      icon: <Star className="h-6 w-6" />, 
      primaryColor: "text-pink-600", 
      secondaryColor: "text-purple-500",
      bgGradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      borderColor: "border-pink-500",
      description: "Fashion shows, exhibitions, and style events"
    },
    "Clubbing": { 
      icon: <Zap className="h-6 w-6" />, 
      primaryColor: "text-purple-600", 
      secondaryColor: "text-pink-500",
      bgGradient: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
      borderColor: "border-purple-500",
      description: "Nightlife, parties, and club events"
    },
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 mx-auto mb-6"
          >
            <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <Rocket className="h-8 w-8 text-white" />
            </div>
          </motion.div>
          <motion.p
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-white text-lg font-medium"
          >
            Loading amazing events...
          </motion.p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <CalendarDays className="h-16 w-16 text-red-400 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-white mb-4">Oops!</h2>
          <p className="text-gray-300 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition-all duration-300"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Header userName="Guest" onLogout={() => {}} />
      
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
            CHEKI EVENTS
          </h1>
          <p className="text-xl text-gray-300 mb-8">Discover Amazing Events in Nairobi</p>
        </motion.div>

        {/* Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
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
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                {/* Category Header */}
                <div className="mb-8">
                  <div className="flex items-center gap-4 mb-4">
                    <div 
                      className="p-4 rounded-2xl text-white shadow-xl"
                      style={{ background: categoryInfo[category]?.bgGradient }}
                    >
                      {categoryInfo[category]?.icon}
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-white mb-1">{category}</h2>
                      <p className="text-gray-400">{categoryInfo[category]?.description}</p>
                    </div>
                    <div className="ml-auto flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-2xl font-bold text-white">{categoryEvents.length}</p>
                        <p className="text-sm text-gray-400">Events</p>
                      </div>
                      <div className={`w-16 h-16 rounded-full border-4 ${categoryInfo[category]?.borderColor} border-opacity-50 flex items-center justify-center bg-slate-800 bg-opacity-50`}>
                        <Users className="h-6 w-6 text-white" />
                      </div>
                    </div>
                  </div>
                  
                  {/* Category Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-slate-800 bg-opacity-50 rounded-xl p-4 border border-slate-700">
                      <div className="flex items-center gap-3">
                        <TrendingUp className="h-5 w-5 text-green-400" />
                        <div>
                          <p className="text-sm text-gray-400">Popular</p>
                          <p className="text-lg font-bold text-white">Trending</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-slate-800 bg-opacity-50 rounded-xl p-4 border border-slate-700">
                      <div className="flex items-center gap-3">
                        <Clock className="h-5 w-5 text-blue-400" />
                        <div>
                          <p className="text-sm text-gray-400">This Week</p>
                          <p className="text-lg font-bold text-white">{Math.floor(categoryEvents.length * 0.6)}</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-slate-800 bg-opacity-50 rounded-xl p-4 border border-slate-700">
                      <div className="flex items-center gap-3">
                        <MapPin className="h-5 w-5 text-purple-400" />
                        <div>
                          <p className="text-sm text-gray-400">Venues</p>
                          <p className="text-lg font-bold text-white">{Math.ceil(categoryEvents.length * 0.8)}</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-slate-800 bg-opacity-50 rounded-xl p-4 border border-slate-700">
                      <div className="flex items-center gap-3">
                        <Ticket className="h-5 w-5 text-pink-400" />
                        <div>
                          <p className="text-sm text-gray-400">Available</p>
                          <p className="text-lg font-bold text-white">{categoryEvents.length * 50}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Events Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {categoryEvents.map((event, eventIndex) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: eventIndex * 0.1 }}
                      whileHover={{ 
                        scale: 1.05,
                        boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3)"
                      }}
                    >
                      <EventCard event={event} index={eventIndex} />
                    </motion.div>
                  ))}
                </div>

                {/* View More Button */}
                <div className="text-center mt-8">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-semibold hover:shadow-lg transition-all duration-300"
                  >
                    View All {category} Events
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          /* Single Category View */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mt-12"
          >
            {filteredEvents.length === 0 ? (
              <div className="text-center py-20">
                <CalendarDays className="h-16 w-16 text-gray-400 mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-white mb-4">No events found</h3>
                <p className="text-gray-400">Try adjusting your search or filters</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
