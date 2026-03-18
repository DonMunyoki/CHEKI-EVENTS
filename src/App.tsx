import { useState, useMemo, useEffect } from "react";
import { Header } from "./components/Header";
import { FilterBar } from "./components/FilterBar";
import { EventCard, Event } from "./components/EventCard";
import { LoginPage } from "./components/LoginPage";
import { SignUpPage } from "./components/SignUpPage";
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
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [showLogin, setShowLogin] = useState(true);

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

    // Only load data if user is logged in
    if (isLoggedIn) {
      loadData();
    }
  }, [isLoggedIn]);

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

    // Only load events when filters change and user is logged in
    if (isLoggedIn) {
      loadFilteredEvents();
    }
  }, [searchQuery, selectedCategory, isLoggedIn]);

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

  const handleLogin = async (admissionNumber: string, password: string) => {
    try {
      await apiService.login(admissionNumber, password);
      setUserName(admissionNumber);
      setIsLoggedIn(true);
      setShowLogin(false);
    } catch (error: any) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const handleSignUp = async (admissionNumber: string, password: string) => {
    try {
      await apiService.register(admissionNumber, password);
      setUserName(admissionNumber);
      setIsLoggedIn(true);
      setShowLogin(false);
    } catch (error: any) {
      console.error('Sign up failed:', error);
      throw error;
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserName("");
    setSearchQuery("");
    setSelectedCategory("All");
    setShowLogin(true);
  };

  const switchToSignUp = () => {
    setShowLogin(false);
  };

  const switchToLogin = () => {
    setShowLogin(true);
  };

  if (!isLoggedIn) {
    return showLogin ? (
      <LoginPage onLogin={handleLogin} onSwitchToSignUp={switchToSignUp} />
    ) : (
      <SignUpPage onSignUp={handleSignUp} onSwitchToLogin={switchToLogin} />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100">
      <Header userName={userName} onLogout={handleLogout} />
      
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
            className="text-center py-20"
          >
            <CalendarDays className="h-20 w-20 text-gray-400 mx-auto mb-6" />
            <h3 className="text-2xl font-semibold text-gray-700 mb-4">No events found</h3>
            <p className="text-gray-500 text-lg">Try adjusting your search or filters</p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mt-10"
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
