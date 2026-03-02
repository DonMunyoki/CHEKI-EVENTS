import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Search, Filter } from "lucide-react";
import { motion } from "framer-motion";

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  categories: string[];
}

const categoryEmojis: Record<string, string> = {
  All: "✨",
  Music: "🎵",
  Art: "🎨",
  Food: "🍕",
  Comedy: "😂",
  Sports: "⚽",
  Theater: "🎭",
  Business: "💼",
  Technology: "💻",
  Fashion: "👗",
  Clubbing: "🌃",
};

export function FilterBar({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  categories,
}: FilterBarProps) {
  return (
    <div className="bg-white/90 backdrop-blur-md border-b border-gray-200/50 sticky top-[65px] z-40 shadow-lg">
      <div className="container mx-auto px-4 py-6">
        <motion.div
          className="flex flex-col gap-6"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-purple-500" />
            <Input
              type="text"
              placeholder="🔍 Search events, venues, artists..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-12 h-14 rounded-2xl border-2 border-purple-200 focus:border-purple-500 bg-white shadow-md text-lg font-medium placeholder-gray-500"
            />
          </div>

          <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
            <div className="flex items-center gap-2 bg-purple-100 px-3 py-2 rounded-full">
              <Filter className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-semibold text-purple-600">Filter</span>
            </div>
            <Button
              variant={selectedCategory === "All" ? "default" : "outline"}
              size="lg"
              onClick={() => onCategoryChange("All")}
              className={`rounded-full whitespace-nowrap transition-all duration-300 font-semibold px-6 py-3 ${
                selectedCategory === "All"
                  ? "bg-gradient-to-r from-purple-600 to-pink-500 border-0 shadow-lg text-white hover:shadow-xl transform hover:scale-105"
                  : "border-2 border-purple-300 hover:border-purple-500 bg-white hover:bg-purple-50 text-purple-700"
              }`}
            >
              {categoryEmojis["All"]} All Events
            </Button>
            {categories.filter(cat => cat !== "All").map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="lg"
                onClick={() => onCategoryChange(category)}
                className={`rounded-full whitespace-nowrap transition-all duration-300 font-semibold px-6 py-3 ${
                  selectedCategory === category
                    ? "bg-gradient-to-r from-purple-600 to-pink-500 border-0 shadow-lg text-white hover:shadow-xl transform hover:scale-105"
                    : "border-2 border-purple-300 hover:border-purple-500 bg-white hover:bg-purple-50 text-purple-700"
                }`}
              >
                {categoryEmojis[category] || "📌"} {category}
              </Button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
