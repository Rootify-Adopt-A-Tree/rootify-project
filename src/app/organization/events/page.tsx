"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import Navbar from "@/components/Header";
import Footer from "@/components/Footer";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

interface Event {
  id: string;
  name: string;
  ngo: string;
  location: string;
  date: string;
  time: string;
  hours: string;
  description?: string;
  image?: string;
  img_url?: string;
}

export default function OrganizationEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchEvents() {
      try {
        const eventsRef = collection(db, "events");
        const snapshot = await getDocs(eventsRef);
        const eventsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Event[];
        setEvents(eventsData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching events:", error);
        setError("Failed to load events");
        setLoading(false);
      }
    }

    fetchEvents();
  }, []);

  const handleEventClick = (eventId: string, eventName: string) => {
    const slug = eventName.toLowerCase().replace(/\s+/g, '-');
    router.push(`/organization/events/${slug}/posts`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-800"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        {error}
      </div>
    );
  }

  // Group events by NGO
  const eventsByNGO = events.reduce((acc, event) => {
    if (!acc[event.ngo]) {
      acc[event.ngo] = [];
    }
    acc[event.ngo].push(event);
    return acc;
  }, {} as Record<string, Event[]>);

  return (
    <div className="bg-white">
      <Navbar />
      <div className="pt-16 md:pt-20"></div>

      {/* Carousel Section */}
      <div className="relative w-full h-64 md:h-80 lg:h-96 flex items-center justify-center">
        <Swiper
          spaceBetween={0}
          slidesPerView={1}
          loop={true}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          navigation={true}
          modules={[Autoplay, Pagination, Navigation]}
          className="w-full h-full"
        >
          {["Children", "Earth", "Father", "Mother"].map((img, index) => (
            <SwiperSlide key={index}>
              <div className="relative w-full h-full">
                <Image 
                  src={`/images/car/${img}.png`} 
                  layout="fill" 
                  objectFit="contain" 
                  alt={`Slide ${index + 1}`} 
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Events Section */}
      <div className="max-w-6xl mx-auto py-8 px-4">
        <h2 className="text-2xl font-bold text-green-800 mb-4">Upcoming Events</h2>
        <div className="space-y-8">
          {Object.entries(eventsByNGO).map(([ngoName, ngoEvents]) => (
            <div key={ngoName} className="bg-green-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-green-800 mb-4">{ngoName}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {ngoEvents.map((event) => (
                  <div 
                    key={event.id} 
                    className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => handleEventClick(event.id, event.name)}
                  >
                    <div className="relative w-full h-40 bg-gray-200 rounded-md overflow-hidden mb-4">
                      {/* <Image 
                        src={event.img_url || '/images/default-event.jpg'} 
                        layout="fill" 
                        objectFit="cover" 
                        alt={event.name}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/images/default-event.jpg';
                        }}
                      /> */}
                    </div>
                    <h4 className="font-semibold text-lg mb-2">{event.name}</h4>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p>📍 {event.location}</p>
                      <p>📅 {event.date}</p>
                      <p>⏰ {event.time}</p>
                      <p>⌛ {event.hours} hours</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
} 