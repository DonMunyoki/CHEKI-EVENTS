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
  Music: "bg-sky-500",
  Art: "bg-gray-700",
  Food: "bg-sky-400",
  Comedy: "bg-yellow-500",
  Sports: "bg-green-500",
  Theater: "bg-purple-500",
  Nightlife: "bg-indigo-600",
};

export function EventCard({ event, index }: EventCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-200 shadow-md group bg-white">
        <div className="relative h-56 w-full overflow-hidden">
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
            className="h-full w-full"
          >
            <ImageWithFallback
              src={event.image}
              alt={event.title}
              className="w-full h-full object-cover"
            />
          </motion.div>

          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          <Badge
            className={`absolute top-3 right-3 ${
              categoryColors[event.category] || "bg-gray-500"
            } text-white border-0 shadow-lg hover:scale-110 transition-transform`}
          >
            {event.category}
          </Badge>

          <motion.div
            className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs flex items-center gap-1.5 shadow-lg border border-gray-200"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Ticket className="h-3.5 w-3.5 text-sky-600" />
            <span>{event.price}</span>
          </motion.div>
        </div>

        <CardHeader className="pb-3">
          <h3 className="line-clamp-2 group-hover:text-sky-600 transition-colors duration-300">
            {event.title}
          </h3>
          <p className="text-muted-foreground line-clamp-2 text-sm">
            {event.description}
          </p>
        </CardHeader>

        <CardContent className="space-y-2 pb-3">
          <div className="flex items-center gap-2 text-muted-foreground">
            <div className="p-1.5 rounded-lg bg-sky-50 border border-sky-100">
              <Calendar className="h-3.5 w-3.5 text-sky-600" />
            </div>
            <span className="text-sm">
              {event.date} • {event.time}
            </span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <div className="p-1.5 rounded-lg bg-gray-100 border border-gray-200">
              <MapPin className="h-3.5 w-3.5 text-gray-600" />
            </div>
            <span className="text-sm line-clamp-1">{event.location}</span>
          </div>
        </CardContent>

        <CardFooter>
          <Button
            asChild
            className="w-full bg-gradient-to-r from-black via-gray-800 to-sky-500 border-0 shadow-lg hover:opacity-90 hover:scale-105 transition-all duration-300"
          >
            <a
              href={event.ticketLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              Get Tickets
              <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
