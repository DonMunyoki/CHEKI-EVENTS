import { useState, useMemo, useEffect } from "react";
import { Header } from "./components/Header";
import { FilterBar } from "./components/FilterBar";
import { EventCard, Event } from "./components/EventCard";
import { LoginPage } from "./components/LoginPage";
import { motion } from "framer-motion";
import { CalendarDays } from "lucide-react";
import { apiService } from "./services/api";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
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

    if (isLoggedIn) {
      loadFilteredEvents();
    }
  }, [searchQuery, selectedCategory, isLoggedIn]);

  const handleLogin = async (admissionNumber: string, name: string, password: string) => {
    try {
      // First try to login
      const response = await apiService.login(admissionNumber, password);
      localStorage.setItem('token', response.token);
      setUserName(response.user.name);
      setIsLoggedIn(true);
      
      // Load events after successful login
      const eventsData = await apiService.getEvents();
      setEvents(eventsData);
    } catch (err: any) {
      // If login fails, try to register the user
      if (err.message === 'Invalid credentials') {
        try {
          const registerResponse = await apiService.register(admissionNumber, name, '', password);
          localStorage.setItem('token', registerResponse.token);
          setUserName(registerResponse.user.name);
          setIsLoggedIn(true);
          
          // Load events after successful registration
          const eventsData = await apiService.getEvents();
          setEvents(eventsData);
        } catch (registerErr: any) {
          throw new Error(registerErr.message || 'Registration failed');
        }
      } else {
        throw err;
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setUserName("");
    setSearchQuery("");
    setSelectedCategory("All");
    setEvents([]);
  };

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-slate-50 to-sky-50 flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-6xl mb-4">🎭</div>
          <h2 className="text-2xl font-semibold mb-2">Loading Events...</h2>
          <p className="text-muted-foreground">Please wait while we fetch the latest events</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-slate-50 to-sky-50 flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-semibold mb-2">Error</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors"
          >
            Retry
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-slate-50 to-sky-50">
      <Header userName={userName} onLogout={handleLogout} />
      <FilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        categories={categories}
      />

      <main className="container mx-auto px-4 py-8">
        {events.length === 0 ? (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="mb-2">No events found</h2>
            <p className="text-muted-foreground">
              Try adjusting your search or check out all events!
            </p>
          </motion.div>
        ) : (
          <>
            <motion.div
              className="mb-8 flex items-center justify-between flex-wrap gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div>
                <h2 className="flex items-center gap-2">
                  <CalendarDays className="h-6 w-6 text-sky-500" />
                  Upcoming Events
                </h2>
                <p className="text-muted-foreground mt-1">
                  {events.length}{" "}
                  {events.length === 1 ? "event" : "events"} in Nairobi
                </p>
              </div>

              <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-md border-2 border-gray-200">
                <span className="text-sm text-gray-600">📍</span>
                <span className="text-sm">Nairobi, Kenya</span>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {events.map((event: Event, index: number) => (
                <EventCard key={event.id} event={event} index={index} />
              ))}
            </div>
          </>
        )}
      </main>

      <footer className="border-t border-gray-200 bg-white/70 backdrop-blur-sm mt-16">
        <div className="container mx-auto px-4 py-8">
          <motion.div
            className="text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <p className="text-sm text-muted-foreground mb-2">
              Cheki Events - Riara University Student Portal
            </p>
            <p className="text-xs text-muted-foreground">
              © 2025 Cheki Events • Discover, Connect, Experience
            </p>
          </motion.div>
        </div>
      </footer>
    </div>
  );
}
