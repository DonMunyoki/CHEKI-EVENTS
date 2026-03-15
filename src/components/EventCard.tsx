import React, { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Calendar, MapPin, ExternalLink, Ticket } from "lucide-react";
import { motion } from "framer-motion";

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: string;
  price: string;
  image: string;
  ticketLink: string;
}

interface EventCardProps {
  event: Event;
  index: number;
}

const categoryColors: Record<string, string> = {
  Technology: "bg-gradient-to-r from-blue-600 to-cyan-600",
  Education: "bg-gradient-to-r from-purple-600 to-indigo-600",
  Business: "bg-gradient-to-r from-green-600 to-emerald-600",
  Music: "bg-gradient-to-r from-pink-600 to-rose-600",
  Art: "bg-gradient-to-r from-orange-600 to-red-600",
  Food: "bg-gradient-to-r from-yellow-600 to-amber-600",
  Sports: "bg-gradient-to-r from-red-600 to-pink-600",
  Science: "bg-gradient-to-r from-teal-600 to-cyan-600",
  Gaming: "bg-gradient-to-r from-indigo-600 to-purple-600",
  Comedy: "bg-gradient-to-r from-yellow-400 to-orange-500",
  Fashion: "bg-gradient-to-r from-pink-500 to-purple-600",
  Clubbing: "bg-gradient-to-r from-purple-600 to-pink-600",
};

// Image with fallback component
const ImageWithFallback: React.FC<{ src: string; alt: string; className: string }> = ({ src, alt, className }) => {
  const [imgError, setImgError] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  const handleImageError = () => {
    setImgError(true);
  };

  const handleImageLoad = () => {
    setImgLoaded(true);
  };

  const fallbackImage = "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&h=600&fit=crop&crop=center&auto=format";

  return (
    <div className={`relative ${className}`}>
      {!imgLoaded && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-400 to-gray-600 animate-pulse" />
      )}
      <img
        src={imgError ? fallbackImage : src}
        alt={alt}
        className={className}
        onError={handleImageError}
        onLoad={handleImageLoad}
        style={{ display: imgLoaded ? 'block' : 'none' }}
      />
    </div>
  );
};

export function EventCard({ event, index }: EventCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ 
        scale: 1.05,
        boxShadow: "0 25px 50px rgba(0, 0, 0, 0.15)"
      }}
      className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-2xl transition-all duration-300"
      style={{ height: '400px', width: '100%' }}
    >
      <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-300 bg-white rounded-2xl hover:scale-105 h-full">
        <div className="relative h-48 w-full overflow-hidden">
          <motion.div
            whileHover={{ scale: 1.08 }}
            transition={{ duration: 0.4 }}
            className="h-full w-full"
          >
            <ImageWithFallback
              src={event.image}
              alt={event.title}
              className="w-full h-full object-cover"
            />
          </motion.div>

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          <Badge
            className={`absolute top-4 right-4 ${
              categoryColors[event.category] || "bg-gradient-to-r from-gray-500 to-gray-700"
            } text-white border-0 shadow-xl hover:scale-110 transition-transform font-semibold px-4 py-2`}
          >
            {event.category}
          </Badge>

          <motion.div
            className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full text-sm flex items-center gap-2 shadow-xl border border-gray-300 font-bold"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Ticket className="h-4 w-4 text-blue-600" />
            <span className="text-gray-800">{event.price}</span>
          </motion.div>
        </div>

        <CardHeader className="pb-4">
          <h3 className="line-clamp-2 group-hover:text-blue-600 transition-colors duration-300 font-bold text-lg text-gray-800">
            {event.title}
          </h3>
          <p className="text-gray-600 line-clamp-2 text-sm leading-relaxed">
            {event.description}
          </p>
        </CardHeader>

        <CardContent className="space-y-3 pb-4">
          <div className="flex items-center gap-3 text-gray-600">
            <div className="p-2 rounded-xl bg-gray-100 border border-gray-300">
              <Calendar className="h-4 w-4 text-blue-600" />
            </div>
            <span className="text-sm">
              {event.date} • {event.time}
            </span>
          </div>
          <div className="flex items-center gap-3 text-gray-600">
            <div className="p-2 rounded-xl bg-gray-100 border border-gray-300">
              <MapPin className="h-4 w-4 text-purple-600" />
            </div>
            <span className="text-sm font-medium">{event.location}</span>
          </div>
        </CardContent>

        <CardFooter className="pt-2">
          <Button
            asChild
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 border-0 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 font-bold py-3 text-white"
          >
            <a
              href={event.ticketLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              🎫 Get Tickets
              <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
