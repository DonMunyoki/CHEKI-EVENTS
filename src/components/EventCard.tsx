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

// Realistic photos for each event type
const realisticImages: Record<string, string[]> = {
  Technology: [
    "https://images.unsplash.com/photo-1550745165-9bc0b252726a?w=800&h=600&fit=crop&crop=entropy&auto=format",
    "https://images.unsplash.com/photo-1553877522-32d3704fd198?w=800&h=600&fit=crop&crop=entropy&auto=format",
    "https://images.unsplash.com/photo-1517077304035-dd75b8c8a3a4?w=800&h=600&fit=crop&crop=entropy&auto=format",
    "https://images.unsplash.com/photo-1559028012-cad4bda9f9a5?w=800&h=600&fit=crop&crop=entropy&auto=format",
  ],
  Education: [
    "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&h=600&fit=crop&crop=entropy&auto=format",
    "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&h=600&fit=crop&crop=entropy&auto=format",
    "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=600&fit=crop&crop=entropy&auto=format",
    "https://images.unsplash.com/photo-1581078426770-6d336e5de7bf?w=800&h=600&fit=crop&crop=entropy&auto=format",
  ],
  Business: [
    "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&h=600&fit=crop&crop=entropy&auto=format",
    "https://images.unsplash.com/photo-1497366214040-f0e0db43e703?w=800&h=600&fit=crop&crop=entropy&auto=format",
    "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=600&fit=crop&crop=entropy&auto=format",
    "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&h=600&fit=crop&crop=entropy&auto=format",
  ],
  Music: [
    "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&h=600&fit=crop&crop=entropy&auto=format",
    "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop&crop=entropy&auto=format",
    "https://images.unsplash.com/photo-1470225620780-dba8ba8b4996?w=800&h=600&fit=crop&crop=entropy&auto=format",
    "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&h=600&fit=crop&crop=entropy&auto=format",
  ],
  Art: [
    "https://images.unsplash.com/photo-1536924940846-227afb31e2a5?w=800&h=600&fit=crop&crop=entropy&auto=format",
    "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&h=600&fit=crop&crop=entropy&auto=format",
    "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&crop=entropy&auto=format",
    "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800&h=600&fit=crop&crop=entropy&auto=format",
  ],
  Food: [
    "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop&crop=entropy&auto=format",
    "https://images.unsplash.com/photo-1504674900247-087a2346ec7d?w=800&h=600&fit=crop&crop=entropy&auto=format",
    "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=600&fit=crop&crop=entropy&auto=format",
    "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=600&fit=crop&crop=entropy&auto=format",
  ],
  Sports: [
    "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop&crop=entropy&auto=format",
    "https://images.unsplash.com/photo-1546519638-68e1aa3d9e76?w=800&h=600&fit=crop&crop=entropy&auto=format",
    "https://images.unsplash.com/photo-1461896836861-1d3a1d9c7f7f?w=800&h=600&fit=crop&crop=entropy&auto=format",
    "https://images.unsplash.com/photo-1576671081837-4cae00277f54?w=800&h=600&fit=crop&crop=entropy&auto=format",
  ],
  Science: [
    "https://images.unsplash.com/photo-1532099436881-5291b1d6d0a?w=800&h=600&fit=crop&crop=entropy&auto=format",
    "https://images.unsplash.com/photo-1561557949-6682a84e00b7?w=800&h=600&fit=crop&crop=entropy&auto=format",
    "https://images.unsplash.com/photo-1532187863289-5c8753b5c9e1?w=800&h=600&fit=crop&crop=entropy&auto=format",
    "https://images.unsplash.com/photo-1576086213369-97a306d5a4da?w=800&h=600&fit=crop&crop=entropy&auto=format",
  ],
  Gaming: [
    "https://images.unsplash.com/photo-1542751371-fc94c4e36a77?w=800&h=600&fit=crop&crop=entropy&auto=format",
    "https://images.unsplash.com/photo-15115182236-0eecb9400b47?w=800&h=600&fit=crop&crop=entropy&auto=format",
    "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=800&h=600&fit=crop&crop=entropy&auto=format",
    "https://images.unsplash.com/photo-1493770348161-369560ae357d?w=800&h=600&fit=crop&crop=entropy&auto=format",
  ],
  Comedy: [
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop&crop=entropy&auto=format",
    "https://images.unsplash.com/photo-1516232698864-2b8c1fc6ab1c?w=800&h=600&fit=crop&crop=entropy&auto=format",
    "https://images.unsplash.com/photo-1581833971eeb8f60c6b3516c6c5a0c8?w=800&h=600&fit=crop&crop=entropy&auto=format",
    "https://images.unsplash.com/photo-1574391583635-3b5a6e5b4d9f?w=800&h=600&fit=crop&crop=entropy&auto=format",
  ],
  Fashion: [
    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop&crop=entropy&auto=format",
    "https://images.unsplash.com/photo-1445205170238-7e693166bb5e?w=800&h=600&fit=crop&crop=entropy&auto=format",
    "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&h=600&fit=crop&crop=entropy&auto=format",
    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&h=600&fit=crop&crop=entropy&auto=format",
  ],
  Clubbing: [
    "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop&crop=entropy&auto=format",
    "https://images.unsplash.com/photo-1544968347-9a1f61b1ad0a?w=800&h=600&fit=crop&crop=entropy&auto=format",
    "https://images.unsplash.com/photo-1516450360452-9312f51686ad?w=800&h=600&fit=crop&crop=entropy&auto=format",
    "https://images.unsplash.com/photo-1511795406834-213e69c13f07?w=800&h=600&fit=crop&crop=entropy&auto=format",
  ],
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

  const fallbackImage = "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&h=600&fit=crop&crop=entropy&auto=format";

  return (
    <div className={`relative ${className}`}>
      {!imgLoaded && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-900 animate-pulse" />
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
  // Get realistic image based on category
  const getCategoryImage = (category: string, eventId: string) => {
    const images = realisticImages[category] || realisticImages.Technology;
    const imageIndex = parseInt(eventId) % images.length;
    return images[imageIndex];
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-700 bg-slate-800 rounded-2xl hover:scale-105">
        <div className="relative h-64 w-full overflow-hidden">
          <motion.div
            whileHover={{ scale: 1.08 }}
            transition={{ duration: 0.4 }}
            className="h-full w-full"
          >
            <ImageWithFallback
              src={getCategoryImage(event.category, event.id)}
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
            className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full text-sm flex items-center gap-2 shadow-xl border border-gray-600 font-bold"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Ticket className="h-4 w-4 text-purple-600" />
            <span className="text-purple-700">{event.price}</span>
          </motion.div>
        </div>

        <CardHeader className="pb-4">
          <h3 className="line-clamp-2 group-hover:text-purple-400 transition-colors duration-300 font-bold text-lg text-white">
            {event.title}
          </h3>
          <p className="text-gray-400 line-clamp-2 text-sm leading-relaxed">
            {event.description}
          </p>
        </CardHeader>

        <CardContent className="space-y-3 pb-4">
          <div className="flex items-center gap-3 text-gray-300">
            <div className="p-2 rounded-xl bg-slate-700 border border-gray-600">
              <Calendar className="h-4 w-4 text-blue-400" />
            </div>
            <span className="text-sm">
              {event.date} • {event.time}
            </span>
          </div>
          <div className="flex items-center gap-3 text-gray-300">
            <div className="p-2 rounded-xl bg-slate-700 border border-gray-600">
              <MapPin className="h-4 w-4 text-purple-400" />
            </div>
            <span className="text-sm font-medium">{event.location}</span>
          </div>
        </CardContent>

        <CardFooter className="pt-2">
          <Button
            asChild
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 border-0 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 font-bold py-3 text-white"
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
