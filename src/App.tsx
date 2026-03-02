import { useState, useMemo, useEffect } from "react";
import { Header } from "./components/Header";
import { FilterBar } from "./components/FilterBar";
import { EventCard, Event } from "./components/EventCard";
import { motion } from "framer-motion";
import { CalendarDays } from "lucide-react";
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
        const eventsData = await apiService.getEvents(selectedCategory, searchQuery);
        setEvents(eventsData);
        setError(null);
      } catch (err) {
        setError('Failed to load events');
        console.error('Error loading filtered events:', err);
      } finally {
        setLoading(false);
      }
    };

    if (selectedCategory !== "All" || searchQuery) {
      loadFilteredEvents();
    }
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading amazing events...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <CalendarDays className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Oops!</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-100">
      <Header userName="Guest" onLogout={() => {}} />
      
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <FilterBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            categories={categories}
          />
        </motion.div>

        {filteredEvents.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <CalendarDays className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No events found</h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8"
          >
            {filteredEvents.map((event, index) => (
              <EventCard key={event.id} event={event} index={index} />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
