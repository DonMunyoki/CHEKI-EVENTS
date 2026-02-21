import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Search, Filter } from "lucide-react";
import { motion } from "motion/react";

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
  Nightlife: "🌃",
};

export function FilterBar({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  categories,
}: FilterBarProps) {
  return (
    <div className="glass-effect border-b border-gray-200/50 sticky top-[65px] z-40 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <motion.div
          className="flex flex-col gap-4"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-sky-500" />
            <Input
              type="text"
              placeholder="Search for events..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-12 h-12 rounded-xl border-2 border-gray-200 focus:border-sky-500 bg-white shadow-sm"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <Filter className="h-4 w-4 text-gray-600 flex-shrink-0" />
            <Button
              variant={selectedCategory === "All" ? "default" : "outline"}
              size="sm"
              onClick={() => onCategoryChange("All")}
              className={`rounded-full whitespace-nowrap transition-all duration-300 ${
                selectedCategory === "All"
                  ? "bg-gradient-to-r from-black to-sky-500 border-0 shadow-md text-white hover:opacity-90"
                  : "border-2 border-gray-300 hover:border-sky-400 bg-white"
              }`}
            >
              {categoryEmojis["All"]} All
            </Button>
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => onCategoryChange(category)}
                className={`rounded-full whitespace-nowrap transition-all duration-300 ${
                  selectedCategory === category
                    ? "bg-gradient-to-r from-black to-sky-500 border-0 shadow-md text-white hover:opacity-90"
                    : "border-2 border-gray-300 hover:border-sky-400 bg-white"
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
