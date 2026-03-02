import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Calendar, MapPin, ExternalLink, Ticket } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
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
  Music: "bg-gradient-to-r from-purple-500 to-pink-500",
  Art: "bg-gradient-to-r from-gray-700 to-gray-900",
  Food: "bg-gradient-to-r from-orange-500 to-red-500",
  Comedy: "bg-gradient-to-r from-yellow-400 to-orange-500",
  Sports: "bg-gradient-to-r from-green-500 to-emerald-600",
  Theater: "bg-gradient-to-r from-purple-600 to-indigo-600",
  Business: "bg-gradient-to-r from-blue-600 to-cyan-600",
  Technology: "bg-gradient-to-r from-indigo-500 to-purple-600",
  Fashion: "bg-gradient-to-r from-pink-500 to-rose-600",
  Clubbing: "bg-gradient-to-r from-purple-600 to-pink-600",
};

export function EventCard({ event, index }: EventCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 border border-purple-200 shadow-lg group bg-white rounded-2xl hover:scale-[1.02]">
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
            className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full text-sm flex items-center gap-2 shadow-xl border border-purple-200 font-bold"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Ticket className="h-4 w-4 text-purple-600" />
            <span className="text-purple-700">{event.price}</span>
          </motion.div>
        </div>

        <CardHeader className="pb-4">
          <h3 className="line-clamp-2 group-hover:text-purple-600 transition-colors duration-300 font-bold text-lg">
            {event.title}
          </h3>
          <p className="text-gray-600 line-clamp-2 text-sm leading-relaxed">
            {event.description}
          </p>
        </CardHeader>

        <CardContent className="space-y-3 pb-4">
          <div className="flex items-center gap-3 text-gray-700">
            <div className="p-2 rounded-xl bg-purple-50 border border-purple-200">
              <Calendar className="h-4 w-4 text-purple-600" />
            </div>
            <span className="text-sm">
              {event.date} • {event.time}
            </span>
          </div>
          <div className="flex items-center gap-3 text-gray-700">
            <div className="p-2 rounded-xl bg-purple-50 border border-purple-200">
              <MapPin className="h-4 w-4 text-purple-600" />
            </div>
            <span className="text-sm font-medium">{event.location}</span>
          </div>
        </CardContent>

        <CardFooter className="pt-2">
          <Button
            asChild
            className="w-full bg-gradient-to-r from-purple-600 to-pink-500 border-0 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 font-bold py-3 text-white"
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
