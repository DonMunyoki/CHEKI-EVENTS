import { useState, useMemo, useEffect } from "react";
import { Header } from "./components/Header";
import { FilterBar } from "./components/FilterBar";
import { EventCard, Event } from "./components/EventCard";
import { LoginPage } from "./components/LoginPage";
import { motion } from "motion/react";
import { CalendarDays } from "lucide-react";
import { apiService } from "./services/api";

// Mock event data for Nairobi
const mockEvents: Event[] = [
  {
    id: "1",
    title: "Nairobi Jazz Night",
    description: "Experience an unforgettable evening of live jazz music featuring Kenya's finest musicians",
    date: "March 15, 2026",
    time: "7:00 PM",
    location: "Carnivore Restaurant, Nairobi",
    category: "Music",
    price: "KES 1,500",
    image: "https://images.unsplash.com/photo-1743791022256-40413c5f019b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25jZXJ0JTIwbXVzaWMlMjBldmVudHxlbnwxfHx8fDE3NjEyNDY1NTZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    ticketLink: "https://www.ticketsasa.com",
  },
  {
    id: "2",
    title: "Contemporary Art Exhibition",
    description: "Explore thought-provoking contemporary art pieces from East African artists",
    date: "February 28, 2026",
    time: "10:00 AM",
    location: "Nairobi National Museum",
    category: "Art",
    price: "KES 500",
    image: "https://images.unsplash.com/photo-1713779490284-a81ff6a8ffae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnQlMjBnYWxsZXJ5JTIwZXhoaWJpdGlvbnxlbnwxfHx8fDE3NjEyMzA0OTV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    ticketLink: "https://www.ticketsasa.com",
  },
  {
    id: "3",
    title: "Nairobi Food Festival",
    description: "Savor cuisines from around the world and local Kenyan delicacies at this vibrant food festival",
    date: "March 7, 2026",
    time: "11:00 AM",
    location: "Karura Forest, Nairobi",
    category: "Food",
    price: "KES 800",
    image: "https://images.unsplash.com/photo-1675674683873-1232862e3c64?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb29kJTIwZmVzdGl2YWwlMjBtYXJrZXR8ZW58MXx8fHwxNzYxMjI1MzMyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    ticketLink: "https://www.ticketsasa.com",
  },
  {
    id: "4",
    title: "Comedy Night with Churchill",
    description: "Laugh your heart out with Kenya's top comedians in this hilarious stand-up show",
    date: "March 21, 2026",
    time: "8:00 PM",
    location: "KICC, Nairobi",
    category: "Comedy",
    price: "KES 1,000",
    image: "https://images.unsplash.com/photo-1760582912320-79fcbc9f309b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21lZHklMjBzaG93JTIwcGVyZm9ybWFuY2V8ZW58MXx8fHwxNzYxMTU5OTYzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    ticketLink: "https://www.ticketsasa.com",
  },
  {
    id: "5",
    title: "Tusker FC vs Gor Mahia",
    description: "Watch the biggest football derby in Kenya at the iconic Kasarani Stadium",
    date: "February 22, 2026",
    time: "3:00 PM",
    location: "Kasarani Stadium, Nairobi",
    category: "Sports",
    price: "KES 500",
    image: "https://images.unsplash.com/photo-1760508737418-a7add7ee3871?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcG9ydHMlMjBzdGFkaXVtJTIwZXZlbnR8ZW58MXx8fHwxNzYxMTUyMDQ4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    ticketLink: "https://www.ticketsasa.com",
  },
  {
    id: "6",
    title: "The Lion King - Live Theater",
    description: "Experience the magic of Disney's The Lion King brought to life on stage",
    date: "March 28, 2026",
    time: "6:00 PM",
    location: "Kenya National Theatre, Nairobi",
    category: "Theater",
    price: "KES 2,000",
    image: "https://images.unsplash.com/photo-1539964604210-db87088e0c2c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0aGVhdGVyJTIwc3RhZ2UlMjBwZXJmb3JtYW5jZXxlbnwxfHx8fDE3NjExNDE2MTR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    ticketLink: "https://www.ticketsasa.com",
  },
  {
    id: "7",
    title: "Blankets and Wine Festival",
    description: "Kenya's premier outdoor music festival featuring live performances and great vibes",
    date: "March 1, 2026",
    time: "2:00 PM",
    location: "Ngong Racecourse, Nairobi",
    category: "Music",
    price: "KES 2,500",
    image: "https://images.unsplash.com/photo-1743791022256-40413c5f019b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25jZXJ0JTIwbXVzaWMlMjBldmVudHxlbnwxfHx8fDE3NjEyNDY1NTZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    ticketLink: "https://www.ticketsasa.com",
  },
  {
    id: "8",
    title: "Nairobi Marathon 2026",
    description: "Join thousands of runners in Kenya's largest marathon event through the city streets",
    date: "February 21, 2026",
    time: "6:00 AM",
    location: "Uhuru Park, Nairobi",
    category: "Sports",
    price: "KES 1,200",
    image: "https://images.unsplash.com/photo-1760508737418-a7add7ee3871?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcG9ydHMlMjBzdGFkaXVtJTIwZXZlbnR8ZW58MXx8fHwxNzYxMTUyMDQ4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    ticketLink: "https://www.ticketsasa.com",
  },
  {
    id: "9",
    title: "Afrobeats Night - Sauti Sol",
    description: "Dance the night away with Sauti Sol and special guest performers in an electrifying concert",
    date: "April 4, 2026",
    time: "8:00 PM",
    location: "Uhuru Gardens, Nairobi",
    category: "Music",
    price: "KES 2,000",
    image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNpYyUyMGNvbmNlcnQlMjBzdGFnZXxlbnwxfHx8fDE3NjEyNTM5Nzh8MA&ixlib=rb-4.1.0&q=80&w=1080",
    ticketLink: "https://www.ticketsasa.com",
  },
  {
    id: "10",
    title: "Street Food Safari",
    description: "Explore Nairobi's best street food vendors in this guided food tour and tasting experience",
    date: "March 14, 2026",
    time: "5:00 PM",
    location: "Westlands, Nairobi",
    category: "Food",
    price: "KES 1,500",
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHJlZXQlMjBmb29kJTIwbWFya2V0fGVufDF8fHx8MTc2MTI1NDAyNnww&ixlib=rb-4.1.0&q=80&w=1080",
    ticketLink: "https://www.ticketsasa.com",
  },
  {
    id: "11",
    title: "Open Mic Comedy Show",
    description: "Discover Kenya's next comedy stars at this weekly open mic night with amateur and pro comedians",
    date: "February 19, 2026",
    time: "7:30 PM",
    location: "Java House, Gigiri",
    category: "Comedy",
    price: "KES 300",
    image: "https://images.unsplash.com/photo-1585699324551-f6c309eedeca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdGFuZHVwJTIwY29tZWR5JTIwbWljfGVufDF8fHx8MTc2MTI1NDA2NXww&ixlib=rb-4.1.0&q=80&w=1080",
    ticketLink: "https://www.ticketsasa.com",
  },
  {
    id: "12",
    title: "Nairobi Rugby Sevens",
    description: "Watch international rugby teams compete in the Safari Sevens tournament",
    date: "April 18, 2026",
    time: "12:00 PM",
    location: "RFUEA Grounds, Nairobi",
    category: "Sports",
    price: "KES 1,000",
    image: "https://images.unsplash.com/photo-1512224580650-25e3b7b342be?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxydWdieSUyMHNwb3J0cyUyMGdhbWV8ZW58MXx8fHwxNzYxMjU0MTA0fDA&ixlib=rb-4.1.0&q=80&w=1080",
    ticketLink: "https://www.ticketsasa.com",
  },
  {
    id: "13",
    title: "Shakespeare in the Park",
    description: "Enjoy a magical outdoor performance of Romeo and Juliet under the stars",
    date: "March 20, 2026",
    time: "6:30 PM",
    location: "Nairobi Arboretum",
    category: "Theater",
    price: "KES 800",
    image: "https://images.unsplash.com/photo-1507924538820-ede94a04019d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvdXRkb29yJTIwdGhlYXRlciUyMHBlcmZvcm1hbmNlfGVufDF8fHx8MTc2MTI1NDE0Nnww&ixlib=rb-4.1.0&q=80&w=1080",
    ticketLink: "https://www.ticketsasa.com",
  },
  {
    id: "14",
    title: "Nairobi Art Week Gallery Hop",
    description: "Visit multiple art galleries in one night with free drinks and meet local artists",
    date: "April 11, 2026",
    time: "5:00 PM",
    location: "Parklands, Nairobi",
    category: "Art",
    price: "KES 600",
    image: "https://images.unsplash.com/photo-1531243269054-5ebf6f34081e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnQlMjBnYWxsZXJ5JTIwZXZlbnR8ZW58MXx8fHwxNzYxMjU0MTkwfDA&ixlib=rb-4.1.0&q=80&w=1080",
    ticketLink: "https://www.ticketsasa.com",
  },
  {
    id: "15",
    title: "Kenyan Coffee Tasting Workshop",
    description: "Learn about Kenya's coffee heritage and taste different coffee varieties from local farms",
    date: "February 26, 2026",
    time: "10:00 AM",
    location: "Nairobi Coffee Lounge, CBD",
    category: "Food",
    price: "KES 1,200",
    image: "https://images.unsplash.com/photo-1511920170033-f8396924c348?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjB0YXN0aW5nfGVufDF8fHx8MTc2MTI1NDIzNHww&ixlib=rb-4.1.0&q=80&w=1080",
    ticketLink: "https://www.ticketsasa.com",
  },
  {
    id: "16",
    title: "DJ Night - Homeboyz Radio Takeover",
    description: "Party with Nairobi's top DJs spinning the latest hits and throwback classics",
    date: "March 13, 2026",
    time: "9:00 PM",
    location: "Skylux Lounge, Westlands",
    category: "Music",
    price: "KES 1,000",
    image: "https://images.unsplash.com/photo-1571266028243-d220c6e2e0ca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuaWdodGNsdWIlMjBkaiUyMHBhcnR5fGVufDF8fHx8MTc2MTI1NDI4Nnww&ixlib=rb-4.1.0&q=80&w=1080",
    ticketLink: "https://www.ticketsasa.com",
  },
  {
    id: "17",
    title: "Roast Battle Kenya",
    description: "Watch comedians go head-to-head in this hilarious roast battle competition",
    date: "April 10, 2026",
    time: "8:30 PM",
    location: "Alliance Française, Nairobi",
    category: "Comedy",
    price: "KES 800",
    image: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21lZHklMjBzaG93JTIwYXVkaWVuY2V8ZW58MXx8fHwxNzYxMjU0MzMzfDA&ixlib=rb-4.1.0&q=80&w=1080",
    ticketLink: "https://www.ticketsasa.com",
  },
  {
    id: "18",
    title: "Basketball Championship Finals",
    description: "Watch the best college basketball teams compete for the championship title",
    date: "May 2, 2026",
    time: "4:00 PM",
    location: "Nyayo Stadium, Nairobi",
    category: "Sports",
    price: "KES 400",
    image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYXNrZXRiYWxsJTIwZ2FtZSUyMGNvdXJ0fGVufDF8fHx8MTc2MTI1NDM3Nnww&ixlib=rb-4.1.0&q=80&w=1080",
    ticketLink: "https://www.ticketsasa.com",
  },
  {
    id: "19",
    title: "Kenyan Fashion Week Showcase",
    description: "Experience the latest trends from Kenya's top fashion designers on the runway",
    date: "April 25, 2026",
    time: "7:00 PM",
    location: "Villa Rosa Kempinski, Nairobi",
    category: "Art",
    price: "KES 2,500",
    image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwc2hvdyUyMHJ1bndheXxlbnwxfHx8fDE3NjEyNTQ0MjR8MA&ixlib=rb-4.1.0&q=80&w=1080",
    ticketLink: "https://www.ticketsasa.com",
  },
  {
    id: "20",
    title: "Broadway Musicals Night",
    description: "Enjoy performances of famous Broadway musical numbers by talented Kenyan performers",
    date: "May 8, 2026",
    time: "7:30 PM",
    location: "Kenya National Theatre, Nairobi",
    category: "Theater",
    price: "KES 1,500",
    image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicm9hZHdheSUyMG11c2ljYWwlMjBzdGFnZXxlbnwxfHx8fDE3NjEyNTQ0ODB8MA&ixlib=rb-4.1.0&q=80&w=1080",
    ticketLink: "https://www.ticketsasa.com",
  },
  {
    id: "21",
    title: "Vegan Food Market",
    description: "Discover delicious plant-based foods from local vegan vendors and restaurants",
    date: "February 28, 2026",
    time: "11:00 AM",
    location: "The Hub Karen, Nairobi",
    category: "Food",
    price: "Free Entry",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2ZWdhbiUyMGZvb2QlMjBtYXJrZXR8ZW58MXx8fHwxNzYxMjU0NTI2fDA&ixlib=rb-4.1.0&q=80&w=1080",
    ticketLink: "https://www.ticketsasa.com",
  },
  {
    id: "22",
    title: "Sunset Rooftop Concert",
    description: "Enjoy acoustic performances while watching the sunset from Nairobi's highest rooftop",
    date: "March 27, 2026",
    time: "6:00 PM",
    location: "Kempinski Hotel, Nairobi",
    category: "Music",
    price: "KES 1,800",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb29mdG9wJTIwY29uY2VydCUyMHN1bnNldHxlbnwxfHx8fDE3NjEyNTQ1Njl8MA&ixlib=rb-4.1.0&q=80&w=1080",
    ticketLink: "https://www.ticketsasa.com",
  },
  {
    id: "23",
    title: "Improv Comedy Workshop",
    description: "Learn improv comedy techniques and perform in front of a live audience",
    date: "March 6, 2026",
    time: "2:00 PM",
    location: "The Alchemist, Westlands",
    category: "Comedy",
    price: "KES 1,500",
    image: "https://images.unsplash.com/photo-1527224857830-43a7acc85260?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21lZHklMjB3b3Jrc2hvcCUyMGNsYXNzfGVufDF8fHx8MTc2MTI1NDYxNHww&ixlib=rb-4.1.0&q=80&w=1080",
    ticketLink: "https://www.ticketsasa.com",
  },
  {
    id: "24",
    title: "Tech Startup Pitch Night",
    description: "Watch innovative Kenyan startups pitch their ideas to investors and win prizes",
    date: "April 17, 2026",
    time: "6:00 PM",
    location: "iHub, Nairobi",
    category: "Art",
    price: "KES 500",
    image: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHBpdGNoJTIwcHJlc2VudGF0aW9ufGVufDF8fHx8MTc2MTI1NDY1Nnww&ixlib=rb-4.1.0&q=80&w=1080",
    ticketLink: "https://www.ticketsasa.com",
  },
  {
    id: "25",
    title: "Friday Night Fever - B-Club",
    description: "Dance to the hottest Afrobeats, Hip Hop, and Dancehall hits with DJ Kalonje",
    date: "February 21, 2026",
    time: "10:00 PM",
    location: "B-Club, ABC Place Waiyaki Way",
    category: "Nightlife",
    price: "KES 500",
    image: "https://images.unsplash.com/photo-1625612446042-afd3fe024131?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuaWdodGNsdWIlMjBwYXJ0eSUyMGxpZ2h0c3xlbnwxfHx8fDE3NjExNDgzNTZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    ticketLink: "https://www.ticketsasa.com",
  },
  {
    id: "26",
    title: "Ladies Night - 1824 Lounge",
    description: "Free entry for ladies with complimentary drinks until midnight, DJ Creme on the decks",
    date: "February 20, 2026",
    time: "9:00 PM",
    location: "1824 Lounge, Karen",
    category: "Nightlife",
    price: "Ladies Free, Gents KES 1,000",
    image: "https://images.unsplash.com/photo-1744314080490-ed41f6319475?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuaWdodGNsdWIlMjBjcm93ZCUyMGRhbmNpbmd8ZW58MXx8fHwxNzYxMjQ4MDI2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    ticketLink: "https://www.ticketsasa.com",
  },
  {
    id: "27",
    title: "Throwback Thursday - Whisky River",
    description: "90s and 2000s classics all night long with DJ Towers at Nairobi's premier club",
    date: "February 27, 2026",
    time: "8:00 PM",
    location: "Whisky River, Westlands",
    category: "Nightlife",
    price: "KES 800",
    image: "https://images.unsplash.com/photo-1649794508359-4a12023aed8a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaiUyMGNsdWIlMjBldmVudHxlbnwxfHx8fDE3NjEyNDgwMjZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    ticketLink: "https://www.ticketsasa.com",
  },
  {
    id: "28",
    title: "Saturday Night Vibes - Kiza Lounge",
    description: "Premium nightlife experience with top DJs, VIP tables, and bottle service",
    date: "March 7, 2026",
    time: "10:00 PM",
    location: "Kiza Lounge, Galana Road",
    category: "Nightlife",
    price: "KES 1,500",
    image: "https://images.unsplash.com/photo-1625612446042-afd3fe024131?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuaWdodGNsdWIlMjBwYXJ0eSUyMGxpZ2h0c3xlbnwxfHx8fDE3NjExNDgzNTZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    ticketLink: "https://www.ticketsasa.com",
  },
  {
    id: "29",
    title: "Amapiano Nights - Space Lounge",
    description: "Experience the best Amapiano hits with South African guest DJs and live performances",
    date: "March 21, 2026",
    time: "9:00 PM",
    location: "Space Lounge, Westlands",
    category: "Nightlife",
    price: "KES 600",
    image: "https://images.unsplash.com/photo-1744314080490-ed41f6319475?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuaWdodGNsdWIlMjBjcm93ZCUyMGRhbmNpbmd8ZW58MXx8fHwxNzYxMjQ4MDI2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    ticketLink: "https://www.ticketsasa.com",
  },
  {
    id: "30",
    title: "K1 Klubhouse Party - Student Night",
    description: "Special student discount night with cheap drinks and the best party atmosphere",
    date: "February 26, 2026",
    time: "10:00 PM",
    location: "K1 Klubhouse, Westlands",
    category: "Nightlife",
    price: "KES 300 (Students)",
    image: "https://images.unsplash.com/photo-1649794508359-4a12023aed8a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaiUyMGNsdWIlMjBldmVudHxlbnwxfHx8fDE3NjEyNDgwMjZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    ticketLink: "https://www.ticketsasa.com",
  },
  {
    id: "31",
    title: "Black Diamond - Hip Hop Night",
    description: "Pure Hip Hop and Trap music all night with DJ Joe Mfalme",
    date: "March 6, 2026",
    time: "9:00 PM",
    location: "Black Diamond, Hurlingham",
    category: "Nightlife",
    price: "KES 700",
    image: "https://images.unsplash.com/photo-1625612446042-afd3fe024131?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuaWdodGNsdWIlMjBwYXJ0eSUyMGxpZ2h0c3xlbnwxfHx8fDE3NjExNDgzNTZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    ticketLink: "https://www.ticketsasa.com",
  },
  {
    id: "32",
    title: "Kilimanjaro Jamia - Reggae Night",
    description: "Authentic reggae vibes with live band performances and DJ sets",
    date: "April 11, 2026",
    time: "8:00 PM",
    location: "Kilimanjaro Jamia, Ngara",
    category: "Nightlife",
    price: "KES 500",
    image: "https://images.unsplash.com/photo-1744314080490-ed41f6319475?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuaWdodGNsdWIlMjBjcm93ZCUyMGRhbmNpbmd8ZW58MXx8fHwxNzYxMjQ4MDI2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    ticketLink: "https://www.ticketsasa.com",
  },
  {
    id: "33",
    title: "Mercury Lounge - EDM Night",
    description: "Electronic Dance Music extravaganza with international DJs and stunning light shows",
    date: "April 24, 2026",
    time: "10:00 PM",
    location: "Mercury Lounge, Westlands",
    category: "Nightlife",
    price: "KES 1,200",
    image: "https://images.unsplash.com/photo-1649794508359-4a12023aed8a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaiUyMGNsdWIlMjBldmVudHxlbnwxfHx8fDE3NjEyNDgwMjZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    ticketLink: "https://www.ticketsasa.com",
  },
  {
    id: "34",
    title: "Brew Bistro Friday - Live DJ & Drinks",
    description: "After-work vibes with live DJ, craft cocktails, and rooftop party atmosphere",
    date: "March 6, 2026",
    time: "7:00 PM",
    location: "Brew Bistro, Fortis Tower",
    category: "Nightlife",
    price: "KES 500",
    image: "https://images.unsplash.com/photo-1625612446042-afd3fe024131?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuaWdodGNsdWIlMjBwYXJ0eSUyMGxpZ2h0c3xlbnwxfHx8fDE3NjExNDgzNTZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    ticketLink: "https://www.ticketsasa.com",
  },
  {
    id: "35",
    title: "Ebony Lounge - Afro House Party",
    description: "Afro House and Deep House music with resident and guest DJs",
    date: "November 9, 2025",
    time: "9:00 PM",
    location: "Ebony Lounge, Kilimani",
    category: "Nightlife",
    price: "KES 800",
    image: "https://images.unsplash.com/photo-1744314080490-ed41f6319475?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuaWdodGNsdWIlMjBjcm93ZCUyMGRhbmNpbmd8ZW58MXx8fHwxNzYxMjQ4MDI2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    ticketLink: "https://www.ticketsasa.com",
  },
  {
    id: "36",
    title: "Grill Shack Saturday - Live Band & Club",
    description: "Live band performances followed by DJ sets until late, best of both worlds",
    date: "November 16, 2025",
    time: "8:00 PM",
    location: "Grill Shack, Westlands",
    category: "Nightlife",
    price: "KES 600",
    image: "https://images.unsplash.com/photo-1649794508359-4a12023aed8a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaiUyMGNsdWIlMjBldmVudHxlbnwxfHx8fDE3NjEyNDgwMjZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    ticketLink: "https://www.ticketsasa.com",
  },
  {
    id: "37",
    title: "Jameson Connect - Rooftop Party",
    description: "Exclusive rooftop party with DJ Crème, sponsored drinks, and amazing city views",
    date: "November 14, 2025",
    time: "7:00 PM",
    location: "The Alchemist, Westlands",
    category: "Nightlife",
    price: "KES 1,000",
    image: "https://images.unsplash.com/photo-1625612446042-afd3fe024131?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuaWdodGNsdWIlMjBwYXJ0eSUyMGxpZ2h0c3xlbnwxfHx8fDE3NjExNDgzNTZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    ticketLink: "https://www.ticketsasa.com",
  },
  {
    id: "38",
    title: "Sting Lounge - College Night",
    description: "Special college students night with discounted drinks and DJ Battle",
    date: "October 30, 2025",
    time: "9:00 PM",
    location: "Sting Lounge, Ngong Road",
    category: "Nightlife",
    price: "KES 300",
    image: "https://images.unsplash.com/photo-1744314080490-ed41f6319475?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuaWdodGNsdWIlMjBjcm93ZCUyMGRhbmNpbmd8ZW58MXx8fHwxNzYxMjQ4MDI2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    ticketLink: "https://www.ticketsasa.com",
  },
  {
    id: "39",
    title: "The Garage - Afrobeats Takeover",
    description: "Non-stop Afrobeats with DJ Kahpun and the freshest Nigerian hits",
    date: "November 6, 2025",
    time: "10:00 PM",
    location: "The Garage Nairobi, Westlands",
    category: "Nightlife",
    price: "KES 700",
    image: "https://images.unsplash.com/photo-1649794508359-4a12023aed8a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaiUyMGNsdWIlMjBldmVudHxlbnwxfHx8fDE3NjEyNDgwMjZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    ticketLink: "https://www.ticketsasa.com",
  },
  {
    id: "40",
    title: "Copa Cabana - Latin Night",
    description: "Salsa, Bachata, and Reggaeton all night with live Latin band and dance lessons",
    date: "November 13, 2025",
    time: "8:00 PM",
    location: "Copa Cabana, Westlands",
    category: "Nightlife",
    price: "KES 1,000",
    image: "https://images.unsplash.com/photo-1625612446042-afd3fe024131?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuaWdodGNsdWIlMjBwYXJ0eSUyMGxpZ2h0c3xlbnwxfHx8fDE3NjExNDgzNTZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    ticketLink: "https://www.ticketsasa.com",
  },
];

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = useMemo(() => {
    const cats = new Set(mockEvents.map((event) => event.category));
    return Array.from(cats);
  }, []);

  const filteredEvents = useMemo(() => {
    return mockEvents.filter((event) => {
      const matchesSearch =
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.location.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === "All" || event.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const handleLogin = (admissionNumber: string, name: string) => {
    setUserName(name);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserName("");
    setSearchQuery("");
    setSelectedCategory("All");
  };

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
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
        {filteredEvents.length === 0 ? (
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
                  {filteredEvents.length}{" "}
                  {filteredEvents.length === 1 ? "event" : "events"} in Nairobi
                </p>
              </div>

              <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-md border-2 border-gray-200">
                <span className="text-sm text-gray-600">📍</span>
                <span className="text-sm">Nairobi, Kenya</span>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {filteredEvents.map((event, index) => (
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
