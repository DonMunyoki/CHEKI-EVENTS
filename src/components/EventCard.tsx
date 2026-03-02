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
  Technology: "bg-gradient-to-r from-sky-600 to-blue-600",
  Education: "bg-gradient-to-r from-blue-600 to-navy-600",
  Business: "bg-gradient-to-r from-sky-500 to-blue-500",
  Music: "bg-gradient-to-r from-blue-500 to-sky-500",
  Art: "bg-gradient-to-r from-sky-600 to-blue-600",
  Food: "bg-gradient-to-r from-blue-600 to-navy-600",
  Sports: "bg-gradient-to-r from-sky-500 to-blue-500",
  Science: "bg-gradient-to-r from-blue-600 to-sky-600",
  Gaming: "bg-gradient-to-r from-sky-500 to-blue-500",
  Comedy: "bg-gradient-to-r from-blue-600 to-navy-600",
  Fashion: "bg-gradient-to-r from-sky-500 to-blue-500",
  Clubbing: "bg-gradient-to-r from-blue-600 to-sky-600",
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
        <div className="absolute inset-0 bg-gradient-to-br from-sky-900 to-blue-900 animate-pulse" />
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 border border-sky-800/50 bg-black/50 rounded-2xl hover:scale-105">
        <div className="relative h-64 w-full overflow-hidden">
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
            className="absolute top-4 left-4 bg-black/90 backdrop-blur-sm px-4 py-2 rounded-full text-sm flex items-center gap-2 shadow-xl border border-sky-800/50 font-bold"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Ticket className="h-4 w-4 text-sky-400" />
            <span className="text-sky-300">{event.price}</span>
          </motion.div>
        </div>

        <CardHeader className="pb-4">
          <h3 className="line-clamp-2 group-hover:text-sky-400 transition-colors duration-300 font-bold text-lg text-white">
            {event.title}
          </h3>
          <p className="text-gray-400 line-clamp-2 text-sm leading-relaxed">
            {event.description}
          </p>
        </CardHeader>

        <CardContent className="space-y-3 pb-4">
          <div className="flex items-center gap-3 text-gray-300">
            <div className="p-2 rounded-xl bg-sky-900/50 border border-sky-800/50">
              <Calendar className="h-4 w-4 text-sky-400" />
            </div>
            <span className="text-sm">
              {event.date} • {event.time}
            </span>
          </div>
          <div className="flex items-center gap-3 text-gray-300">
            <div className="p-2 rounded-xl bg-sky-900/50 border border-sky-800/50">
              <MapPin className="h-4 w-4 text-blue-400" />
            </div>
            <span className="text-sm font-medium">{event.location}</span>
          </div>
        </CardContent>

        <CardFooter className="pt-2">
          <Button
            asChild
            className="w-full bg-gradient-to-r from-sky-600 to-blue-600 border-0 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 font-bold py-3 text-white"
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
