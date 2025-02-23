"use client"

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import Navbar from "@/components/Header";
import Footer from "@/components/Footer";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useParams } from "next/navigation";

interface Project {
  id: string;
  projectName: string;
  ngoName: string;
  location: string;
  state: string;
  ntree: string;
  vols: string;
  surrate: string;
  species: string;
  img_url: string;
  email: string;
  price: string;
}

interface Event {
  id: string;
  name: string;
  ngo: string;
  location: string;
  date: string;
  time: string;
  hours: string;
}

const MissionPage = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const params = useParams();

  useEffect(() => {
    async function fetchData() {
      try {
        const slug = params.slug.toString();
        let ngoName = slug
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');

        // First fetch the project details
        const projectsRef = collection(db, "projects");
        let projectQuery = query(projectsRef, where("ngoName", "==", ngoName));
        let projectSnapshot = await getDocs(projectQuery);

        // If no results, try uppercase version
        if (projectSnapshot.empty) {
          ngoName = slug.split('-').map(word => word.toUpperCase()).join(' ');
          projectQuery = query(projectsRef, where("ngoName", "==", ngoName));
          projectSnapshot = await getDocs(projectQuery);
        }

        // Now fetch the events
        const eventsRef = collection(db, "events");
        const eventsQuery = query(eventsRef, where("ngo", "==", ngoName));
        const eventsSnapshot = await getDocs(eventsQuery);

        const projectsData = projectSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Project[];

        const eventsData = eventsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Event[];

        setProjects(projectsData);
        setEvents(eventsData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load data");
        setLoading(false);
      }
    }

    fetchData();
  }, [params.slug]);

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

  return (
    <div className="bg-gray-100">
      <Navbar />
      <div className="pt-16 md:pt-20"></div>

      {/* Hero Section with Carousel */}
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
                          <Image src={`/images/car/${img}.png`} layout="fill" objectFit="contain" alt={`Slide ${index + 1}`} />
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>

      {/* Statistics Section */}
      <section className="flex justify-center gap-8 bg-white py-6">
        {[
          { value: projects[0]?.ntree || "0", label: "trees planted" },
          { value: projects[0]?.vols || "0", label: "volunteers joined" },
          { value: projects[0]?.surrate || "0%", label: "survived" },
          { value: projects[0]?.species || "0", label: "different species" }
        ].map((stat, index) => (
          <div key={index} className="text-center flex items-center justify-center gap-2px">
            <Image src={`/images/treelogo.png`} width={40} height={40} alt={stat.label} />
            <p className="text-lg font-bold text-green-800">{stat.value}</p>
            <p className="text-gray-600 text-sm">{stat.label}</p>
          </div>
        ))}
      </section>

      {/* Events Section */}
      <section className="px-6 py-8">
        <h2 className="text-2xl font-bold text-green-800 mb-4">Events by {projects[0]?.ngoName}</h2>
        {events.map((event) => (
          <div key={event.id} className="bg-white rounded-lg p-4 mb-4 flex justify-between items-center shadow-md">
            <div>
              <p className="font-semibold">Event: {event.name}</p>
              <p className="text-sm text-gray-600">
                Location: {event.location}
              </p>
              <p className="text-sm text-gray-600">
                Date: {event.date} | Time: {event.time}
              </p>
              <p className="text-sm text-gray-600">
                Duration: {event.hours} hours
              </p>
            </div>
            <Link href={`/raise/missions/${params.slug}/register`}>
              <button className="bg-green-200 text-green-700 px-4 py-2 rounded-lg hover:bg-green-300 shadow">
                BOOK YOUR SLOT NOW
              </button>
            </Link>
          </div>
        ))}
        {events.length === 0 && (
          <p className="text-center text-gray-600">No upcoming events at the moment.</p>
        )}
      </section>

      <Footer />
    </div>
  );
};

export default MissionPage;